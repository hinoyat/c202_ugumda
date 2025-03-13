package com.c202.luckyNumber.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LuckyNumberDTO {
    private int userSeq;
    private List<Integer> luckNumbers;
}
