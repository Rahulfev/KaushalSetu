package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/** Immutable audit trail of every KYC lifecycle action, for compliance/accountability. */
@Entity
@Table(name = "kyc_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KycAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "kyc_id", nullable = false)
    private KycDocument kyc;

    @ManyToOne
    @JoinColumn(name = "performed_by_user_id")
    private User performedBy; // null if the worker themself performed the action (e.g. submission)

    /** SUBMITTED / MOVED_TO_UNDER_REVIEW / APPROVED / REJECTED / REUPLOAD_REQUESTED */
    private String action;

    private String remarks;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
