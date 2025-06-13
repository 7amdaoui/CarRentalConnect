package com.tinghir.carrentalconnect.controller;

import com.tinghir.carrentalconnect.dto.CarDTO;
import com.tinghir.carrentalconnect.dto.response.ApiResponse;
import com.tinghir.carrentalconnect.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cars")
public class CarController {

    private final CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarDTO>>> getAllCars(
            @RequestParam(required = false) Map<String, String> params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<CarDTO> cars = carService.getAllCars(params, page, size);
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", cars));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarDTO>> getCarById(@PathVariable Long id) {
        CarDTO car = carService.getCarById(id);
        return ResponseEntity.ok(ApiResponse.success("Car retrieved successfully", car));
    }

    @GetMapping("/agency/{agency}")
    public ResponseEntity<ApiResponse<List<CarDTO>>> getCarsByAgency(@PathVariable String agency) {
        List<CarDTO> cars = carService.getCarsByAgency(agency);
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", cars));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CarDTO>>> searchCars(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String agency,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<CarDTO> cars = carService.searchCars(type, agency, minPrice, maxPrice, status, startDate, endDate, page, size);
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", cars));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<Map<String, String>>> checkCarAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, String> availability = carService.checkCarAvailability(id, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Availability checked successfully", availability));
    }

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<String>>> getAllTypes() {
        List<String> types = carService.getAllTypes();
        return ResponseEntity.ok(ApiResponse.success("Car types retrieved successfully", types));
    }

    @GetMapping("/agencies")
    public ResponseEntity<ApiResponse<List<String>>> getAllAgencies() {
        List<String> agencies = carService.getAllAgencies();
        return ResponseEntity.ok(ApiResponse.success("Agencies retrieved successfully", agencies));
    }

    // Admin endpoints

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CarDTO>> createCar(@RequestBody CarDTO carDTO) {
        CarDTO createdCar = carService.createCar(carDTO);
        return new ResponseEntity<>(ApiResponse.success("Car created successfully", createdCar), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CarDTO>> updateCar(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        CarDTO updatedCar = carService.updateCar(id, carDTO);
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", updatedCar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }
} 