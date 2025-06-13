package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.model.Payment;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment getPaymentById(Long id);
    List<Payment> getPaymentsByReservationId(Long reservationId);
    List<Payment> getAllPayments();
}