package com.kaushalsetu.modules.job.repository;


import com.kaushalsetu.entity.Job;
import com.kaushalsetu.common.enums.JobStatus; // ✅ Import the Enum

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // ✅ Change 'String' to 'JobStatus'
    long countByStatus(JobStatus status);
 // For Client Dashboard: Get jobs posted by a specific user
    List<Job> findByPostedByUserId(Integer userId);

    // For Worker Feed: Find nearby jobs by district and status
    List<Job> findByDistrictAndStatus(String district, JobStatus status);

    // For Filtered Feed: Find jobs by district and category
    List<Job> findByDistrictAndCategoryAndStatus(String district, String category, JobStatus status);
//	Optional<Job> findById(Integer jobId);

    // Open job feed, optionally filtered by district (matches district column or free-text city)
    @org.springframework.data.jpa.repository.Query(
        "SELECT j FROM Job j WHERE j.status = :status " +
        "AND (:district IS NULL " +
        "     OR j.district = :district " +
        "     OR LOWER(j.city) = LOWER(:humanizedDistrict) " +
        "     OR LOWER(j.city) LIKE LOWER(CONCAT('%', :humanizedDistrict, '%'))) " +
        "ORDER BY j.createdAt DESC"
    )
    List<Job> findJobFeed(
        @org.springframework.data.repository.query.Param("status") JobStatus status,
        @org.springframework.data.repository.query.Param("district") String district,
        @org.springframework.data.repository.query.Param("humanizedDistrict") String humanizedDistrict
    );

}