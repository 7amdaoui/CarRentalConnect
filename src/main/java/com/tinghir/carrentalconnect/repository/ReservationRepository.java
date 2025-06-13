package com.tinghir.carrentalconnect.repository;

import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.model.User;
import com.tinghir.carrentalconnect.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUser(User user);
    
    List<Reservation> findByCar(Car car);
    
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
    
    List<Reservation> findByPaymentStatus(Reservation.PaymentStatus paymentStatus);
    
    @Query("SELECT r FROM Reservation r WHERE r.car.id = :carId AND " +
           "((r.startDate <= :endDate AND r.endDate >= :startDate) AND " +
           "r.status IN ('PENDING', 'CONFIRMED'))")
    List<Reservation> findOverlappingReservations(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM Reservation r WHERE r.car.agency = :agency")
    List<Reservation> findByCarAgency(@Param("agency") String agency);
    
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND " + 
           "r.status IN ('PENDING', 'CONFIRMED')")
    List<Reservation> findActiveReservationsByUser(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND " +
           "r.status IN ('COMPLETED', 'CANCELLED')")
    List<Reservation> findPastReservationsByUser(@Param("userId") Long userId);
} 