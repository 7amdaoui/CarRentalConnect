package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.model.Payment;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.service.PaymentService;
import com.tinghir.carrentalconnect.service.EmailService;
import com.tinghir.carrentalconnect.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment created = paymentService.createPayment(payment);
        // Send confirmation email if payment is successful
        if ("SUCCESS".equalsIgnoreCase(created.getStatus()) && created.getReservation() != null) {
            Reservation reservation = reservationRepository.findById(created.getReservation().getId()).orElse(null);
            if (reservation != null && reservation.getUser() != null) {
                String to = reservation.getUser().getEmail();
                String subject = "Confirmation de paiement";
                String text = "Bonjour " + reservation.getUser().getFirstName() + ",\n\n" +
                        "Votre paiement pour la réservation #" + reservation.getId() + " a été reçu avec succès.\n" +
                        "Montant: " + created.getAmount() + " MAD\n" +
                        "Merci pour votre confiance !\nCarRentalConnect";
                emailService.sendPaymentConfirmationEmail(reservation.getUser(), reservation, created);
            }
        }
        return ResponseEntity.ok(created);
    }
} 