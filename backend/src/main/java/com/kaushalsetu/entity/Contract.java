package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;
import com.kaushalsetu.common.enums.ContractStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contractId;

    @OneToOne
    private Job job;

    @ManyToOne
    private User worker;

    @ManyToOne
    private User client;

    private String contractTerms;
    private Double agreedAmount;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ContractStatus status;

    
    public boolean isParticipant(User user) {
        return user != null &&
               (user.getUserId().equals(client.getUserId()) ||
                user.getUserId().equals(worker.getUserId()));
    }



    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime signedAt;
}
