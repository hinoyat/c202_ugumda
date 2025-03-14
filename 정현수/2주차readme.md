# 2025-03-10 월요일

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

# 2025-03-11 화요일
## Spring Cloud Gateway & Eureka 기반 아키텍처 정리

### 1. Gateway의 필터 설정

- Global Filter(전역)
- Custom Filter(서비스 별)

Global Filter

- 모든 요청에 적용되는 필터
- JWT 적용 가능
- 캐싱 전략으로 성능 최적화 가능

Custom Filter

- 특정 서비스에만 적용되는 필터

### 2. Netty(SCG)와 Tomcat 차이

Tomcat


![image-2.png](./images/image-2.png)

- nio : non blocking io
- exec-1, exec-2등 뒤에 붙은 번호는 스레드 번호
- 이처럼 tomcat은 다른 스레드가 **동기적**으로 실행됨

Netty(Spring Cloud Gateway)

![image-1.png](./images/image-1.png)

- nio-2, 2, .. 뒤에 붙은 스레드 번호가 동일함
- 이처럼 Netty(SCG)는 하나의 스레드가 비동기적으로 실행됨
- 단, 비동기라서 순서대로 진행되어 오래 걸림

⇒ 캐싱 전략 사용 & RDB 사용 X

- DoS로 스레드를 소모시키는 공격 당할 수도 있음(성능 저하)

### 3. Eureka를 활용한 동적 서비스 확장

- Spring Cloud Gateway는 Eureka와 연동하여 서비스를 동적으로 관리할 수 있음
- Gateway는 30초마다 Eueka에서 서비스 목록을 가져와 동기화함
- 동적으로 Scale-out(서버가 늘어나면 자동 반영)
- Eureka에 이벤트 리스너 등록하여 자동으로 확장이 가능

(보통 Eureka 서버 2개, Gateway 서버 2개를 띄워 한 쪽이 다운되더라도 로드 밸런싱이 가능하게 설계함)

### 4. API Gateway & Eureka 통합 아키텍처

다음과 같은 흐름으로 동작함

1. user-service, diary-service가 실행되면 Eureka 서버에 등록됨
2. Gateway가 30초마다 Eureka에서 최신 서비스 목록을 동기화
3. 클라이언트가 Gateway로 요청
4. Gateway는 Eureka에서 user-service의 주소를 가져와 요청을 전달
5. JWT 검증등의 필터를 거쳐 서비스로 전달

# 2025-03-12 수요일
1. Eureka 서버 설정 완료
2. Gateway 서버 설정 완료

# 2025-03-13 목요일
1. Gateway JWT 필터 분리
2. luck-service(행운 번호 서비스) CRUD 생성

