package com.example.paymentGateway.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.paymentGateway.Dto.PaymentDto;
import com.example.paymentGateway.Dto.PaymentRequest;
import com.example.paymentGateway.Dto.VerifyPaymentDTO;
import com.example.paymentGateway.Service.PaymentService;
import com.example.paymentGateway.enums.PaymentStatus;
import com.razorpay.RazorpayException;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/payment/payments")

public class PaymentController{

    @Autowired
    private PaymentService paymentService;

    //make a payment
    @PostMapping("/pay")
    public PaymentDto initiatePayment(@RequestBody PaymentRequest paymentRequest) throws RazorpayException {
        return paymentService.initiatePayment(paymentRequest);
    }

    //retry a payment
    @PostMapping("/retry")
    public PaymentDto retryPayment(@RequestBody PaymentRequest paymentRequest) throws RazorpayException {
        return paymentService.initiatePayment(paymentRequest);
    } 

    //cancel a payment
    @PostMapping("/cancel/{paymentId}")
    public PaymentDto cancelPayment(@PathVariable String paymentId) throws RazorpayException {
        return paymentService.cancelPayment(paymentId);
    }

    //get payment by payment id
    @GetMapping("/getById/{paymentId}")
    public PaymentDto getPaymentByPaymentId(@PathVariable String paymentId){
        return paymentService.getPaymentByPaymentId(paymentId);
    }

    //get payment status by paymentId
    @GetMapping("/getByStatus/{paymentId}")
    public PaymentStatus getPaymentStatusByPaymentId(@PathVariable String paymentId){
        return paymentService.getPaymentStatusByPaymentId(paymentId);
    }


    //get all payments of logged in user
    @GetMapping("/user")
public List<PaymentDto> getUserPayments() {
    return paymentService.getPaymentsOfLoggedInUser();
}

    //verify payment via its signature
    @PostMapping("/verify")
    public PaymentDto verifyPayment(@RequestBody VerifyPaymentDTO request) throws RazorpayException{
        return paymentService.verifyPayment(request);

    } 

}