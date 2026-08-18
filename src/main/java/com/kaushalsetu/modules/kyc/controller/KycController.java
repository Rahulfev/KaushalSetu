package com.kaushalsetu.modules.kyc.controller;

import com.kaushalsetu.modules.kyc.dto.*;
import com.kaushalsetu.modules.kyc.service.KycService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WORKER')")
public class KycController {

    private final KycService kycService;

    /** Submit (or resubmit after rejection) the full KYC form, multipart with files. */
//    @PostMapping(value = "/submit", consumes = "multipart/form-data")
//    public ResponseEntity<KycSubmitResponseDto> submitKyc(@ModelAttribute KycSubmitRequestDto request) {
//        return ResponseEntity.ok(kycService.submitKyc(request));
//    }

    @PostMapping("/submit")
    public ResponseEntity<KycSubmitResponseDto> submitKyc(@RequestBody KycSubmitRequestDto request) {
        return ResponseEntity.ok(kycService.submitKyc(request));
    }

    /** Worker's own current KYC status + full profile (drives the dashboard UI). */
    @GetMapping("/my-status")
    public ResponseEntity<KycMyStatusResponseDto> getMyStatus() {
        return ResponseEntity.ok(kycService.getMyStatus());
    }

    /** Optional: upload a skill certificate (ITI, Electrician License, Resume, etc.). */
    @PostMapping(value = "/certificates", consumes = "multipart/form-data")
    public ResponseEntity<KycMyStatusResponseDto.CertificateDto> uploadCertificate(
            @RequestParam("certificateName") String certificateName,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(kycService.uploadCertificate(certificateName, file));
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<KycMyStatusResponseDto.CertificateDto>> getCertificates() {
        return ResponseEntity.ok(kycService.getMyCertificates());
    }
}
