package com.kaushalsetu.modules.review.repository;

import com.kaushalsetu.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/** Narrow repository just for updating a worker's aggregate rating after a review. */
@Repository
public interface WorkerRatingRepository extends JpaRepository<Worker, Integer> {
    Optional<Worker> findByUser_UserId(Integer userId);
}
