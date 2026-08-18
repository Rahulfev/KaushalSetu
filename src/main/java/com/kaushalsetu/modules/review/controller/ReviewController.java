package com.kaushalsetu.modules.review.controller;

import com.kaushalsetu.modules.review.dto.ReviewRequest;
import com.kaushalsetu.modules.review.dto.ReviewResponse;
import com.kaushalsetu.modules.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZATION','CLIENT','WORKER')")
    public ReviewResponse submitReview(@RequestBody ReviewRequest request, Authentication authentication) {
        return reviewService.submitReview(request, authentication.getName());
    }

    /** Public-ish: reviews received by a given user (worker, org, or client). */
    @GetMapping("/user/{userId}")
    public List<ReviewResponse> getReviewsForUser(@PathVariable Integer userId) {
        return reviewService.getReviewsForUser(userId);
    }
}
