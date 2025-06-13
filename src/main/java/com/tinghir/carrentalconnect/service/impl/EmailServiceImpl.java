package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.model.User;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.model.Payment;
import com.tinghir.carrentalconnect.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM = "CarRentalConnect <mygmail@gmail.com>";

    @Override
    public void sendReservationConfirmationEmail(User user, Reservation reservation) {
        String subject = "Confirmation de votre réservation – CarRentalConnect";
        String to = user.getEmail();
        String html = getReservationHtml(user, reservation);
        sendHtmlEmail(to, subject, html);
    }

    @Override
    public void sendPaymentConfirmationEmail(User user, Reservation reservation, Payment payment) {
        String subject = "Paiement reçu – CarRentalConnect";
        String to = user.getEmail();
        String html = getPaymentHtml(user, reservation, payment);
        sendHtmlEmail(to, subject, html);
    }

    @Override
    public void sendReservationCancellationEmail(User user, Reservation reservation) {
        String subject = "Annulation de votre réservation – CarRentalConnect";
        String to = user.getEmail();
        String html = getCancellationHtml(user, reservation);
        sendHtmlEmail(to, subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(FROM);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getReservationHtml(User user, Reservation reservation) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; color: #222;'>" +
                "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;'>" +
                "<h2 style='color: #d32f2f;'>Confirmation de votre réservation</h2>" +
                "<p>Bonjour <b>" + user.getFirstName() + " " + user.getLastName() + "</b>,</p>" +
                "<p>Merci d'avoir choisi CarRentalConnect !</p>" +
                "<table style='width:100%; margin: 16px 0; border-collapse: collapse;'>" +
                "<tr><td><b>Numéro de réservation:</b></td><td>" + reservation.getId() + "</td></tr>" +
                "<tr><td><b>Véhicule:</b></td><td>" + reservation.getCar().getBrand() + " " + reservation.getCar().getModel() + "</td></tr>" +
                "<tr><td><b>Date de début:</b></td><td>" + reservation.getStartDate() + "</td></tr>" +
                "<tr><td><b>Date de fin:</b></td><td>" + reservation.getEndDate() + "</td></tr>" +
                "<tr><td><b>Montant total:</b></td><td>" + reservation.getTotalPrice() + " MAD</td></tr>" +
                "</table>" +
                "<p style='margin-top: 24px;'>Nous vous remercions pour votre confiance.<br/>Pour toute question, contactez-nous à <a href='mailto:mygmail@gmail.com'>mygmail@gmail.com</a>.</p>" +
                "<p style='color: #888; font-size: 12px; margin-top: 32px;'>CarRentalConnect – Location de voitures à Tinghir</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String getPaymentHtml(User user, Reservation reservation, Payment payment) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; color: #222;'>" +
                "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;'>" +
                "<h2 style='color: #388e3c;'>Paiement reçu</h2>" +
                "<p>Bonjour <b>" + user.getFirstName() + " " + user.getLastName() + "</b>,</p>" +
                "<p>Nous avons bien reçu votre paiement pour la réservation <b>#" + reservation.getId() + "</b>.</p>" +
                "<table style='width:100%; margin: 16px 0; border-collapse: collapse;'>" +
                "<tr><td><b>Montant payé:</b></td><td>" + payment.getAmount() + " MAD</td></tr>" +
                "<tr><td><b>Statut:</b></td><td>Paiement validé</td></tr>" +
                "<tr><td><b>Numéro de réservation:</b></td><td>" + reservation.getId() + "</td></tr>" +
                "</table>" +
                "<p style='margin-top: 24px;'>Merci pour votre confiance.<br/>Pour toute question, contactez-nous à <a href='mailto:mygmail@gmail.com'>mygmail@gmail.com</a>.</p>" +
                "<p style='color: #888; font-size: 12px; margin-top: 32px;'>CarRentalConnect – Location de voitures à Tinghir</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String getCancellationHtml(User user, Reservation reservation) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; color: #222;'>" +
                "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;'>" +
                "<h2 style='color: #d32f2f;'>Votre réservation a été annulée</h2>" +
                "<p>Bonjour <b>" + user.getFirstName() + " " + user.getLastName() + "</b>,</p>" +
                "<p>Votre réservation <b>#" + reservation.getId() + "</b> a été annulée.</p>" +
                "<table style='width:100%; margin: 16px 0; border-collapse: collapse;'>" +
                "<tr><td><b>Numéro de réservation:</b></td><td>" + reservation.getId() + "</td></tr>" +
                "<tr><td><b>Véhicule:</b></td><td>" + reservation.getCar().getBrand() + " " + reservation.getCar().getModel() + "</td></tr>" +
                "<tr><td><b>Date de début:</b></td><td>" + reservation.getStartDate() + "</td></tr>" +
                "<tr><td><b>Date de fin:</b></td><td>" + reservation.getEndDate() + "</td></tr>" +
                "<tr><td><b>Montant total:</b></td><td>" + reservation.getTotalPrice() + " MAD</td></tr>" +
                "</table>" +
                "<p style='margin-top: 24px;'>Pour toute question, contactez-nous à <a href='mailto:mygmail@gmail.com'>mygmail@gmail.com</a>.</p>" +
                "<p style='color: #888; font-size: 12px; margin-top: 32px;'>CarRentalConnect – Location de voitures à Tinghir</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
} 