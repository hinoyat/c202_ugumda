# 2025-03-06 화요일
- 아이디어 회의

# 2025-03-07 수요일
- 기획 회의

# 2025-03-06-목요일

## MSA
마이크로서비스 아키텍처(MSA)는 작고 독립적인 서비스들의 집합으로 구성된 애플리케이션 구조

## 프로젝트에 왜 도입하는 것인가 ?
- 여러 기능을 독립적으로 관리하고 확장 가능
- 꿈 프로젝트의 경우, 영상 AI를 사용하기 때문에 리소스를 많이 씀
- 따라서 MSA로 효율적으로 관리하고, 확장성 있는 시스템 구축 가능
- 장애 발생 시 다른 서비스에 영향을 주지 않아 안정성 높음
- 트래픽이 집중될 경우, scale out을 통해 해당 서비스만 별도로 확장 가능

## 프로젝트에 어떻게 도입할 것인가?
- 각각의 db를 테이블로 설계하는 것이 아닌 스키마로 생성

```
create DATABASE user_db;

use user_db;

CREATE TABLE users(
	user_seq INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL
);
```
```
create DATABASE diary_db;

use diary_db;

CREATE TABLE diary (
   diary_seq INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags VARCHAR(255),
    likes INT DEFAULT 0,
    is_public CHAR(1) DEFAULT 'Y',
    is_deleted CHAR(1) DEFAULT 'N'
);
```

- 두 테이블 모두 임시 사용
- spring.io에서 의존성을 추가하여 프로젝트 생성
![image.png](./image.png)

- Eureka 서버 설정
- Eureka 클라이언트 설정
- API Gateway 설정 (Spring Cloud Gateway)
.. 

## API gateway
- MSA 관리, 운영을 위한 플랫폼 패턴이며 해당 패턴에 필요한 기능들을 제공하는 서버

### 특징
- 인증과 인가
- API 요청 로드밸런싱 및 라우팅
- QoS(Quality of Service)
- 로깅 및 모니터링
- 입력 유효성 검사

### 장단점
- 애플리케이션 내부 구조 캡슐화
- 클라이언트, 애플리케이션 간 왕복 횟수가 감소하며, 클라이언트 코드 단순화
- 개발, 배포 및 관리해야 하는 지점 증가
- 개발 병목 현상

⇒ 단점에 비해 장점이 뚜렷하고 있기 때문에 MSA에서 API gateway는 반드시 필요한 요소

⇒ Spring Cloud Gateway

## Spring Cloud Gateway
- spring framework에서 제공하는 오픈 소스 기반의 gateway 서비스
- zuul의 패치 중단 → spring cloud gateway
- Netty(비동기 방식), Spring WebFlux 기반의 특징

