# 2025-03-27 목요일
### 개발
- Guestbook 기능 개발 및 AI 예외 처리 추가
- 꿈 해몽(DreamMeaning) 서비스에 AI 호출 실패에 대한 예외처리 적용
- AiCallFailedException 정의 및 적용
- Daily Fortune 서비스에도 동일한 AI 예외 처리 적용
- dreamMeaning 삭제 시 userSeq 검증 강화
- writer 본인만 삭제 가능하도록 검증 및 예외처리 적용

### 배운 점
- Spring AI 사용 시 외부 API 실패 케이스를 항상 대비해야 함
- WebClient로 다른 마이크로서비스와 연동할 때 header, pathVariable 활용 방법
- 서비스 간 의존성이 필요한 경우 DTO를 꼭 entity에 저장하지 않아도 됨 (조회 시만 사용 가능)

### 느낌 점
- 하나의 서비스라도 실무에서 쓰려면 다양한 예외 처리와 권한 검증이 필수적임
- MSA 환경에서는 WebClient를 자유자재로 다룰 줄 알아야 한다는 것을 체감
- 작성자 정보는 반드시 최신화를 고려해야 하고, 저장 시점과 조회 시점을 잘 구분해야 함


# 2025-03-28 금요일
## 오늘 해결한 문제
방명록(Guestbook) 목록 조회 시 발생하는 N+1 문제

작성자(user) 정보를 조회할 때 guestbook 개수만큼 user-service에 개별 요청이 발생하는 문제

### 기존 구조
1. guestbook 목록 조회
2. guestbook N개
3. 각 guestbook에 대해 N번의 user-service HTTP 요청 발생

=> 방명록 개수 N → user-service 호출 N번 발생 (N+1 Problem)
```
for (Guestbook guestbook : guestbooks) {
    Map<String, Object> writerInfo = webClient.get()
        .uri("/api/users/{userSeq}/profile", guestbook.getWriterSeq())
        .retrieve()
        .bodyToMono(Map.class)
        .block();
}
```

### 문제점
- guestbook 100개면 user-service 호출 100번 발생
- 서비스 응답 속도 저하
- user-service 부하 심각 (N+1 Problem)
- MSA 환경에서 더욱 주의해야 함

### 개선 목표
- 여러 writerSeq를 모아서 한번에 조회
- Bulk Profile API 사용하여 user-service 호출 횟수 1회로 감소
- 성능 개선 및 트래픽 감소

### 개선 구조
1. guestbook 목록 조회
2. guestbook의 모든 writerSeq를 리스트로 추출 (중복 제거)
3. bulk profile API로 user-service에 한번에 요청
4. 받은 프로필 정보를 map으로 변환
5. guestbook에 profile을 매핑하여 반환

### 개선된 코드

```
// 1. 작성자 목록 수집
List<Integer> writerSeqList = guestbooks.stream()
        .map(Guestbook::getWriterSeq)
        .distinct()
        .collect(Collectors.toList());

// 2. bulk profile API 호출 (1회)
Map<String, Object> response = webClient.post()
        .uri("/api/users/profiles")
        .bodyValue(writerSeqList)
        .retrieve()
        .bodyToMono(Map.class)
        .block();

List<Map<String, Object>> profiles = (List<Map<String, Object>>) response.get("data");

// 3. userSeq → profile map 구성
Map<Integer, Map<String, Object>> profileMap = profiles.stream()
        .collect(Collectors.toMap(
            p -> (Integer) p.get("userSeq"),
            p -> p
        ));

// 4. guestbook에 프로필 매핑
guestbooks.stream()
    .map(guestbook -> {
        Map<String, Object> profile = profileMap.getOrDefault(guestbook.getWriterSeq(), null);
        ...
    })
```

### 배운 점
- 목록 조회 + 작성자 정보 구조에서 반드시 N+1 문제를 의심해야 한다
- MSA에서 다수의 user 정보를 다룰 때는 Bulk API를 적극 활용해야 한다
