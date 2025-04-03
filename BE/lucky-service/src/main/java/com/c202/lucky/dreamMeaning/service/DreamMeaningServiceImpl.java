package com.c202.lucky.dreamMeaning.service;

import com.c202.exception.types.*;
import com.c202.lucky.dreamMeaning.entity.DreamMeaning;
import com.c202.lucky.dreamMeaning.model.DreamMeaningDto;
import com.c202.lucky.dreamMeaning.model.DreamMeaningRequestDto;
import com.c202.lucky.dreamMeaning.repository.DreamMeaningRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DreamMeaningServiceImpl implements DreamMeaningService {
    private final ChatModel chatModel;
    private final DreamMeaningRepository dreamMeaningRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Override
    public DreamMeaningDto createDreamMeaning(Integer userSeq, Integer diarySeq, DreamMeaningRequestDto dto) {
        String content;
        String isGood;
        try {
//            // 1. 해몽 생성
//            String prompt1 = dto.getInputContent() + " 이에 대한 꿈 해몽을 한국어로 간결하게 알려줘. 너무 장황하지 않고 딱 2~3줄 정도.";
//            content = chatModel.call(prompt1);
//
//            // 2. 해몽 평가 (좋음/나쁨 분류)
//            String prompt2 = content + "이 해몽은 좋습니까? 반드시 '좋음' 또는 '나쁨'으로만 답하세요. 다른 말 절대 하지 마세요.";
//            String sentiment = chatModel.call(prompt2).trim();
//            log.info(sentiment);
//
//            if (sentiment.contains("좋")) {
//                isGood = "Y";
//            } else if (sentiment.contains("나쁘") || sentiment.contains("나쁜")) {
//                isGood = "N";
//            } else {
//                throw new AiCallFailedException("AI가 올바른 형식으로 분류하지 못했습니다. 답변: " + sentiment);
//            }
            content = "푸하하";
            isGood = "Y";

        } catch (Exception e) {
            log.error("AI 해몽 생성 실패", e);
            throw new AiCallFailedException("AI 해몽 생성 중 오류가 발생했습니다.");
        }

        log.info("GPT 해몽 응답: {}", content);
        log.info("GPT 분류 결과 (isGood): {}", isGood);

        DreamMeaning dreamMeaning = DreamMeaning.builder()
                .userSeq(userSeq)
                .diarySeq(diarySeq)
                .inputContent(dto.getInputContent())
                .resultContent(content)
                .isGood(isGood)
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();

        dreamMeaningRepository.save(dreamMeaning);
        return DreamMeaningDto.fromEntity(dreamMeaning);
    }

    @Override
    public List<DreamMeaningDto> getAllDreamMeanings(Integer userSeq) {
        return dreamMeaningRepository.findByUserSeq(userSeq).stream()
                .map(DreamMeaningDto::fromEntity)
                .toList();
    }
    @Override
    public DreamMeaningDto getDreamMeaning(Integer userSeq, Integer dreamMeaningSeq) {
        DreamMeaning entity = dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq)
                .orElseThrow(() -> new NotFoundException("해당 꿈 해몽을 찾을 수 없습니다."));

        if (!entity.getUserSeq().equals(userSeq)) {
            throw new UnauthorizedException("해당 해몽을 조회할 권한이 없습니다.");
        }
        return DreamMeaningDto.fromEntity(entity);
    }

    @Override
    public void deleteDreamMeaning(Integer userSeq, Integer dreamMeaningSeq) {
        DreamMeaning entity = dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq)
                .orElseThrow(() -> new NotFoundException("해당 꿈 해몽을 찾을 수 없습니다."));

        if (!entity.getUserSeq().equals(userSeq)) {
            throw new UnauthorizedException("해당 해몽을 삭제할 권한이 없습니다.");
        }

        dreamMeaningRepository.delete(entity);
    }
}