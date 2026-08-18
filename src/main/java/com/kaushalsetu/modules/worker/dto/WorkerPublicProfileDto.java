package com.kaushalsetu.modules.worker.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Public/verified worker profile shown to clients & organizations when reviewing a
 * candidate. Deliberately excludes anything from the KYC record that isn't meant to be
 * shared: no Aadhaar/PAN numbers, no document images, no bank account/UPI details, no full
 * residential address, and no admin remarks. Only Admins see the full KYC record.
 */
@Getter @Setter @Builder
public class WorkerPublicProfileDto {
    private Integer workerId; // this is the user id, used everywhere else as the worker's identifier
    private String profilePhotoUrl;
    private String fullName;
    private boolean verified;
    private String kycStatus; // NOT_SUBMITTED / PENDING / UNDER_REVIEW / APPROVED / REJECTED

    private String skills;
    private Integer experienceYears;
    private String languagesKnown;
    private String serviceAreas;
    private String profileDescription;

    private Integer completedJobs;
    private Double averageRating;
    private Integer totalReviews;

    private List<CertificateDto> certificates;

    @Getter @Setter @Builder
    public static class CertificateDto {
        private String certificateName;
        private String fileUrl;
    }
}
