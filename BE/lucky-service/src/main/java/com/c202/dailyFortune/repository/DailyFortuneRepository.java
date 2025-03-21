package com.c202.dailyFortune.repository;

import com.c202.dailyFortune.entity.DailyFortune;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DailyFortuneRepository extends JpaRepository<DailyFortune, Integer> {

    Optional<DailyFortune> findByUserSeq(Integer userSeq);
}
