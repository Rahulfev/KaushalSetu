package com.kaushalsetu.modules.review.repository;

import com.kaushalsetu.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByReviewee_UserId(Integer revieweeUserId);
    Optional<Review> findByContract_ContractIdAndReviewer_UserId(Integer contractId, Integer reviewerUserId);
    Optional<Review> findByApplication_ApplicationIdAndReviewer_UserId(Integer applicationId, Integer reviewerUserId);
    long countByApplication_ApplicationId(Integer applicationId);
}
