package com.kaushalsetu.modules.kyc.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/** Full KYC record as seen by an admin/supervisor reviewing it — nothing masked. */
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class KycAdminDetailResponseDto {
    private Integer kycId;
    private Integer userId;
    private String status;
    private int completionPercent;

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

    private String documentType;
    private String documentNumber;
   // private String documentFrontUrl;
   // private String documentBackUrl;

    private String payoutMethod;
    private String upiId;
    private String bankAccountHolderName;
    private String bankName;
    private String bankAccountNumber;
    private String ifscCode;

    private String rejectionReason;
    private String remarks;
    private String verifiedByName;
    private LocalDateTime verifiedAt;
    private LocalDateTime submittedAt;

    private List<KycMyStatusResponseDto.CertificateDto> certificates;
    private List<AuditLogDto> auditLog;

    @Getter @Setter @Builder
    public static class AuditLogDto {
        private String action;
        private String remarks;
        private String performedBy;
        private LocalDateTime createdAt;
    }
}
