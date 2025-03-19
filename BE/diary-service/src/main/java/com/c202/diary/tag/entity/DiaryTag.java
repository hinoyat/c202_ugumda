package com.c202.diary.tag.entity;

import com.c202.diary.diary.entity.Diary;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryTag {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer diaryTagSeq;

    @Column(nullable = false)
    private Integer diarySeq;

    @Column(nullable = false)
    private Integer tagSeq;

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(nullable = false, length = 15)
    private String updatedAt;

    // Diary와 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diarySeq")
    private Diary diary;

    // Tag와 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tagSeq")
    private Tag tag;
}
