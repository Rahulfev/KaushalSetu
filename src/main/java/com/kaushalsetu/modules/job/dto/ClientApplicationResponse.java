package com.kaushalsetu.modules.job.dto;

import java.time.LocalDateTime;

import com.kaushalsetu.common.enums.ApplicationStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClientApplicationResponse {

    private Integer applicationId;
    private Integer jobId;
    private Integer workerId;

    private String jobTitle;
    private String workerName;
    private String workerProfilePhotoUrl;
    private Integer workerExperienceYears;
    private Double workerRating;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    // What the client actually compares candidates on:
    private Double estimatedBudget;
    private String coverMessage;
    private String expectedStartTime;
    private String expectedCompletionTime;

    private LocalDateTime assignedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime paidAt;
    private LocalDateTime closedAt;
}
