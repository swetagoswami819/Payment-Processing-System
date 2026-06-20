package com.example.paymentGateway.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.paymentGateway.enums.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDTO{

    private String orderNumber;
    private Long userId;
    private BigDecimal amount;
    private OrderStatus orderStatus;
    private LocalDateTime orderCreatedAt;
}
