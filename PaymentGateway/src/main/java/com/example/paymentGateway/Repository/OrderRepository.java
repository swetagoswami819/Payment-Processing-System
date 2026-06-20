package com.example.paymentGateway.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.example.paymentGateway.Entity.Order;
import com.example.paymentGateway.enums.OrderStatus;
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByOrderNumber(String orderNumber);
    List<Order> findByOrderStatus(OrderStatus orderStatus);
    List<Order> findByUser_Id(Long userId);
    List<Order> findByUser_IdAndOrderStatus(
        Long userId,
        OrderStatus status
);
    Order findByOrderNumberAndUser_Id(String orderNumber, Long userId);
}
