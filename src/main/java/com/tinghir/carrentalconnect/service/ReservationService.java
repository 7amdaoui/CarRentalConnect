package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.dto.ReservationDTO;
import java.util.List;

public interface ReservationService {
    ReservationDTO createReservation(ReservationDTO reservationDTO, String authenticatedEmail);
    ReservationDTO getReservationById(Long id);
    List<ReservationDTO> getReservationsByUserEmail(String email);
    ReservationDTO cancelReservation(Long id);
    List<ReservationDTO> getAllReservations();
} 