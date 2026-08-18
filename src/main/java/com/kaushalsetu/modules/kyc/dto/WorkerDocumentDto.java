package com.kaushalsetu.modules.kyc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDocumentDto {

    private Integer kycId;
    private String documentType;   // e.g. "AADHAAR", "PAN" — the TYPE only, never the number
    private String status;         // NOT_SUBMITTED / PENDING / UNDER_REVIEW / APPROVED / REJECTED
    private String verifiedBy;
    private LocalDateTime verifiedAt;
}
