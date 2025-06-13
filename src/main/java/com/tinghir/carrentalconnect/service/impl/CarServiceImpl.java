package com.tinghir.carrentalconnect.service.impl;

import com.tinghir.carrentalconnect.dto.CarDTO;
import com.tinghir.carrentalconnect.model.Car;
import com.tinghir.carrentalconnect.model.Reservation;
import com.tinghir.carrentalconnect.repository.CarRepository;
import com.tinghir.carrentalconnect.repository.ReservationRepository;
import com.tinghir.carrentalconnect.service.CarService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public CarServiceImpl(CarRepository carRepository, ReservationRepository reservationRepository) {
        this.carRepository = carRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getAllCars(Map<String, String> filters, int page, int size) {
        String agency = filters.get("agency");
        Page<Car> carsPage;
        if (agency != null && !agency.isEmpty()) {
            carsPage = carRepository.findByAgency(agency, PageRequest.of(page, size));
        } else {
            carsPage = carRepository.findAll(PageRequest.of(page, size));
        }
        return carsPage.getContent().stream()
                .map(CarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with id: " + id));
        return CarDTO.fromEntity(car);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> getCarsByAgency(String agency) {
        List<Car> cars = carRepository.findByAgency(agency);
        return cars.stream()
                .map(CarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CarDTO createCar(CarDTO carDTO) {
        Car car = carDTO.toEntity();
        car = carRepository.save(car);
        return CarDTO.fromEntity(car);
    }

    @Override
    @Transactional
    public CarDTO updateCar(Long id, CarDTO carDTO) {
        Car existingCar = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with id: " + id));

        // Update properties
        existingCar.setBrand(carDTO.getBrand());
        existingCar.setModel(carDTO.getModel());
        existingCar.setYear(carDTO.getYear());
        existingCar.setRegistrationNumber(carDTO.getRegistrationNumber());
        existingCar.setType(carDTO.getType());
        existingCar.setAgency(carDTO.getAgency());
        if (carDTO.getStatus() != null) {
            existingCar.setStatus(Car.CarStatus.valueOf(carDTO.getStatus()));
        }
        existingCar.setPricePerDay(carDTO.getPricePerDay());
        existingCar.setImageUrl(carDTO.getImageUrl());

        existingCar = carRepository.save(existingCar);
        return CarDTO.fromEntity(existingCar);
    }

    @Override
    @Transactional
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new EntityNotFoundException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarDTO> searchCars(String type, String agency, BigDecimal minPrice, BigDecimal maxPrice,
                                 String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        List<Car> availableCars;
        
        if (startDate != null && endDate != null) {
            if (type != null && agency != null) {
                availableCars = carRepository.findAvailableCarsForDateRangeByTypeAndAgency(
                        startDate, endDate, type, agency);
            } else {
                availableCars = carRepository.findAvailableCarsForDateRange(startDate, endDate);
            }
        } else if (type != null) {
            availableCars = carRepository.findByType(type);
        } else if (agency != null) {
            availableCars = carRepository.findByAgency(agency);
        } else if (status != null) {
            availableCars = carRepository.findByStatus(Car.CarStatus.valueOf(status.toUpperCase()));
        } else {
            availableCars = carRepository.findAll();
        }
        
        // Additional filtering by price
        if (minPrice != null || maxPrice != null) {
            availableCars = availableCars.stream()
                    .filter(car -> {
                        boolean withinRange = true;
                        if (minPrice != null) {
                            withinRange = car.getPricePerDay().compareTo(minPrice) >= 0;
                        }
                        if (maxPrice != null && withinRange) {
                            withinRange = car.getPricePerDay().compareTo(maxPrice) <= 0;
                        }
                        return withinRange;
                    })
                    .collect(Collectors.toList());
        }
        
        // Apply pagination manually since we're filtering in memory
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, availableCars.size());
        
        if (fromIndex >= availableCars.size()) {
            return List.of();
        }
        
        return availableCars.subList(fromIndex, toIndex).stream()
                .map(CarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> checkCarAvailability(Long carId, LocalDate startDate, LocalDate endDate) {
        Map<String, String> result = new HashMap<>();
        
        // Check if car exists
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new EntityNotFoundException("Car not found with id: " + carId));
        
        // Check if car is in available status
        if (car.getStatus() != Car.CarStatus.AVAILABLE) {
            result.put("available", "false");
            result.put("message", "Car is not available for reservation");
            return result;
        }
        
        // Check for overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                carId, startDate, endDate);
        
        if (!overlappingReservations.isEmpty()) {
            result.put("available", "false");
            result.put("message", "Car is already reserved for the selected dates");
            return result;
        }
        
        result.put("available", "true");
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllTypes() {
        return carRepository.findAllTypes();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllAgencies() {
        return carRepository.findAllAgencies();
    }
} 