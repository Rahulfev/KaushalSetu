package com.kaushalsetu.modules.job.dto;

import com.kaushalsetu.common.enums.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrganizationJobApplicationResponse {

    private Integer applicationId;

    // JOB
    private Integer jobId;
    private String jobTitle;

    // WORKER
    private Integer workerId;
    private String workerName;
    private String workerEmail;

    // APPLICATION
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
