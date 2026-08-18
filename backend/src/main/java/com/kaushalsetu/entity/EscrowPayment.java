package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import com.kaushalsetu.common.enums.PaymentStatus;
import com.kaushalsetu.common.enums.TransactionType;
import java.time.LocalDateTime;

@Entity
@Table(name = "escrow_payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EscrowPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer escrowId;

    @ManyToOne
    private Contract contract;

    private Double amount;

    // Bridge between your DB and Razorpay
    @Column(unique = true)
    private String razorpayOrderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    private LocalDateTime transactionDate = LocalDateTime.now();
}