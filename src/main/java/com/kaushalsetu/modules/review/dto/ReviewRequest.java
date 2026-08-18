package com.kaushalsetu.modules.review.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReviewRequest {
    // Exactly one of these two should be set, depending on which flow the engagement came from.
    private Integer contractId;   // Organization contract flow
    private Integer applicationId; // Client household-hiring flow

    private Integer rating; // 1-5
    private String comment;
}
