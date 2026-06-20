package com.example.paymentGateway.Mapper;

import com.example.paymentGateway.Dto.UserDTO;
import com.example.paymentGateway.Entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user){
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setAccountId(user.getAccountId());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public static User toEntity(UserDTO dto){
        User user = new User();
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        user.setUsername(dto.getUsername());
        user.setAccountId(dto.getAccountId());
        user.setRole(dto.getRole());
        user.setEmail(dto.getEmail());
        return user;
    }
    
}
