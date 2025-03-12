package com.c202.diary.diary.service;

import com.c202.diary.diary.model.request.DiaryCreateRequestDto;
import com.c202.diary.diary.model.request.DiaryUpdateRequestDto;
import com.c202.diary.diary.model.response.DiaryDetailResponseDto;
import com.c202.diary.diary.model.response.DiaryListResponseDto;

import java.util.List;

public interface DiaryService {

    DiaryDetailResponseDto createDiary(DiaryCreateRequestDto request);

    DiaryDetailResponseDto updateDiary(int diarySeq, DiaryUpdateRequestDto request);

    void deleteDiary(int diaryId);

    List<DiaryListResponseDto> getMyDiaries(int userSeq);

    List<DiaryListResponseDto> getUserDiaries(int userSeq);

    DiaryDetailResponseDto getDiary(int diarySeq);

    String toggleDiaryIsPublic(int diarySeq);

//    boolean toggleDiaryLike(String userId, Long diaryId);
}