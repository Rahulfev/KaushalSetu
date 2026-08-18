package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A direct client -> worker payment for a household-hiring engagement (JobApplication).
 * Kept entirely separate from the Organization's EscrowPayment table — there is no escrow
 * hold in this flow, payment happens once and is credited to the worker's wallet immediately.
 */
@Entity
@Table(name = "client_payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClientPayment {

    public enum Status { PENDING, PAID, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    private Double amount;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private LocalDateTime paidAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
