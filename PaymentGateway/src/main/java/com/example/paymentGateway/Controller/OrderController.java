package com.example.paymentGateway.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.paymentGateway.Dto.OrderDTO;

import com.example.paymentGateway.Service.OrderService;
import com.example.paymentGateway.enums.OrderStatus;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/payment/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    //make an order
    @PostMapping("/buy")
    public OrderDTO createOrder(@RequestBody OrderDTO orderDto) {

        OrderDTO orderDTO = orderService.createOrder(orderDto);
        return orderDTO;  
    }
    
    //get order by order number
    @GetMapping("/number")
    public OrderDTO getOrderByOrderNumber(@RequestParam("orderNumber") String orderNumber) {
        OrderDTO orderDTO = orderService.getOrderByOrderNumber(orderNumber);
        return orderDTO;
    }
    
    //get orders by user
    @GetMapping("/ordersByUserId")
    public List<OrderDTO> getOrdersByUser() {
        List<OrderDTO> orderDTO  = orderService.getOrdersByUser();
        return orderDTO;
    }
    
    //get orders by order status
    @GetMapping("/status/{status}")
    public List<OrderDTO> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderDTO> orderDto = orderService.getOrdersByStatus(status);
        return orderDto;
        
    }
    
    //update order status
    @PutMapping("/updateStatus")
    public OrderDTO updateOrderStatus(@RequestParam("orderNumber") String orderNumber, @RequestParam("status") OrderStatus status) 
    {
        OrderDTO orderDTO = orderService.updateOrderStatus(orderNumber, status);
        return orderDTO;
    }
    
    //cancel order
    @PutMapping("/cancel/{orderNumber}")
public OrderDTO cancelOrder(@PathVariable String orderNumber) {
    return orderService.cancelOrder(orderNumber);
}


    
}
