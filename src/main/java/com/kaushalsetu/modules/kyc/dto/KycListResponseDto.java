package com.kaushalsetu.modules.kyc.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class KycListResponseDto {

    private Integer kycId;
    private Integer userId;
    private String userName;
    private String email;
   // private String profilePhotoUrl;
    private String documentType;
    private String documentNumber;
    private String status;
    private int completionPercent;
    private LocalDateTime submittedAt;
}
