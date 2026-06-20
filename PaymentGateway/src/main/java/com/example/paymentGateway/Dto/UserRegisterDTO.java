package com.example.paymentGateway.Dto;

import com.example.paymentGateway.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDTO {

    private Long id;
    private String username;
    private String password;
    private Role Role;
    private Long accountId;
    private String email;
    
}
