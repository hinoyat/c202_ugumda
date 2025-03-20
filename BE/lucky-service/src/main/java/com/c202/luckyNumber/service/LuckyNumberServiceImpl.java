package com.c202.luckyNumber.service;

import com.c202.exception.CustomException;
import com.c202.luckyNumber.entity.LuckyNumber;
import com.c202.luckyNumber.repository.LuckyNumberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LuckyNumberServiceImpl implements LuckyNumberService {
    private final LuckyNumberRepository luckyNumberRepository;

    @Override
    @Transactional
    public void createLuckyNumber(Integer userSeq) {
        if (luckyNumberRepository.findByUserSeq(userSeq).isPresent()) {
            throw new CustomException("오늘은 이미 생성된 행운 번호가 있습니다");
        }

        List<Integer> luckyNumbers = generateLuckyNumbers();

        LuckyNumber luckyNumber = LuckyNumber.builder()
                .userSeq(userSeq)
                .number1(luckyNumbers.get(0))
                .number2(luckyNumbers.get(1))
                .number3(luckyNumbers.get(2))
                .number4(luckyNumbers.get(3))
                .number5(luckyNumbers.get(4))
                .number6(luckyNumbers.get(5))
                .build();

        luckyNumberRepository.save(luckyNumber);
    }

    @Override
    public List<String> getLuckyNumber(Integer userSeq) {
        return luckyNumberRepository.findByUserSeq(userSeq)
                .map(luckyNumber -> List.of(
                        String.valueOf(luckyNumber.getNumber1()),
                        String.valueOf(luckyNumber.getNumber2()),
                        String.valueOf(luckyNumber.getNumber3()),
                        String.valueOf(luckyNumber.getNumber4()),
                        String.valueOf(luckyNumber.getNumber5()),
                        String.valueOf(luckyNumber.getNumber6())
                ))
                .orElse(List.of());
    }

    private List<Integer> generateLuckyNumbers() {
        return new Random().ints(1, 46)
                .distinct()
                .limit(6)
                .boxed()
                .collect(Collectors.toList());
    }
}