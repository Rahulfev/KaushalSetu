package com.kaushalsetu.modules.organization.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationRegistrationDto {
    private Integer userId;
    private String orgName;
    private String gstNumber;
    private String address;
    private String district;
}