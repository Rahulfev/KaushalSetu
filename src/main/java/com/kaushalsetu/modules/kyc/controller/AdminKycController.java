package com.kaushalsetu.modules.kyc.controller;

import com.kaushalsetu.modules.kyc.dto.KycAdminDetailResponseDto;
import com.kaushalsetu.modules.kyc.dto.KycDecisionRequestDto;
import com.kaushalsetu.modules.kyc.dto.KycListResponseDto;
import com.kaushalsetu.modules.kyc.service.AdminKycService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Admin panel for reviewing/deciding worker KYC submissions. */
@RestController
@RequestMapping("/api/admin/kyc")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminKycController {

    private final AdminKycService adminKycService;

    @GetMapping
    public List<KycListResponseDto> list(@RequestParam(required = false) String status) {
        return adminKycService.listAll(status);
    }

    @GetMapping("/{kycId}")
    public KycAdminDetailResponseDto getDetail(@PathVariable Integer kycId) {
        return adminKycService.getDetail(kycId);
    }

    /** decision: UNDER_REVIEW / APPROVED / REJECTED / REUPLOAD_REQUESTED */
    @PostMapping("/{kycId}/decision")
    public Map<String, String> decide(@PathVariable Integer kycId, @RequestBody KycDecisionRequestDto request) {
        adminKycService.decide(kycId, request);
        return Map.of("message", "Decision recorded");
    }
}
