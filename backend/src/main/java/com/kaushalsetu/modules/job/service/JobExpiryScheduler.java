package com.kaushalsetu.modules.job.service;

import com.kaushalsetu.common.enums.JobStatus;
import com.kaushalsetu.entity.Job;
import com.kaushalsetu.modules.job.repository.ClientJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Auto-expires client household job postings that have sat OPEN (no worker assigned) for
 * too long, so stale requests don't linger forever in workers' job feeds.
 */
@Component
@RequiredArgsConstructor
public class JobExpiryScheduler {

    private static final int EXPIRY_DAYS = 30;

    private final ClientJobRepository clientJobRepository;

    /** Runs once a day at 3 AM server time. */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void expireStaleJobs() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(EXPIRY_DAYS);

        List<Job> staleJobs = clientJobRepository.findByStatusAndCreatedAtBefore(JobStatus.OPEN, cutoff);
        for (Job job : staleJobs) {
            job.setStatus(JobStatus.EXPIRED);
        }
        if (!staleJobs.isEmpty()) {
            clientJobRepository.saveAll(staleJobs);
            System.out.println("⏰ Auto-expired " + staleJobs.size() + " stale job posting(s)");
        }
    }
}
