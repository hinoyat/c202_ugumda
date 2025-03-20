package com.c202.subscribe.controller;

import com.c202.dto.ResponseDto;
import com.c202.subscribe.service.SubscribeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscribeController {

    private final SubscribeService subscribeService;

    // 구독할 사람의 userSeq를 path variable로 설정
    @PostMapping("/{subscribedSeq}")
    public ResponseEntity<ResponseDto<Void>> subscribe(@RequestHeader("X-User-Seq") Integer subscriberSeq, @PathVariable Integer subscribedSeq) {
        subscribeService.subscribe(subscriberSeq, subscribedSeq);
        return ResponseEntity.ok(ResponseDto.success(200, "구독 완료"));
    }

    // 구독해제 사람의 userSeq를 path variable로 설정
    @DeleteMapping("/{subscribedSeq}")
    public ResponseEntity<ResponseDto<Void>> unsubscribe(@RequestHeader("X-User-Seq") Integer subscriberSeq, @PathVariable Integer subscribedSeq) {
        subscribeService.unsubscribe(subscriberSeq, subscribedSeq);
        return ResponseEntity.ok(ResponseDto.success(200, "구독 삭제 완료"));
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<Integer>>> getSubscriptions(@RequestHeader("X-User-Seq") Integer userSeq){
        List<Integer> subscriptions = subscribeService.getSubscriptions(userSeq); // userSeq가 구독한 목록 조회
        return ResponseEntity.ok(ResponseDto.success(200, "구독 목록 조회 완료", subscriptions));
    }
}