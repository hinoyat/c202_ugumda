package com.c202.diary.tag.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer tagSeq;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    // DiaryTag와 연결
    @OneToMany(mappedBy = "tag")
    @Builder.Default
    private List<DiaryTag> diaryTags = new ArrayList<>();
}
