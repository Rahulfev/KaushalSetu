package com.kaushalsetu.modules.worker.service;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.common.enums.ContractStatus;
import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.entity.KycDocument;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.entity.Worker;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import com.kaushalsetu.modules.kyc.repository.WorkerSkillCertificateRepository;
import com.kaushalsetu.modules.review.repository.ReviewRepository;
import com.kaushalsetu.modules.review.repository.WorkerRatingRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.worker.dto.WorkerPublicProfileDto;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerPublicProfileService {

    private final UserRepository userRepository;
    private final WorkerRatingRepository workerRepository;
    private final KycRepository kycRepository;
    private final WorkerSkillCertificateRepository certificateRepository;
    private final ContractRepository contractRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ReviewRepository reviewRepository;

    public WorkerPublicProfileDto getPublicProfile(Integer workerUserId) {
        User user = userRepository.findById(workerUserId)
                .orElseThrow(() -> new ApiException("Worker not found"));

        if (user.getRole() == null || !"WORKER".equals(user.getRole().getRoleName())) {
            throw new ApiException("This user is not a worker");
        }

        Worker worker = workerRepository.findByUser_UserId(workerUserId).orElse(null);

        // Only the profile photo is pulled from the KYC record — nothing else from it is exposed here.
//        String profilePhotoUrl = kycRepository.findTopByUser_UserIdOrderByKycIdDesc(workerUserId)
//                .map(KycDocument::getProfilePhotoUrl)
//                .orElse(null);

        List<WorkerPublicProfileDto.CertificateDto> certificates =
                certificateRepository.findByUser_UserId(workerUserId).stream()
                        .map(c -> WorkerPublicProfileDto.CertificateDto.builder()
                                .certificateName(c.getCertificateName())
                                .fileUrl(c.getFileUrl())
                                .build())
                        .toList();

        long completedContracts = contractRepository.countByWorker_UserIdAndStatus(workerUserId, ContractStatus.COMPLETED);
        long completedHouseholdJobs = jobApplicationRepository.countByWorker_UserIdAndStatusIn(
                workerUserId, List.of(ApplicationStatus.PAID, ApplicationStatus.CLOSED));

        int totalReviews = reviewRepository.findByReviewee_UserId(workerUserId).size();

        KycStatus kycStatus = user.getKycStatus() != null ? user.getKycStatus() : KycStatus.NOT_SUBMITTED;

        return WorkerPublicProfileDto.builder()
                .workerId(user.getUserId())
              //  .profilePhotoUrl(profilePhotoUrl)
                .fullName(user.getFullName())
                .verified(kycStatus == KycStatus.APPROVED)
                .kycStatus(kycStatus.name())
                .skills(worker != null ? worker.getSkillSet() : null)
                .experienceYears(worker != null ? worker.getExperienceYears() : null)
                .languagesKnown(worker != null ? worker.getLanguagesKnown() : null)
                .serviceAreas(worker != null ? worker.getServiceAreas() : null)
                .profileDescription(worker != null ? worker.getProfileDescription() : null)
                .completedJobs((int) (completedContracts + completedHouseholdJobs))
                .averageRating(worker != null ? worker.getRating() : null)
                .totalReviews(totalReviews)
                .certificates(certificates)
                .build();
    }
}
