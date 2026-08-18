package com.kaushalsetu.modules.job.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

/**
 * Used by BOTH the Organization job-post form (title/category/description/budget/location/
 * district) and the Client household-hiring form (everything else). The client intentionally
 * does NOT set a budget — that's supplied by workers as their estimatedBudget when applying.
 */
@Data
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    // Organization flow only — optional here, validated separately where required.
    private Double budget;
    private String location;
    private String district;

    // ───────────────── Client household-service fields ─────────────────
    private String serviceAddress;
    private String city;
    private String state;
    private String pincode;      // optional
    private String landmark;     // optional
    private LocalDate preferredDate;
    private String preferredTime;
    private String additionalNotes; // optional
    private String contactPreference; // defaults to PHONE_CALL if omitted
}
