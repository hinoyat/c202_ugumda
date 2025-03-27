package com.c202.notification.listener;

import com.c202.notification.emitter.EmitterRepository;
import com.c202.notification.model.AlarmMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Slf4j
@RabbitListener
@RequiredArgsConstructor
public class AlarmListener {

    private final EmitterRepository emitterRepository;

    @RabbitListener(queues = "alarm.created.queue")
    public void handleAlarmMessage(final AlarmMessageDto alarmMessage) {
        log.info("Received alarm message: {}", alarmMessage);

        SseEmitter emitter = emitterRepository.getEmitter(alarmMessage.getUserSeq());

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("alarm")
                        .data(alarmMessage));

            } catch (IOException e) {
                log.error("에러러러{}", e.getMessage());
                emitterRepository.remove(alarmMessage.getUserSeq());
            }
        } else {
            log.info("SSE 연결 없음 userSeq: {}", alarmMessage.getUserSeq());
        }
    }

}
