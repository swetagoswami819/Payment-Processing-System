package com.example.paymentGateway.Dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class PaymentRequest{
    private String orderNumber;
    private BigDecimal Amount;
}