package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.model.Payment;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.repository.PaymentRepository;
import com.tinghir.carrentalconnect.repository.ReservationRepository;
import com.tinghir.carrentalconnect.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    @Transactional
    public Payment createPayment(Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);
        if ("SUCCESS".equalsIgnoreCase(payment.getStatus()) && payment.getReservation() != null) {
            Reservation reservation = reservationRepository.findById(payment.getReservation().getId()).orElse(null);
            if (reservation != null) {
                reservation.setPaymentStatus(Reservation.PaymentStatus.PAID);
                reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
                reservationRepository.save(reservation);
            }
        }
        return savedPayment;
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public List<Payment> getPaymentsByReservationId(Long reservationId) {
        return paymentRepository.findAll().stream()
            .filter(p -> p.getReservation().getId().equals(reservationId))
            .toList();
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
} 