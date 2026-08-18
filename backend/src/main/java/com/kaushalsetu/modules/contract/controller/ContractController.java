package com.kaushalsetu.modules.contract.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.kaushalsetu.modules.contract.dto.ContractResponse;
import com.kaushalsetu.modules.contract.dto.CreateContractRequest;
import com.kaushalsetu.modules.contract.service.ContractService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContractController {

    private final ContractService contractService;

    /** ORG/CLIENT: generate a contract for a shortlisted worker after negotiating terms. */
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZATION','CLIENT')")
    public ResponseEntity<ContractResponse> createContract(
            @RequestBody CreateContractRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(contractService.createContract(request, authentication.getName()));
    }

    @GetMapping("/{contractId}")
    @PreAuthorize("hasAnyRole('ORGANIZATION','CLIENT','WORKER')")
    public ResponseEntity<ContractResponse> getContract(@PathVariable Integer contractId, Authentication authentication) {
        return ResponseEntity.ok(contractService.getContract(contractId, authentication.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ORGANIZATION','CLIENT','WORKER')")
    public ResponseEntity<List<ContractResponse>> getMyContracts(Authentication authentication) {
        return ResponseEntity.ok(contractService.getMyContracts(authentication.getName()));
    }

    /** WORKER: accept a generated contract. Org flow -> ACCEPTED (awaiting escrow). Client flow -> ACTIVE. */
    @PutMapping("/{contractId}/accept")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ContractResponse> accept(@PathVariable Integer contractId, Authentication authentication) {
        return ResponseEntity.ok(contractService.acceptContract(contractId, authentication.getName()));
    }

    /** WORKER: reject a generated contract. */
    @PutMapping("/{contractId}/reject")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ContractResponse> reject(@PathVariable Integer contractId, Authentication authentication) {
        return ResponseEntity.ok(contractService.rejectContract(contractId, authentication.getName()));
    }

    /** WORKER: mark work / milestones as completed, sends it for approval (org) or payment (client). */
    @PutMapping("/{contractId}/submit-work")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ContractResponse> submitWork(@PathVariable Integer contractId, Authentication authentication) {
        return ResponseEntity.ok(contractService.submitWork(contractId, authentication.getName()));
    }

    /** ORGANIZATION: approve submitted work -> releases escrow -> credits worker wallet -> COMPLETED. */
    @PutMapping("/{contractId}/approve-work")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<ContractResponse> approveWork(@PathVariable Integer contractId, Authentication authentication) {
        return ResponseEntity.ok(contractService.approveWorkAndRelease(contractId, authentication.getName()));
    }
}
