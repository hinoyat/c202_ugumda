package com.c202.luckyNumber.repository;

import com.c202.luckyNumber.entity.LuckyNumber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LuckyNumberRepository extends JpaRepository<LuckyNumber, Long> {

    // 사용자 번호로 행운 번호를 조회하는 메서드
    Optional<LuckyNumber> findByUserSeq(int userSeq);

    // 선택적으로 추가: 사용자 번호로 행운 번호 삭제하는 메서드
    void deleteByUserSeq(int userSeq);
}