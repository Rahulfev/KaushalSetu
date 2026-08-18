package com.kaushalsetu.entity;

import com.kaushalsetu.common.enums.District;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer clientId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String address;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private District district;

}
