package com.c202.luckyNumber.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LuckyNumber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  id;

    private int userSeq;
    private int number1;
    private int number2;
    private int number3;
    private int number4;
    private int number5;
    private int number6;
}