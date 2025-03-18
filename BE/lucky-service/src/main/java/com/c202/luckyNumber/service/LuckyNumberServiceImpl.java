package com.c202.luckyNumber.service;

import com.c202.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LuckyNumberServiceImpl implements LuckyNumberService {
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void createLuckyNumber(int userSeq) {
        List<Integer> luckyNumbers = generateLuckyNumbers();

        if (redisTemplate.opsForHash().hasKey("lucky_number:" + userSeq, "number1")) {
            throw new CustomException("이미 생성된 행운 번호가 있습니다");
        }

        for (int i = 0; i < luckyNumbers.size(); i++) {
            redisTemplate.opsForHash().put("lucky_number:" + userSeq, "number" + (i + 1), luckyNumbers.get(i).toString());
        }

        redisTemplate.expire("lucky_number:" + userSeq,  calculateTimeToMidnight(), TimeUnit.SECONDS);
    }

    @Override
    public List<String> getLuckyNumber(int userSeq) {
        List<Object> luckyNumbers = redisTemplate.opsForHash().values("lucky_number:" + userSeq);

        return luckyNumbers.stream()
                .map(String::valueOf)
                .collect(Collectors.toList());
    }

    private List<Integer> generateLuckyNumbers() {
        return new Random().ints(1, 46)
                .distinct()
                .limit(6)
                .boxed()
                .collect(Collectors.toList());
    }

    private long calculateTimeToMidnight() {
        long currentTimeMillis = System.currentTimeMillis() + TimeUnit.HOURS.toMillis(9); // 9시간을 더함

        long midnightMillis = (currentTimeMillis / 86400000) * 86400000 + 86400000;

        return (midnightMillis - currentTimeMillis) / 1000;
    }
}
