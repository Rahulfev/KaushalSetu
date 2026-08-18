package com.kaushalsetu.modules.job.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.Notification;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.entity.Worker;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.job.dto.ClientApplicationResponse;
import com.kaushalsetu.modules.job.repository.ClientApplicationRepository;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import com.kaushalsetu.modules.review.repository.WorkerRatingRepository;
import com.kaushalsetu.modules.user.repository.NotificationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientApplicationService {

    private final ClientApplicationRepository clientApplicationRepository;
    private final UserRepository userRepository;
    private final WorkerRatingRepository workerRatingRepository;
    private final KycRepository kycRepository;
    private final NotificationRepository notificationRepository;

    public List<ClientApplicationResponse> getClientApplications() {

        String email = JwtUtils.getCurrentUsername();

        User clientUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return clientApplicationRepository
                .findClientApplications(clientUser.getUserId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * CLIENT: assign this application — the selected worker is set ASSIGNED, every other
     * applicant on the same job is auto-REJECTED (a household job only has one worker).
     */
    @Transactional
    public void assign(Integer applicationId) {
        JobApplication app = ownedByClient(applicationId);

        if (app.getStatus() != ApplicationStatus.APPLIED) {
            throw new ApiException("Only a freshly applied candidate can be assigned");
        }

        app.setStatus(ApplicationStatus.ASSIGNED);
        app.setAssignedAt(LocalDateTime.now());
        clientApplicationRepository.save(app);
        notify(app.getWorker().getUserId(), "You've been assigned to \"" + app.getJob().getTitle() + "\"!");

        // Auto-reject every other applicant for this job.
        clientApplicationRepository.findClientApplications(app.getJob().getPostedByUserId()).stream()
                .filter(other -> other.getJob().getJobId().equals(app.getJob().getJobId()))
                .filter(other -> !other.getApplicationId().equals(app.getApplicationId()))
                .filter(other -> other.getStatus() == ApplicationStatus.APPLIED)
                .forEach(other -> {
                    other.setStatus(ApplicationStatus.REJECTED);
                    clientApplicationRepository.save(other);
                    notify(other.getWorker().getUserId(), "Your application for \"" + app.getJob().getTitle() + "\" wasn't selected this time.");
                });
    }

    /** CLIENT: reject a single application. */
    @Transactional
    public void reject(Integer applicationId) {
        JobApplication app = ownedByClient(applicationId);
        if (app.getStatus() != ApplicationStatus.APPLIED) {
            throw new ApiException("Only a pending application can be rejected");
        }
        app.setStatus(ApplicationStatus.REJECTED);
        clientApplicationRepository.save(app);
        notify(app.getWorker().getUserId(), "Your application for \"" + app.getJob().getTitle() + "\" wasn't selected this time.");
    }

    private JobApplication ownedByClient(Integer applicationId) {
        String email = JwtUtils.getCurrentUsername();
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobApplication app = clientApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getJob().getPostedByUserId().equals(client.getUserId())) {
            throw new AccessDeniedException("This isn't your job posting");
        }
        return app;
    }

    private void notify(Integer userId, String message) {
        notificationRepository.save(Notification.builder()
                .userId(userId.longValue())
                .message(message)
                .unread(true)
                .build());
    }

    private ClientApplicationResponse mapToResponse(JobApplication app) {
        ClientApplicationResponse.ClientApplicationResponseBuilder builder = ClientApplicationResponse.builder()
                .applicationId(app.getApplicationId())
                .jobId(app.getJob().getJobId())
                .workerId(app.getWorker().getUserId())
                .jobTitle(app.getJob().getTitle())
                .workerName(app.getWorker().getFullName())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .estimatedBudget(app.getEstimatedBudget())
                .coverMessage(app.getCoverMessage())
                .expectedStartTime(app.getExpectedStartTime())
                .expectedCompletionTime(app.getExpectedCompletionTime())
                .assignedAt(app.getAssignedAt())
                .startedAt(app.getStartedAt())
                .completedAt(app.getCompletedAt())
                .paidAt(app.getPaidAt())
                .closedAt(app.getClosedAt());

        workerRatingRepository.findByUser_UserId(app.getWorker().getUserId()).ifPresent((Worker w) -> {
            builder.workerExperienceYears(w.getExperienceYears());
            builder.workerRating(w.getRating());
        });
//        kycRepository.findTopByUser_UserIdOrderByKycIdDesc(app.getWorker().getUserId())
//                .ifPresent(kyc -> builder.workerProfilePhotoUrl(kyc.getProfilePhotoUrl()));

        return builder.build();
    }
}
