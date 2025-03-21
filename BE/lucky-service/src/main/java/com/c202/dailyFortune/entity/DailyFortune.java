package com.c202.dailyFortune.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyFortune {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fortuneSeq;
    private Integer userSeq;
    private String content;

    @Column(nullable = false, length = 15)
    private String createdAt;
}
