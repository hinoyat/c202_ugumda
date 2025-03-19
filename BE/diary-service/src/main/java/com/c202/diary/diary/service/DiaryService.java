package com.c202.diary.diary.service;

import com.c202.diary.diary.model.request.DiaryCreateRequestDto;
import com.c202.diary.diary.model.request.DiaryUpdateRequestDto;
import com.c202.diary.diary.model.response.DiaryDetailResponseDto;
import com.c202.diary.diary.model.response.DiaryListResponseDto;

import java.util.List;

public interface DiaryService {

    DiaryDetailResponseDto createDiary(int userSeq, DiaryCreateRequestDto request);

    DiaryDetailResponseDto updateDiary(int diarySeq, int userSeq, DiaryUpdateRequestDto request);

    void deleteDiary(int diaryId, int userSeq);

    List<DiaryListResponseDto> getMyDiaries(int userSeq);

    List<DiaryListResponseDto> getUserDiaries(int userSeq);

    DiaryDetailResponseDto getDiary(int diarySeq);

    String toggleDiaryIsPublic(int diarySeq, int userSeq);

}