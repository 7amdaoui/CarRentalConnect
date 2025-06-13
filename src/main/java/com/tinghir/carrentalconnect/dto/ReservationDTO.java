package com.tinghir.carrentalconnect.dto;

import com.tinghir.carrentalconnect.model.Reservation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private Long carId;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String status;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for frontend display
    private CarDTO car;
    private UserDTO user;
    
    private String guestFirstName;
    private String guestLastName;
    private String guestEmail;
    private String guestPhone;
    
    public static ReservationDTO fromEntity(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setCarId(reservation.getCar().getId());
        dto.setUserId(reservation.getUser().getId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus().toString());
        dto.setPaymentStatus(reservation.getPaymentStatus().toString());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());
        
        // Set related entities as DTOs
        dto.setCar(CarDTO.fromEntity(reservation.getCar()));
        dto.setUser(UserDTO.fromEntity(reservation.getUser()));
        
        dto.setGuestFirstName(reservation.getGuestFirstName());
        dto.setGuestLastName(reservation.getGuestLastName());
        dto.setGuestEmail(reservation.getGuestEmail());
        dto.setGuestPhone(reservation.getGuestPhone());
        
        return dto;
    }
} 