package com.kaushalsetu.modules.kyc.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class KycDecisionRequestDto {
    private String decision; // UNDER_REVIEW / APPROVED / REJECTED / REUPLOAD_REQUESTED
    private String remarks;  // rejection reason OR general remarks/instructions
}
