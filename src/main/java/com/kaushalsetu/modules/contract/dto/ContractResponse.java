package com.kaushalsetu.modules.contract.dto;

import com.kaushalsetu.common.enums.ContractStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ContractResponse {

    private Integer contractId;
    private Integer jobId;
    private String jobTitle;
    private Integer workerId;
    private String workerName;
    private Integer clientId;
    private String clientName;
    private Double agreedAmount;
    private String contractTerms;
    private ContractStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime signedAt;
}
