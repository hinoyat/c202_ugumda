package com.c202.message.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.*;

@Configuration
public class RabbitMQConfig {

    public static final String USER_QUEUE = "user.created.queue";
    public static final String USER_EXCHANGE = "user.created.exchange";
    public static final String USER_ROUTING_KEY = "user.created.routing.key";

    @Bean
    public Queue userCreatedQueue() {
        return new Queue(USER_QUEUE, true);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(USER_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue userCreatedQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(userCreatedQueue)
                .to(exchange)
                .with(USER_ROUTING_KEY);
    }

}
