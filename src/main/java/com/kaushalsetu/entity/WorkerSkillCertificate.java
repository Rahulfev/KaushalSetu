package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_skill_certificates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkerSkillCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer certificateId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** e.g. "ITI", "Electrician License", "Plumbing Certificate", "Welding Certificate", "Resume" */
    private String certificateName;

    private String fileUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
}
