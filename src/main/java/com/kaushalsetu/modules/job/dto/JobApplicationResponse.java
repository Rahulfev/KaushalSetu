package com.kaushalsetu.modules.job.dto;

import com.kaushalsetu.common.enums.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {

    private Integer applicationId;
    private Integer jobId;
    private String jobTitle;
    private Integer applicantUserId;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    // Client household-hiring flow
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
