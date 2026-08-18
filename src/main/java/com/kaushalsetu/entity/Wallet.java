package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer walletId;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Double balance = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double totalEarned = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double totalWithdrawn = 0.0;

    private LocalDateTime updatedAt;
}
