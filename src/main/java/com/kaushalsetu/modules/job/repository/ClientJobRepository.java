package com.kaushalsetu.modules.job.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaushalsetu.common.enums.JobStatus;
import com.kaushalsetu.entity.Job;

@Repository
public interface ClientJobRepository extends JpaRepository<Job, Integer> {

    List<Job> findByPostedByUserId(Integer postedByUserId);

    List<Job> findByPostedByUserIdOrderByCreatedAtDesc(Integer postedByUserId);

    long countByPostedByUserIdAndStatus(Integer postedByUserId, JobStatus status);

    @Query("""
        SELECT COALESCE(SUM(j.budget), 0)
        FROM Job j
        WHERE j.postedByUserId = :userId
          AND j.status = :status
    """)
    Double sumBudgetByPostedByUserIdAndStatus(
            @Param("userId") Integer userId,
            @Param("status") JobStatus status
    );

    List<Job> findTop5ByPostedByUserIdOrderByCreatedAtDesc(Integer postedByUserId);

    List<Job> findByStatusAndCreatedAtBefore(JobStatus status, java.time.LocalDateTime cutoff);
}
