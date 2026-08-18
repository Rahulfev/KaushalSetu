package com.kaushalsetu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orgId;

    @Column(name = "user_id")
    private Integer userId;

    private String orgName;
    private String gstNumber;
    private String address;
    private String district;

}
