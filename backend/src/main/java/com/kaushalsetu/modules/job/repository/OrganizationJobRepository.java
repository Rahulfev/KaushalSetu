package com.kaushalsetu.modules.job.repository;

import com.kaushalsetu.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrganizationJobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByPostedByUserId(Integer postedByUserId);
}