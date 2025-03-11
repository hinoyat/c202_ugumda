package com.c202.diaryservice.diary.controller;

import com.c202.diaryservice.diary.model.request.DiaryCreateRequestDto;
import com.c202.diaryservice.diary.model.response.DiaryDetailResponseDto;
import com.c202.diaryservice.diary.service.DiaryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryServiceImpl diaryService;

    @PostMapping("")
    public DiaryDetailResponseDto createDiary(@RequestBody DiaryCreateRequestDto dto) {
        return diaryService.createDiary(dto);
    }


}
