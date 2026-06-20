package com.example.paymentGateway.Mapper;

import com.example.paymentGateway.Dto.OrderDTO;
import com.example.paymentGateway.Entity.Order;
import com.example.paymentGateway.Entity.User;



public class OrderMapper{

    public static OrderDTO toDto(Order order){
        OrderDTO dto = new OrderDTO();
        dto.setOrderNumber(order.getOrderNumber());
        dto.setAmount(order.getAmount());
        dto.setUserId(order.getUser().getId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setOrderCreatedAt(order.getOrderCreatedAt());
        return dto;
    }

    public static Order toEntity(OrderDTO orderDto , User user){
        Order order = new Order();
        order.setAmount(orderDto.getAmount());
        order.setUser(user);
        return order;
    }

}