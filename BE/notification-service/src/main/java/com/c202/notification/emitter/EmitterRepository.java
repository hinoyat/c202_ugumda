package com.c202.notification.emitter;

import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmitterRepository {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(String userSeq, SseEmitter emitter) {
        emitters.put(userSeq, emitter);
    }

    public SseEmitter remove(String userSeq) {
        return emitters.remove(userSeq);
    }

    public SseEmitter getEmitter(String userSeq) {
        return emitters.get(userSeq);
    }

}
