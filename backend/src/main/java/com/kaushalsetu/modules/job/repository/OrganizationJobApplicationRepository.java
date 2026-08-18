package com.kaushalsetu.modules.job.repository;

import com.kaushalsetu.entity.Job;
import com.kaushalsetu.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationJobApplicationRepository
        extends JpaRepository<JobApplication, Integer> {

    List<JobApplication> findByJobIn(List<Job> jobs);
}
