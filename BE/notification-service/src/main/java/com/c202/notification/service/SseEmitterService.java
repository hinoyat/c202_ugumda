package com.c202.notification.service;

import com.c202.notification.entity.Alarm;
import com.c202.notification.emitter.EmitterRepository;
import com.c202.notification.model.ConnectionInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseEmitterService {

    private final EmitterRepository emitterRepository;
    private final AlarmService alarmService;

    private static final Long DEFAULT_TIMEOUT = TimeUnit.HOURS.toMillis(1);
    private static final int HEARTBEAT_INTERVAL = 15; // 초 단위

    // SSE 연결 생성 및 초기화
    public SseEmitter createEmitter(Integer userSeq) {
        // 고유 세션 ID 생성 (동일 사용자의 여러 연결 지원)
        String sessionId = userSeq + "_" + UUID.randomUUID().toString();
        log.info("SSE 연결 요청 → userSeq: {}, sessionId: {}", userSeq, sessionId);

        // 기존 연결 종료
        closeExistingConnection(userSeq);

        // 새 연결 생성 및 설정
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(userSeq, emitter);

        // 연결 이벤트 핸들러 등록 및 하트비트 스케줄러 설정
        setupEmitterWithHeartbeat(userSeq, emitter);

        // 초기 데이터 전송
        try {
            sendInitialData(userSeq, emitter);
        } catch (Exception e) {
            log.error("초기 데이터 전송 실패: {}", e.getMessage());
            emitter.completeWithError(e);
            return null;
        }

        return emitter;
    }

    // 클라이언트에 이벤트 알림
    public void notifyClient(Integer userSeq, String eventName, Object data) {
        SseEmitter emitter = emitterRepository.getEmitter(userSeq);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
                log.debug("{} 이벤트를 userSeq: {}에게 전송 완료", eventName, userSeq);
            } catch (IOException e) {
                log.error("{} 이벤트 전송 실패: {}", eventName, e.getMessage());
                cleanup(userSeq, null);
            }
        }
    }

    // Ping 테스트로 연결 상태 확인
    public boolean testConnection(Integer userSeq) {
        SseEmitter emitter = emitterRepository.getEmitter(userSeq);
        if (emitter == null) {
            return false;
        }

        try {
            emitter.send(SseEmitter.event().name("ping").data("pong"));
            return true;
        } catch (IOException e) {
            log.error("Ping 실패 - 연결이 끊어졌습니다: {}", e.getMessage());
            cleanup(userSeq, null);
            return false;
        }
    }

    // 읽지 않은 알림 개수 업데이트 알림
    public void updateUnreadCount(Integer userSeq) {
        try {
            long unreadCount = alarmService.getUnreadCount(userSeq);
            notifyClient(userSeq, "unread", Map.of("count", unreadCount));
        } catch (Exception e) {
            log.error("읽지 않은 알림 수 업데이트 실패: {}", e.getMessage());
        }
    }

    // 기존 연결 종료
    private void closeExistingConnection(Integer userSeq) {
        SseEmitter existingEmitter = emitterRepository.getEmitter(userSeq);
        if (existingEmitter != null) {
            existingEmitter.complete();
            emitterRepository.remove(userSeq);
            log.debug("기존 연결 종료 완료 - userSeq: {}", userSeq);
        }
    }

    // 이미터 설정 및 하트비트 설정
    private void setupEmitterWithHeartbeat(Integer userSeq, SseEmitter emitter) {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

        // 연결 완료 이벤트
        emitter.onCompletion(() -> {
            log.info("SSE 연결 완료 → userSeq: {}", userSeq);
            cleanup(userSeq, scheduler);
        });

        // 연결 타임아웃 이벤트
        emitter.onTimeout(() -> {
            log.info("SSE 연결 타임아웃 → userSeq: {}", userSeq);
            emitter.complete();
            cleanup(userSeq, scheduler);
        });

        // 오류 발생 이벤트
        emitter.onError((e) -> {
            log.warn("SSE 연결 오류 → userSeq: {}, error: {}", userSeq, e.getMessage());
            emitter.complete();
            cleanup(userSeq, scheduler);
        });

        // 하트비트 스케줄러 설정
        scheduler.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("ping"));
                log.debug("Heartbeat sent to userSeq: {}", userSeq);
            } catch (IOException e) {
                log.warn("Heartbeat failed, closing connection for userSeq: {}", userSeq);
                emitter.complete();
                cleanup(userSeq, scheduler);
            }
        }, 0, HEARTBEAT_INTERVAL, TimeUnit.SECONDS);
    }

    // 리소스 정리
    private void cleanup(Integer userSeq, ScheduledExecutorService scheduler) {
        emitterRepository.remove(userSeq);
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
        }
        log.debug("SSE 리소스 정리 완료 - userSeq: {}", userSeq);
    }

    // 초기 데이터 전송
    private void sendInitialData(Integer userSeq, SseEmitter emitter) throws IOException {
        // 연결 정보 전송
        emitter.send(SseEmitter.event()
                .name("connect")
                .data(ConnectionInfoDto.builder()
                        .userId(userSeq)
                        .connectedAt(LocalDateTime.now().toString())
                        .activeUsers(emitterRepository.countEmitters())
                        .status("CONNECTED")
                        .build()));

        // 읽지 않은 알림 개수 전송
        long unreadCount = alarmService.getUnreadCount(userSeq);
        emitter.send(SseEmitter.event()
                .name("unread")
                .data(Map.of("count", unreadCount)));

        // 최근 알림들 전송
        List<Alarm> recentAlarms = alarmService.getRecentAlarms(userSeq, 5);
        if (!recentAlarms.isEmpty()) {
            emitter.send(SseEmitter.event()
                    .name("recent-alarms")
                    .data(recentAlarms));
        }

        log.debug("초기 데이터 전송 완료 - userSeq: {}", userSeq);
    }

    // 현재 활성화된 연결 수 조회
    public int getActiveConnectionCount() {
        return emitterRepository.countEmitters();
    }
}