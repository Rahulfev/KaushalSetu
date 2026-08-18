package com.kaushalsetu.modules.job.controller;

import com.kaushalsetu.entity.Job;
import com.kaushalsetu.modules.job.service.OrganizationJobService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organization/jobs")
@RequiredArgsConstructor
public class OrganizationJobController {

    private final OrganizationJobService jobService;

    @PostMapping
    public ResponseEntity<?> postJob(@RequestBody Job job) {
        try {
            System.out.println("Posting job: " + job.getTitle());
            Job savedJob = jobService.postJob(job);
            System.out.println("Job posted successfully with ID: " + savedJob.getJobId());
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            System.out.println("Failed to post job: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to post job: " + e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getJobsByUser(@PathVariable Integer userId) {
        try {
            System.out.println("Getting jobs for user ID: " + userId);
            List<Job> jobs = jobService.getJobsByUserId(userId);
            System.out.println("Found " + jobs.size() + " jobs");
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            System.out.println("Error getting jobs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to get jobs: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Integer jobId) {
        try {
            jobService.deleteJob(jobId);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Job deleted successfully"));
        } catch (com.kaushalsetu.exception.ApiException e) {
            return ResponseEntity.status(409).body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Failed to delete job: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Integer jobId, @RequestBody Job job) {
        try {
            Job updatedJob = jobService.updateJob(jobId, job);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update job: " + e.getMessage());
        }
    }
}