package com.example.paymentGateway.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.paymentGateway.Dto.UserDTO;
import com.example.paymentGateway.Dto.UserRegisterDTO;
import com.example.paymentGateway.Entity.User;
import com.example.paymentGateway.Mapper.UserMapper;
import com.example.paymentGateway.Repository.UserRepository;
import com.example.paymentGateway.Security.UserPrincipal;

@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    //create User (Register new User)
    public UserDTO createUser(UserRegisterDTO userRegisterDTO) {
        User user = new User();

        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
        user.setRole(userRegisterDTO.getRole());
        user.setEmail(userRegisterDTO.getEmail());

        User savedUser = userRepository.save(user);
        UserDTO returnUser =  UserMapper.toDTO(savedUser);

        return returnUser;
    }

    //get User By Id
    public UserDTO getUserById(){
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
  
        return UserMapper.toDTO(user);
    }

    //get All Users
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll()
        .stream()
        .map(UserMapper::toDTO)
        .toList();
    }

    //Delete User By Id
    public void deleteUserById(){
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(user.getId());
    }
}
