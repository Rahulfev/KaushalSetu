package com.kaushalsetu.modules.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;


    private static final String FROM_DISPLAY_NAME = "KaushalSetu";

    private void send(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");

            helper.setFrom(fromAddress, FROM_DISPLAY_NAME);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(mimeMessage);
        } catch (jakarta.mail.MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public void sendVerificationEmail(String to, String link) {
        send(
                to,
                "Verify your email - KaushalSetu",
                "Welcome to KaushalSetu!\n\n" +
                "Click below to verify your email:\n" +
                link + "\n\n" +
                "This link expires in 24 hours."
        );
    }

    public void sendPasswordResetOtp(String to, String otp) {
        send(
                to,
                "Your password reset OTP - KaushalSetu",
                "You requested a password reset.\n\n" +
                "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                "Enter this OTP to set a new password.\n" +
                "This OTP expires in 10 minutes.\n" +
                "If you didn't request this, please ignore this email."
        );
    }

}
