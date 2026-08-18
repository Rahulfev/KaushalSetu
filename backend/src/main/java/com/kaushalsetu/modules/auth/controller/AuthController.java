package com.kaushalsetu.modules.auth.controller;

import com.kaushalsetu.common.enums.EmailVStatus;
import com.kaushalsetu.entity.EmailVerificationToken;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.modules.auth.dto.ForgotPasswordRequest;
import com.kaushalsetu.modules.auth.dto.LoginRequest;
import com.kaushalsetu.modules.auth.dto.LoginResponse;
import com.kaushalsetu.modules.auth.dto.RegisterRequest;
import com.kaushalsetu.modules.auth.dto.RegisterResponse;
import com.kaushalsetu.modules.auth.dto.ResetPasswordRequest;
import com.kaushalsetu.modules.auth.dto.VerifyOtpRequest;
import com.kaushalsetu.modules.auth.repository.EmailVerificationTokenRepository;
import com.kaushalsetu.modules.auth.service.AuthService;
import com.kaushalsetu.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository tokenRepository;


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));  //calling to auth service
    }
    
    
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {

        EmailVerificationToken verificationToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (verificationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = verificationToken.getUser();
        user.setEmailStatus(EmailVStatus.VERIFIED);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        return ResponseEntity.ok("Email verified successfully");
    }
    
    
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("An OTP has been sent to your email");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("OTP verified");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );

        return ResponseEntity.ok("Password reset successful");
    }




}
