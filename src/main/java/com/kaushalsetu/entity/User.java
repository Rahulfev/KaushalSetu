package com.kaushalsetu.entity;

import java.time.LocalDateTime;

import com.kaushalsetu.common.enums.EmailVStatus;
import com.kaushalsetu.common.enums.KycStatus;
import com.kaushalsetu.common.enums.UserStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String fullName;
    private String email;


    private String countryCode;

    private String phone;
    private String passwordHash;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    // ACCOUNT ACCESS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    //  EMAIL VERIFICATION
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmailVStatus emailStatus;

    //  KYC STATUS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus kycStatus;

    private LocalDateTime createdAt = LocalDateTime.now();
}
