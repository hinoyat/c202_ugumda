package com.c202.diaryservice.diary.model.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DiaryListResponseDto {

    private String title;

    private String content;

    private String videoUrl;

    private String dreamDate;

    private String createdAt;

    private String updatedAt;

    private String isPublic;
}
