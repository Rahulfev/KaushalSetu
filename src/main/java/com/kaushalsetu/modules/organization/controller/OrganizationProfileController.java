package com.kaushalsetu.modules.organization.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.entity.Organization;
import com.kaushalsetu.entity.User;

import com.kaushalsetu.modules.organization.repository.OrganizationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/organization/profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class OrganizationProfileController {

    // ✅ UPDATED FIELD TYPE TO MATCH RENAMED REPOSITORY
    private final OrganizationRepository organizationRepository; 
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // ✅ CORRESPONDS TO THE RENAMED REPOSITORY INTERFACE
            Organization org = organizationRepository.findByUserId(user.getUserId())
                    .orElseGet(() -> {

                        Organization newOrg = Organization.builder()
                                .userId(user.getUserId())
                                .orgName("")
                                .gstNumber("")
                                .address("")
                                .district("")
                                .build();

                        return organizationRepository.save(newOrg);
                    });
            
            return ResponseEntity.ok(org);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get profile: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Organization orgData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization org = organizationRepository.findByUserId(user.getUserId())
                    .orElseGet(() -> {

                        Organization newOrg = Organization.builder()
                                .userId(user.getUserId())
                                .orgName("")
                                .gstNumber("")
                                .address("")
                                .district("")
                                .build();

                        return organizationRepository.save(newOrg);
                    });
            
            // ✅ UPDATING FIELDS IN THE ORGANIZATION TABLE
            org.setOrgName(orgData.getOrgName());
            org.setGstNumber(orgData.getGstNumber());
            org.setAddress(orgData.getAddress());
            org.setDistrict(orgData.getDistrict());
            
            organizationRepository.save(org);
            
            return ResponseEntity.ok(org);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }
}