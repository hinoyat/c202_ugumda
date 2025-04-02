package com.c202.diary.elastic.model.request;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiarySearchRequestDto {
    private String keyword;
    private boolean searchTitle;
    private boolean searchContent;
    private boolean searchTag;
    private boolean currentUserOnly;
}