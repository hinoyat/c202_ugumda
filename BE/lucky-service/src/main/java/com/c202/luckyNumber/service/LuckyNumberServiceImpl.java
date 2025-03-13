package com.c202.luckyNumber.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LuckyNumberServiceImpl implements LuckyNumberService {
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void createLuckyNumber(int userSeq) {
        List<Integer> luckyNumbers = new Random().ints(1, 46)
                .distinct() // 중복을 제거
                .limit(6)   // 6개 숫자만 선택
                .boxed()    // IntStream을 List<Integer>로 변환
                .collect(Collectors.toList());

        // Redis에 행운 번호 저장
        for (int i = 0; i < luckyNumbers.size(); i++) {
            redisTemplate.opsForHash().put("lucky_number:" + userSeq, "number" + (i + 1), luckyNumbers.get(i).toString());
        }
    }

    @Override
    public List<String> getLuckyNumber(int userSeq) {
        List<Object> luckyNumbers = redisTemplate.opsForHash().values("lucky_number:" + userSeq);

        // Redis에서 조회된 행운 번호 반환
        return luckyNumbers.stream()
                .map(String::valueOf)  // 숫자를 문자열로 변환
                .collect(Collectors.toList());
    }
}
