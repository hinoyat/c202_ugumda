package com.c202.diary.diary.repository;

import com.c202.diary.diary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    Optional<Diary> findByDiarySeq(int diarySeq);

    List<Diary> findByUserSeq(int userSeq);

    List<Diary> findByUserSeqAndIsDeleted(int userSeq, String isDeleted);

    // 다른 유저 일기 조회 시 비공개 일기까지 필터링
    List<Diary> findByUserSeqAndIsPublicAndIsDeleted(int userSeq, String isPublic, String isDeleted);
}
