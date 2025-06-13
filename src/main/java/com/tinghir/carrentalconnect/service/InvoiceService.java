package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.model.Reservation;

public interface InvoiceService {
    String generateInvoiceHtml(Reservation reservation);
} 