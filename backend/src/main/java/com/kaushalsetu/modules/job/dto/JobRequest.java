package com.kaushalsetu.modules.job.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {
    private String title;
    private String description;
    private String category;
    private Double budget;
    private String location;
    private String district;
}