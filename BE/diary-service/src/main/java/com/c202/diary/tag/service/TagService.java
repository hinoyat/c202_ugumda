package com.c202.diary.tag.service;

import com.c202.diary.tag.entity.Tag;
import com.c202.diary.tag.model.response.TagResponseDto;

import java.util.List;

// 공용 태그 관리
// TagService.java
public interface TagService {
    // 사용자의 최근 태그 조회
    List<TagResponseDto> getRecentTags(Integer userSeq, int limit);

    // 태그 생성 (없는 경우)
    Tag createTagIfNotExists(String tagName);

    // 일기에 태그 연결
    void addTagsToDiary(Integer diarySeq, List<Integer> tagSeqs, String createdAt);
}