package com.fit.shoeshopbackend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String accountId;
    private List<String> roles;
}










