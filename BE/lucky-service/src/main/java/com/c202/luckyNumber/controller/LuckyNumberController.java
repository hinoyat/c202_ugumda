package com.c202.luckyNumber.controller;

import com.c202.luckyNumber.service.LuckyNumberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lucky-numbers")
@RequiredArgsConstructor
public class LuckyNumberController {

    private final LuckyNumberService luckyNumberService;

    @PostMapping
    public ResponseEntity<String> generateLuckyNumber(@RequestHeader("X-User-Seq") int userSeq){
        luckyNumberService.createLuckyNumber(userSeq);
        return ResponseEntity.ok("생성 완료");
    }

    @GetMapping
    public ResponseEntity<List<String>> getLuckyNumbers(@RequestHeader("X-User-Seq") int userSeq){
        return ResponseEntity.ok(luckyNumberService.getLuckyNumber(userSeq));
    }

    // TODO : 12시마다 삭제 (redis ttl)

}
