package com.example.paymentGateway.Mapper;

import com.example.paymentGateway.Dto.PaymentDto;
import com.example.paymentGateway.Entity.Payment;

public class PaymentMapper {

    public static Payment toEntity(PaymentDto dto){
        Payment payment = new Payment();
        return payment;
    }

    public static PaymentDto toDto(Payment payment){
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderNumber(payment.getOrder().getOrderNumber());
        dto.setUserId(payment.getUser().getId());
        dto.setGatewayOrderId(payment.getGatewayOrderId());
        dto.setOrderId(payment.getOrder().getId());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setAmount(payment.getAmount());
        return dto;
    }
}
