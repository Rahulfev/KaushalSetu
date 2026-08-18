package com.kaushalsetu.modules.organization.service;

import com.kaushalsetu.entity.Organization;
import com.kaushalsetu.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrganizationProfileService {

    private final OrganizationRepository organizationRepository;

    public Organization saveProfile(Organization organization) {

        return organizationRepository
                .findByUserId(organization.getUserId())
                .map(existing -> {
                    // Update existing profile
                    existing.setOrgName(organization.getOrgName());
                    existing.setAddress(organization.getAddress());
                    existing.setDistrict(organization.getDistrict());
                    existing.setGstNumber(organization.getGstNumber());
                    return organizationRepository.save(existing);
                })
                .orElseGet(() -> {
                    // Create new profile
                    return organizationRepository.save(organization);
                });
    }

    public Organization getProfileByUserId(Integer userId) {

        return organizationRepository
                .findByUserId(userId)
                .orElse(null); // or throw if you prefer
    }
}
