package com.kaushalsetu.modules.kyc.service;

import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.common.enums.PayoutMethod;
import com.kaushalsetu.common.util.DocumentValidator;
import com.kaushalsetu.entity.*;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.kyc.dto.*;
import com.kaushalsetu.modules.kyc.repository.KycAuditLogRepository;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import com.kaushalsetu.modules.kyc.repository.WorkerSkillCertificateRepository;
import com.kaushalsetu.modules.user.repository.NotificationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.user.service.FileStorageService;
import com.kaushalsetu.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

/**
 * Worker-facing KYC operations: full submission (personal + identity doc + payout details),
 * status lookup, and optional skill certificates.
 *
 * KYC is a 4-step process: Personal Details -> Identity Document -> Payment Details ->
 * Review & Submit. There is no mobile OTP verification and no selfie/live-photo step —
 * both were removed to simplify onboarding; identity is verified by an admin reviewing the
 * uploaded document images instead.
 */
@Service
@RequiredArgsConstructor
public class KycService {

    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final WorkerSkillCertificateRepository certificateRepository;
    private final KycAuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;
    private final FileStorageService fileStorageService;

    // ───────────────── SUBMIT / RESUBMIT KYC ─────────────────
    @Transactional
    public KycSubmitResponseDto submitKyc(KycSubmitRequestDto request) {
        User user = currentUser();

        KycDocument existing = kycRepository.findTopByUser_UserIdOrderByKycIdDesc(user.getUserId()).orElse(null);

        if (existing != null && (existing.getStatus() == KycStatus.PENDING || existing.getStatus() == KycStatus.UNDER_REVIEW)) {
            throw new ApiException("Your KYC is already submitted and awaiting review.");
        }
        if (existing != null && existing.getStatus() == KycStatus.APPROVED) {
            throw new ApiException("Your KYC has already been verified.");
        }

        validate(request);

       // try {
            KycDocument kyc = existing != null ? existing : KycDocument.builder().user(user).build();

            kyc.setFullName(request.getFullName().trim());
            kyc.setDateOfBirth(parseDob(request.getDateOfBirth()));
            kyc.setGender(request.getGender().trim().toUpperCase());
            kyc.setMobileNumber(request.getMobileNumber().trim());
            kyc.setEmail(request.getEmail().trim());
            kyc.setAddressLine(request.getAddressLine().trim());
            kyc.setCity(request.getCity().trim());
            kyc.setState(request.getState().trim());
            kyc.setPincode(request.getPincode().trim());

            kyc.setDocumentType(request.getDocumentType().trim().toUpperCase());
            kyc.setDocumentNumber(request.getDocumentNumber().trim().toUpperCase());

//            if (request.getProfilePhoto() != null && !request.getProfilePhoto().isEmpty()) {
//                kyc.setProfilePhotoUrl(fileStorageService.saveFile(request.getProfilePhoto(), user.getUserId(), "kyc/profile"));
//            }
//            if (request.getDocumentFront() != null && !request.getDocumentFront().isEmpty()) {
//                kyc.setDocumentFrontUrl(fileStorageService.saveFile(request.getDocumentFront(), user.getUserId(), "kyc/documents"));
//            }
//            if (request.getDocumentBack() != null && !request.getDocumentBack().isEmpty()) {
//                kyc.setDocumentBackUrl(fileStorageService.saveFile(request.getDocumentBack(), user.getUserId(), "kyc/documents"));
//            }
//
//            if (kyc.getProfilePhotoUrl() == null) throw new ApiException("Profile photo is required");
//            if (kyc.getDocumentFrontUrl() == null) throw new ApiException("Identity document (front) image is required");

            PayoutMethod payoutMethod = PayoutMethod.valueOf(request.getPayoutMethod().trim().toUpperCase());
            kyc.setPayoutMethod(payoutMethod);
            if (payoutMethod == PayoutMethod.UPI) {
                kyc.setUpiId(request.getUpiId().trim());
                kyc.setBankAccountHolderName(null);
                kyc.setBankName(null);
                kyc.setBankAccountNumber(null);
                kyc.setIfscCode(null);
            } else {
                kyc.setBankAccountHolderName(request.getBankAccountHolderName().trim());
                kyc.setBankName(request.getBankName().trim());
                kyc.setBankAccountNumber(request.getBankAccountNumber().trim());
                kyc.setIfscCode(request.getIfscCode().trim().toUpperCase());
                kyc.setUpiId(null);
            }

            kyc.setStatus(KycStatus.PENDING);
            kyc.setRejectionReason(null);
            kyc.setSubmittedAt(LocalDateTime.now());

            KycDocument saved = kycRepository.save(kyc);

            user.setKycStatus(KycStatus.PENDING);
            userRepository.save(user);

            auditLogRepository.save(KycAuditLog.builder()
                    .kyc(saved)
                    .performedBy(null)
                    .action("SUBMITTED")
                    .remarks("Worker submitted KYC for review")
                    .build());

            notify(user, "Your KYC has been submitted and is now pending review.");

            return KycSubmitResponseDto.builder()
                    .kycId(saved.getKycId())
                    .status(saved.getStatus().name())
                    .completionPercent(saved.getCompletionPercent())
                    .message("KYC submitted successfully! It's now pending review.")
                    .build();

//        } catch (IOException e) {
//            throw new ApiException("File upload failed: " + e.getMessage());
//        }
    }

    private void validate(KycSubmitRequestDto r) {
        if (isBlank(r.getFullName())) throw new ApiException("Full name is required");
        if (isBlank(r.getDateOfBirth())) throw new ApiException("Date of birth is required");
        if (isBlank(r.getGender())) throw new ApiException("Gender is required");
        if (isBlank(r.getEmail())) throw new ApiException("Email is required");
        if (isBlank(r.getAddressLine()) || isBlank(r.getCity()) || isBlank(r.getState()))
            throw new ApiException("Complete address (line, city, state) is required");
        if (!DocumentValidator.isValidPincode(r.getPincode())) throw new ApiException("Enter a valid 6-digit PIN code");
        if (!DocumentValidator.isValidMobile(r.getMobileNumber())) throw new ApiException("Enter a valid mobile number");

        String docType = r.getDocumentType() == null ? null : r.getDocumentType().trim().toUpperCase();
        if (!DocumentValidator.SUPPORTED_TYPES.contains(docType))
            throw new ApiException("Document type must be one of: " + DocumentValidator.SUPPORTED_TYPES);
        if (!DocumentValidator.isValidDocumentNumber(docType, r.getDocumentNumber()))
            throw new ApiException("Invalid document number for " + docType);
//        if (DocumentValidator.REQUIRES_BACK_IMAGE.contains(docType)
//                && (r.getDocumentBack() == null || r.getDocumentBack().isEmpty())) {
//            throw new ApiException(docType + " requires both front and back images");
//        }

        if (isBlank(r.getPayoutMethod())) throw new ApiException("Select a payout method (UPI or Bank Account)");
        PayoutMethod method;
        try {
            method = PayoutMethod.valueOf(r.getPayoutMethod().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Payout method must be UPI or BANK_ACCOUNT");
        }
        if (method == PayoutMethod.UPI) {
            if (!DocumentValidator.isValidUpi(r.getUpiId())) throw new ApiException("Enter a valid UPI ID (e.g. name@bank)");
        } else {
            if (isBlank(r.getBankAccountHolderName()) || isBlank(r.getBankName()) || isBlank(r.getBankAccountNumber()))
                throw new ApiException("Account holder name, bank name, and account number are required");
            if (!DocumentValidator.isValidIfsc(r.getIfscCode())) throw new ApiException("Enter a valid IFSC code");
        }
    }

    private LocalDate parseDob(String dob) {
        try {
            LocalDate parsed = LocalDate.parse(dob);
            if (parsed.isAfter(LocalDate.now().minusYears(18))) {
                throw new ApiException("Worker must be at least 18 years old");
            }
            return parsed;
        } catch (DateTimeParseException e) {
            throw new ApiException("Date of birth must be in yyyy-MM-dd format");
        }
    }

    // ───────────────── MY STATUS ─────────────────
    public KycMyStatusResponseDto getMyStatus() {
        User user = currentUser();
        Optional<KycDocument> latest = kycRepository.findTopByUser_UserIdOrderByKycIdDesc(user.getUserId());

        KycMyStatusResponseDto.KycMyStatusResponseDtoBuilder builder = KycMyStatusResponseDto.builder()
                .overallStatus(user.getKycStatus() != null ? user.getKycStatus().name() : "NOT_SUBMITTED")
                .completionPercent(0)
                .certificates(getMyCertificates());

        latest.ifPresent(doc -> builder
                .kycId(doc.getKycId())
                .completionPercent(doc.getCompletionPercent())
                .fullName(doc.getFullName())
                .dateOfBirth(doc.getDateOfBirth() != null ? doc.getDateOfBirth().toString() : null)
                .gender(doc.getGender())
                .mobileNumber(doc.getMobileNumber())
                .email(doc.getEmail())
               // .profilePhotoUrl(doc.getProfilePhotoUrl())
                .addressLine(doc.getAddressLine())
                .city(doc.getCity())
                .state(doc.getState())
                .pincode(doc.getPincode())
                .documentType(doc.getDocumentType())
                .documentNumber(doc.getDocumentNumber())
                // .documentFrontUrl(doc.getDocumentFrontUrl())
              //  .documentBackUrl(doc.getDocumentBackUrl())
                .payoutMethod(doc.getPayoutMethod() != null ? doc.getPayoutMethod().name() : null)
                .upiId(doc.getUpiId())
                .bankAccountHolderName(doc.getBankAccountHolderName())
                .bankName(doc.getBankName())
                .bankAccountNumberMasked(mask(doc.getBankAccountNumber()))
                .ifscCode(doc.getIfscCode())
                .rejectionReason(doc.getRejectionReason())
                .remarks(doc.getRemarks())
                .submittedAt(doc.getSubmittedAt())
                .verifiedAt(doc.getVerifiedAt())
        );

        return builder.build();
    }

    private String mask(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return accountNumber;
        return "•".repeat(accountNumber.length() - 4) + accountNumber.substring(accountNumber.length() - 4);
    }

    // ───────────────── SKILL CERTIFICATES (optional) ─────────────────
    @Transactional
    public KycMyStatusResponseDto.CertificateDto uploadCertificate(String certificateName, org.springframework.web.multipart.MultipartFile file) {
        User user = currentUser();
        if (file == null || file.isEmpty()) throw new ApiException("Please choose a file to upload");
        if (isBlank(certificateName)) throw new ApiException("Certificate name is required");

        try {
            String url = fileStorageService.saveFile(file, user.getUserId(), "kyc/certificates");
            WorkerSkillCertificate cert = certificateRepository.save(WorkerSkillCertificate.builder()
                    .user(user)
                    .certificateName(certificateName.trim())
                    .fileUrl(url)
                    .build());

            return KycMyStatusResponseDto.CertificateDto.builder()
                    .certificateId(cert.getCertificateId())
                    .certificateName(cert.getCertificateName())
                    .fileUrl(cert.getFileUrl())
                    .uploadedAt(cert.getUploadedAt())
                    .build();
        } catch (IOException e) {
            throw new ApiException("File upload failed: " + e.getMessage());
        }
    }

    public List<KycMyStatusResponseDto.CertificateDto> getMyCertificates() {
        User user = currentUser();
        return certificateRepository.findByUser_UserId(user.getUserId()).stream()
                .map(c -> KycMyStatusResponseDto.CertificateDto.builder()
                        .certificateId(c.getCertificateId())
                        .certificateName(c.getCertificateName())
                        .fileUrl(c.getFileUrl())
                        .uploadedAt(c.getUploadedAt())
                        .build())
                .toList();
    }

    // ───────────────── HELPERS ─────────────────
    private User currentUser() {
        String email = JwtUtils.getCurrentUsername();
        return userRepository.findByEmail(email).orElseThrow(() -> new ApiException("User not found"));
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    void notify(User user, String message) {
        notificationRepository.save(Notification.builder()
                .userId(user.getUserId().longValue())
                .message(message)
                .unread(true)
                .build());
    }
}
