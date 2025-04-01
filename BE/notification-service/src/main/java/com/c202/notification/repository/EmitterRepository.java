package com.c202.notification.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Repository
public class EmitterRepository {

    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<Integer, Object> eventCache = new ConcurrentHashMap<>();

    // 사용자 ID에 해당하는 Emitter 저장
    public SseEmitter save(Integer userSeq, SseEmitter emitter) {
        log.info("새로운 Emitter 등록: userSeq={}", userSeq);
        emitters.put(userSeq, emitter);
        return emitter;
    }

    // 사용자 ID에 해당하는 이벤트 캐시 저장
    public void saveEventCache(Integer userSeq, Object event) {
        log.info("이벤트 캐시 저장: userSeq={}", userSeq);
        eventCache.put(userSeq, event);
    }

    // 특정 사용자의 Emitter 조회
    public SseEmitter getEmitter(Integer userSeq) {
        return emitters.get(userSeq);
    }

    // 특정 사용자의 Emitter 제거
    public void remove(Integer userSeq) {
        log.info("Emitter 제거: userSeq={}", userSeq);
        emitters.remove(userSeq);
    }

    // 현재 연결된 사용자 수 조회
    public int countEmitters() {
        return emitters.size();
    }
}