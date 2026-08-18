package com.kaushalsetu.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ForgotPasswordRequest {
    
    @NotBlank(message = "Email is required to reset password")
    @Email(message = "Invalid email format")
    private String email;
}