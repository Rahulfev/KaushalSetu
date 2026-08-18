package com.kaushalsetu.modules.job.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.job.dto.ApplyJobRequest;
import com.kaushalsetu.modules.job.dto.JobApplicationResponse;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.job.service.JobApplicationService;
import com.kaushalsetu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-status")
    public ResponseEntity<?> getMyApplications(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body("Error: Unauthorized");
        }
        try {
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<JobApplication> applications = jobApplicationRepository.findByWorkerUserId(user.getUserId());

            // Match the original raw-SQL shape so the frontend, which reads snake_case keys,
            // keeps working unchanged.
            List<Map<String, Object>> apps = applications.stream().map(a -> {
                Map<String, Object> row = new java.util.LinkedHashMap<String, Object>();
                row.put("application_id", a.getApplicationId());
                row.put("title", a.getJob() != null ? a.getJob().getTitle() : null);
                row.put("location", a.getJob() != null ? a.getJob().getLocation() : null);
                row.put("budget", a.getJob() != null ? a.getJob().getBudget() : null);
                row.put("applied_at", a.getAppliedAt());
                row.put("status", a.getStatus());
                row.put("estimated_budget", a.getEstimatedBudget());
                row.put("cover_message", a.getCoverMessage());
                row.put("expected_start_time", a.getExpectedStartTime());
                row.put("expected_completion_time", a.getExpectedCompletionTime());
                row.put("assigned_at", a.getAssignedAt());
                row.put("started_at", a.getStartedAt());
                row.put("completed_at", a.getCompletedAt());
                row.put("paid_at", a.getPaidAt());
                row.put("closed_at", a.getClosedAt());
                return row;
            }).toList();

            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Backend Database Error: " + e.getMessage());
        }
    }

    /** Body is optional — Organization-flow applicants can send nothing. */
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(
            @PathVariable Integer jobId,
            @RequestBody(required = false) ApplyJobRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            jobApplicationService.applyForJob(jobId, request, userEmail);
            return ResponseEntity.ok(Map.of("message", "Application submitted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Application failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {
        try {
            if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
            String username = authentication.getName();
            jobApplicationService.updateApplicationStatus(applicationId, status, username);
            return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Update failed: " + e.getMessage()));
        }
    }

    // ───────────────── CLIENT HOUSEHOLD-HIRING ENGAGEMENT (WORKER SIDE) ─────────────────

    /** WORKER: Assigned -> Ongoing */
    @PutMapping("/{applicationId}/start-service")
    public ResponseEntity<JobApplicationResponse> startService(@PathVariable Integer applicationId, Authentication auth) {
        return ResponseEntity.ok(jobApplicationService.startService(applicationId, auth.getName()));
    }

    /** WORKER: Ongoing -> Completed (unlocks "Pay Now" for the client) */
    @PutMapping("/{applicationId}/complete-service")
    public ResponseEntity<JobApplicationResponse> completeService(@PathVariable Integer applicationId, Authentication auth) {
        return ResponseEntity.ok(jobApplicationService.completeService(applicationId, auth.getName()));
    }
}
