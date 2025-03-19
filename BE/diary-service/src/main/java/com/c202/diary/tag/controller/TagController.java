package com.c202.diary.tag.controller;

import com.c202.diary.tag.model.response.TagResponseDto;
import com.c202.diary.tag.service.TagService;
import com.c202.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// TagController.java
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    // 사용자의 최근 태그 조회 (없으면 추천 태그)
    @GetMapping("/recent")
    public ResponseEntity<ResponseDto<List<TagResponseDto>>> getRecentTags(
            @RequestHeader("X-User-Seq") Integer userSeq) {
        List<TagResponseDto> tags = tagService.getRecentTags(userSeq, 7);
        return ResponseEntity.ok(ResponseDto.success(200, "최근 태그 조회 완료", tags));
    }
}
