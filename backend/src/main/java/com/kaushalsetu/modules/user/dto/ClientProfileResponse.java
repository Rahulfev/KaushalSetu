package com.kaushalsetu.modules.user.dto;

import lombok.Data;

@Data
public class ClientProfileResponse {
    private String name;
    private String email;
    private String mobile;
    private String district;
    private String address;
    private boolean kycVerified;
}
