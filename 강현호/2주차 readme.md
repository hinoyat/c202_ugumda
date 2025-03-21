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

-----------------------------

<details>
<summary><b>2025-03-12(Srping의 bycript)</summary>

## Spring의 BCrypt 암호화

### 1. 암호화 기본 설명

- Spring의 PasswordEncoder를 통해 비밀번호를 암호화하여 DB에 저장.
- 암호화된 비밀번호는 관리자도 알 수 없는 형태로 저장됩니다.
- 예: 비밀번호 "1234"가 "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"와 같이 암호화됩니다.

### 2. BCrypt의 특징

- 매번 다른 해시 값 생성: 같은 비밀번호를 암호화해도 매번 다른 결과 생성.
- 솔트(Salt) 사용: 암호화 과정에 랜덤한 값을 추가하여 보안성을 높임.
- 복호화 불가능: 단방향 해시 함수이므로 원래 비밀번호로 되돌릴 수 없다.

### 3. 비밀번호 검증 방법

비밀번호 검증은 `matches()` 메서드를 사용:

```java
    @Override
    public TokenDto.TokenResponseDto login(LoginRequestDto request) {
        // 삭제된 계정인지 확인
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ServiceException.ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        // 비밀번호 체크 (passwordEncoder.matches() 사용)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ServiceException.AuthenticationException("잘못된 비밀번호입니다.");
        }
    }
```

### 4. BCrypt의 동작 원리

1. 암호화 시 솔트 생성: 비밀번호 암호화 시 랜덤한 솔트를 생성.
2. 해시 값 생성: 비밀번호와 솔트를 조합하여 해시 값을 생성.
3. 솔트 저장: 생성된 솔트를 해시 값과 함께 저장.
4. 검증 시 솔트 추출: 저장된 해시 값에서 솔트를 추출.
5. 비교: 입력된 비밀번호와 추출된 솔트로 새로운 해시를 생성하여 저장된 해시와 비교.

### 5. BCrypt의 장점

- 레인보우 테이블 공격 방지: 솔트 사용으로 인해 사전에 계산된 해시 테이블을 무력화합니다.
- 느린 해시 함수: 의도적으로 느리게 설계되어 무차별 대입 공격을 어렵게 만듭니다.
- 적응형 함수: 컴퓨팅 성능 향상에 따라 작업 계수(work factor)를 조정할 수 있습니다.

</details>




---------------------------------------
<details>
  <summary><b>2025-03-13(Lombok 생성자 어노테이션)</b></summary>

# Spring의 @Data 어노테이션

## 개념

@Data는 Lombok 라이브러리에서 제공하는 어노테이션으로, 여러  기능을 한 번에 포함.

## 포함된 기능
- @ToString
- @EqualsAndHashCode
- @Getter (모든 필드)
- @Setter (final이 아닌 모든 필드)
- @RequiredArgsConstructor

## 사용법

1. 클래스 레벨에 @Data 어노테이션을 추가.
2. 필요한 필드를 선언.
3. 추가적인 메서드나 생성자가 필요한 경우 직접 작성.

```java
import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String email;
}
```

## 주의해야 할 점

1. **엔티티에서의 사용 자제**: @Setter로 인해 안전성이 보장되지 않습니다!

2. **순환 참조 문제**: JPA에서 양방향 참조 시 @ToString으로 인해 순환 참조 문제가 발생.

3. **생성자 파라미터 순서**: @RequiredArgsConstructor 사용 시 생성자의 파라미터 순서에 주의해야 함.

4. **equals와 hashCode 메서드**: @EqualsAndHashCode로 인해 예기치 않은 동작이 발생할 수 있으므로, 필요한 경우 직접 구현.

5. **불변성 침해**: @Setter로 인해 객체의 불변성이 침해.

6. **과도한 기능 포함**: @Data는 여러 어노테이션을 포함하고 있어, 실제로 필요하지 않은 기능까지 생성.

7. **성능 고려**: 대규모 프로젝트에서는 @Data 사용을 자제하고, 필요한 어노테이션만 개별적으로 사용하는 것이 성능적으로 이득.

## 번외
@RequiredArgsConstructor는 Lombok 라이브러리에서 제공하는 어노테이션으로, 특정 조건을 만족하는 필드에 대한 생성자를 자동으로 생성해줍니다. 주요 특징은 다음과 같습니다:

1. 대상 필드:
   - 초기화되지 않은 final 필드
   - @NonNull로 표시된 필드 중 초기화되지 않은 필드

2. 생성자 생성:
   - 위 조건에 해당하는 필드들만을 매개변수로 갖는 생성자를 자동으로 생성합니다.

3. null 체크:
   - @NonNull로 표시된 필드에 대해 null 체크를 수행하며, null 값이 전달되면 NullPointerException을 발생시킵니다.

4. 매개변수 순서:
   - 생성자의 매개변수 순서는 클래스 내에서 필드가 선언된 순서를 따릅니다.

5. 스프링 의존성 주입:
   - 스프링 프레임워크에서 생성자 주입 방식의 의존성 주입을 간편하게 구현할 수 있습니다.

6. 코드 간소화:
   - 개발자가 직접 생성자를 작성하는 번거로움을 줄여줍니다.

## @RequiredArgsConstructor 사용 예제

```java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // final 또는 @NonNull 필드에 대한 생성자를 자동 생성
public class UserService {

    private final UserRepository userRepository; // 반드시 final이어야 생성자에 포함됨
    private final EmailService emailService;

    public void registerUser(String username, String email) {
        // 의존성 주입된 userRepository와 emailService 사용
        userRepository.save(new User(username, email));
        emailService.sendWelcomeEmail(email);
    }
}
```

### 생성된 생성자 (컴파일 후)
위 코드는 다음과 같은 생성자를 자동으로 생성합니다:

```java
// Lombok이 자동으로 생성하는 생성자
public UserService(UserRepository userRepository, EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
}
```

---

## @RequiredArgsConstructor와 @NonNull 사용 예제

`@NonNull` 필드를 사용하는 경우:

```java
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class OrderService {

    @NonNull
    private final PaymentService paymentService; // @NonNull로 null 체크 포함
    private final DiscountService discountService;

    public void processOrder(Order order) {
        paymentService.processPayment(order);
        if (discountService != null) {
            discountService.applyDiscount(order);
        }
    }
}
```

### 주의사항: @NonNull로 null 체크 포함

- `@NonNull`이 붙은 필드에 대해 null 값이 전달되면 **NullPointerException**이 발생합니다.
- 위 코드에서 `paymentService`가 null로 전달되면 런타임 시 다음과 같은 에러가 발생합니다:

```java
Exception in thread "main" java.lang.NullPointerException: paymentService is marked non-null but is null
```

---

## @RequiredArgsConstructor와 스프링 의존성 주입

스프링에서 **생성자 주입** 방식으로 의존성을 주입할 때 유용합니다. 아래는 스프링 컨텍스트에서 서비스 클래스에 의존성을 주입하는 예제입니다:

```java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository; // 스프링이 자동으로 주입

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
```

### 스프링에서의 동작 원리:
- 스프링 컨테이너가 `ProductRepository`를 Bean으로 등록하고, `@RequiredArgsConstructor`가 생성한 생성자를 통해 자동으로 주입합니다.

---

## @RequiredArgsConstructor 사용 시 주의사항 정리

1. **final 키워드 필수**:
   - `final` 키워드가 없는 필드는 생성자에 포함되지 않습니다.
   - 아래처럼 `final` 키워드가 없으면 의존성 주입이 누락될 수 있습니다:
     ```java
     private ProductRepository productRepository; // final이 없으므로 생성자에 포함되지 않음!
     ```

2. **필드 순서 변경 주의**:
   - 필드 선언 순서대로 생성자의 매개변수가 결정되므로, 순서를 변경하면 의도치 않은 문제가 발생할 수 있습니다.

3. **@Qualifier 사용 시 추가 설정 필요**:
   - 동일한 타입의 Bean이 여러 개인 경우 `@Qualifier`를 사용해야 합니다. 이때 Lombok만으로는 처리할 수 없으므로 직접 생성자를 작성하거나 설정 파일(`lombok.config`)을 수정해야 합니다.

4. **상속 관계에서는 사용 제한**:
   - 부모 클래스에서 상속받은 필드는 자동으로 생성된 생성자에 포함되지 않습니다.


</details>

---------------------------------------

<details>
  <summary><b>2025-03-14(Config Server)</b></summary>

# Spring Cloud Config Server


## 주요 특징

1. **중앙 집중식 설정 관리**: 모든 마이크로서비스의 설정을 한 곳에서 관리할 수 있습니다.

2. **외부 저장소 지원**: Git, JDBC, HashiCorp Vault 등 다양한 저장소를 설정 원본으로 사용 가능합니다.

3. **동적 설정 업데이트**: 서비스를 재배포하지 않고도 설정을 실시간으로 변경할 수 있습니다.

4. **환경별 설정 관리**: 개발, 테스트, 운영 등 다양한 환경에 대한 설정을 쉽게 관리할 수 있습니다.

## 작동 방식

1. 마이크로서비스가 시작될 때 Config Server에 설정 정보를 요청.

2. Config Server는 외부 저장소(예: Git)에서 최신 설정을 가져와 마이크로서비스에 제공.

3. 설정이 변경되면 각 마이크로서비스에 변경 사항 알려줍니다.

## 장점

- 설정의 일관성 유지
- 환경 간 설정 차이 최소화
- 버전 관리 시스템과 연동 가능
- 보안 강화 (민감한 정보 암호화 가능)

## 단점

- Config Server 장애 시 전체 시스템에 영향을 줍니다
- 추가적인 인프라 구성 필요

## 구현 방법

1. `spring-cloud-config-server` 의존성 추가
2. 메인 클래스에 `@EnableConfigServer` 어노테이션 추가
3. `application.yml`에 Git 저장소 등 설정 추가

```yaml
server:
  port: 8888
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-repo/config-repo
```

이렇게 Spring Cloud Config Server를 사용하면 복잡한 마이크로서비스 환경에서도 설정을 효율적으로 관리할 수 있고, 설정 변경이 필요할 때마다 각 서비스를 재배포할 필요 없이 중앙에서 한 번에 관리할 수 있다는 게 큰 장점입니다.


## 현재 프로젝트에서는 로컬 파일로 설정을 관리하고 있지만 배포 과정에서 git을 통해 관리하는 방법을 검토중입니다.

</details>
