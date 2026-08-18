package com.kaushalsetu.modules.job.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.Notification;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.job.dto.ApplyJobRequest;
import com.kaushalsetu.modules.job.dto.JobApplicationResponse;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.job.repository.JobRepository;
import com.kaushalsetu.modules.user.repository.NotificationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    // --- WORKER: APPLY FOR JOB ---
    // `request` is optional (null) for the Organization contract flow, which doesn't collect
    // these fields. For a CLIENT household job, estimatedBudget + coverMessage are mandatory.
    public void applyForJob(Integer jobId, ApplyJobRequest request, String userEmail) {

        User worker = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (worker.getKycStatus() != com.kaushalsetu.common.enums.KycStatus.APPROVED) {
            throw new ApiException(
                    "Complete your KYC verification before applying for jobs. " +
                    "Go to Identity Verification (KYC) in your dashboard to get started.");
        }

        Job job = jobRepository.findById(jobId.longValue())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        boolean isClientJob = isClientPosted(job);
        if (isClientJob) {
            if (request == null || request.getEstimatedBudget() == null) {
                throw new ApiException("An estimated budget is required to apply for this job");
            }
            if (request.getEstimatedBudget() <= 0) {
                throw new ApiException("Estimated budget must be greater than zero");
            }
            if (isBlank(request.getCoverMessage())) {
                throw new ApiException("A cover message is required to apply for this job");
            }
        }

        JobApplication.JobApplicationBuilder builder = JobApplication.builder()
                .job(job)
                .worker(worker)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now());

        if (request != null) {
            builder.estimatedBudget(request.getEstimatedBudget())
                    .coverMessage(request.getCoverMessage())
                    .expectedStartTime(request.getExpectedStartTime())
                    .expectedCompletionTime(request.getExpectedCompletionTime());
        }

        jobApplicationRepository.save(builder.build());

        if (job.getPostedByUserId() != null) {
            notify(job.getPostedByUserId(), worker.getFullName() + " applied for \"" + job.getTitle() + "\"");
        }
    }

    private boolean isClientPosted(Job job) {
        if (job.getPostedByUserId() == null) return false;
        return userRepository.findById(job.getPostedByUserId())
                .map(u -> u.getRole() != null && "CLIENT".equals(u.getRole().getRoleName()))
                .orElse(false);
    }

    // --- WORKER: MY APPLICATIONS ---
    public List<JobApplicationResponse> getApplicationsByWorker(String email) {

        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jobApplicationRepository.findByWorker(worker)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- CLIENT: APPLICATIONS FOR MY JOBS ---
    public List<JobApplicationResponse> getApplicationsByClient(String username) {

        User client = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Job> jobs = jobRepository.findByPostedByUserId(client.getUserId());

        return jobApplicationRepository.findByJobIn(jobs)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Legacy generic setter — kept for the Organization flow (SHORTLISTED / REJECTED only).
    public void updateApplicationStatus(Integer applicationId, ApplicationStatus status, String username) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        jobApplicationRepository.save(application);
    }

    // ───────────────── CLIENT HOUSEHOLD-HIRING ENGAGEMENT LIFECYCLE ─────────────────

    /** WORKER: start the job once assigned. Assigned -> Ongoing. */
    public JobApplicationResponse startService(Integer applicationId, String email) {
        JobApplication app = ownedByWorker(applicationId, email);
        requireStatus(app, ApplicationStatus.ASSIGNED);

        app.setStatus(ApplicationStatus.ONGOING);
        app.setStartedAt(LocalDateTime.now());
        jobApplicationRepository.save(app);

        notifyClient(app, "Work has started on \"" + app.getJob().getTitle() + "\"");
        return mapToResponse(app);
    }

    /** WORKER: mark the job done. Ongoing -> Completed (client then sees "Pay Now"). */
    public JobApplicationResponse completeService(Integer applicationId, String email) {
        JobApplication app = ownedByWorker(applicationId, email);
        requireStatus(app, ApplicationStatus.ONGOING);

        app.setStatus(ApplicationStatus.COMPLETED);
        app.setCompletedAt(LocalDateTime.now());
        jobApplicationRepository.save(app);

        app.getJob().setStatus(com.kaushalsetu.common.enums.JobStatus.COMPLETED);
        jobRepository.save(app.getJob());

        notifyClient(app, "Work is marked complete on \"" + app.getJob().getTitle() + "\" — you can now pay the worker.");
        return mapToResponse(app);
    }

    private JobApplication ownedByWorker(Integer applicationId, String email) {
        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobApplication app = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!app.getWorker().getUserId().equals(worker.getUserId())) {
            throw new AccessDeniedException("This isn't your job application");
        }
        return app;
    }

    private void requireStatus(JobApplication app, ApplicationStatus expected) {
        if (app.getStatus() != expected) {
            throw new ApiException("Invalid state: expected " + expected + " but was " + app.getStatus());
        }
    }

    private void notifyClient(JobApplication app, String message) {
        if (app.getJob().getPostedByUserId() != null) {
            notify(app.getJob().getPostedByUserId(), message);
        }
    }

    private void notify(Integer userId, String message) {
        notificationRepository.save(Notification.builder()
                .userId(userId.longValue())
                .message(message)
                .unread(true)
                .build());
    }

    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    private JobApplicationResponse mapToResponse(JobApplication application) {

        JobApplicationResponse response = new JobApplicationResponse();

        response.setApplicationId(application.getApplicationId());
        response.setJobId(application.getJob().getJobId());
        response.setJobTitle(application.getJob().getTitle());
        response.setApplicantUserId(application.getWorker().getUserId());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        response.setEstimatedBudget(application.getEstimatedBudget());
        response.setCoverMessage(application.getCoverMessage());
        response.setExpectedStartTime(application.getExpectedStartTime());
        response.setExpectedCompletionTime(application.getExpectedCompletionTime());
        response.setAssignedAt(application.getAssignedAt());
        response.setStartedAt(application.getStartedAt());
        response.setCompletedAt(application.getCompletedAt());
        response.setPaidAt(application.getPaidAt());
        response.setClosedAt(application.getClosedAt());

        return response;
    }
}
