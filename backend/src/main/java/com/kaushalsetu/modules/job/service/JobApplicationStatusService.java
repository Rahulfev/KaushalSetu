package com.kaushalsetu.modules.job.service;

import org.springframework.stereotype.Service;

import com.kaushalsetu.common.enums.ApplicationStatus;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.modules.job.repository.ClientApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobApplicationStatusService {

    private final ClientApplicationRepository repository;

    public void updateStatus(Integer applicationId, ApplicationStatus status) {

        JobApplication app = repository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);
        repository.save(app);
    }
}
