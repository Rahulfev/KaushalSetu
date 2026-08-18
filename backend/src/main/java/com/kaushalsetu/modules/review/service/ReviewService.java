package com.kaushalsetu.modules.review.service;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.common.enums.ContractStatus;
import com.kaushalsetu.entity.Contract;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.Review;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.review.dto.ReviewRequest;
import com.kaushalsetu.modules.review.dto.ReviewResponse;
import com.kaushalsetu.modules.review.repository.ReviewRepository;
import com.kaushalsetu.modules.review.repository.WorkerRatingRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ContractRepository contractRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final WorkerRatingRepository workerRatingRepository;

    @Transactional
    public ReviewResponse submitReview(ReviewRequest request, String email) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getApplicationId() != null) {
            return submitForApplication(request, reviewer);
        }
        if (request.getContractId() != null) {
            return submitForContract(request, reviewer);
        }
        throw new ApiException("Either contractId or applicationId is required");
    }

    private ReviewResponse submitForContract(ReviewRequest request, User reviewer) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getStatus() != ContractStatus.COMPLETED) {
            throw new IllegalStateException("You can only review a completed contract");
        }
        if (!contract.isParticipant(reviewer)) {
            throw new AccessDeniedException("You are not part of this contract");
        }

        reviewRepository.findByContract_ContractIdAndReviewer_UserId(contract.getContractId(), reviewer.getUserId())
                .ifPresent(r -> { throw new IllegalStateException("You already reviewed this contract"); });

        boolean reviewerIsWorker = contract.getWorker().getUserId().equals(reviewer.getUserId());
        User reviewee = reviewerIsWorker ? contract.getClient() : contract.getWorker();

        Review review = reviewRepository.save(Review.builder()
                .contract(contract)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());

        if (!reviewerIsWorker) recalculateWorkerRating(reviewee.getUserId());
        return map(review);
    }

    private ReviewResponse submitForApplication(ReviewRequest request, User reviewer) {
        JobApplication application = jobApplicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Reviewable any time after payment — matches the "rate & review, job closes" step.
        if (application.getStatus() != ApplicationStatus.PAID && application.getStatus() != ApplicationStatus.CLOSED) {
            throw new IllegalStateException("You can only review after payment is complete");
        }
        if (!application.isParticipant(reviewer)) {
            throw new AccessDeniedException("You are not part of this engagement");
        }

        reviewRepository.findByApplication_ApplicationIdAndReviewer_UserId(application.getApplicationId(), reviewer.getUserId())
                .ifPresent(r -> { throw new IllegalStateException("You already reviewed this job"); });

        boolean reviewerIsWorker = application.getWorker().getUserId().equals(reviewer.getUserId());
        User reviewee = reviewerIsWorker
                ? userRepository.findById(application.getJob().getPostedByUserId())
                        .orElseThrow(() -> new RuntimeException("Client not found"))
                : application.getWorker();

        Review review = reviewRepository.save(Review.builder()
                .application(application)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());

        if (!reviewerIsWorker) recalculateWorkerRating(reviewee.getUserId());

        // Once both sides have reviewed (or at least one has, for a simple flow), close the job.
        if (application.getStatus() == ApplicationStatus.PAID) {
            application.setStatus(ApplicationStatus.CLOSED);
            application.setClosedAt(java.time.LocalDateTime.now());
            jobApplicationRepository.save(application);
        }

        return map(review);
    }

    public List<ReviewResponse> getReviewsForUser(Integer userId) {
        return reviewRepository.findByReviewee_UserId(userId).stream().map(this::map).toList();
    }

    private void recalculateWorkerRating(Integer workerUserId) {
        List<Review> reviews = reviewRepository.findByReviewee_UserId(workerUserId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        workerRatingRepository.findByUser_UserId(workerUserId).ifPresent(worker -> {
            worker.setRating(Math.round(avg * 10.0) / 10.0);
            workerRatingRepository.save(worker);
        });
    }

    private ReviewResponse map(Review r) {
        return ReviewResponse.builder()
                .reviewId(r.getReviewId())
                .contractId(r.getContract() != null ? r.getContract().getContractId() : null)
                .reviewerName(r.getReviewer().getFullName())
                .revieweeName(r.getReviewee().getFullName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
