package com.c202.diary.tag.service;

import com.c202.diary.tag.entity.DiaryTag;
import com.c202.diary.tag.entity.Tag;
import com.c202.diary.tag.model.response.TagResponseDto;
import com.c202.diary.tag.repository.DiaryTagRepository;
import com.c202.diary.tag.repository.TagRepository;
import com.c202.exception.CustomException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

// TagServiceImpl.java
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final DiaryTagRepository diaryTagRepository;

    @Override
    public List<TagResponseDto> getRecentTags(Integer userSeq, int limit) {
        // 최근 사용한 태그 조회
        List<Tag> recentTags = diaryTagRepository.findRecentTagsByUserSeq(userSeq, limit);

        if (recentTags.isEmpty()) {
            // 최근 사용 태그가 없는 경우 추천 태그
            return getRecommendedTags();
        }

        return recentTags.stream()
                .map(TagResponseDto::toDto)
                .collect(Collectors.toList());
    }

    private List<TagResponseDto> getRecommendedTags() {

        // 기본 추천 태그
        List<String> recommendedTagNames = Arrays.asList("행복", "슬픔", "분노", "기쁨", "평화", "불안", "희망");

        return recommendedTagNames.stream()
                .map(name -> {
                    Tag tag = tagRepository.findByName(name).orElse(null);
                    return TagResponseDto.builder()
                            .tagSeq(tag != null ? tag.getTagSeq() : null)
                            .name(name)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Tag createTagIfNotExists(String tagName) {

        if (tagName == null || tagName.trim().isEmpty() || tagName.length() > 5) {
            throw new CustomException("태그는 1~5자로 입력해주세요.");
        }

        return tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(Tag.builder()
                        .name(tagName)
                        .build()));
    }

    @Override
    @Transactional
    public void addTagsToDiary(Integer diarySeq, List<Integer> tagSeqs, String createdAt) {

        if (tagSeqs.size() > 3) {
            throw new CustomException("태그는 최대 3개까지 추가할 수 있습니다.");
        }

        tagSeqs.forEach(tagSeq -> {
            DiaryTag diaryTag = DiaryTag.builder()
                    .diarySeq(diarySeq)
                    .tagSeq(tagSeq)
                    .createdAt(createdAt)
                    .updatedAt(createdAt)
                    .build();

            diaryTagRepository.save(diaryTag);
        });
    }
}