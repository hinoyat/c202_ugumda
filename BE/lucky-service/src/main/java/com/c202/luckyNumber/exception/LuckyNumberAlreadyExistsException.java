package com.c202.luckyNumber.exception;

public class LuckyNumberAlreadyExistsException extends RuntimeException {
    public LuckyNumberAlreadyExistsException() {
        super("행운 번호가 이미 생성되었습니다.");
    }
}