package com.tinghir.carrentalconnect.dto;

import com.tinghir.carrentalconnect.model.Car;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDTO {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private String registrationNumber;
    private String type;
    private String agency;
    private String status;
    private BigDecimal pricePerDay;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static CarDTO fromEntity(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setBrand(car.getBrand());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setRegistrationNumber(car.getRegistrationNumber());
        dto.setType(car.getType());
        dto.setAgency(car.getAgency());
        dto.setStatus(car.getStatus().toString());
        dto.setPricePerDay(car.getPricePerDay());
        dto.setImageUrl(car.getImageUrl());
        dto.setCreatedAt(car.getCreatedAt());
        dto.setUpdatedAt(car.getUpdatedAt());
        return dto;
    }
    
    public Car toEntity() {
        Car car = new Car();
        car.setId(this.id);
        car.setBrand(this.brand);
        car.setModel(this.model);
        car.setYear(this.year);
        car.setRegistrationNumber(this.registrationNumber);
        car.setType(this.type);
        car.setAgency(this.agency);
        if (this.status != null) {
            car.setStatus(Car.CarStatus.valueOf(this.status));
        }
        car.setPricePerDay(this.pricePerDay);
        car.setImageUrl(this.imageUrl);
        return car;
    }
} 