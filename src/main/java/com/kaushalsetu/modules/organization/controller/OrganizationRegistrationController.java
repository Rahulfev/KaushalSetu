package com.kaushalsetu.modules.organization.controller;

import com.kaushalsetu.entity.Organization;
import com.kaushalsetu.modules.organization.dto.OrganizationRegistrationDto;
import com.kaushalsetu.modules.organization.service.OrganizationRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organization")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class OrganizationRegistrationController {

    private final OrganizationRegistrationService organizationRegistrationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerOrganization(@RequestBody OrganizationRegistrationDto request) {
        try {
            Organization organization = organizationRegistrationService.registerOrganization(request);
            return ResponseEntity.ok(organization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Organization registration failed: " + e.getMessage());
        }
    }
}