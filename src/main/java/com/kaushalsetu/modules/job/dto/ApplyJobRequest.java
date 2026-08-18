package com.kaushalsetu.modules.job.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Optional request body for POST /api/applications/apply/{jobId}.
 * Organization-flow applicants can omit this entirely. CLIENT household jobs require
 * estimatedBudget + coverMessage — enforced in JobApplicationService.
 */
@Getter
@Setter
public class ApplyJobRequest {
    private Double estimatedBudget;
    private String coverMessage;
    private String expectedStartTime;      // optional, free text e.g. "Tomorrow 10 AM"
    private String expectedCompletionTime; // optional, free text e.g. "Same day, 2 PM"
}
