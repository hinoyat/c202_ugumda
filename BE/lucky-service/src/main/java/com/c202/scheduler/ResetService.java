package com.c202.scheduler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.c202.luckyNumber.repository.LuckyNumberRepository;
//import com.c202.todayFortune.repository.TodayFortuneRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResetService {

    private final LuckyNumberRepository luckyNumberRepository;
//    private final TodayFortuneRepository todayFortuneRepository;

    public void resetAllData() {
        log.info("[ResetService] 행운 번호 및 운세 초기화 시작");

        luckyNumberRepository.deleteAll();
//        todayFortuneRepository.deleteAll();

        log.info("[ResetService] 모든 초기화 완료");
    }
}