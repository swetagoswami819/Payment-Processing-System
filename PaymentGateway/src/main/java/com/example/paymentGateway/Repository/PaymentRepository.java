package com.example.paymentGateway.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.paymentGateway.Entity.Order;
import com.example.paymentGateway.Entity.Payment;
import com.example.paymentGateway.Entity.User;
import com.example.paymentGateway.enums.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long>{
    
    Optional<Payment> findByPaymentId(String paymentId);

   // Optional<Payment> findByGatewayId(String gatewayId);

   // boolean existsByGatewayId(String gatewayId);

    List<Payment> findByOrder(Order order);


    Optional<Payment> findTopByOrderOrderByCreatedAtDesc(Order order);

    List<Payment> findByPaymentStatus(PaymentStatus status);

    List<Payment> findByUser(User user);

    
}
