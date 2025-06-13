package com.tinghir.carrentalconnect.dto.response;

import com.tinghir.carrentalconnect.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UserDTO user;
    private String token;
} 