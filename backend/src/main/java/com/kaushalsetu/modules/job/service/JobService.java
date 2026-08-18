package com.kaushalsetu.modules.job.service; // ✅ Corrected Package

import com.kaushalsetu.common.enums.JobStatus;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.entity.Worker;
import com.kaushalsetu.modules.job.repository.JobRepository; // Using the renamed repo
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.modules.user.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    /**
     * WORKER FEATURE: Job Discovery Feed
     * Fetches OPEN jobs filtered by the worker's district.
     */
    public List<Job> getJobFeedForWorker(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        Worker worker = workerRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        return jobRepository.findByDistrictAndStatus(worker.getDistrict().name(), JobStatus.OPEN);
    }

    public List<Job> getJobsByClient(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jobRepository.findByPostedByUserId(user.getUserId());
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Integer jobId) {
        return jobRepository.findById(jobId.longValue())
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));
    }
}