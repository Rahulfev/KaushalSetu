package com.kaushalsetu.modules.payment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaushalsetu.entity.EscrowPayment;
import com.kaushalsetu.modules.payment.service.RazorpayService;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/worker/payments")
@RequiredArgsConstructor
public class WorkerPaymentController {

    private final RazorpayService razorpayService; 
    private final UserRepository userRepository; 

    @GetMapping("/my-history")
    public ResponseEntity<?> getMyHistory() {
        // 1. Get current user email from JWT
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 2. Fetch history using the method already in your RazorpayService
        return userRepository.findByEmail(email)
            .map(user -> {
                List<EscrowPayment> history = razorpayService.getPaymentsByWorker(user.getUserId());
                return ResponseEntity.ok(history);
            })
            //  FIX: Using orElseGet to match the ResponseEntity type
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}