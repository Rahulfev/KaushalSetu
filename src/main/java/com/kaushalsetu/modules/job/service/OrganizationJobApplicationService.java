package com.kaushalsetu.modules.job.service;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.job.dto.OrganizationJobApplicationResponse;
import com.kaushalsetu.modules.job.repository.ClientJobRepository;
import com.kaushalsetu.modules.job.repository.OrganizationJobApplicationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationJobApplicationService {

    private final OrganizationJobApplicationRepository organizationJobApplicationRepository;
    private final ClientJobRepository clientJobRepository;
    private final UserRepository userRepository;

    public List<OrganizationJobApplicationResponse> getApplicationsForOrganization(String username) {

        User organization = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        List<Job> jobs =
                clientJobRepository.findByPostedByUserId(organization.getUserId());

        List<JobApplication> applications =
                organizationJobApplicationRepository.findByJobIn(jobs);

        return applications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void updateApplicationStatus(
            Integer applicationId,
            ApplicationStatus status,
            String username) {

        User organization = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        JobApplication application =
                organizationJobApplicationRepository.findById(applicationId)
                        .orElseThrow(() -> new RuntimeException("Application not found"));

        Job job = application.getJob();

        if (!job.getPostedByUserId().equals(organization.getUserId())) {
            throw new RuntimeException("Unauthorized access");
        }

        application.setStatus(status);
        organizationJobApplicationRepository.save(application);
    }

    private OrganizationJobApplicationResponse mapToResponse(JobApplication application) {

        Job job = application.getJob();
        User worker = application.getWorker();

        OrganizationJobApplicationResponse response =
                new OrganizationJobApplicationResponse();

        response.setApplicationId(application.getApplicationId());

        // Job info
        response.setJobId(job.getJobId());
        response.setJobTitle(job.getTitle());

        // Worker info
        response.setWorkerId(worker.getUserId());
        response.setWorkerName(worker.getFullName());
        response.setWorkerEmail(worker.getEmail());

        // Application info
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        return response;
    }
}
