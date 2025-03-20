package com.c202.luckyNumber.service;

import java.util.List;

public interface LuckyNumberService {
    void createLuckyNumber(Integer userSeq);

    List<String> getLuckyNumber(Integer userSeq);
}
