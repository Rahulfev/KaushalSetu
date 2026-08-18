package com.kaushalsetu.modules.auth.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterResponse {

    private Integer userId;
    private String message;
}
