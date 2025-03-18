package com.c202.luckyNumber.controller;

import com.c202.dto.ResponseDto;
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
    public ResponseEntity<ResponseDto<Object>> generateLuckyNumber(@RequestHeader("X-User-Seq") int userSeq){
        luckyNumberService.createLuckyNumber(userSeq);
        return ResponseEntity.ok(ResponseDto.success(201, "행운 번호 생성 성공"));
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<String>>> getLuckyNumbers(@RequestHeader("X-User-Seq") int userSeq){
        return ResponseEntity.ok(ResponseDto.success(200,"행운 번호 조회 성공", luckyNumberService.getLuckyNumber(userSeq)));
    }
}
