package com.kaushalsetu.modules.kyc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerVerificationProfileResponse {

    private Integer workerId;
    private String fullName;
    private String email;
    private String countryCode;
    private String phone;
    private String overallKycStatus;

    private List<WorkerDocumentDto> documents;
}
