package com.kaushalsetu.modules.user.controller;

import com.kaushalsetu.modules.user.dto.ClientDashboardResponse;
import com.kaushalsetu.modules.user.service.ClientDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientDashboardController {

    private final ClientDashboardService clientDashboardService;

    @GetMapping("/client")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard(Authentication authentication) {
        String username = authentication.getName();
        ClientDashboardResponse response = clientDashboardService.getDashboardData(username);
        return ResponseEntity.ok(response);
    }
}