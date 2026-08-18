package com.kaushalsetu.exception;

/**
 * Generic application-level exception for expected business errors
 * (invalid credentials, invalid OTP, duplicate email, etc.)
 * Thrown with a user-friendly message that is safe to show on the frontend.
 */
public class ApiException extends RuntimeException {

    public ApiException(String message) {
        super(message);
    }
}
