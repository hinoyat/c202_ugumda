package com.c202.notification.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Slf4j
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SseExceptionHandler {

    // SSE 연결 시간 초과 예외 처리
    @ExceptionHandler(AsyncRequestTimeoutException.class)
    public void handleAsyncRequestTimeoutException(AsyncRequestTimeoutException ex) {
        log.debug("SSE 연결 시간 초과 (정상 종료): {}", ex.getMessage());
        // void 반환 - 응답 본문 없음
    }

    // 클라이언트 연결 종료 예외 처리
    @ExceptionHandler(IOException.class)
    public void handleIOException(IOException ex) {
        log.debug("SSE 클라이언트 연결 종료 (정상): {}", ex.getMessage());
        // void 반환 - 응답 본문 없음
    }

    // HTTP 메시지 변환 예외 처리
    @ExceptionHandler(HttpMessageNotWritableException.class)
    public void handleHttpMessageNotWritableException(HttpMessageNotWritableException ex) {
        if (ex.getMessage() != null && ex.getMessage().contains("text/event-stream")) {
            log.debug("SSE 콘텐츠 타입 변환 에러 (무시됨): {}", ex.getMessage());
            // void 반환 - 응답 본문 없음
        } else {
            throw ex; // 다른 HTTP 변환 오류는 전역 핸들러로 위임
        }
    }

    // SseEmitter 관련 IllegalStateException 처리
    @ExceptionHandler(IllegalStateException.class)
    public void handleSseIllegalStateException(IllegalStateException ex) {
        if (ex.getMessage() != null &&
                (ex.getMessage().contains("ResponseBodyEmitter") ||
                        ex.getMessage().contains("SseEmitter") ||
                        ex.getMessage().contains("Timeout value"))) {
            log.debug("SSE 이벤트 전송 중 오류 (연결 종료됨): {}", ex.getMessage());
            // void 반환 - 응답 본문 없음
        } else {
            throw ex; // SSE와 관련 없는 IllegalStateException은 전역 핸들러로 위임
        }
    }

    // Servlet 컨테이너 관련 예외 처리 (jakarta.servlet 패키지 사용)
    @ExceptionHandler(Exception.class)
    public void handleServletContainerException(Exception ex) {
        String message = ex.getMessage();
        if (message != null &&
                (message.contains("Servlet container error") ||
                        message.contains("disconnected client"))) {
            log.debug("SSE 클라이언트 연결 끊김 (정상): {}", message);
            // void 반환 - 응답 본문 없음
            return;
        }

        // SseEmitter 또는 event-stream 관련 예외 처리
        if (message != null &&
                (message.contains("SseEmitter") ||
                        message.contains("event-stream") ||
                        message.contains("AsyncContext"))) {
            log.debug("SSE 관련 예외 발생 (처리됨): {}", message);
            // void 반환 - 응답 본문 없음
            return;
        }

        // 그 외 예외는 전역 핸들러로 위임
        throw new RuntimeException(ex);
    }
}