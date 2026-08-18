package com.kaushalsetu.modules.job.service;

import com.kaushalsetu.entity.Job;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.contract.repository.ContractRepository;
import com.kaushalsetu.modules.job.repository.JobApplicationRepository;
import com.kaushalsetu.modules.job.repository.OrganizationJobRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationJobService {

    private final OrganizationJobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ContractRepository contractRepository;

    public Job postJob(Job job) {
        return jobRepository.save(job);
    }
    
    public List<Job> getJobsByUserId(Integer userId) {
        return jobRepository.findByPostedByUserId(userId);
    }
    
    /**
     * Only jobs with zero applications and no contract can be hard-deleted — once either
     * exists, deleting the job would violate a foreign key (job_application/contract both
     * reference it) and also destroy application/payment history. Callers should prevent this
     * in the UI (hide the Delete button once a job has applicants), but this check makes the
     * API itself safe and gives a clear reason instead of a raw DB error.
     */
    public void deleteJob(Integer jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ApiException("Job not found"));

        long applicationCount = jobApplicationRepository.countByJobJobId(jobId);
        if (applicationCount > 0) {
            throw new ApiException(
                    "This job already has " + applicationCount + " application(s) and can't be deleted. " +
                    "Once a job is applied to, contracted, or completed/archived, remove it from view instead " +
                    "(e.g. cancel it) rather than deleting it, to keep application and payment history intact.");
        }

        if (contractRepository.existsByJob_JobId(jobId)) {
            throw new ApiException(
                    "This job has an associated contract and can't be deleted, as it would break payment/wallet history.");
        }

        jobRepository.delete(job);
    }
    
    public Job updateJob(Integer jobId, Job jobData) {
        Job existingJob = jobRepository.findById(jobId)
            .orElseThrow(() -> new ApiException("Job not found"));
            
        existingJob.setTitle(jobData.getTitle());
        existingJob.setDescription(jobData.getDescription());
        existingJob.setCategory(jobData.getCategory());
        existingJob.setBudget(jobData.getBudget());
        existingJob.setLocation(jobData.getLocation());
        existingJob.setDistrict(jobData.getDistrict());
        
        return jobRepository.save(existingJob);
    }
}
