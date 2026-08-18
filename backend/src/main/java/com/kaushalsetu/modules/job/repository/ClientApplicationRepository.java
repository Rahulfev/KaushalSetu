package com.kaushalsetu.modules.job.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaushalsetu.entity.JobApplication;

@Repository
public interface ClientApplicationRepository
        extends JpaRepository<JobApplication, Integer> {

    @Query("""
        SELECT ja
        FROM JobApplication ja
        JOIN FETCH ja.job j
        JOIN FETCH ja.worker w
        WHERE j.postedByUserId = :clientUserId
    """)
    List<JobApplication> findClientApplications(
            @Param("clientUserId") Integer clientUserId
    );
}
