package com.c202.diaryservice.diary.service;

import com.c202.diaryservice.diary.model.request.DiaryCreateRequestDto;
import com.c202.diaryservice.diary.model.response.DiaryDetailResponseDto;

public interface DiaryService {

    DiaryDetailResponseDto createDiary(DiaryCreateRequestDto request);

//    void updateDiary();
//
//    void deleteDiary(String userId, Long diaryId);
//
//    void getMyDiaries(String userId, int page, int size);
//
//    void getUserDiaries(String userId, String targetUserId, int page, int size);
//
//    void getDiaryDetail(String userId, Long diaryId);
//
//    boolean toggleDiaryVisibility(String userId, Long diaryId, boolean isPublic);
//
//    boolean toggleDiaryLike(String userId, Long diaryId);
//
//    void updateDiaryVideoUrl(String userId, int diarySeq, String videoUrl);
}