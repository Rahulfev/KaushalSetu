package com.kaushalsetu.modules.admin.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.user.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/profile")
@CrossOrigin(origins = "*")
public class AdminProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("name", user.getFullName());
        result.put("email", user.getEmail());
        result.put("phone", user.getPhone());
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody Map<String, Object> data) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        // Email is treated as the login identity elsewhere in the app, so it's read-only here —
        // only name and phone are editable from this screen.
        if (data.get("name") != null) user.setFullName(String.valueOf(data.get("name")));
        if (data.get("phone") != null) user.setPhone(String.valueOf(data.get("phone")));

        userRepository.save(user);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("name", user.getFullName());
        result.put("email", user.getEmail());
        result.put("phone", user.getPhone());
        return ResponseEntity.ok(result);
    }
}
