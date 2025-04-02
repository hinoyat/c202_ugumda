package com.c202.lucky.dailyFortune.service;

import com.c202.exception.types.AiCallFailedException;
import com.c202.exception.types.AlreadyExistsException;
import com.c202.lucky.dailyFortune.entity.DailyFortune;
import com.c202.lucky.dailyFortune.repository.DailyFortuneRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class DailyFortuneServiceImpl implements DailyFortuneService{
    private final ChatModel chatModel;
    private final DailyFortuneRepository dailyFortuneRepository;
    private final WebClient.Builder webClientBuilder;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Override
    @Transactional
    public void createDailyFortune(Integer userSeq) {
        if (dailyFortuneRepository.findByUserSeq(userSeq).isPresent()) {
            throw new AlreadyExistsException("오늘의 운세가 이미 생성되었습니다.");
        }
        try {

            // 실제 배포 시 주석 해제
//            String birthDate = webClientBuilder
//                    .baseUrl("http://user-service")
//                    .build()
//                    .get()
//                    .uri("/api/users/birthdate")
//                    .header("X-User-Seq", String.valueOf(userSeq))
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block();
//
//            String prompt = String.format(
//                    "생년월일이 %s인 사람을 위한 오늘의 운세를 한국어로 간결하게 알려줘. 너무 장황하지 않고 딱 2~3줄 정도.", birthDate
//            );
//
//            String content = chatModel.call(prompt);
            String content = "주찬이의 연동을 위한 오늘의 운세, 주찬이는 클린코딩을 아주 잘 할 것 같아요";
            log.info("GPT 응답: {}", content);

            DailyFortune fortune = DailyFortune.builder()
                    .userSeq(userSeq)
                    .content(content)
                    .createdAt(LocalDateTime.now().format(FORMATTER))
                    .build();

            dailyFortuneRepository.save(fortune);
        } catch (Exception e) {
            log.error("AI 운세 생성 실패", e);
            throw new AiCallFailedException("AI 운세 생성 중 오류가 발생했습니다.");
        }
    }

    @Override
    public String getDailyFortune(Integer userSeq) {
        return dailyFortuneRepository.findByUserSeqAndUserSeqIs(userSeq)
                .map(DailyFortune::getContent)
                .orElse(null);
    }
}
