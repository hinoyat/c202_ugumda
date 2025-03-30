package com.c202.notification.controller;

import com.c202.notification.entity.Alarm;
import com.c202.notification.service.AlarmService;
import com.c202.notification.service.SseEmitterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")  // 설정 파일에서 CORS 설정을 가져옴
public class NotificationController {

    private final SseEmitterService sseEmitterService;
    private final AlarmService alarmService;

    // SSE 연결 생성 및 초기화
    @GetMapping(value = "/subscribe/{userSeq}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Integer userSeq) {
        return sseEmitterService.createEmitter(userSeq);
    }

    // 연결 정보 조회
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getConnectionInfo() {
        return ResponseEntity.ok(Map.of(
                "activeConnections", sseEmitterService.getActiveConnectionCount(),
                "serverTime", LocalDateTime.now().toString()
        ));
    }

    // 연결 상태 확인
    @GetMapping("/ping/{userSeq}")
    public ResponseEntity<?> pingConnection(@PathVariable Integer userSeq) {
        boolean isActive = sseEmitterService.testConnection(userSeq);

        if (isActive) {
            return ResponseEntity.ok(Map.of("message", "연결이 활성화되어 있습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("message", "연결이 존재하지 않습니다."));
        }
    }

    // 사용자의 알림 목록 조회
    @GetMapping("/list/{userSeq}")
    public ResponseEntity<List<Alarm>> getAlarms(@PathVariable Integer userSeq) {
        try {
            return ResponseEntity.ok(alarmService.getAlarms(userSeq));
        } catch (Exception e) {
            log.error("알림 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 사용자의 알림 목록을 페이지네이션으로 조회
    @GetMapping("/list/{userSeq}/page")
    public ResponseEntity<Map<String, Object>> getPagedAlarms(
            @PathVariable Integer userSeq,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            return ResponseEntity.ok(alarmService.getPagedAlarms(userSeq, page, size));
        } catch (Exception e) {
            log.error("페이지 알림 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 특정 알림을 읽음 처리
    @PutMapping("/read/{alarmId}")
    public ResponseEntity<?> markAsRead(@PathVariable Integer alarmId) {
        try {
            Alarm alarm = alarmService.markAsRead(alarmId);
            sseEmitterService.updateUnreadCount(alarm.getUserSeq());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("알림 읽음 처리 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 사용자의 모든 알림을 읽음 처리
    @PutMapping("/read-all/{userSeq}")
    public ResponseEntity<?> markAllAsRead(@PathVariable Integer userSeq) {
        try {
            alarmService.markAllAsRead(userSeq);
            sseEmitterService.notifyClient(userSeq, "unread", Map.of("count", 0L));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("모든 알림 읽음 처리 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 특정 알림 삭제
    @DeleteMapping("/{alarmId}")
    public ResponseEntity<?> deleteAlarm(@PathVariable Integer alarmId) {
        try {
            Integer userSeq = alarmService.deleteAlarm(alarmId);
            if (userSeq != null) {
                long unreadCount = alarmService.getUnreadCount(userSeq);
                sseEmitterService.notifyClient(userSeq, "alarm-deleted", Map.of(
                        "alarmId", alarmId,
                        "unreadCount", unreadCount
                ));
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("알림 삭제 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 사용자의 모든 알림 삭제
    @DeleteMapping("/all/{userSeq}")
    public ResponseEntity<?> deleteAllAlarms(@PathVariable Integer userSeq) {
        try {
            alarmService.deleteAllAlarms(userSeq);
            sseEmitterService.notifyClient(userSeq, "all-alarms-deleted", Map.of("userSeq", userSeq));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("모든 알림 삭제 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 읽지 않은 알림 개수 조회
    @GetMapping("/unread/{userSeq}")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Integer userSeq) {
        try {
            return ResponseEntity.ok(Map.of("count", alarmService.getUnreadCount(userSeq)));
        } catch (Exception e) {
            log.error("읽지 않은 알림 개수 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}