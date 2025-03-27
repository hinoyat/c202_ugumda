package com.c202.lucky.dreamMeaning.service;

import com.c202.exception.types.NotFoundException;
import com.c202.exception.types.UnauthorizedException;
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
        String prompt = String.format(
                dto.getInputContent() + "이에 대한 꿈 해몽을 한국어로 간결하게 알려줘. 너무 장황하지 않고 딱 2~3줄 정도."
        );

        String content = chatModel.call(prompt);
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
    public void deleteDreamMeaning(Integer dreamMeaningSeq, Integer userSeq) {
        DreamMeaning entity = dreamMeaningRepository.findById(dreamMeaningSeq)
                .orElseThrow(() -> new NotFoundException("해당 꿈 해몽을 찾을 수 없습니다."));

        if (!entity.getUserSeq().equals(userSeq)) {
            throw new UnauthorizedException("해당 해몽을 삭제할 권한이 없습니다.");
        }

        dreamMeaningRepository.delete(entity);
    }
}