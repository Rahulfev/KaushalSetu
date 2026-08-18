package com.kaushalsetu.modules.payment.dto;

import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationEscrowPaymentResponse {

    private Integer escrowId;
    private Integer contractId;
    private Double amount;
    private PaymentStatus paymentStatus;
    private TransactionType transactionType;
    private LocalDateTime transactionDate;

    // Worker/job info so the frontend doesn't need a separate lookup
    private Integer workerId;
    private String workerName;
    private String jobTitle;
}
