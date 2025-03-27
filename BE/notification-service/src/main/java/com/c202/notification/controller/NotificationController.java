package com.c202.notification.controller;

import com.c202.notification.emitter.EmitterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 임시 HTML 테스트용
@RequestMapping("/notifications")
public class NotificationController {

    private final EmitterRepository emitterRepository;

    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Integer userId) {
        log.info("SSE 연결 요청 → userId: {}", userId);

        // 연결 유지 시간 설정 (기본: 1시간)
        SseEmitter emitter = new SseEmitter(TimeUnit.HOURS.toMillis(1));
        emitterRepository.save(userId, emitter);

        // 연결 종료 또는 에러 발생 시 emitter 제거
        emitter.onCompletion(() -> emitterRepository.remove(userId));
        emitter.onTimeout(() -> emitterRepository.remove(userId));
        emitter.onError((e) -> {
            log.warn("SSE 연결 오류: {}", e.getMessage());
            emitterRepository.remove(userId);
        });

        // 연결 성공 응답 보내기 (optional)
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("알림 연결 완료"));
        } catch (IOException e) {
            log.error("SSE 초기 전송 실패", e);
        }

        return emitter;
    }
}
