package com.tinghir.carrentalconnect.repository;

import com.tinghir.carrentalconnect.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
} 