package com.c202.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ResponseDto<T> {
    private final LocalDateTime timestamp;
    private final int status;
    private final String message;
    private final T data;

    public static <T> ResponseDto<T> success(T data) {
        return ResponseDto.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(200)
                .message("요청이 성공적으로 처리되었습니다.")
                .data(data)
                .build();
    }

    public static <T> ResponseDto<T> error(int status, String message) {
        return ResponseDto.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .message(message)
                .build();
    }
}