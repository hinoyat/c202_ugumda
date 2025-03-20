package com.c202.luckyNumber.service;

import com.c202.exception.CustomException;
import com.c202.luckyNumber.entity.LuckyNumber;
import com.c202.luckyNumber.repository.LuckyNumberRepository;
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
    public void createLuckyNumber(int userSeq) {
        // 이미 생성된 행운 번호가 있는지 확인
        if (luckyNumberRepository.findByUserSeq(userSeq).isPresent()) {
            throw new CustomException("이미 생성된 행운 번호가 있습니다");
        }

        // 행운 번호 생성
        List<Integer> luckyNumbers = generateLuckyNumbers();

        // 행운 번호 데이터베이스에 저장
        LuckyNumber luckyNumber = new LuckyNumber();
        luckyNumber.setUserSeq(userSeq);
        luckyNumber.setNumber1(luckyNumbers.get(0));
        luckyNumber.setNumber2(luckyNumbers.get(1));
        luckyNumber.setNumber3(luckyNumbers.get(2));
        luckyNumber.setNumber4(luckyNumbers.get(3));
        luckyNumber.setNumber5(luckyNumbers.get(4));
        luckyNumber.setNumber6(luckyNumbers.get(5));

        luckyNumberRepository.save(luckyNumber);
    }

    @Override
    public List<String> getLuckyNumber(int userSeq) {
        // 사용자에 해당하는 행운 번호 조회
        LuckyNumber luckyNumber = luckyNumberRepository.findByUserSeq(userSeq)
                .orElseThrow(() -> new CustomException("행운 번호가 없습니다"));

        return List.of(
                String.valueOf(luckyNumber.getNumber1()),
                String.valueOf(luckyNumber.getNumber2()),
                String.valueOf(luckyNumber.getNumber3()),
                String.valueOf(luckyNumber.getNumber4()),
                String.valueOf(luckyNumber.getNumber5()),
                String.valueOf(luckyNumber.getNumber6())
        );
    }

    private List<Integer> generateLuckyNumbers() {
        return new Random().ints(1, 46)
                .distinct()
                .limit(6)
                .boxed()
                .collect(Collectors.toList());
    }
}