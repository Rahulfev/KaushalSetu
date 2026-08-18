package com.kaushalsetu.entity;

import com.kaushalsetu.common.enums.District;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer workerId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String skillSet;
    private String category;       // job category, e.g. "PLUMBING", "ELECTRICAL" — shown as "Primary Skillset" on the profile page
    private Integer experienceYears;
    private String location;

    private String languagesKnown;   // free text, e.g. "Hindi, Marathi, English"
    private String serviceAreas;     // free text, e.g. "Pune, Pimpri-Chinchwad"

    @Column(length = 1000)
    private String profileDescription; // short bio shown on the public profile

    private Double rating;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private District district;

}
