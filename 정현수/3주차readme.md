# 2025-03-17 월요일

## common-module 도입
### 1. 공통 dto
```
@Getter
@Builder
public class ResponseDto<T> {
    private int status;
    private String message;
    private T data;

    public static <T> ResponseDto<T> success(int status, String message) {
        return ResponseDto.<T>builder()
                .status(status)
                .message(message)
                .build();
    }

    public static <T> ResponseDto<T> success(int status, String message, T data) {
        return ResponseDto.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .build();
    }

    public static ResponseDto<Void> error(int status, String message) {
        return ResponseDto.<Void>builder()
                .status(status)
                .message(message)
                .build();
    }
}
```

### 2. custom exception
```
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
```

### 3. global exception handler
```
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ResponseDto<Void>> handleCustomException(CustomException ex) {
        return ResponseEntity.status(400).body(ResponseDto.error(400, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto<Void>> handleGenericException(Exception e) {
        return ResponseEntity.status(500).body(ResponseDto.error(500, "서버 오류가 발생했습니다."));
    }
}
```

- common-module의 기능들을 사용하기 위해서는 다른 서비스의 pom.xml에 추가하고, import하여여 사용해야 한다.
- common-module에서 mvn install을 진행하면 C:\Users\SSAFY\.m2\repository\com\c202\common-module 이 생긴 것을 확인할 수 있다.
- 이처럼 로컬에 jar 파일이 저장이 되어야 다른 서비스에서 이 파일을 참조해서 사용할 수 있다.
- 서버 배포시에는 외부의 repository를 사용할지도 ..?

- exception는 다른 서비스에서 custom exception으로 감싸 globalexceptionhandler에서 처리할 수 있다.
- 이는 사용자가 데이터베이스 문제나 서버의 문제를 로그를 통해 알 수 있으면 안되기 때문에 캡슐화하는 것으로 볼 수 있다.

# 2025-03-18 화요일

## 방명록 서비스 도입
### 방명록 기능
- 방명록 목록 조회(자신)
- 방명록 목록 조회(타인)
- 방명록 삭제
- 방명록 추가

### 쿼리 최적화
- 기존에 isDelted = N을 먼저 조회한 후 ownerSeq를 찾는 방식에서, ownerSeq와 isDeleted를 동시에 조건으로 추가하여 더 효율적으로 쿼리로 개선하였다.
- `List<Guestbook> guestbooks = guestbookRepository.findByOwnerSeqAndIsDeleted(ownerSeq, "N");`

## lombok 버전 충돌 해결
- 각각의 프로젝트에서 lombok 버전이 혼용되어 `C:\Users\SSAFY\.m2\repository\org\projectlombok`을 확인해보니 unknown이 존재하고 다양한 버전이 있는 것을 확인하였다.
- 1.18.36 버전만 남기고 모두 삭제하고, 모든 프로젝트의 pom.xml에서 lombok 버전을 명시하였다.

## SecurityConfig 설정
- common-module에서 securityConfig를 추가하여 각 프로젝트에서 발생하던 401 오류를 해결하였다.
- global filter와 jwt filter가 존재하더라도, spring boot 내에서 기본적으로 security를 제공하기 때문에 각 프로젝트마다 필요한 config였다.
- 이를 common-module에서 구성하여 중복되는 코드를 줄일 수 있다.

### `@ComponentScan(basePackages = {"com.c202.*"})`
- 이를 application에서 추가해주어야 common-module의 @@RestControllerAdvice를 읽을 수 있다.
- 이에 프론트앤드가 편하게 디버그를 할 수 있다.
![image-3.png](./images/image-3.png)

## 에러 처리
```
// 1. 방명록이 없을 때
        Guestbook guestbook = guestbookRepository.findByGuestbookSeq(guestbookSeq);
        if (guestbook == null) {
            throw new CustomException("해당 방명록을 찾을 수 없습니다.");
        }

        // 2. 방명록이 이미 삭제된 상태인 경우
        if ("Y".equals(guestbook.getIsDeleted())) {
            throw new CustomException("이미 삭제된 방명록입니다.");
        }

        // 3. userSeq와 방명록의 writerSeq가 다른 경우
        if (!guestbook.getWriterSeq().equals(userSeq)) {
            throw new CustomException("방명록 삭제 권한이 없습니다.");
        }
```
- 에러를 세분화하여 좀 더 명확한 오류 메시지를 전달할 수 있도록 했다.

# 2025-03-19 수요일

## 방명록 서비스 수정
- eureka 등록
- config 등록
- gateway 등록

## lombok
- exclude 되어 있었던 pom.xml 수정

## MSA 서비스 확장 관련 문서 정리
- https://www.notion.so/1ba9ac6da02c80c4b986d2b7f003d626

## api 명세서 수정
![images/image-4.png](./images/image-4.png)


# 2025-03-20 목요일

## 1. MYSQL + 스케줄러 적용

### 기존 방식 (Redis TTL)
- 기존에는 행운 번호 생성시 12시까지 남은 시간을 계산하여 TTL로 설정하였다.
- 매번 12시까지의 시간을 계산해야 하므로 불필요한 서버 자원을 사용하였다.

### 개선된 방식 (MySQL + 스케줄러)
- 모든 데이터를 MySQL에 저장하고, 스케줄러를 사용하여 매일 자정에 일괄 삭제하는 방식으로 변경하였다.
- TTL을 계산할 필요 없어 서버 자원을 절약할 수 있고,
- 스케줄러를 단 한번 실행하는 것으로 모든 데이터를 쉽게 정리가 가능한 장점이 있다.

### 향후 개선 방향
- 현재는 행운 번호 서비스만 적용되었지만, 오늘의 운세 서비스에도 동일한 방식으로 확장 가능하다.
- 데이터가 백만 건 이상으로 증가할 경우 Spring Batch 적용을 고려할 수 있다.

## 2. `@NotNull` 을 활용한 유효성 검사 개선

### 기존 방식 (==null)
- 컨트롤러와 서비스 레이어에서 `if (userSeq == null)` 같은 조건을 사용해 매번 유효성 검사를 진행했다.
- 여러 곳에서 null 체크를 반복해야 해서 비효율적이고,
- 직접적으로 CustomException을 던져야 하므로 코드가 복잡해진다.
- 심지어 pathvariable로는 null값이 오지 않기 때문에 절대로 실행되지 않는 실효성 없는 코드였다.

### 개선된 방식 (`@NotNull` + `@Validated`)
```
@PostMapping
    public ResponseEntity<ResponseDto<Object>> generateLuckyNumber(
            @RequestHeader("X-User-Seq") @NotNull Integer userSeq) { 
        luckyNumberService.createLuckyNumber(userSeq);
        return ResponseEntity.ok(ResponseDto.success(201, "행운 번호 생성 성공"));
    }
```
- `NotNull`을 사용하면 Spring이 자동으로 유효성 검사를 수행하여 userSeq가 null이면 요청 자체를 차단한다.

### 향후 개선 방향
- `GlobalExceptionHandler`에서 `MethodArgumentNotValidException`을 처리하여 클라이언트가 이해하기 쉬운 메시지를 반환할 수 있다.
- 이처럼 전역 예외 핸들러에서 메시지를 통합 관리할 수 있어 유지보수성이 증가한다.

## 3. 구독 API
### 기존 방식
- 구독 생성/구독 해제 API 가 따로 존재하였다.
- 클라이언트에서 요청을 다르게 처리해야 하는 문제가 있었다.

### 개선된 방식
- 팀원들의 코드리뷰를 받아 수정하였다.
- 구독 상태 변경(PATCH) API로 변경하였다.
- RESTful하고, API 단순화, 유지보수성이 증가하는 장점을 가지게 되었다.
