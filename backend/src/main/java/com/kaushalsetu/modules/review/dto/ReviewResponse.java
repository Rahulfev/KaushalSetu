package com.kaushalsetu.modules.review.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
public class ReviewResponse {
    private Integer reviewId;
    private Integer contractId;
    private String reviewerName;
    private String revieweeName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
