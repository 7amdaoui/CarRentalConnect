package com.tinghir.carrentalconnect.service;

import com.tinghir.carrentalconnect.dto.CarDTO;
import com.tinghir.carrentalconnect.model.Car;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CarService {
    
    List<CarDTO> getAllCars(Map<String, String> filters, int page, int size);
    
    CarDTO getCarById(Long id);
    
    List<CarDTO> getCarsByAgency(String agency);
    
    CarDTO createCar(CarDTO carDTO);
    
    CarDTO updateCar(Long id, CarDTO carDTO);
    
    void deleteCar(Long id);
    
    List<CarDTO> searchCars(String type, String agency, BigDecimal minPrice, BigDecimal maxPrice, 
                           String status, LocalDate startDate, LocalDate endDate, int page, int size);
    
    Map<String, String> checkCarAvailability(Long carId, LocalDate startDate, LocalDate endDate);
    
    List<String> getAllTypes();
    
    List<String> getAllAgencies();
} 