package com.example.paymentGateway.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.example.paymentGateway.enums.Role;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private Long accountId;

    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(nullable = false, unique = true)
    private String email;
    private LocalDateTime createdAt;

    //One user can made many orders
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.accountId == null) {
            this.accountId = Math.abs(UUID.randomUUID().getMostSignificantBits());

        }
    }

}
