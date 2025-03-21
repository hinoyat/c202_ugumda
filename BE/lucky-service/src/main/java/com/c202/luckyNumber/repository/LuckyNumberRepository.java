package com.c202.luckyNumber.repository;

import com.c202.luckyNumber.entity.LuckyNumber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LuckyNumberRepository extends JpaRepository<LuckyNumber, Integer> {

    Optional<LuckyNumber> findByUserSeq(Integer userSeq);
}