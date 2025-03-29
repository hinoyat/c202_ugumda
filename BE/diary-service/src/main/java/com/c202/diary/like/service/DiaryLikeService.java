package com.c202.diary.like.service;

import com.c202.diary.like.model.response.DiaryLikeResponseDto;

import java.util.List;

public interface DiaryLikeService {

    DiaryLikeResponseDto addLike(Integer diarySeq, Integer userSeq);

    void removeLike(Integer diarySeq, Integer userSeq);

    Integer getLikeCount(Integer diarySeq);

    boolean hasUserLiked(Integer diarySeq, Integer userSeq);
}
