package com.c202.notification.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlarmMessageDto {
    private String userSeq;
    private String content;
    private String type;

}
