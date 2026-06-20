package com.example.paymentGateway.Dto;

import java.math.BigDecimal;

import com.example.paymentGateway.enums.PaymentStatus;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PaymentDto {
    private Long id;
    private String paymentId;
    private String orderNumber;
    private Long orderId;
    private Long userId;
    private String gatewayOrderId;
    private PaymentStatus paymentStatus;
    private BigDecimal amount;
    private String status;
   
}
