package com.c202.dailyFortune.service;

import com.c202.dailyFortune.repository.DailyFortuneRepository;
import com.c202.luckyNumber.repository.LuckyNumberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DailyFortuneServiceImpl implements DailyFortuneService{
    private final DailyFortuneRepository dailyFortuneRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Override
    @Transactional
    public void createDailyFortune(Integer userSeq){

    }

    @Override
    public String getDailyFortune(Integer userSeq) {
        return null;
    }
}
