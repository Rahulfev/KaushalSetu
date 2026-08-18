package com.kaushalsetu.modules.job.dto;

import com.kaushalsetu.common.enums.JobStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobResponse {

    private Integer jobId;
    private String title;
    private String category;
    private String description;
    private Double budget;
    private String location;
    private String district;
    private JobStatus status;

    // Client household-service fields
    private String serviceAddress;
    private String city;
    private String state;
    private String pincode;
    private String landmark;
    private LocalDate preferredDate;
    private String preferredTime;
    private String additionalNotes;
    private String contactPreference;

    private Integer postedByUserId;
    private LocalDateTime createdAt;
}
