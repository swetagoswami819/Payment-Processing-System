package com.example.paymentGateway.Entity;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.example.paymentGateway.enums.OrderStatus;

import java.math.BigDecimal;
import java.security.SecureRandom;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private LocalDateTime orderCreatedAt;

    //Many orders can be done by one User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.orderCreatedAt = LocalDateTime.now();
        this.orderStatus = OrderStatus.PENDING;

        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        SecureRandom r = new SecureRandom();
        // generate 6 digits random number
        int number = 100000 + r.nextInt(900000);

        this.orderNumber = "ORD" + "-" + date + "-" + String.format("%06d", number);

    }
}
