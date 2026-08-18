package com.kaushalsetu.entity;

import com.kaushalsetu.common.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jobId;

    private String title;
    private String description;
    private String category;

    // Used by the ORGANIZATION contract flow only — CLIENT household jobs leave this null;
    // the price is set later by the worker's estimatedBudget on their application.
    private Double budget;

    private String location;
    private String district;

    // ───────────────── CLIENT household-service fields ─────────────────
    private String serviceAddress;
    private String city;
    private String state;
    private String pincode;
    private String landmark;
    private LocalDate preferredDate;
    private String preferredTime;
    private String additionalNotes;

    @Builder.Default
    private String contactPreference = "PHONE_CALL";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.OPEN;

    @Column(name = "posted_by_user_id")
    private Integer postedByUserId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
