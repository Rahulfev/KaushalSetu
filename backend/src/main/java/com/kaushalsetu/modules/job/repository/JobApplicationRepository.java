package com.kaushalsetu.modules.job.repository;

import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.JobApplication;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.common.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {

    // ✅ Organization → Applications for my jobs
    @Query("""
        SELECT ja
        FROM JobApplication ja
        WHERE ja.job.postedByUserId = :orgId
    """)
    List<JobApplication> findByOrganizationJobs(
            @Param("orgId") Integer orgId
    );

    // ✅ FIXED: eagerly fetch the linked Job so the controller can read
    // job title/location/budget without a LazyInitializationException
    // (the controller has no open Hibernate session by the time it maps the response).
    @Query("""
        SELECT ja
        FROM JobApplication ja
        JOIN FETCH ja.job
        WHERE ja.worker.userId = :userId
        ORDER BY ja.appliedAt DESC
    """)
    List<JobApplication> findByWorkerUserId(
            @Param("userId") Integer userId
    );
    
    @Query("""
    	    SELECT ja
    	    FROM JobApplication ja
    	    JOIN FETCH ja.job j
    	    WHERE j.postedByUserId = :clientId
    	""")
    	List<JobApplication> findClientApplicationsWithJob(
    	        @Param("clientId") Integer clientId
    	);


    long countByJobJobId(Integer jobId);

    // ✅ Count applications for jobs posted by a client
    @Query("""
        SELECT COUNT(ja)
        FROM JobApplication ja
        WHERE ja.job.postedByUserId = :userId
          AND ja.status = :status
    """)
    long countByClientAndStatus(
            @Param("userId") Integer userId,
            @Param("status") ApplicationStatus status
    );

    // ✅ Already correct
    List<JobApplication> findByWorker(User worker);

    List<JobApplication> findByJobIn(List<Job> jobs);

    List<JobApplication> findByJob_JobId(Integer jobId);

    long countByWorker_UserIdAndStatusIn(Integer workerUserId, List<com.kaushalsetu.common.enums.ApplicationStatus> statuses);
}
