package com.kaushalsetu.modules.auth.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushalsetu.common.enums.EmailVStatus;
import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.common.util.CountryCodeData;
import com.kaushalsetu.common.util.EmailValidator;
import com.kaushalsetu.common.util.OtpUtil;
import com.kaushalsetu.common.util.PasswordValidator;
import com.kaushalsetu.common.util.PhoneValidator;
import com.kaushalsetu.entity.EmailVerificationToken;
import com.kaushalsetu.entity.PasswordResetToken;
import com.kaushalsetu.entity.Role;
import com.kaushalsetu.entity.User;
import com.kaushalsetu.exception.ApiException;
import com.kaushalsetu.modules.auth.dto.LoginRequest;
import com.kaushalsetu.modules.auth.dto.LoginResponse;
import com.kaushalsetu.modules.auth.dto.RegisterRequest;
import com.kaushalsetu.modules.auth.dto.RegisterResponse;
import com.kaushalsetu.modules.auth.repository.EmailVerificationTokenRepository;
import com.kaushalsetu.modules.auth.repository.PasswordResetTokenRepository;
import com.kaushalsetu.modules.user.repository.RoleRepository;
import com.kaushalsetu.modules.user.repository.UserRepository;
import com.kaushalsetu.security.JwtUtils;
import com.kaushalsetu.entity.Organization;
import com.kaushalsetu.modules.organization.repository.OrganizationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        //  EMAIL FORMAT kaa hai
        if (!EmailValidator.isValid(request.getEmail())) {
            throw new ApiException("Invalid email address");
        }


        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered");
        }

        // COUNTRY CODE + PHONE NUMBER  dono kaa hai
        if (!PhoneValidator.isValidDialCodeFormat(request.getCountryCode())
                || !CountryCodeData.isValidDialCode(request.getCountryCode())) {
            throw new ApiException("Please select a valid country code");
        }

        if (!PhoneValidator.isValidPhone(request.getPhone())) {
            throw new ApiException("Please enter a valid phone number (6-14 digits)");
        }

        String fullPhone = request.getCountryCode() + request.getPhone();
        if (userRepository.findByPhone(fullPhone).isPresent()
                || userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ApiException("Phone number already registered");
        }

        //  PASSWORD MATCH  hoga
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Passwords do not match");
        }

        //  PASSWORD STRENGTH logic hai
        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new ApiException(
                    "Password must contain at least 1 uppercase letter, 1 number, 1 special character and be 8 characters long"
            );
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new ApiException("Invalid role"));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .countryCode(request.getCountryCode())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(UserStatus.ACTIVE)
                .emailStatus(EmailVStatus.NOT_VERIFIED)
                .kycStatus(KycStatus.NOT_SUBMITTED)
                .build();

        userRepository.save(user);


// Automatically create organization profile hoga
        if ("ROLE_ORGANIZATION".equals(role.getRoleName())) {

            Organization organization = Organization.builder()
                    .userId(user.getUserId())
                    .orgName("")
                    .gstNumber("")
                    .address("")
                    .district("")
                    .build();

            organizationRepository.save(organization);
        }


        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                        .token(token)
                        .user(user)
                        .expiryTime(LocalDateTime.now().plusHours(24))
                        .build();

        tokenRepository.save(verificationToken);

        String verifyLink =
                "http://localhost:8080/api/auth/verify-email?token=" + token;

        // 📧 Don't let a flaky mail server (common with disposable/temp-mail addresses)
        // fail the whole registration after the account has already been created.
        // The account still exists and verification can be re-sent later.
        try {
            emailService.sendVerificationEmail(user.getEmail(), verifyLink);
        } catch (Exception e) {
            System.err.println("⚠️ Could not send verification email to " + user.getEmail() + ": " + e.getMessage());
        }

        return RegisterResponse.builder()
                .userId(user.getUserId())
                .message("Registration successful. Verify email.")
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getUsername())
                .or(() -> userRepository.findByPhone(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ Bypass email verification for development
        /* if (user.getEmailStatus() != EmailVStatus.VERIFIED) {
            throw new RuntimeException("Please verify your email");
        }
        */

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account blocked");
        }

        String roleName = user.getRole().getRoleName();
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }
        String token = jwtUtils.generateToken(user.getEmail(), roleName);

        return LoginResponse.builder()
                .token(token)
                .role(roleName)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .accountStatus(user.getStatus().name())
                .emailStatus(user.getEmailStatus().name())
                .kycStatus(user.getKycStatus().name())
                .build();
    }

    
    
    
    
    /**
     * STEP 1 of forgot-password: user submits their email.
     * We generate a 6-digit OTP, store it (replacing any previous one for this user),
     * and email it to them.
     */
    @Transactional
    public void forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("No account found with this email"));

        // Remove any previous OTPs for this user so only the latest one is valid
        passwordResetTokenRepository.deleteByUser(user);

        String otp = OtpUtil.generate();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(otp)
                .user(user)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetOtp(user.getEmail(), otp);
    }

    /**
     * STEP 2 (optional, used by the frontend to validate the OTP before showing
     * the "create new password" fields): checks the OTP is correct and not expired,
     * WITHOUT consuming it.
     */
    public void verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("No account found with this email"));

        PasswordResetToken resetToken = passwordResetTokenRepository.findByUserAndToken(user, otp)
                .orElseThrow(() -> new ApiException("Invalid OTP"));

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP has expired. Please request a new one.");
        }
    }

    /**
     * STEP 3: user submits the OTP together with their new password.
     * OTP is re-checked (and consumed) here as the source of truth.
     */
    @Transactional
    public void resetPassword(String email, String otp, String newPassword, String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new ApiException("Passwords do not match");
        }

        if (!PasswordValidator.isValid(newPassword)) {
            throw new ApiException(
                    "Password must contain at least 1 uppercase letter, 1 number, 1 special character and be 8 characters long"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("No account found with this email"));

        PasswordResetToken resetToken = passwordResetTokenRepository.findByUserAndToken(user, otp)
                .orElseThrow(() -> new ApiException("Invalid OTP"));

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }


}

