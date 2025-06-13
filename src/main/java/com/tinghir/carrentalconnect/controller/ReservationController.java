package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.dto.ReservationDTO;
import com.tinghir.carrentalconnect.service.ReservationService;
import com.tinghir.carrentalconnect.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReservationDTO>> createReservation(@RequestBody ReservationDTO reservationDTO) {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;
        ReservationDTO created = reservationService.createReservation(reservationDTO, email);
        return ResponseEntity.ok(ApiResponse.success("Reservation created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDTO>> getReservationById(@PathVariable Long id) {
        // Fetch reservation by ID (implement in service)
        ReservationDTO reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success("Reservation fetched successfully", reservation));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getMyReservations() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication != null ? authentication.getName() : null;
        if (email == null || email.equals("anonymousUser")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        List<ReservationDTO> reservations = reservationService.getReservationsByUserEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Reservations fetched successfully", reservations));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDTO>> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        if (updates.containsKey("status") && "cancelled".equalsIgnoreCase((String) updates.get("status"))) {
            ReservationDTO cancelled = reservationService.cancelReservation(id);
            return ResponseEntity.ok(ApiResponse.success("Reservation cancelled", cancelled));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Unsupported update"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getAllReservations() {
        List<ReservationDTO> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success("All reservations fetched", reservations));
    }

    // If you have an old PDF endpoint, you can redirect to the new one:
    // @GetMapping("/reservation/{id}/pdf")
    // public ResponseEntity<Void> downloadPdf(@PathVariable Long id, HttpServletResponse response) throws IOException {
    //     response.sendRedirect("/reservation/" + id + "/invoice");
    //     return ResponseEntity.status(HttpStatus.FOUND).build();
    // }
} 