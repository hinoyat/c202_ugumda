package com.c202.diaryservice.diary.controller;

import com.c202.diaryservice.diary.model.request.DiaryCreateRequestDto;
import com.c202.diaryservice.diary.model.request.DiaryUpdateRequestDto;
import com.c202.diaryservice.diary.model.response.DiaryDetailResponseDto;
import com.c202.diaryservice.diary.model.response.DiaryListResponseDto;
import com.c202.diaryservice.diary.service.DiaryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryServiceImpl diaryService;

    @PostMapping("")
    public DiaryDetailResponseDto createDiary(@RequestBody DiaryCreateRequestDto dto) {
        return diaryService.createDiary(dto);
    }

    @PutMapping("/{diarySeq}")
    public DiaryDetailResponseDto updateDiary(@RequestBody DiaryUpdateRequestDto dto, @PathVariable Integer diarySeq) {
        return diaryService.updateDiary(diarySeq, dto);
    }

    @DeleteMapping("/{diarySeq}")
    public int deleteDiary(@PathVariable Integer diarySeq) {
        diaryService.deleteDiary(diarySeq);
        return diarySeq;
    }

    // 조회 부분은 일단 더미 숫자로 넣었습니다 연동 성공 후 테스트 하면서 작업할게요!
    @GetMapping("/me")
    public List<DiaryListResponseDto> getMyDiaries() {
        diaryService.getMyDiaries(1);
        return diaryService.getMyDiaries(1);
    }

    @GetMapping("/users/{userSeq}")
    public List<DiaryListResponseDto> getUserDiaries() {
        diaryService.getUserDiaries(1);
        return diaryService.getMyDiaries(1);
    }

    // 개별 조회
    @GetMapping("/{diarySeq}")
    public DiaryDetailResponseDto getDiary(@PathVariable Integer diarySeq) {
        return diaryService.getDiary(diarySeq);
    }

    @PutMapping("/{diarySeq}/visibility")
    public String toggleDiaryIsPublic(@PathVariable Integer diarySeq) {
        return diaryService.toggleDiaryIsPublic(diarySeq);
    }
}
