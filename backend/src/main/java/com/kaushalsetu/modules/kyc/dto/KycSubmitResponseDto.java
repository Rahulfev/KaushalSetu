package com.kaushalsetu.modules.kyc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class KycSubmitResponseDto {
    private Integer kycId;
    private String status;
    private int completionPercent;
    private String message;
}
