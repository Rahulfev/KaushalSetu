package com.kaushalsetu.modules.payment.repository;

import com.kaushalsetu.entity.ClientPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientPaymentRepository extends JpaRepository<ClientPayment, Integer> {
    Optional<ClientPayment> findByRazorpayOrderId(String orderId);
    List<ClientPayment> findByApplication_ApplicationId(Integer applicationId);
    List<ClientPayment> findByApplication_Job_PostedByUserId(Integer clientUserId);
    List<ClientPayment> findByApplication_Worker_UserId(Integer workerUserId);
}
