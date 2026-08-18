package com.kaushalsetu.modules.kyc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class KycMyStatusResponseDto {
    private String overallStatus;      // NOT_SUBMITTED / PENDING / UNDER_REVIEW / APPROVED / REJECTED
    private Integer kycId;
    private int completionPercent;

    // Personal
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String mobileNumber;
    private String email;
   // private String profilePhotoUrl;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    // Identity document
    private String documentType;
    private String documentNumber;
   // private String documentFrontUrl;
   // private String documentBackUrl;

    // Payment
    private String payoutMethod;
    private String upiId;
    private String bankAccountHolderName;
    private String bankName;
    private String bankAccountNumberMasked;
    private String ifscCode;

    // Lifecycle
    private String rejectionReason;
    private String remarks;
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;

    private List<CertificateDto> certificates;

    @Getter @Setter @Builder
    public static class CertificateDto {
        private Integer certificateId;
        private String certificateName;
        private String fileUrl;
        private LocalDateTime uploadedAt;
    }
}
