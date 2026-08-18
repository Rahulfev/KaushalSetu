package com.kaushalsetu.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "system_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    private User user;

    private String action;
    private LocalDateTime createdAt = LocalDateTime.now();
}
