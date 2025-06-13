package com.tinghir.carrentalconnect.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreateRequest {
    
    @NotNull(message = "Car ID is required")
    private Long carId;
    
    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;
    
    // Optional - only used when the user is not authenticated
    private UserDetailsRequest userDetails;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDetailsRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
    }
} 