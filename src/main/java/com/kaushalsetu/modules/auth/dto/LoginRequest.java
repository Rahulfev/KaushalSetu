package com.kaushalsetu.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

	// Can be either an email address or a phone number, so no @Email constraint here.
	@NotBlank(message = "Email or phone number is required")
	private String username;

	@NotBlank(message = "Password is required")
    private String password;
}