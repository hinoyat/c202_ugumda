package com.c202.lucky.dreamMeaning.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DreamMeaning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dreamMeaningSeq;

    private Integer userSeq;

    @Column(nullable = false)
    private String inputContent;

    @Column(nullable = false)
    private String resultContent;

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(length = 1)
    private String isGood;
}
