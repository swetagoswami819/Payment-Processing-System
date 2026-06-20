package com.example.paymentGateway.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.paymentGateway.Dto.UserDTO;
import com.example.paymentGateway.Service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/payment/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET current logged-in user
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getUserById() {
        return ResponseEntity.ok(userService.getUserById());
    }

    // GET all users (admin use)
    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // DELETE current user
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteUserById() {
        userService.deleteUserById();
        return ResponseEntity.ok("User deleted successfully");
    }
}