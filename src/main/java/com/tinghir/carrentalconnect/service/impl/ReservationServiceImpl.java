package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.dto.ReservationDTO;
import com.tinghir.carrentalconnect.model.Car;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.model.User;
import com.tinghir.carrentalconnect.repository.CarRepository;
import com.tinghir.carrentalconnect.repository.ReservationRepository;
import com.tinghir.carrentalconnect.repository.UserRepository;
import com.tinghir.carrentalconnect.service.EmailService;
import com.tinghir.carrentalconnect.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    @Override
    public ReservationDTO createReservation(ReservationDTO reservationDTO, String authenticatedEmail) {
        System.out.println("Creating reservation for carId: " + reservationDTO.getCarId());
        Car car = carRepository.findById(reservationDTO.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));
        System.out.println("Fetched car: " + car);
        User user = null;
        if (authenticatedEmail != null && !authenticatedEmail.equalsIgnoreCase("anonymousUser")) {
            user = userRepository.findByEmail(authenticatedEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else if (reservationDTO.getGuestEmail() != null) {
            user = new User();
            user.setFirstName(reservationDTO.getGuestFirstName());
            user.setLastName(reservationDTO.getGuestLastName());
            user.setEmail(reservationDTO.getGuestEmail());
            user.setPhone(reservationDTO.getGuestPhone());
            user.setPassword("");
            user.setRole(User.UserRole.USER);
            user = userRepository.save(user);
        } else {
            user = userRepository.findByEmail("guest@carrentalconnect.com").orElse(null);
            if (user == null) {
                user = new User();
                user.setFirstName("Guest");
                user.setLastName("User");
                user.setEmail("guest@carrentalconnect.com");
                user.setPassword("");
                user.setPhone("");
                user.setRole(User.UserRole.USER);
                user = userRepository.save(user);
            }
        }
        Reservation reservation = new Reservation();
        reservation.setCar(car);
        reservation.setUser(user);
        reservation.setStartDate(reservationDTO.getStartDate());
        reservation.setEndDate(reservationDTO.getEndDate());
        java.math.BigDecimal totalPrice = reservationDTO.getTotalPrice();
        if (totalPrice == null || totalPrice.compareTo(java.math.BigDecimal.ZERO) == 0) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(reservationDTO.getStartDate(), reservationDTO.getEndDate()) + 1;
            totalPrice = car.getPricePerDay().multiply(java.math.BigDecimal.valueOf(days));
        }
        reservation.setTotalPrice(totalPrice);
        reservation.setGuestFirstName(reservationDTO.getGuestFirstName());
        reservation.setGuestLastName(reservationDTO.getGuestLastName());
        reservation.setGuestEmail(reservationDTO.getGuestEmail());
        reservation.setGuestPhone(reservationDTO.getGuestPhone());
        Reservation saved = reservationRepository.save(reservation);
        System.out.println("Saved reservation with id: " + saved.getId() + ", carId: " + saved.getCar().getId());
        // Send confirmation email
        emailService.sendReservationConfirmationEmail(user, saved);
        return ReservationDTO.fromEntity(saved);
    }

    @Override
    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return ReservationDTO.fromEntity(reservation);
    }

    @Override
    public List<ReservationDTO> getReservationsByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Reservation> reservations = reservationRepository.findByUser(user);
        return reservations.stream().map(ReservationDTO::fromEntity).toList();
    }

    // Add this method to handle reservation cancellation
    public ReservationDTO cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        Reservation saved = reservationRepository.save(reservation);
        emailService.sendReservationCancellationEmail(saved.getUser(), saved);
        return ReservationDTO.fromEntity(saved);
    }

    @Override
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
            .map(ReservationDTO::fromEntity)
            .collect(java.util.stream.Collectors.toList());
    }
} 