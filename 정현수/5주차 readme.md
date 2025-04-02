# 2025-3-31 월요일
## 1. RabbitMQ 사용
- 서비스 간 연결을 느슨하게 하기 위해 사용
- 비동기 처리로 부하를 줄이기 위해 사용
- (서비스를 유연하게, 장애에 강하고, 추후 확장이 쉬움)

### Kafka ?
- 프로젝트 내에서 서비스 간 이벤트 전달(탈퇴 -> 구독 삭제)
- 대량 스트림X
- 실시간으로 처리를 끝내고 싶음
- 개발, 운영 편리함 우선선
- 따라서 Kafka가 아닌 RabbitMQ를 사용함함

## 2. 사용자 탈퇴시 구독 취소
### RabbitMQ는 크게 4가지 요소로 구성됨
- Producer -> Exchange -> Queue -> Consumer
- Producer : 메시지를 보내는 쪽
- Exchange : 메시지를 받아서, 어떤 Queue로 보낼지 결정 (라우팅팅)
- Queue : 메시지를 보관하고, 나중에 Consumer가 가져감
- Consumer : 메시지를 받아서 처리

### user-service의 config
```
package com.c202.user.user.config;


import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitProducerConfig {

    @Bean
    public Exchange userExchange() {
        return ExchangeBuilder.topicExchange("user.event.exchange").durable(true).build();
    }
}
```
- user.event.exchange라는 이름의 토픽 기반 익스체인지를 등록해서, user-service에서 발생하는 이벤트 메시지를 RabbitMQ로 보내기 위한 준비를 하는 설정정

### userServiceImpl
```

        rabbitTemplate.convertAndSend("user.event.exchange", "user.withdrawn", userSeq);
```
- 익스체인지 설정을 실제로 메시지 전송하는 부분
- userSeq를 user.withdrawn이라는 라우팅 키로 user.event.exchange에 발행(publish) 한다

### subscrib-service의 config
```
package com.c202.subscribe.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConsumerConfig {

    @Bean
    public Exchange userExchange() {
        return ExchangeBuilder.topicExchange("user.event.exchange").durable(true).build();
    }

    @Bean
    public Queue userWithdrawnQueue() {
        return QueueBuilder.durable("user.withdrawn.queue").build();
    }

    @Bean
    public Binding userWithdrawnBinding() {
        return BindingBuilder.bind(userWithdrawnQueue())
                .to(userExchange())
                .with("user.withdrawn")
                .noargs();
    }
}
```
- Consumer의 설정
- Producer랑 똑같이 user.event.exchange를 정의하고,
- 큐를 선언하고, 큐와 익스체인지를 라우팅키(withdrawn)로 바인딩

### subscribeServiceImpl
```
    @RabbitListener(queues = "user.withdrawn.queue")
    @Transactional
    public void handleUserWithdrawn(Integer userSeq) {
        log.info("유저 탈퇴 이벤트 수신: userSeq = {}", userSeq);
        subscribeRepository.deleteBySubscriberSeq(userSeq);
        log.info("구독 정보 삭제 완료: userSeq = {}", userSeq);
    }
```
- user.withdrawn.queue 큐로부터 유저 탈퇴 메시지를 받아서, 해당 유저의 구독정보를 DB에서 삭제

## 3. 구독 목록 조회시 구독자들 정보 추가
- 서비스는 MSA 구조로 이루어져있는데, 구독 서비스에서는 subscribedSeq만 존재하고, 닉네임이나 아이콘같은 프로필 정보가 없었음
- 프론트 쪽에서 닉네임, 아이콘 같은 프로필 정보를 요구함
- 따라서, 프로필 정보를 가지고 있는 user-service의 api를 사용해야 했음
- WebClient(다른 마이크로서비스에서 필요한 데이터를 REST API로 가져오기 위해) 사용)

### webclient
- WebClient는 Spring에서 권장하는 비동기/논블로킹 HTTP 통신 도구
- MSA 환경에서 API 호출, 이벤트 연동, 외부 서비스 연동 등에 적합하게 설계된 Client

```
    @Override
    public List<SubscriptionProfileDto> getSubscriptions(Integer subscriberSeq) {
        if (subscriberSeq == null) {
            throw new BadRequestException("구독자 정보가 유효하지 않습니다.");
        }
        // 1. 구독 대상 seq 목록 가져오기
        List<Integer> subscribedSeqList = subscribeRepository.findBySubscriberSeq(subscriberSeq)
                .stream()
                .map(Subscribe::getSubscribedSeq)
                .distinct()
                .collect(Collectors.toList());

        log.info("subscriberSeq = {}, subscribedSeqList = {}", subscriberSeq, subscribedSeqList);

        // 2. bulk 요청으로 user profile 조회
        Map<String, Object> response = webClientBuilder
                .baseUrl("http://user-service")
                .build()
                .post()
                .uri("/api/users/profiles")
                .bodyValue(subscribedSeqList)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorMap(ex -> new WebClientCommunicationException("WebClient 통신 에러: " + ex.getMessage()))
                .block();

        List<Map<String, Object>> profiles = (List<Map<String, Object>>) response.get("data");

        // 3. profile map 으로 변경
        Map<Integer, Map<String, Object>> profileMap = profiles.stream()
                .collect(Collectors.toMap(
                        p -> (Integer) p.get("userSeq"),
                        p -> p
                ));

        // 4. 구독 정보 + 프로필 합쳐서 반환
        return subscribedSeqList.stream()
                .map(subscribedSeq -> {
                    Map<String, Object> profile = profileMap.getOrDefault(subscribedSeq, null);
                    String nickname = profile != null ? (String) profile.getOrDefault("nickname", "알 수 없음") : "알 수 없음";
                    Integer iconSeq = profile != null ? (Integer) profile.getOrDefault("iconSeq", 0) : 0;

                    return SubscriptionProfileDto.builder()
                            .subscribedSeq(subscribedSeq)
                            .nickname(nickname)
                            .iconSeq(iconSeq)
                            .build();
                })
                .collect(Collectors.toList());
    }
    ```


# 2025-04-01 화요일

# 2025-04-02 수요일