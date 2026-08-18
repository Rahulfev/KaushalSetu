package com.kaushalsetu.modules.job.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.kaushalsetu.common.enums.JobStatus;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.job.dto.JobRequest;
import com.kaushalsetu.modules.job.repository.JobRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Job job = Job.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .category(request.getCategory())
                    .budget(request.getBudget())
                    .location(request.getLocation())
                    .district(request.getDistrict())
                    .postedByUserId(user.getUserId())
                    .status(JobStatus.OPEN)
                    .createdAt(LocalDateTime.now())
                    .build();

            jobRepository.save(job);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create job: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllJobs() {
        try {
            List<Job> jobs = jobRepository.findAll();
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get jobs: " + e.getMessage());
        }
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<?> getMyJobs() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Job> jobs = jobRepository.findByPostedByUserId(user.getUserId());
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get jobs: " + e.getMessage());
        }
    }

 

    @GetMapping("/feed")
    public ResponseEntity<?> getJobFeed(@RequestParam(required = false) String district) {
        try {
            String districtParam = (district != null && !district.isEmpty()) ? district : null;
            String humanizedDistrict = districtParam != null ? districtParam.replace('_', ' ') : null;

            List<Job> jobs = jobRepository.findJobFeed(JobStatus.OPEN, districtParam, humanizedDistrict);

            // Match the original raw-SQL shape (j.* plus client_name) so the frontend,
            // which reads snake_case keys, keeps working unchanged.
            List<Map<String, Object>> result = jobs.stream().map(j -> {
                Map<String, Object> row = new java.util.LinkedHashMap<String, Object>();
                row.put("job_id", j.getJobId());
                row.put("title", j.getTitle());
                row.put("description", j.getDescription());
                row.put("category", j.getCategory());
                row.put("budget", j.getBudget());
                row.put("location", j.getLocation());
                row.put("district", j.getDistrict());
                row.put("service_address", j.getServiceAddress());
                row.put("city", j.getCity());
                row.put("state", j.getState());
                row.put("pincode", j.getPincode());
                row.put("landmark", j.getLandmark());
                row.put("preferred_date", j.getPreferredDate());
                row.put("preferred_time", j.getPreferredTime());
                row.put("additional_notes", j.getAdditionalNotes());
                row.put("contact_preference", j.getContactPreference());
                row.put("status", j.getStatus());
                row.put("posted_by_user_id", j.getPostedByUserId());
                row.put("created_at", j.getCreatedAt());
                User client = j.getPostedByUserId() != null
                        ? userRepository.findById(j.getPostedByUserId()).orElse(null)
                        : null;
                row.put("client_name", client != null ? client.getFullName() : null);
                return row;
            }).toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to load job feed: " + e.getMessage());
        }
    }
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Integer jobId, @RequestBody JobRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Job job = jobRepository.findById(jobId.longValue())
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            if (!job.getPostedByUserId().equals(user.getUserId())) {
                return ResponseEntity.badRequest().body("Not authorized");
            }

            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setCategory(request.getCategory());
            job.setBudget(request.getBudget());
            job.setLocation(request.getLocation());
            job.setDistrict(request.getDistrict());

            jobRepository.save(job);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Integer jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Job job = jobRepository.findById(jobId.longValue())
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            if (!job.getPostedByUserId().equals(user.getUserId())) {
                return ResponseEntity.badRequest().body("Not authorized");
            }

            jobRepository.delete(job);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Delete failed: " + e.getMessage());
        }
    }
}