package com.kaushalsetu.modules.organization.service;

import com.kaushalsetu.entity.Organization;
import com.kaushalsetu.modules.organization.dto.OrganizationRegistrationDto;
import com.kaushalsetu.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationRegistrationService {

    private final OrganizationRepository organizationRepository;

    public Organization registerOrganization(OrganizationRegistrationDto dto) {
        Organization organization = Organization.builder()
                .userId(dto.getUserId())
                .orgName(dto.getOrgName())
                .gstNumber(dto.getGstNumber())
                .address(dto.getAddress())
                .district(dto.getDistrict())
                .build();

        return organizationRepository.save(organization);
    }
}