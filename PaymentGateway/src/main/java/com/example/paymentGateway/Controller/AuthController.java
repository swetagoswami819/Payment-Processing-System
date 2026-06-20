package com.example.paymentGateway.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.paymentGateway.Dto.UserDTO;
import com.example.paymentGateway.Dto.UserRegisterDTO;
import com.example.paymentGateway.Entity.User;
import com.example.paymentGateway.Security.JwtUtil;
import com.example.paymentGateway.Service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/payment/auth")
public class AuthController{

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    //register user
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserRegisterDTO userRegisterDTO){
        UserDTO userDTO = userService.createUser(userRegisterDTO);
        return ResponseEntity.ok(userDTO);
    }



     // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        System.out.println(auth);
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        // Extract roles from authorities
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
                
        String token = jwtUtil.generateToken(
                userDetails.getUsername(),
                roles);

        return token;
    }

    

    
}