package com.example.paymentGateway.Dto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class VerifyPaymentDTO {
    
    private String paymentId;
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private String signature;

    
}
