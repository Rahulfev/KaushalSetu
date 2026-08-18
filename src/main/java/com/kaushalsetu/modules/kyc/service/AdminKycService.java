package com.kaushalsetu.modules.kyc.service;

import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.entity.KycAuditLog;
import com.kaushalsetu.entity.KycDocument;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.kyc.dto.*;
import com.kaushalsetu.modules.kyc.repository.KycAuditLogRepository;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import com.kaushalsetu.modules.kyc.repository.WorkerSkillCertificateRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Admin/supervisor side of the KYC lifecycle: review queue, full detail view (unmasked),
 * and the decision actions (move to review, approve, reject, request re-upload).
 * Every decision is written to the audit log and triggers an in-app notification.
 */
@Service
@RequiredArgsConstructor
public class AdminKycService {

    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final KycAuditLogRepository auditLogRepository;
    private final WorkerSkillCertificateRepository certificateRepository;
    private final KycService kycService; // reused for its notify() helper

    public List<KycListResponseDto> listAll(String statusFilter) {
        List<KycDocument> docs = (statusFilter == null || statusFilter.isBlank())
                ? kycRepository.findAllByOrderByKycIdDesc()
                : kycRepository.findByStatusOrderByKycIdAsc(KycStatus.valueOf(statusFilter.trim().toUpperCase()));

        return docs.stream().map(this::toListDto).toList();
    }

    public KycAdminDetailResponseDto getDetail(Integer kycId) {
        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ApiException("KYC record not found"));

        List<KycAdminDetailResponseDto.AuditLogDto> auditLog =
                auditLogRepository.findByKyc_KycIdOrderByCreatedAtDesc(kycId).stream()
                        .map(a -> KycAdminDetailResponseDto.AuditLogDto.builder()
                                .action(a.getAction())
                                .remarks(a.getRemarks())
                                .performedBy(a.getPerformedBy() != null ? a.getPerformedBy().getFullName() : "Worker")
                                .createdAt(a.getCreatedAt())
                                .build())
                        .toList();

        List<KycMyStatusResponseDto.CertificateDto> certs =
                certificateRepository.findByUser_UserId(kyc.getUser().getUserId()).stream()
                        .map(c -> KycMyStatusResponseDto.CertificateDto.builder()
                                .certificateId(c.getCertificateId())
                                .certificateName(c.getCertificateName())
                                .fileUrl(c.getFileUrl())
                                .uploadedAt(c.getUploadedAt())
                                .build())
                        .toList();

        return KycAdminDetailResponseDto.builder()
                .kycId(kyc.getKycId())
                .userId(kyc.getUser().getUserId())
                .status(kyc.getStatus().name())
                .completionPercent(kyc.getCompletionPercent())
                .fullName(kyc.getFullName())
                .dateOfBirth(kyc.getDateOfBirth() != null ? kyc.getDateOfBirth().toString() : null)
                .gender(kyc.getGender())
                .mobileNumber(kyc.getMobileNumber())
                .email(kyc.getEmail())
              //  .profilePhotoUrl(kyc.getProfilePhotoUrl())
                .addressLine(kyc.getAddressLine())
                .city(kyc.getCity())
                .state(kyc.getState())
                .pincode(kyc.getPincode())
                .documentType(kyc.getDocumentType())
                .documentNumber(kyc.getDocumentNumber())
//                .documentFrontUrl(kyc.getDocumentFrontUrl())
//                .documentBackUrl(kyc.getDocumentBackUrl())
                .payoutMethod(kyc.getPayoutMethod() != null ? kyc.getPayoutMethod().name() : null)
                .upiId(kyc.getUpiId())
                .bankAccountHolderName(kyc.getBankAccountHolderName())
                .bankName(kyc.getBankName())
                .bankAccountNumber(kyc.getBankAccountNumber())
                .ifscCode(kyc.getIfscCode())
                .rejectionReason(kyc.getRejectionReason())
                .remarks(kyc.getRemarks())
                .verifiedByName(kyc.getVerifiedBy() != null ? kyc.getVerifiedBy().getFullName() : null)
                .verifiedAt(kyc.getVerifiedAt())
                .submittedAt(kyc.getSubmittedAt())
                .certificates(certs)
                .auditLog(auditLog)
                .build();
    }

    /**
     * decision: UNDER_REVIEW, APPROVED, REJECTED, or REUPLOAD_REQUESTED
     * (REUPLOAD_REQUESTED behaves like REJECTED — it lets the worker edit & resubmit —
     * but the audit trail / notification text distinguishes it from an outright rejection.)
     */
    @Transactional
    public void decide(Integer kycId, KycDecisionRequestDto request) {
        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ApiException("KYC record not found"));

        String adminEmail = JwtUtils.getCurrentUsername();
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ApiException("Reviewer not found"));

        String decisionRaw = request.getDecision() == null ? "" : request.getDecision().trim().toUpperCase();
        User worker = kyc.getUser();
        String notifyMessage;
        String auditAction;

        switch (decisionRaw) {
            case "UNDER_REVIEW" -> {
                kyc.setStatus(KycStatus.UNDER_REVIEW);
                auditAction = "MOVED_TO_UNDER_REVIEW";
                notifyMessage = "Your KYC submission is now under review.";
            }
            case "APPROVED" -> {
                kyc.setStatus(KycStatus.APPROVED);
                kyc.setRejectionReason(null);
                auditAction = "APPROVED";
                notifyMessage = "🎉 Your KYC has been verified! You can now apply for jobs and receive payments.";
            }
            case "REJECTED" -> {
                if (request.getRemarks() == null || request.getRemarks().isBlank())
                    throw new ApiException("A rejection reason is required");
                kyc.setStatus(KycStatus.REJECTED);
                kyc.setRejectionReason(request.getRemarks());
                auditAction = "REJECTED";
                notifyMessage = "Your KYC was rejected: " + request.getRemarks();
            }
            case "REUPLOAD_REQUESTED" -> {
                if (request.getRemarks() == null || request.getRemarks().isBlank())
                    throw new ApiException("Please specify what needs to be re-uploaded");
                kyc.setStatus(KycStatus.REJECTED); // worker can edit & resubmit, same as a rejection
                kyc.setRejectionReason(request.getRemarks());
                auditAction = "REUPLOAD_REQUESTED";
                notifyMessage = "Action needed on your KYC: " + request.getRemarks();
            }
            default -> throw new ApiException("Decision must be one of UNDER_REVIEW, APPROVED, REJECTED, REUPLOAD_REQUESTED");
        }

        kyc.setRemarks(request.getRemarks());
        kyc.setVerifiedBy(admin);
        kyc.setVerifiedAt(java.time.LocalDateTime.now());
        kycRepository.save(kyc);

        worker.setKycStatus(kyc.getStatus());
        userRepository.save(worker);

        auditLogRepository.save(KycAuditLog.builder()
                .kyc(kyc)
                .performedBy(admin)
                .action(auditAction)
                .remarks(request.getRemarks())
                .build());

        kycService.notify(worker, notifyMessage);
    }

    private KycListResponseDto toListDto(KycDocument kyc) {
        return KycListResponseDto.builder()
                .kycId(kyc.getKycId())
                .userId(kyc.getUser().getUserId())
                .userName(kyc.getUser().getFullName())
                .email(kyc.getUser().getEmail())
                //.profilePhotoUrl(kyc.getProfilePhotoUrl())
                .documentType(kyc.getDocumentType())
                .documentNumber(kyc.getDocumentNumber())
                .status(kyc.getStatus().name())
                .completionPercent(kyc.getCompletionPercent())
                .submittedAt(kyc.getSubmittedAt())
                .build();
    }
}
