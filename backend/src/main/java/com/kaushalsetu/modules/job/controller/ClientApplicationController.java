package com.kaushalsetu.modules.job.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.kaushalsetu.modules.job.dto.ClientApplicationResponse;
import com.kaushalsetu.modules.job.service.ClientApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/client/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENT')")
public class ClientApplicationController {

    private final ClientApplicationService clientApplicationService;

    @GetMapping
    public List<ClientApplicationResponse> getClientApplications() {
        return clientApplicationService.getClientApplications();
    }

    /** Assign this worker — every other applicant on the same job is auto-rejected. */
    @PutMapping("/{applicationId}/assign")
    public ResponseEntity<Map<String, String>> assign(@PathVariable Integer applicationId) {
        clientApplicationService.assign(applicationId);
        return ResponseEntity.ok(Map.of("message", "Worker assigned"));
    }

    @PutMapping("/{applicationId}/reject")
    public ResponseEntity<Map<String, String>> reject(@PathVariable Integer applicationId) {
        clientApplicationService.reject(applicationId);
        return ResponseEntity.ok(Map.of("message", "Application rejected"));
    }
}
