package com.c202.diary.elastic.model.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiarySearchRequestDto {
    private String keyword;
    private boolean searchTitle;
    private boolean searchContent;
    private boolean searchTag;
    private boolean currentUserOnly;

    @Override
    public String toString() {
        return "DiarySearchRequestDto{" +
                "keyword='" + keyword + '\'' +
                ", searchTitle=" + searchTitle +
                ", searchContent=" + searchContent +
                ", searchTag=" + searchTag +
                ", currentUserOnly=" + currentUserOnly +
                '}';
    }

}