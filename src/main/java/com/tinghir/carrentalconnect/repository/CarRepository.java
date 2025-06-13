package com.tinghir.carrentalconnect.repository;

import com.tinghir.carrentalconnect.model.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    List<Car> findByStatus(Car.CarStatus status);
    
    List<Car> findByAgency(String agency);
    
    List<Car> findByType(String type);
    
    List<Car> findByBrand(String brand);
    
    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND c.type = :type")
    List<Car> findAvailableCarsByType(@Param("type") String type);
    
    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND c.agency = :agency")
    List<Car> findAvailableCarsByAgency(@Param("agency") String agency);
    
    @Query("SELECT c FROM Car c WHERE c.id NOT IN " +
           "(SELECT r.car.id FROM Reservation r WHERE " +
           "((r.startDate <= :endDate AND r.endDate >= :startDate) " +
           "AND r.status IN ('PENDING', 'CONFIRMED')))")
    List<Car> findAvailableCarsForDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Car c WHERE c.type = :type AND c.agency = :agency AND c.id NOT IN " +
           "(SELECT r.car.id FROM Reservation r WHERE " +
           "((r.startDate <= :endDate AND r.endDate >= :startDate) " +
           "AND r.status IN ('PENDING', 'CONFIRMED')))")
    List<Car> findAvailableCarsForDateRangeByTypeAndAgency(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("type") String type,
            @Param("agency") String agency);
    
    @Query("SELECT DISTINCT c.type FROM Car c")
    List<String> findAllTypes();
    
    @Query("SELECT DISTINCT c.agency FROM Car c")
    List<String> findAllAgencies();

    Page<Car> findByAgency(String agency, Pageable pageable);
} 