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
