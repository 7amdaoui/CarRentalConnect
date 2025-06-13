package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.dto.ReservationDTO;
import com.tinghir.carrentalconnect.dto.request.ReservationCreateRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ReservationServiceInterface {
    
    List<ReservationDTO> getAllReservations(int page, int size);
    
    ReservationDTO getReservationById(Long id);
    
    List<ReservationDTO> getReservationsByUser(Long userId);
    
    List<ReservationDTO> getReservationsByCar(Long carId);
    
    List<ReservationDTO> getReservationsByAgency(String agency);
    
    ReservationDTO createReservation(ReservationCreateRequest request, Long userId);
    
    ReservationDTO updateReservationStatus(Long id, String status);
    
    ReservationDTO updatePaymentStatus(Long id, String paymentStatus);
    
    ReservationDTO cancelReservation(Long id);
    
    Map<String, Object> processPayment(Long reservationId, Map<String, Object> paymentDetails);
} 