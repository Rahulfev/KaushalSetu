package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.common.enums.PayoutMethod;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A worker's full KYC submission — one row per worker (latest/only active record).
 * Holds personal details, identity document, selfie, payment payout details, and the
 * verification lifecycle (status, remarks, who verified it, when).
 */
@Entity
@Table(name = "kyc_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KycDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kycId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ───────────────── PERSONAL DETAILS ─────────────────
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender; // MALE / FEMALE / OTHER

    private String mobileNumber;

    private String email;
 //   private String profilePhotoUrl;

    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    // ───────────────── IDENTITY DOCUMENT ─────────────────
    private String documentType;      // AADHAAR / PAN / DRIVING_LICENSE / PASSPORT / VOTER_ID
    private String documentNumber;
//    private String documentFrontUrl;
//    private String documentBackUrl;   // null for single-page docs like PAN

    // ───────────────── PAYMENT / PAYOUT DETAILS ─────────────────
    @Enumerated(EnumType.STRING)
    private PayoutMethod payoutMethod; // UPI or BANK_ACCOUNT

    private String upiId;

    private String bankAccountHolderName;
    private String bankName;
    private String bankAccountNumber;
    private String ifscCode;

    // ───────────────── VERIFICATION LIFECYCLE ─────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus status;

    private String rejectionReason;
    private String remarks; // admin's internal notes, shown to worker too

    @ManyToOne
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedBy;

    private LocalDateTime verifiedAt;
    private LocalDateTime submittedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /** Rough completion percentage for the worker's KYC progress bar. */
    @Transient
    public int getCompletionPercent() {
        int total = 6;
        int done = 0;
        if (fullName != null && !fullName.isBlank()) done++;
        if (mobileNumber != null && !mobileNumber.isBlank()) done++;
       // if (profilePhotoUrl != null) done++;
        if (addressLine != null && city != null && state != null && pincode != null) done++;
       // if (documentType != null && documentNumber != null && documentFrontUrl != null) done++;
        if (payoutMethod != null) done++;
        return (int) Math.round((done / (double) total) * 100);
    }
}
