package com.kaushalsetu.modules.payment.repository;

import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationEscrowPaymentRepository extends JpaRepository<EscrowPayment, Integer> {

    Optional<EscrowPayment> findByRazorpayOrderId(String razorpayOrderId);

    List<EscrowPayment> findByContract_ContractId(Integer contractId);

    List<EscrowPayment> findByPaymentStatus(PaymentStatus paymentStatus);

    List<EscrowPayment> findByTransactionType(TransactionType transactionType);

    // ✅ Matches the logic in RazorpayService for Worker dashboards
    List<EscrowPayment> findByContract_Client_UserId(Integer clientId);
    List<EscrowPayment> findByContract_Worker_UserId(Integer userId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(ep.amount), 0) FROM EscrowPayment ep " +
        "WHERE ep.contract.worker.userId = :workerId AND ep.paymentStatus = :status"
    )
    Double sumAmountByWorkerAndStatus(
        @org.springframework.data.repository.query.Param("workerId") Integer workerId,
        @org.springframework.data.repository.query.Param("status") PaymentStatus status
    );
}