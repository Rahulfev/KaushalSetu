package com.kaushalsetu.modules.payment.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
public class ClientPaymentResponse {
    private Integer paymentId;
    private Integer applicationId;
    private Integer jobId;
    private String jobTitle;
    private String workerName;
    private String clientName;
    private Double amount;
    private String status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
