<details>
  <summary><b>2025-03-24</b></summary>
</details>
<details>
<summary><b>2025-03-25 (MSA에서 동기 호출)</b></summary>

# MSA에서 동기 호출 방식 정리 (REST, Feign)

## 동기 방식이 적합한 이유

### 동기 방식 (REST, Feign)
- 실시간으로 데이터를 요청하여 현재의 최신 데이터를 정확히 얻을 수 있음.
- 코드 흐름이 직관적이고 유지보수하기 쉬움.
- 구조가 비교적 간단하여 빠른 개발 및 디버깅 가능.

### 비동기 방식 (RabbitMQ 등 메시지 브로커)
- 미리 메시지를 저장하여 데이터 준비 가능.
- 구조는 유연하지만 복잡성이 증가할 수 있음.
- 현재 최신 정보가 필요할 때는 적합하지 않음.

## 현재 프로젝트에서 동기 호출이 적절한 예시

| 상황                          | 동기 호출 여부 |
|-------------------------------|---------------|
| 유저 이름을 화면에 표시        | Yes           |
| 유저 프로필 이미지를 보여줌    | Yes           |
| 유저 권한 체크                | Yes           |
| 유저 정보 변경 감지 및 캐싱만  | No (비동기 적합) |

## 해야 할 작업 목록
- **user-service에 API 생성**  
  `GET /users/{userId}`

- **diary-service에서 FeignClient 호출**

  ```java
  @FeignClient(name = "user-service")
  public interface UserClient {
      @GetMapping("/users/{userId}")
      UserDto getUser(@PathVariable String userId);
  }
  ```

## 요약
현재 데이터를 즉각적으로 확인하는 경우에는 동기 호출이 더 적합하며, 구현이 쉽고 코드 흐름이 명확함.

</details>

<details>
<summary><b>2025-03-26 (Kafka 기초)</b></summary>

# Kafka 기본 개념 정리

## Kafka의 주요 구성 요소
- **Producer**: Kafka에 메시지를 발행하는 주체
- **Consumer**: 메시지를 읽어 처리하는 주체 (Consumer Group에 속함)
- **Broker**: Kafka 서버 (분산 환경에서 여러 대 운용 가능)
- **Topic**: 메시지를 카테고리화하는 큐(Queue)와 같은 개념
- **Partition**: Topic을 분할한 단위로, 병렬 처리 가능

## 메시지 흐름
```
Producer → [Topic (Partition)] → Consumer
```

## Kafka 특징
- 높은 처리량과 우수한 확장성
- 데이터의 내구성 보장 (디스크 저장)
- Consumer가 메시지 소비의 Offset 관리 가능
- 실시간 스트리밍 처리 지원

## 기본 활용 용도
- 로그 수집 및 처리
- 실시간 알림 및 이벤트 처리
- 데이터 파이프라인 구축 및 스트리밍 데이터 처리
</details>

<details>
<summary><b>2025-03-27 (RabbitMQ + SSE 알림 서비스 구축)</b></summary>

# RabbitMQ + SSE 기반 실시간 알림 시스템 구축

## 오늘의 목표
메시지 처리 기반의 실시간 알림 시스템을 RabbitMQ와 SSE를 활용하여 구현

## 구축한 시스템 구조
- `notification-service` 생성 및 구성
- RabbitMQ 설정 (`exchange`, `queue`, `routingKey`)
- SSE 기반의 실시간 알림 기능 구현
- AlarmListener 및 EmitterRepository 작성
- 브라우저에서 SSE 이벤트 수신 확인 완료

## 메시지 흐름
```
message-service → [RabbitMQ] → notification-service(listener) → SSE 전송
```

## 주요 코드 예시

### AlarmListener 구현 예시
```java
@RabbitListener(queues = "alarm.created.queue")
public void handleAlarmMessage(AlarmMessageDto alarmMessage) {
    SseEmitter emitter = emitterRepository.getEmitter(alarmMessage.getUserSeq());
    emitter.send(SseEmitter.event().name("alarm").data(alarmMessage));
}
```

### EmitterRepository 구성 예시
```java
private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();
```

## 발생했던 이슈 및 해결 과정
- JSON 직렬화 이슈 발생 → DTO에 기본 생성자, `@JsonProperty` 추가
- 사용자 식별자(userSeq) 타입 불일치 → Map 키 타입을 Integer로 수정
- 브라우저의 CORS 에러 → Controller에 `@CrossOrigin` 어노테이션 추가
- SSE 이벤트가 브라우저에서 수신되지 않음 → HTML 기반 테스트 페이지를 작성하여 해결

## 마무리
RabbitMQ와 SSE 연동을 통해 실시간 알림 시스템을 성공적으로 구축. 브라우저에서 "event: alarm" 메시지 수신까지 확인 완료.

</details>
