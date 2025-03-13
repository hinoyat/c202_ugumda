package com.c202.luckyNumber.service;

import java.util.List;

public interface LuckyNumberService {
    void createLuckyNumber(int userSeq);

    List<String> getLuckyNumber(int userSeq);
}
