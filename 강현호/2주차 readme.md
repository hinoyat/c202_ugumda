<details>
  # 25.03.10 (월)
<summary><b>2025-03-10(Gradle VS Maven)</b></summary>

# Maven과 Gradle 개념 및 차이점

## Maven

### 개념
Maven은 Apache Software Foundation에서 개발한 Java 프로젝트 관리 및 빌드 도구. 주로 Java 개발에서 사용되며, 프로젝트의 빌드, 문서화, 의존성 관리, 보고서 생성 등을 지원.

Maven은 **Project Object Model (POM)**을 기반으로 하며, 프로젝트의 구조와 빌드 과정을 표준화합니다. POM은 XML 형식의 `pom.xml` 파일로 표현.

### 주요 기능
- **빌드 및 배포**: 프로젝트의 빌드, 테스트, 패키징, 배포를 자동화.
- **의존성 관리**: 프로젝트에 필요한 라이브러리를 자동으로 관리.
- **문서화**: 프로젝트 문서를 생성하고 관리.
- **플러그인 확장성**: 다양한 플러그인을 통해 기능 확장.

## Gradle

### 개념
Gradle은 Java, Kotlin, Groovy 등 다양한 언어로 개발된 빌드 자동화 도구입니다. Maven과 Apache Ant의 단점을 보완하여 개발.

Gradle은 Groovy나 Kotlin 기반의 **DSL(Domain Specific Language)**을 사용하여 빌드 스크립트를 작성합니다. 이는 XML보다 더 유연하고 표현력이 좋음.

### 주요 기능
- **INCREMENTAL BUILD**: 변경된 부분만 빌드하여 빌드 시간을 단축.
- **BUILD CACHE**: 이전 빌드 결과를 캐싱하여 빌드 속도를 향상시.
- **멀티 프로젝트 지원**: 복잡한 프로젝트 구조를 효율적으로 관리.
- **플러그인 확장성**: 다양한 플러그인을 통해 기능을 확장.

## Maven과 Gradle의 차이점

| **항목**               | **Maven**                          | **Gradle**                          |
|------------------------|------------------------------------|-------------------------------------|
| **빌드 스크립트 언어**  | XML 기반                           | Groovy, Kotlin 기반                |
| **유연성 및 커스터마이즈** | 표준화된 구조를 따르며 유연성이 적음 | 코드로 작성할 수 있어 유연성 높음   |
| **성능**               | 빌드 속도가 상대적으로 느림         | Incremental Build, Build Cache로 빠름 |
| **멀티 프로젝트 지원**  | 가능하지만 복잡함                  | 복잡한 구조도 쉽게 관리 가능       |
| **의존성 관리**         | 의존성 관리 가능, 제한적           | 더 유연하고 충돌 해결 기능 제공   |
| **커뮤니티 및 지원**    | 오랜 역사와 널리 사용됨             | Android 개발에서 주로 사용됨, 활발한 지원 |

## 결론
Maven은 표준화된 빌드 프로세스를 제공하며 안정적이고, Gradle은 유연성과 성능에서 강점.

</details>

---------------------------------------
<details>
  <summary><b>2025-03-11(GenerationType.IDENTITY와 GenerationType.AUTO 전략 비교)</b></summary>
# JPA의 GenerationType.IDENTITY와 GenerationType.AUTO 전략 비교

## GenerationType.AUTO

`GenerationType.AUTO`는 JPA가 데이터베이스의 종류와 방언(dialect)에 따라 가장 적합한 식별자 생성 전략을 자동으로 선택합니다.

### 작동 방식

- **MySQL**: 보통 `TABLE` 전략을 사용 (시퀀스 객체를 지원하지 않기 때문)
- **Oracle, PostgreSQL**: 주로 `SEQUENCE` 전략을 사용
- **H2**: 데이터베이스 모드에 따라 다름

### 시퀀스 테이블 생성 원인

MySQL에서는 시퀀스 객체를 지원하지 않기 때문에, Hibernate는 시퀀스를 시뮬레이션하기 위해 별도의 테이블(`diary_seq`)을 생성합니다. 이 테이블은 다음과 같은 역할을 합니다:

1. 각 엔티티 타입별로 다음 ID 값을 저장
2. ID를 획득하기 위해 추가 SELECT와 UPDATE 쿼리가 실행됨

```sql
sql
Copy
-- ID 획득 시 실행되는 쿼리 예시
SELECT next_val FROM diary_seq FOR UPDATE;
UPDATE diary_seq SET next_val = next_val + 1;

```

### 장점

- 데이터베이스 변경 시 코드 수정 없이 적합한 전략 사용 가능
- 데이터베이스 시스템에 독립적인 코드 작성 가능

### 단점

- MySQL에서는 추가 테이블 생성 및 추가 쿼리로 인한 성능 오버헤드
- 트랜잭션 내에서 새 ID를 얻기 위해 추가 쿼리 필요

## GenerationType.IDENTITY

`GenerationType.IDENTITY`는 데이터베이스의 자동 증가 컬럼을 사용합니다.

### 작동 방식

- MySQL의 `AUTO_INCREMENT`
- SQL Server의 `IDENTITY`
- PostgreSQL의 `SERIAL`

```sql
sql
Copy
CREATE TABLE Diary (
    diary_seq INT AUTO_INCREMENT PRIMARY KEY,
    ...
);

```

ID 생성은 완전히 데이터베이스에 위임되며, INSERT 실행 시 자동으로 값이 생성됩니다.

### 장점

- 별도의 테이블이나 시퀀스 객체가 필요 없음
- 단일 INSERT 쿼리로 처리됨 (추가 SELECT/UPDATE 없음)
- 구현이 단순하고 직관적임

### 단점

- JDBC 드라이버가 `getGeneratedKeys()` 메서드를 지원해야 함
- ID 값은 실제 INSERT 후에만 사용 가능 (영속성 컨텍스트 이슈)
- 일괄 처리(batch insert) 최적화가 어려움

## 핵심 차이점

1. **테이블 생성**:
    - `AUTO`: MySQL에서 시퀀스 테이블(`diary_seq`) 생성
    - `IDENTITY`: 별도 테이블 없음, 테이블 컬럼 자체에 AUTO_INCREMENT 적용
2. **ID 생성 시점**:
    - `AUTO`: 엔티티가 영속화되는 시점 (EntityManager.persist() 호출 시)
    - `IDENTITY`: 데이터베이스에 INSERT 쿼리가 실행된 후
3. **쿼리 실행**:
    - `AUTO`: ID 획득을 위한 별도 SELECT/UPDATE + INSERT 쿼리
    - `IDENTITY`: INSERT 쿼리만 실행
4. **성능**:
    - `AUTO`: 추가 쿼리로 인한 오버헤드 발생
    - `IDENTITY`: 단일 쿼리로 효율적, 다만 일괄 처리에서는 비효율적
5. **휴대성**:
    - `AUTO`: 다양한 DB 환경에서 쉽게 코드 이식 가능
    - `IDENTITY`: 특정 DB 기능에 의존
</details>

---------------------------------------
<details>
  <summary><b>2025-03-12(Lombok 생성자 어노테이션)</b></summary>

  

</details>

---------------------------------------
