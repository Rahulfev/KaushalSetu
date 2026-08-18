package com.kaushalsetu.modules.job.controller;

import com.kaushalsetu.modules.job.dto.CreateJobRequest;
import com.kaushalsetu.modules.job.dto.JobResponse;
import com.kaushalsetu.modules.job.service.ClientJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientJobController {

    private final ClientJobService clientJobService;

    @PostMapping("/create")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        JobResponse response = clientJobService.createJob(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/client")
    public ResponseEntity<List<JobResponse>> getClientJobs(Authentication authentication) {
        String username = authentication.getName();
        List<JobResponse> jobs = clientJobService.getJobsByClient(username);
        return ResponseEntity.ok(jobs);
    }

    @DeleteMapping("/delete/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Integer jobId,
            Authentication authentication) {
        String username = authentication.getName();
        clientJobService.deleteJob(jobId, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Integer jobId,
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        JobResponse response = clientJobService.updateJob(jobId, request, username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}/cancel")
    public ResponseEntity<Void> cancelJob(@PathVariable Integer jobId, Authentication authentication) {
        clientJobService.cancelJob(jobId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}