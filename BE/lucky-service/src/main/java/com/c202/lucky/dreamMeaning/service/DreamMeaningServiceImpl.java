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
    public void createDreamMeaning(Integer userSeq, DreamMeaningRequestDto dto) {
        String content;
        try {
            // 실제 사용 시에는 아래 주석 해제
            // String prompt = String.format(dto.getInputContent() + " 이에 대한 꿈 해몽을 한국어로 간결하게 알려줘. 너무 장황하지 않고 딱 2~3줄 정도.");
            // content = chatModel.call(prompt);
            content = "인프라 화이팅..!!";
        } catch (Exception e) {
            log.error("AI 해몽 생성 실패", e);
            throw new AiCallFailedException("AI 해몽 생성 중 오류가 발생했습니다.");
        }

        log.info("GPT 응답: {}", content);

        DreamMeaning dreamMeaning = DreamMeaning.builder()
                .userSeq(userSeq)
                .inputContent(dto.getInputContent())
                .resultContent(content)
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();

        dreamMeaningRepository.save(dreamMeaning);
    }

    @Override
    public List<DreamMeaningDto> getAllDreamMeanings(Integer userSeq) {
        return dreamMeaningRepository.findByUserSeq(userSeq).stream()
                .map(DreamMeaningDto::fromEntity)
                .collect(Collectors.toList());
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