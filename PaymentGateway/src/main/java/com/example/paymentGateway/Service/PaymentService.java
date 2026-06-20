package com.example.paymentGateway.Service;

import java.math.BigDecimal;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.paymentGateway.Dto.PaymentDto;
import com.example.paymentGateway.Dto.PaymentRequest;
import com.example.paymentGateway.Dto.VerifyPaymentDTO;
import com.example.paymentGateway.Entity.Order;
import com.example.paymentGateway.Entity.Payment;
import com.example.paymentGateway.Entity.User;
import com.example.paymentGateway.Mapper.PaymentMapper;
import com.example.paymentGateway.Repository.OrderRepository;
import com.example.paymentGateway.Repository.PaymentRepository;
import com.example.paymentGateway.Repository.UserRepository;
import com.example.paymentGateway.Security.UserPrincipal;
import com.example.paymentGateway.enums.OrderStatus;
import com.example.paymentGateway.enums.PaymentStatus;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import java.util.List;
import java.util.stream.Collectors;



@Service
public class PaymentService {

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RazorpayClient razorpayClient;

    // Initiate / Retry Payment
    public PaymentDto initiatePayment(PaymentRequest paymentRequest) throws RazorpayException {

        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findByOrderNumber(paymentRequest.getOrderNumber());
        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Order does not belong to authenticated user");
        }

        Optional<Payment> existingPaymentOpt = paymentRepository.findTopByOrderOrderByCreatedAtDesc(order);

        Payment existingPayment = null;
        if (existingPaymentOpt.isPresent()) {
            existingPayment = existingPaymentOpt.get();

            if (existingPayment.getPaymentStatus() == PaymentStatus.SUCCEED) {
                throw new RuntimeException("Payment already completed");
            }

            if (existingPayment.getPaymentStatus() == PaymentStatus.CREATED
                    || existingPayment.getPaymentStatus() == PaymentStatus.PROCESSING) {
                return PaymentMapper.toDto(existingPayment);
            }
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setUser(user);
        BigDecimal amount = order.getAmount();
        payment.setAmount(amount);

        Payment savedPayment = paymentRepository.save(payment);

        try {
            // create Razorpay order
            JSONObject options = new JSONObject();

            options.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue());
            options.put("currency", "INR");
            options.put("receipt", "order_" + paymentRequest.getOrderNumber());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            System.out.println("Razorpay Order = " + razorpayOrder);
            System.out.println("Gateway Order Id = " + razorpayOrder.get("id"));

            String gatewayOrderId = razorpayOrder.get("id");

            savedPayment.setGatewayOrderId(gatewayOrderId);
            savedPayment.setPaymentStatus(PaymentStatus.PROCESSING);

            savedPayment = paymentRepository.save(savedPayment);

        } catch (RazorpayException e) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw e;
        }

        return PaymentMapper.toDto(savedPayment);
    }

    // Cancel Payment
    public PaymentDto cancelPayment(String paymentId) {

    UserPrincipal principal =
            (UserPrincipal) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();

    User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Payment payment = paymentRepository.findByPaymentId(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    if (!payment.getUser().getId().equals(user.getId())) {
        throw new RuntimeException(
                "Payment does not belong to authenticated user");
    }

    if (payment.getPaymentStatus() != PaymentStatus.CREATED
            && payment.getPaymentStatus() != PaymentStatus.PROCESSING) {
        throw new RuntimeException("Payment cannot be cancelled");
    }

    payment.setPaymentStatus(PaymentStatus.CANCELLED);

    return PaymentMapper.toDto(
            paymentRepository.save(payment)
    );
}
    // get Payment by Payment Id
    public PaymentDto getPaymentByPaymentId(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Validate Payment Ownership
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!payment.getUser().getId().equals(principal.getId())) {
            throw new RuntimeException("Payment does not belong to the authenticated user");
        }

        return PaymentMapper.toDto(payment);
    }

    // get Payment Status by Payment Id
    public PaymentStatus getPaymentStatusByPaymentId(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Validate Payment Ownership
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!payment.getUser().getId().equals(principal.getId())) {
            throw new RuntimeException("Payment does not belong to the authenticated user");
        }

        return payment.getPaymentStatus();
    }

    // Get Payments by Logged-in User
   
public List<PaymentDto> getPaymentsOfLoggedInUser() {

    UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Payment> payments = paymentRepository.findByUser(user);

    return payments.stream()
            .map(PaymentMapper::toDto)
            .collect(Collectors.toList());
}

    // verify payment signature
    public PaymentDto verifyPayment(VerifyPaymentDTO request) throws RazorpayException {

        Payment payment = paymentRepository.findByPaymentId(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getGatewayOrderId()
                .equals(request.getGatewayOrderId())) {

            throw new RuntimeException("Order ID mismatch");
        }

        if (payment.getPaymentStatus() == PaymentStatus.SUCCEED) {
            return PaymentMapper.toDto(payment);
        }

        String payload = request.getGatewayOrderId() + "|" + request.getGatewayPaymentId();

        boolean valid = Utils.verifySignature(payload, request.getSignature(), razorpayKeySecret);

        if (!valid) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            throw new RuntimeException("Invalid payment signature");
        }

        payment.setGatewayPaymentId(request.getGatewayPaymentId());
        payment.setPaymentStatus(PaymentStatus.SUCCEED);

        // update order status
Order order = payment.getOrder();
order.setOrderStatus(OrderStatus.COMPLETED);
orderRepository.save(order);

        paymentRepository.save(payment);

        return PaymentMapper.toDto(payment);

    }

}
