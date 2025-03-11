# 2025-03-11 월요일

## Spring Cloud Gateway와 Eureka

### 1. ID 정책명
- 각 라우팅 경로를 구분하기 위한 고유 식별자 설정
```
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route  # ID 정책명
          uri: lb://USER-SERVICE
```

### 2. URL 라우팅 위치
- URI를 통해 특정 서비스로 요청을 전달
- lb://는 Eureka를 이용한 로드밸런싱을 의미

```
uri:lb://ORDER-SERVICE # Eureka에서 등록한 서비스명 사용
```

### 3. Predicates (if문 역할)
- 특정 조건에 따라 라우팅 경로를 결정하는 기능
- Before : 특정 시간 이전에만 요청 허용
- After : 특정 시간 이후에만 요청 허용
- Between : 특정 시간 범위 내에서만 요청 허용
- Cookie : 특정 쿠키가 있을 때만 요청 허용

```
predicates:
  - Path=/api/users/**     # 특정 경로일 때만 라우팅
  - Before=2025-03-12T00:00:00+09:00  # 특정 날짜 이전만 허용
  - Cookie=SESSION_ID, abc123  # 특정 쿠키가 있을 때만 허용
```

- weight 전략 : 여러 인스턴스가 있을 때 특정 서비스로 트래픽을 분산하는 전략
- weight 값을 통해 트래픽의 비율을 조정
- 배포 전략 활용 
    - Canary 배포(새로운 버전의 서비스를 이룹 트래픽에만 적용해 테스트)
    - A/B 테스트(다른 서비스 버전으로 분할 트래픽)

```
routes:
  - id: user-service-v1
    uri: lb://USER-SERVICE
    predicates:
      - Path=/api/users/**
      - Weight=group1, 80  # 80% 트래픽 전달

  - id: user-service-v2
    uri: lb://USER-SERVICE
    predicates:
      - Path=/api/users/**
      - Weight=group1, 20  # 20% 트래픽 전달
```
- user-service-1은 80%의 트래픽을 받고,
- user-service-2는 20%의 트래픽을 받음
- 이를 통해 무중단 배포와 A/B 테스트가 가능능

### 4. Eureka 사용 : IP 등록
- Eureka : 서비스 디스커버리를 위한 레지스트리 서버
- 각 마이크로서비스가 Eureka에 자신의 IP를 등록
- Spring Cloud Gateway는 Eureka를 통해 서비스 위치(IP)를 조회
```
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true  # IP 기반 등록
```
- prefer-ip-address: true는 ip를 기준으로 Eureka에 등록하겠다는 설정
