package com.kaushalsetu.modules.kyc.service;

import com.kaushalsetu.entity.KycDocument;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.kyc.dto.WorkerDocumentDto;
import com.kaushalsetu.modules.kyc.dto.WorkerVerificationProfileResponse;
import com.kaushalsetu.modules.kyc.repository.KycRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerVerificationService {

    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;

    /**
     * Returns a worker's profile + KYC documents so a client/organization can verify
     * who they hired (useful for accountability if a dispute or misconduct comes up).
     *
     * Access is restricted to clients/organizations who actually have (or had) a
     * contract with that worker, plus admins/supervisors — so this can't be used to
     * browse arbitrary people's personal documents.
     */
    public WorkerVerificationProfileResponse getWorkerVerificationProfile(Integer workerId) {

        String requesterEmail = JwtUtils.getCurrentUsername();

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ApiException("Worker not found"));

        String requesterRole = requester.getRole().getRoleName();
        boolean isPrivileged = "ADMIN".equalsIgnoreCase(requesterRole);

        if (!isPrivileged) {
            boolean hasRelationship = contractRepository
                    .existsByClient_UserIdAndWorker_UserId(requester.getUserId(), workerId);

            if (!hasRelationship) {
                throw new ApiException(
                        "You can only view documents for workers you have hired via a contract"
                );
            }
        }

        List<KycDocument> documents = kycRepository.findByUser_UserId(workerId);

        List<WorkerDocumentDto> documentDtos = documents.stream()
                .map(doc -> WorkerDocumentDto.builder()
                        .kycId(doc.getKycId())
                        .documentType(doc.getDocumentType())
                        .status(doc.getStatus() != null ? doc.getStatus().name() : "NOT_SUBMITTED")
                        .verifiedBy(doc.getVerifiedBy() != null ? doc.getVerifiedBy().getFullName() : null)
                        .verifiedAt(doc.getVerifiedAt())
                        .build())
                .toList();

        return WorkerVerificationProfileResponse.builder()
                .workerId(worker.getUserId())
                .fullName(worker.getFullName())
                .email(worker.getEmail())
                .countryCode(worker.getCountryCode())
                .phone(worker.getPhone())
                .overallKycStatus(worker.getKycStatus() != null ? worker.getKycStatus().name() : "NOT_SUBMITTED")
                .documents(documentDtos)
                .build();
    }
}
