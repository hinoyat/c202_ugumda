package com.c202.dailyFortune.service;

public interface DailyFortuneService {
    void createDailyFortune(Integer userSeq);
    String getDailyFortune(Integer userSeq);
}
