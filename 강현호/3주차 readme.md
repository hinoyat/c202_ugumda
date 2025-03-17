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