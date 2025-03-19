package com.c202.diary.diary.controller;

import com.c202.dto.ResponseDto;
import com.c202.diary.diary.model.request.DiaryCreateRequestDto;
import com.c202.diary.diary.model.request.DiaryUpdateRequestDto;
import com.c202.diary.diary.model.response.DiaryDetailResponseDto;
import com.c202.diary.diary.model.response.DiaryListResponseDto;
import com.c202.diary.diary.service.DiaryService;
import com.c202.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;
    
    // 일기 생성
    @PostMapping("")
    public ResponseEntity<ResponseDto<DiaryDetailResponseDto>> createDiary(
            @RequestHeader("X-User-Seq") Integer userSeq,
            @RequestBody DiaryCreateRequestDto dto
    ) {
        return ResponseEntity.ok(ResponseDto.success(201, "일기 작성 완료", diaryService.createDiary(userSeq, dto)));
    }

    // 일기 수정
    @PutMapping("/{diarySeq}")
    public ResponseEntity<ResponseDto<DiaryDetailResponseDto>> updateDiary(
            @RequestBody DiaryUpdateRequestDto dto,
            @PathVariable Integer diarySeq
    ) {
        if (diarySeq == null) { throw new CustomException("diarySeq 값을 다시 확인해 주세요"); }
        return ResponseEntity.ok(ResponseDto.success(200, "일기 수정 완료", diaryService.updateDiary(diarySeq, dto)));
    }

    // 일기 삭제
    @DeleteMapping("/{diarySeq}")
    public ResponseEntity<ResponseDto<Objects>> deleteDiary(
            @PathVariable Integer diarySeq
    ) {
        if (diarySeq == null) { throw new CustomException("diarySeq 값을 다시 확인해 주세요"); }
        diaryService.deleteDiary(diarySeq);
        return ResponseEntity.ok(ResponseDto.success(204, "일기 삭제 완료"));
    }

    // 내 일기 전체 조회
    @GetMapping("/me")
    public ResponseEntity<ResponseDto<List<DiaryListResponseDto>>> getMyDiaries(
            @RequestHeader("X-User-Seq") Integer userSeq
    ) {
        return ResponseEntity.ok(ResponseDto.success(200, "내 일기 조회 완료", diaryService.getMyDiaries(userSeq)));
    }

    // 다른 유저 일기 전체 조회
    @GetMapping("/users/{userSeq}")
    public ResponseEntity<ResponseDto<List<DiaryListResponseDto>>> getUserDiaries(
            @PathVariable Integer userSeq
    ) {
        if (userSeq == null) { throw new CustomException("userSeq 값을 다시 확인해 주세요"); }
        return ResponseEntity.ok(ResponseDto.success(200, "사용자 일기 조회 완료", diaryService.getUserDiaries(userSeq)));
    }

    // 개별 조회
    @GetMapping("/{diarySeq}")
    public ResponseEntity<ResponseDto<DiaryDetailResponseDto>> getDiary(
            @PathVariable Integer diarySeq
    ) {
        if (diarySeq == null) { throw new CustomException("diarySeq 값을 다시 확인해 주세요"); }
        return ResponseEntity.ok(ResponseDto.success(200, "일기 상세 조회 완료", diaryService.getDiary(diarySeq)));
    }

    // 공개 비공개 토글
    @PutMapping("/{diarySeq}/visibility")
    public ResponseEntity<ResponseDto<String>> toggleDiaryIsPublic(
            @PathVariable Integer diarySeq
    ) {
        if (diarySeq == null) { throw new CustomException("diarySeq 값을 다시 확인해 주세요"); }
        String result = diaryService.toggleDiaryIsPublic(diarySeq);
        return ResponseEntity.ok(ResponseDto.success(200, "일기 공개 상태 변경 완료", result));
    }

}
