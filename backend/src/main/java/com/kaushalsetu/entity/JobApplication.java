package com.kaushalsetu.entity;

import com.kaushalsetu.common.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_job_id")
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_user_id")
    private User worker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    // ───────────────── CLIENT household-hiring flow ─────────────────
    // Set by the worker when applying to a CLIENT job (Organization jobs leave these null —
    // pricing there is negotiated separately via the Contract flow).
    private Double estimatedBudget;
    private String coverMessage;
    private String expectedStartTime;
    private String expectedCompletionTime;

    // Engagement lifecycle timestamps
    private LocalDateTime assignedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime paidAt;
    private LocalDateTime closedAt;

    public boolean isParticipant(User user) {
        if (user == null) return false;
        boolean isWorker = worker != null && worker.getUserId().equals(user.getUserId());
        boolean isClient = job != null && job.getPostedByUserId() != null && job.getPostedByUserId().equals(user.getUserId());
        return isWorker || isClient;
    }
}
