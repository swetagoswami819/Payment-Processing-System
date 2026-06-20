package com.example.paymentGateway.Service;

import java.util.List;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.paymentGateway.Dto.OrderDTO;
import com.example.paymentGateway.Entity.Order;
import com.example.paymentGateway.Entity.User;
import com.example.paymentGateway.Mapper.OrderMapper;
import com.example.paymentGateway.Repository.OrderRepository;
import com.example.paymentGateway.Repository.UserRepository;
import com.example.paymentGateway.Security.UserPrincipal;
import com.example.paymentGateway.enums.OrderStatus;

@Service
public class OrderService {

    @Autowired 
    private  OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    //make an order
    public  OrderDTO createOrder(OrderDTO orderDto) {
        
        UserPrincipal principal = (UserPrincipal)
        SecurityContextHolder.getContext()
                             .getAuthentication()
                             .getPrincipal();

        User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        Order order = OrderMapper.toEntity(orderDto, user);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toDto(savedOrder);
    }
    //get order by order number
   public OrderDTO getOrderByOrderNumber(String orderNumber) {

    UserPrincipal principal =
            (UserPrincipal) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

    Order order =
            orderRepository.findByOrderNumberAndUser_Id(
                    orderNumber,
                    principal.getId()
            );

    if (order == null) {
        throw new RuntimeException("Order not found");
    }

    return OrderMapper.toDto(order);
}
    //get all orders by user Id
    public  List<OrderDTO> getOrdersByUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(principal.getId());
        List<Order> orders = orderRepository.findByUser_Id(user.getId());
        return orders.stream().map(OrderMapper::toDto).collect(Collectors.toList());
    }
    //get all orders
    public  List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(OrderMapper::toDto).collect(Collectors.toList());
    }


    //get orders by status
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {

    UserPrincipal principal =
            (UserPrincipal) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

    List<Order> orders =
            orderRepository.findByUser_IdAndOrderStatus(
                    principal.getId(),
                    status
            );

    return orders.stream()
            .map(OrderMapper::toDto)
            .collect(Collectors.toList());
}

    //update order status
    public  OrderDTO updateOrderStatus(String orderNumber, OrderStatus status) {
        Order order = orderRepository.findByOrderNumber(orderNumber);
        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.toDto(updatedOrder);
    }

    //cancel order
    public OrderDTO cancelOrder(String orderNumber) {

    UserPrincipal principal =
            (UserPrincipal) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

    Order order = orderRepository
            .findByOrderNumberAndUser_Id(
                    orderNumber,
                    principal.getId());

    if (order == null) {
        throw new RuntimeException("Order not found");
    }

    if (order.getOrderStatus() == OrderStatus.COMPLETED) {
        throw new RuntimeException("Completed order cannot be cancelled");
    }

    order.setOrderStatus(OrderStatus.CANCELLED);

    return OrderMapper.toDto(orderRepository.save(order));
}


    
}
