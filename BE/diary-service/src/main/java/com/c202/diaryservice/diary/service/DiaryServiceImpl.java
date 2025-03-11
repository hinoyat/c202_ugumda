package com.c202.diaryservice.diary.service;

import com.c202.diaryservice.diary.entity.Diary;
import com.c202.diaryservice.diary.model.request.DiaryCreateRequestDto;
import com.c202.diaryservice.diary.model.response.DiaryDetailResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class DiaryServiceImpl implements DiaryService {

    // 날짜 포매터
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Transactional
    @Override
    public DiaryDetailResponseDto createDiary(DiaryCreateRequestDto request) {

        String now = LocalDateTime.now().format(DATE_TIME_FORMATTER);

        Diary diary = Diary.builder()
                .userSeq(1)
                .title(request.getTitle())
                .content(request.getContent())
                .dreamDate(request.getDreamDate())
                .isPublic(request.getIsPublic())
                .createdAt(now)
                .updatedAt(now)
                .isDeleted("N")
                .build();


        return DiaryDetailResponseDto.toDto(diary);
    }
}
