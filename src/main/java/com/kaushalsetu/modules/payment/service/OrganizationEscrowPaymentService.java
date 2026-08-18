package com.kaushalsetu.modules.payment.service;

import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import java.util.List;

public interface OrganizationEscrowPaymentService {
	
    List<EscrowPayment> getAllPayments();

    /** Returns only the escrow payments belonging to contracts where this user is the client/organization. */
    List<EscrowPayment> getPaymentsForClient(Integer clientUserId);
    
    EscrowPayment getPaymentById(Integer escrowId);
    
    List<EscrowPayment> getPaymentsByContract(Integer contractId);
    
    List<EscrowPayment> getPaymentsByStatus(PaymentStatus status);
    
    List<EscrowPayment> getPaymentsByTransactionType(TransactionType type);
    
    /** ORGANIZATION: directly funds a PENDING escrow record — no payment gateway involved. */
    EscrowPayment fundEscrow(Integer escrowId);

    /** Releases a specific ESCROW_HELD payment to the worker (marks it RELEASED). */
    EscrowPayment releaseToWorker(Integer escrowId);
}