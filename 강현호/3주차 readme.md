<details>
  <summary><b>2025-03-17(JWT Blacklist)</b></summary>

# JWT Blacklist with Redis

## Redis를 이용한 JWT Blacklist 구현 이유

1. **빠른 조회 속도**: Redis는 인메모리 데이터 저장소로, 디스크 기반 데이터베이스보다 훨씬 빠른 읽기/쓰기 속도를 제공.

2. **만료 시간 자동 관리**: Redis의 TTL(Time To Live) 기능을 활용하여 만료된 토큰을 자동으로 제거.

3. **분산 환경 지원**: Redis는 분산 시스템에서도 효과적으로 사용할 수 있어, 마이크로서비스 아키텍처에 적합.

4. **메모리 효율성**: 키-값 구조로 데이터를 저장하여 메모리를 효율적으로 사용.

## 구현 방법


## 장점

1. **즉각적인 토큰 무효화**: 사용자 로그아웃이나 보안 위협 감지 시 즉시 토큰을 무효화.

2. **유연한 관리**: 특정 토큰만 선별적으로 무효화할 수 있어 관리의 유연성이 높습니다.

3. **보안 강화**: 탈취된 토큰의 사용을 빠르게 차단하여 보안을 강화.

4. **확장성**: Redis의 분산 구조를 활용하여 시스템 확장이 용이.

## 단점

1. **추가 인프라 필요**: Redis 서버 구축 및 관리에 추가적인 리소스가 필요.

2. **복잡성 증가**: 시스템 아키텍처가 더 복잡해질 수 있음.

3. **네트워크 오버헤드**: 모든 요청마다 Redis를 조회해야 하므로 약간의 지연이 발생할 수 있음.

4. **데이터 일관성**: 분산 환경에서 데이터 동기화에 주의가 필요.

## 구현 시 고려사항

1. **만료 시간 설정**: JWT의 만료 시간과 일치하도록 Redis의 TTL을 설정해야 함.

2. **에러 처리**: Redis 연결 실패 등의 상황에 대한 적절한 에러 처리가 필요.

3. **성능 최적화**: 캐싱 전략을 활용하여 Redis 조회 횟수를 최소화할 수 있음.

4. **보안**: Redis 서버에 대한 적절한 보안 설정이 필요.


### 1. redis config 작성
```java
@Configuration
@EnableCaching
@Slf4j
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;


    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        log.info("Redis 연결 설정: {}:{}", redisHost, redisPort);
        return new LettuceConnectionFactory(redisHost, redisPort);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // 직렬화 설정 최적화
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 기본 직렬화
        redisTemplate.setDefaultSerializer(new StringRedisSerializer());

        // 트랜잭션 지원 활성화
        redisTemplate.setEnableDefaultSerializer(true);
        
        return redisTemplate;
    }
}

```


### 2. BlacklistService 작성
```java
@Service
@Slf4j
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final String BLACKLIST_PREFIX = "token:blacklist:";


    // 토큰 블랙리스트 추가
    public void addToBlacklist(String token, Date expirationTime) {
        try {
            long ttl = expirationTime.getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                String tokenHash = DigestUtils.sha256Hex(token);
                String key = BLACKLIST_PREFIX + tokenHash;
                redisTemplate.opsForValue().set(key, "blacklisted", ttl, TimeUnit.MILLISECONDS);
                log.info("토큰이 블랙리스트에 추가되었습니다 토큰해쉬{}. 남은 시간: {}ms",tokenHash, ttl);
            } else {
                log.info("이미 만료된 토큰입니다. 블랙리스트에 추가하지 않습니다.");
            }
        } catch (Exception e) {
            log.error("토큰 블랙리스트 추가 중 오류 발생: {}", e.getMessage(), e);
        }
    }


    
    // 토큰 블랙리스트 확인
    public boolean isBlacklisted(String token) {
        try {
            String tokenHash = DigestUtils.sha256Hex(token);
            String key = BLACKLIST_PREFIX + tokenHash;
            boolean isBlacklisted = Boolean.TRUE.equals(redisTemplate.hasKey(key));
            if (isBlacklisted) {
                log.debug("토큰이 블랙리스트에 있습니다: {}", token.substring(0, 10));
            }
            return isBlacklisted;
        } catch (Exception e) {
            log.error("토큰 블랙리스트 확인 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }

}

```

### 3. 사용

```java
    // 블랙리스트 추가
    public void blacklistToken(String token) {
        try {
            Date expirationDate = getTokenExpiration(token);

            tokenBlacklistService.addToBlacklist(token, expirationDate);
            log.info("Blacklisted token: " + token.substring(0, 10));

        } catch ( Exception e ) {
            log.error("토큰 추가 오류: {}", e.getMessage());
        }
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            if (tokenBlacklistService.isBlacklisted(token)) {
                log.warn("블랙리스트에 등록된 토큰입니다: {}", token.substring(0, 10));
                return false;
            }

            // 토큰 파싱 시도
            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);

            // 만료 확인
            boolean isValid = !claims.getBody().getExpiration().before(new Date());
            if (isValid) {
                log.debug("유효한 토큰: {}, 사용자: {}", token.substring(0, 10), claims.getBody().getSubject());
            } else {
                log.warn("만료된 토큰: {}", token.substring(0, 10));
            }
            return isValid;
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            log.error("잘못된 형식의 JWT 토큰: {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            log.error("유효하지 않은 JWT 서명: {}", e.getMessage());
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("잘못된 JWT 토큰: {}", e.getMessage());
            return false;
        }
    }

```

</details>

<details>
<summary><b>2025-03-18(예비군)</summary>
</details>

<details>
<summary><b>2025-03-19(SHA256)</b></summary>

# SHA-256 (Secure Hash Algorithm 256-bit)

## SHA-256이란?

SHA-256은 미국 국가안보국(NSA)에서 설계하고 미국 국립표준기술연구소(NIST)에서 2001년에 표준으로 발표한 암호화 해시 함수입니다. SHA-2 계열 중 일부로, 가장 널리 사용되는 해시 알고리즘 중 하나입니다.

## 주요 특징

1. **고정 출력 길이**: 입력 데이터의 크기와 상관없이 항상 256비트(32바이트)의 해시값을 생성합니다.

2. **일방향성**: 해시값으로부터 원본 데이터를 역산하는 것이 계산적으로 불가능합니다.

3. **충돌 저항성**: 서로 다른 두 입력값이 동일한 해시값을 생성할 확률이 극히 낮습니다.

4. **눈사태 효과**: 입력 데이터의 작은 변화도 완전히 다른 해시값을 생성합니다.

5. **결정론적**: 동일한 입력에 대해 항상 동일한 출력값을 생성합니다.

## 작동 원리

1. **전처리(Preprocessing)**:
   - 메시지에 패딩을 추가하여 512비트 블록의 배수가 되도록 합니다.
   - 원본 메시지 길이를 64비트 값으로 표현하여 마지막 블록에 추가합니다.

2. **초기 해시값 설정**:
   - 8개의 32비트 상수로 초기 해시값을 설정합니다.
   - 이 상수들은 처음 8개 소수(2, 3, 5, 7, 11, 13, 17, 19)의 제곱근에서 소수부분의 처음 32비트로 구성됩니다.

3. **메시지 처리**:
   - 메시지를 512비트 블록으로 나누어 처리합니다.
   - 각 블록은 64단계의 압축 함수를 통과합니다.
   - 압축 함수는 논리 연산(AND, OR, XOR, NOT), 비트 회전, 덧셈을 사용하여 해시값을 업데이트합니다.

4. **최종 해시값 생성**:
   - 모든 블록 처리 후, 8개의 32비트 워드를 연결하여 최종 256비트 해시값을 생성합니다.

## 활용 분야

1. **데이터 무결성 검증**: 파일 다운로드, 소프트웨어 배포 시 무결성 확인에 사용됩니다.

2. **비밀번호 저장**: 비밀번호를 평문으로 저장하지 않고 해시값으로 저장할 때 사용됩니다.

3. **디지털 서명**: 메시지의 해시값을 암호화하여 디지털 서명을 생성합니다.

4. **블록체인**: 트랜잭션 검증과 블록 연결에 사용됩니다.

5. **JWT 토큰**: 토큰의 서명에 사용되어 무결성을 보장합니다.

</details>


<details>
<summary><b>2025-03-20(JPA FetchType 전략)</summary>

## FetchType.LAZY (지연 로딩)

### 작동 방식

1. `DiaryTag` 엔티티를 조회할 때, `diary` 필드에는 실제 `Diary` 객체가 아닌 프록시(proxy) 객체가 담깁니다.
2. 이 프록시 객체는 실제 데이터를 가지고 있지 않지만, 필요할 때 데이터베이스에서 실제 객체를 로드할 수 있는 참조를 가지고 있습니다.
3. 코드에서 `diaryTag.getDiary().getTitle()`과 같이 실제로 Diary의 속성에 접근할 때만 데이터베이스 쿼리가 실행됩니다.

### 장점

1. **메모리 효율성**: 필요한 데이터만 로드하므로 메모리 사용량이 줄어듭니다.
2. **초기 로딩 속도**: 연관 엔티티를 즉시 로드하지 않으므로 초기 로딩 시간이 단축됩니다.
3. **불필요한 데이터 로딩 방지**: 연관 엔티티를 사용하지 않는 경우 데이터베이스에서 로드하지 않습니다.

### 장단점 요약

**지연 로딩(LAZY)**

- **장점**: 필요한 데이터만 가져오므로 메모리와 초기 로딩 시간을 절약할 수 있습니다.
- **단점**: 나중에 데이터에 접근할 때 추가 데이터베이스 조회가 필요하므로, 여러 개체에 반복 접근하면 느려질 수 있습니다.

**즉시 로딩(EAGER)**

- **장점**: 나중에 데이터에 접근할 때 추가 조회가 필요 없어 빠릅니다.
- **단점**: 필요하지 않은 데이터까지 모두 가져오므로 메모리 사용량이 증가하고 초기 로딩 시간이 길어질 수 있습니다.

대부분의 경우 지연 로딩(LAZY)을 사용하는 것이 효율적이지만, 항상 함께 사용되는 관련 데이터라면 즉시 로딩(EAGER)이 더 효율적일 수 있습니다.

FetchType.LAZY를 사용하면, DiaryTag만 조회하고 연결된 Diary는 아직 조회하지 않는 상태로 둡니다. 이렇게 하면 처음에 필요한 데이터만 가져와서 시스템 자원을 효율적으로 사용할 수 있습니다.

그런데 이후에 코드에서 `diaryTag.getDiary().getTitle()`처럼 실제로 Diary 정보가 필요해지는 시점이 되면, 그때 JPA가 자동으로 추가 쿼리를 실행해서 Diary 정보를 데이터베이스에서 가져옵니다. 이런 방식을 "지연 로딩"이라고 합니다.

반면 FetchType.EAGER를 사용하면, DiaryTag를 조회할 때 연결된 Diary 정보까지 한 번에 모두 가져옵니다. 나중에 Diary 정보가 필요하지 않더라도 무조건 함께 로딩하기 때문에, 데이터가 많을 경우 메모리를 더 많이 사용하게 됩니다.

두 방식의 선택은 애플리케이션의 특성에 따라 달라집니다:

- 거의 항상 연관 엔티티의 정보가 필요하다면 EAGER가 효율적일 수 있습니다
- 가끔만 연관 엔티티 정보가 필요하거나, 조건에 따라 필요할 때만 LAZY가 효율적입니다

JPA에서는 일반적으로 @ManyToOne 관계에서는 EAGER가 기본값이고, @OneToMany나 @ManyToMany 관계에서는 LAZY가 기본값입니다. 하지만 성능 최적화를 위해 개발자가 직접 설정을 변경하는 경우가 많습니다.

</details>
