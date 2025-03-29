package com.c202.diary.like.service;

import com.c202.diary.diary.entity.Diary;
import com.c202.diary.diary.repository.DiaryRepository;
import com.c202.diary.like.entity.DiaryLike;
import com.c202.diary.like.model.response.DiaryLikeResponseDto;
import com.c202.diary.like.repository.DiaryLikeRepository;
import com.c202.exception.types.ConflictException;
import com.c202.exception.types.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaryLikeServiceImpl implements DiaryLikeService {

    private final DiaryLikeRepository diaryLikeRepository;
    private final DiaryRepository diaryRepository;
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Transactional
    @Override
    public DiaryLikeResponseDto addLike(Integer diarySeq, Integer userSeq) {
        Diary diary = diaryRepository.findByDiarySeqAndIsDeleted(diarySeq, "N")
                .orElseThrow(() -> new NotFoundException("해당 일기를 찾을 수 없습니다."));

        if (diaryLikeRepository.findByDiarySeqAndUserSeq(diarySeq, userSeq).isPresent()) {
            throw new ConflictException("이미 좋아요를 누른 일기입니다.");
        }

        String now = LocalDateTime.now().format(DATE_TIME_FORMATTER);

        DiaryLike diaryLike = DiaryLike.builder()
                .diarySeq(diarySeq)
                .userSeq(userSeq)
                .createdAt(now)
                .build();

        diaryLikeRepository.save(diaryLike);

        // 해당 일기의 총 좋아요 수 조회
        Integer likeCount = diaryLikeRepository.countByDiarySeq(diarySeq);

        return DiaryLikeResponseDto.toDto(diaryLike, likeCount);
    }

    @Transactional
    @Override
    public void removeLike(Integer diarySeq, Integer userSeq) {
        DiaryLike diaryLike = diaryLikeRepository.findByDiarySeqAndUserSeq(diarySeq, userSeq)
                .orElseThrow(() -> new NotFoundException("좋아요를 누르지 않은 일기입니다."));
        diaryLikeRepository.delete(diaryLike);
    }

    @Override
    public Integer getLikeCount(Integer diarySeq) {
        return diaryLikeRepository.countByDiarySeq(diarySeq);
    }

    @Override
    public boolean hasUserLiked(Integer diarySeq, Integer userSeq) {
        return diaryLikeRepository.findByDiarySeqAndUserSeq(diarySeq, userSeq).isPresent();
    }
}