package com.c202.diaryservice.diary.repository;

import com.c202.diaryservice.diary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    Diary findByDiarySeq(int diarySeq);


}
