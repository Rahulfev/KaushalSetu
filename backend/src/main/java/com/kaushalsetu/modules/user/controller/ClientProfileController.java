package com.kaushalsetu.modules.user.controller;

import com.kaushalsetu.modules.user.dto.ClientProfileResponse;
import com.kaushalsetu.modules.user.dto.ClientProfileUpdateRequest;
import com.kaushalsetu.modules.user.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientProfileController {

    private final ClientProfileService clientProfileService;

    @GetMapping("/profile")
    public ResponseEntity<ClientProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(clientProfileService.getProfile(email));
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody ClientProfileUpdateRequest request) {

        String email = authentication.getName();
        clientProfileService.updateProfile(email, request);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/profile/delete")
    public ResponseEntity<?> blockAccount(Authentication authentication) {
        String email = authentication.getName();
        clientProfileService.blockAccount(email);
        return ResponseEntity.ok("Account blocked successfully");
    }

}
