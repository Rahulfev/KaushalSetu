package com.kaushalsetu.modules.user.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {

    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
}
