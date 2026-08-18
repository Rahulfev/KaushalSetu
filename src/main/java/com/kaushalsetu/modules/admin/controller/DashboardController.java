package com.kaushalsetu.modules.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.modules.admin.dto.DashboardStatsDTO;
import com.kaushalsetu.modules.admin.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard") // ✅ Base path is /api/admin/dashboard
@Tag(name = "Platform Monitoring", description = "System Health and Stats Dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get Dashboard Counters", description = "Returns aggregated stats for Users, Jobs, and Revenue")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // ✅ ADDED THIS METHOD (Returns Mock Logs)
    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        // ✅ FIX: Call the Service! The Service handles the DB fetch AND the key renaming.
        return ResponseEntity.ok(dashboardService.getSystemLogs());
    }
    
}