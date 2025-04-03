package com.c202.lucky.dreamMeaning;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.c202.exception.types.AiCallFailedException;
import com.c202.exception.types.NotFoundException;
import com.c202.exception.types.UnauthorizedException;
import com.c202.lucky.dreamMeaning.entity.DreamMeaning;
import com.c202.lucky.dreamMeaning.model.DreamMeaningDto;
import com.c202.lucky.dreamMeaning.model.DreamMeaningRequestDto;
import com.c202.lucky.dreamMeaning.repository.DreamMeaningRepository;
import com.c202.lucky.dreamMeaning.service.DreamMeaningServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.model.ChatModel;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class DreamMeaningServiceImplTest {

    @Mock
    private ChatModel chatModel;

    @Mock
    private DreamMeaningRepository dreamMeaningRepository;

    @InjectMocks
    private DreamMeaningServiceImpl dreamMeaningService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    private final Integer userSeq = 1;
    private final Integer dreamMeaningSeq = 100;

    private DreamMeaningRequestDto requestDto;

    @BeforeEach
    void setup() {
        // DTO 초기화: setter 없이 생성자를 사용
        requestDto = new DreamMeaningRequestDto("꿈에 대한 궁금증");
    }

    @Test
    void testCreateDreamMeaning_success() {
        // given
        String prompt1 = requestDto.getInputContent() + " 이에 대한 꿈 해몽을 한국어로 간결하게 알려줘. 너무 장황하지 않고 딱 2~3줄 정도.";
        String generatedContent = "이것은 GPT가 생성한 해몽 내용입니다.";
        String prompt2 = generatedContent + "이 해몽은 좋습니까? 반드시 '좋음' 또는 '나쁨'으로만 답하세요. 다른 말 절대 하지 마세요.";
        String sentiment = "좋음";  // 결과적으로 isGood = "Y"

        when(chatModel.call(prompt1)).thenReturn(generatedContent);
        when(chatModel.call(prompt2)).thenReturn(sentiment);

        // when: createDreamMeaning 호출 (예외 없이 실행되어야 함)
        assertDoesNotThrow(() -> dreamMeaningService.createDreamMeaning(userSeq, requestDto));

        // then: Repository의 save가 1회 호출되었는지 검증
        ArgumentCaptor<DreamMeaning> captor = ArgumentCaptor.forClass(DreamMeaning.class);
        verify(dreamMeaningRepository, times(1)).save(captor.capture());
        DreamMeaning saved = captor.getValue();

        assertEquals(userSeq, saved.getUserSeq());
        assertEquals(requestDto.getInputContent(), saved.getInputContent());
        assertEquals(generatedContent, saved.getResultContent());
        assertEquals("Y", saved.getIsGood());
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    void testCreateDreamMeaning_aiCallFail() {
        // given: chatModel.call() throws exception
        when(chatModel.call(anyString())).thenThrow(new RuntimeException("AI ERROR"));

        // when & then: AiCallFailedException 발생해야 함
        assertThrows(AiCallFailedException.class, () -> dreamMeaningService.createDreamMeaning(userSeq, requestDto));
        verify(dreamMeaningRepository, never()).save(any(DreamMeaning.class));
    }

    @Test
    void testGetAllDreamMeanings_success() {
        // given: Repository returns a list of DreamMeaning entities
        DreamMeaning dm1 = DreamMeaning.builder()
                .dreamMeaningSeq(1)
                .userSeq(userSeq)
                .inputContent("입력내용1")
                .resultContent("결과내용1")
                .isGood("Y")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        DreamMeaning dm2 = DreamMeaning.builder()
                .dreamMeaningSeq(2)
                .userSeq(userSeq)
                .inputContent("입력내용2")
                .resultContent("결과내용2")
                .isGood("N")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        when(dreamMeaningRepository.findByUserSeq(userSeq)).thenReturn(List.of(dm1, dm2));

        // when: getAllDreamMeanings 호출
        List<DreamMeaningDto> result = dreamMeaningService.getAllDreamMeanings(userSeq);

        // then: 리스트 크기 및 필드 값 검증
        assertEquals(2, result.size());
        assertEquals("입력내용1", result.get(0).getInputContent());
        assertEquals("결과내용2", result.get(1).getResultContent());
    }

    @Test
    void testGetDreamMeaning_success() {
        // given: Repository returns an entity with matching userSeq
        DreamMeaning dm = DreamMeaning.builder()
                .dreamMeaningSeq(dreamMeaningSeq)
                .userSeq(userSeq)
                .inputContent("입력내용")
                .resultContent("결과내용")
                .isGood("Y")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        when(dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq))
                .thenReturn(Optional.of(dm));

        // when: getDreamMeaning 호출
        DreamMeaningDto result = dreamMeaningService.getDreamMeaning(userSeq, dreamMeaningSeq);

        // then: 반환된 DTO 필드 검증
        assertNotNull(result);
        assertEquals("입력내용", result.getInputContent());
        assertEquals("결과내용", result.getResultContent());
    }

    @Test
    void testGetDreamMeaning_unauthorized() {
        // given: Repository returns an entity with a different userSeq
        DreamMeaning dm = DreamMeaning.builder()
                .dreamMeaningSeq(dreamMeaningSeq)
                .userSeq(userSeq + 1)  // 다른 사용자
                .inputContent("입력내용")
                .resultContent("결과내용")
                .isGood("Y")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        when(dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq))
                .thenReturn(Optional.of(dm));

        // then: UnauthorizedException 발생해야 함
        assertThrows(UnauthorizedException.class, () -> dreamMeaningService.getDreamMeaning(userSeq, dreamMeaningSeq));
    }

    @Test
    void testDeleteDreamMeaning_success() {
        // given: Repository returns an entity with matching userSeq
        DreamMeaning dm = DreamMeaning.builder()
                .dreamMeaningSeq(dreamMeaningSeq)
                .userSeq(userSeq)
                .inputContent("입력내용")
                .resultContent("결과내용")
                .isGood("Y")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        when(dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq))
                .thenReturn(Optional.of(dm));

        // when: deleteDreamMeaning 호출 (예외 없이 처리되어야 함)
        assertDoesNotThrow(() -> dreamMeaningService.deleteDreamMeaning(userSeq, dreamMeaningSeq));

        // then: Repository의 delete 메서드가 호출되었는지 검증
        verify(dreamMeaningRepository, times(1)).delete(dm);
    }

    @Test
    void testDeleteDreamMeaning_unauthorized() {
        // given: Repository returns an entity with 다른 userSeq
        DreamMeaning dm = DreamMeaning.builder()
                .dreamMeaningSeq(dreamMeaningSeq)
                .userSeq(userSeq + 1)
                .inputContent("입력내용")
                .resultContent("결과내용")
                .isGood("Y")
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        when(dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq))
                .thenReturn(Optional.of(dm));

        // then: UnauthorizedException 발생해야 함
        assertThrows(UnauthorizedException.class, () -> dreamMeaningService.deleteDreamMeaning(userSeq, dreamMeaningSeq));
        verify(dreamMeaningRepository, never()).delete(any(DreamMeaning.class));
    }

    @Test
    void testDeleteDreamMeaning_notFound() {
        // given: Repository returns empty
        when(dreamMeaningRepository.findByDreamMeaningSeq(dreamMeaningSeq))
                .thenReturn(Optional.empty());

        // then: NotFoundException 발생
        assertThrows(NotFoundException.class, () -> dreamMeaningService.deleteDreamMeaning(userSeq, dreamMeaningSeq));
        verify(dreamMeaningRepository, never()).delete(any(DreamMeaning.class));
    }
}
