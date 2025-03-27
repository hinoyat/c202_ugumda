package com.c202.message.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserCreatedListener {

    @RabbitListener(queues = "user.created.queue")
    public void handleUserCreated(String message) {
        log.info("User created: {}", message);
    }
}
