package com.c202.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "alarm.exchange";
    public static final String QUEUE_NAME = "alarm.created.queue";
    public static final String ROUTING_KEY = "alarm.created";

    @Bean
    public Queue alarmQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange alarmExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding alarmBinding() {
        return BindingBuilder
                .bind(alarmQueue())
                .to(alarmExchange())
                .with(ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }

}
