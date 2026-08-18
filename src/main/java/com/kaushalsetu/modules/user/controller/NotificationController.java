package com.kaushalsetu.modules.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.entity.Notification;
import com.kaushalsetu.modules.user.repository.NotificationRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .map(user -> ResponseEntity.ok(notificationRepository.findByUserIdAndUnreadTrue(user.getUserId())))
            .orElse(ResponseEntity.notFound().build());
    }
}