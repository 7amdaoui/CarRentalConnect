package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.model.Payment;
import com.tinghir.carrentalconnect.service.InvoiceService;
import org.springframework.stereotype.Service;

@Service
public class InvoiceServiceImpl implements InvoiceService {
    @Override
    public String generateInvoiceHtml(Reservation reservation) {
        String clientName = reservation.getUser() != null ? reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName() : "";
        String clientEmail = reservation.getUser() != null ? reservation.getUser().getEmail() : "";
        String clientPhone = reservation.getUser() != null ? reservation.getUser().getPhone() : "";
        String car = reservation.getCar() != null ? reservation.getCar().getBrand() + " " + reservation.getCar().getModel() + " (" + reservation.getCar().getYear() + ")" : "";
        String agency = reservation.getCar() != null ? reservation.getCar().getAgency() : "";
        String status = reservation.getPaymentStatus() != null ? (reservation.getPaymentStatus().toString().equalsIgnoreCase("PAID") ? "Payé" : "En attente") : "En attente";
        String paymentMethod = "-";
        if (reservation.getPayments() != null && !reservation.getPayments().isEmpty()) {
            Payment lastPayment = reservation.getPayments().get(reservation.getPayments().size() - 1);
            paymentMethod = lastPayment.getMethod();
        }
        String total = reservation.getTotalPrice() != null ? String.format("%.2f", reservation.getTotalPrice()) : "-";
        
        return "<html><head><style>"
            + "body { font-family: Arial, sans-serif; color: #222; margin: 40px; }"
            + "table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }"
            + "th, td { border: 1px solid #eee; padding: 8px; }"
            + "th { background: #f5f5f5; text-align: left; }"
            + ".title { font-size: 1.5em; color: #d32f2f; font-weight: bold; margin-bottom: 16px; }"
            + ".section-title { font-weight: bold; color: #1976d2; margin-top: 18px; }"
            + ".footer { margin-top: 32px; font-size: 0.95em; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }"
            + "</style></head><body>"
            + "<div style='text-align: center; margin-bottom: 30px;'>"
            + "<h1 class='title'>Facture de Réservation – CarRentalConnect</h1>"
            + "</div>"
            + "<div class='section-title'>Informations du client</div>"
            + "<table>"
            + "<tr><th>Nom</th><td>" + clientName + "</td></tr>"
            + "<tr><th>Téléphone</th><td>" + clientPhone + "</td></tr>"
            + "<tr><th>Email</th><td>" + clientEmail + "</td></tr>"
            + "</table>"
            + "<div class='section-title'>Détails de la réservation</div>"
            + "<table>"
            + "<tr><th>Numéro de réservation</th><td>#" + reservation.getId() + "</td></tr>"
            + "<tr><th>Véhicule</th><td>" + car + "</td></tr>"
            + "<tr><th>Agence</th><td>" + agency + "</td></tr>"
            + "<tr><th>Période</th><td>" + reservation.getStartDate() + " – " + reservation.getEndDate() + "</td></tr>"
            + "</table>"
            + "<div class='section-title'>Paiement</div>"
            + "<table>"
            + "<tr><th>Statut</th><td>" + status + "</td></tr>"
            + "<tr><th>Méthode</th><td>" + paymentMethod + "</td></tr>"
            + "<tr><th>Montant total TTC</th><td><b>" + total + " MAD</b></td></tr>"
            + "</table>"
            + "<div class='footer'>Merci pour votre confiance.<br/>"
            + "CarRentalConnect – Location de voitures à Tinghir et alentours<br/>"
            + "www.carrentalconnect.ma | support@carrentalconnect.ma</div>"
            + "</body></html>";
    }
} 