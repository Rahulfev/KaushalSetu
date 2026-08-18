package com.kaushalsetu.modules.user.dto;

import lombok.Data;

@Data
public class ClientProfileUpdateRequest {
    private String name;
    private String mobile;
    private String district;
    private String address;
}
