package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.model.User;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.model.Payment;

public interface EmailService {
    void sendReservationConfirmationEmail(User user, Reservation reservation);
    void sendPaymentConfirmationEmail(User user, Reservation reservation, Payment payment);
    void sendReservationCancellationEmail(User user, Reservation reservation);
} 