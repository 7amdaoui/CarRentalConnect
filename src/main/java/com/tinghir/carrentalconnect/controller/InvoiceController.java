package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.repository.ReservationRepository;
import com.tinghir.carrentalconnect.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;

@RestController
public class InvoiceController {
    private static final Logger logger = LoggerFactory.getLogger(InvoiceController.class);
    
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/reservation/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        try {
            Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
            
            String html = invoiceService.generateInvoiceHtml(reservation);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(baos, true);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline()
                .filename("facture_reservation_" + id + ".pdf")
                .build());
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(baos.toByteArray());
                
        } catch (Exception e) {
            logger.error("Error generating PDF for reservation {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF invoice", e);
        }
    }
} 