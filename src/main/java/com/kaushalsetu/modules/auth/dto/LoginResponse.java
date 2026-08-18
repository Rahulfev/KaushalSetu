package com.kaushalsetu.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String role;

    private Integer userId;
    private String fullName;
    private String emailStatus;
    private String kycStatus;


    private String accountStatus;
}
