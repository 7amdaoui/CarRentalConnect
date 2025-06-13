package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.repository.ReservationRepository;
import com.tinghir.carrentalconnect.model.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class StatsController {
    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue() {
        double total = reservationRepository.findAll().stream()
            .filter(r -> r.getPaymentStatus() == Reservation.PaymentStatus.PAID)
            .mapToDouble(r -> r.getTotalPrice().doubleValue())
            .sum();
        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        return ResponseEntity.ok(response);
    }
} 