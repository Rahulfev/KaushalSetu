package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    // Exactly one of these two is set — Organization flow reviews link to a Contract,
    // Client household-hiring flow reviews link to a JobApplication.
    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = true)
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = true)
    private JobApplication application;

    @ManyToOne
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewee_user_id", nullable = false)
    private User reviewee;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(length = 1000)
    private String comment;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
