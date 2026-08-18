package com.kaushalsetu.modules.worker.controller;

import com.kaushalsetu.modules.worker.dto.WorkerPublicProfileDto;
import com.kaushalsetu.modules.worker.service.WorkerPublicProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerPublicProfileController {

    private final WorkerPublicProfileService workerPublicProfileService;

    /**
     * Read-only, non-sensitive worker profile — used by the "View Worker Details" button on
     * application cards (Client) and the shortlist/Generate Contract screens (Organization).
     * Does NOT include Aadhaar/PAN numbers, document images, bank/UPI details, full address,
     * or admin remarks — only Admins see the full KYC record.
     */
    @GetMapping("/{workerId}/public-profile")
    @PreAuthorize("hasAnyRole('CLIENT','ORGANIZATION','ADMIN')")
    public WorkerPublicProfileDto getPublicProfile(@PathVariable Integer workerId) {
        return workerPublicProfileService.getPublicProfile(workerId);
    }
}
