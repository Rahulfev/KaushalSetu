package com.kaushalsetu.modules.kyc.controller;

import com.kaushalsetu.modules.kyc.dto.WorkerVerificationProfileResponse;
import com.kaushalsetu.modules.kyc.service.WorkerVerificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client/workers")
@RequiredArgsConstructor
public class WorkerVerificationController {

    private final WorkerVerificationService workerVerificationService;

    /**
     * Lets a client/organization view the verification documents (Aadhar, PAN, etc.)
     * of a worker they have hired — useful for accountability if the worker
     * misbehaves or a dispute needs to be raised.
     */
    @GetMapping("/{workerId}/documents")
    public ResponseEntity<WorkerVerificationProfileResponse> getWorkerDocuments(
            @PathVariable Integer workerId) {

        return ResponseEntity.ok(
                workerVerificationService.getWorkerVerificationProfile(workerId)
        );
    }
}
