package com.c202.exception;

import com.c202.dto.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDto<Void>> handleCustomException(CustomException ex) {
        return ResponseEntity.status(400).body(ResponseDto.error(400, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto<Void>> handleGenericException(Exception e) {
        return ResponseEntity.status(500).body(ResponseDto.error(500, "서버 오류가 발생했습니다."));
    }
}