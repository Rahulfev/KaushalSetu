package com.kaushalsetu.modules.job.controller;

import com.kaushalsetu.modules.job.dto.OrganizationJobApplicationResponse;
import com.kaushalsetu.modules.job.service.OrganizationJobApplicationService;
import com.kaushalsetu.common.enums.ApplicationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizationJobApplicationController {

    private final OrganizationJobApplicationService organizationJobApplicationService;

    @GetMapping
    public ResponseEntity<List<OrganizationJobApplicationResponse>> getOrganizationApplications(
            Authentication authentication) {

        String username = authentication.getName();
   
        return ResponseEntity.ok(
                organizationJobApplicationService.getApplicationsForOrganization(username)
        );
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        String username = authentication.getName();
        organizationJobApplicationService.updateApplicationStatus(
                applicationId, status, username
        );
        return ResponseEntity.ok().build();
    }
}


 
