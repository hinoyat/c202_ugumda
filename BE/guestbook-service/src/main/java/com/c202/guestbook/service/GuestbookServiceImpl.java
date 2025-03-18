package com.c202.guestbook.service;

import com.c202.exception.CustomException;
import com.c202.guestbook.entity.Guestbook;
import com.c202.guestbook.model.GuestbookDto;
import com.c202.guestbook.repository.GuestbookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class GuestbookServiceImpl implements GuestbookService {

    // 날짜 포맷터
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Autowired
    private GuestbookRepository guestbookRepository;

    @Override
    public GuestbookDto createGuestbook(int ownerSeq, int writerSeq, GuestbookDto guestbookDTO) {
        if(ownerSeq == writerSeq){
            throw new CustomException("본인 방명록에는 작성할 수 없습니다.");
        }

        String currentTime = LocalDateTime.now().format(DATE_TIME_FORMATTER);

        Guestbook guestbook = Guestbook.builder()
                .ownerSeq(ownerSeq)
                .writerSeq(writerSeq)
                .content(guestbookDTO.getContent())
                .createdAt(currentTime)
                .updatedAt(currentTime)
                .isDeleted("N")
                .build();

        guestbook = guestbookRepository.save(guestbook);

        return new GuestbookDto(
                guestbook.getGuestbookSeq(),
                guestbook.getOwnerSeq(),
                guestbook.getWriterSeq(),
                guestbook.getContent(),
                guestbook.getCreatedAt(),
                guestbook.getUpdatedAt(),
                guestbook.getDeletedAt(),
                guestbook.getIsDeleted()
        );
    }

    @Override
    public List<GuestbookDto> getAllGuestbooks(int ownerSeq) {
        List<Guestbook> guestbooks = guestbookRepository.findByOwnerSeqAndIsDeleted(ownerSeq, "N");

        return guestbooks.stream()
                .map(guestbook -> new GuestbookDto(
                        guestbook.getGuestbookSeq(),
                        guestbook.getOwnerSeq(),
                        guestbook.getWriterSeq(),
                        guestbook.getContent(),
                        guestbook.getCreatedAt(),
                        guestbook.getUpdatedAt(),
                        guestbook.getDeletedAt(),
                        guestbook.getIsDeleted()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGuestbook(int userSeq, int guestbookSeq) {
        // 1. 방명록이 없을 때
        Guestbook guestbook = guestbookRepository.findByGuestbookSeq(guestbookSeq);
        if (guestbook == null) {
            throw new CustomException("해당 방명록을 찾을 수 없습니다.");
        }

        // 2. 방명록이 이미 삭제된 상태인 경우
        if ("Y".equals(guestbook.getIsDeleted())) {
            throw new CustomException("이미 삭제된 방명록입니다.");
        }

        // 3. userSeq와 방명록의 writerSeq가 다른 경우
        if (!guestbook.getWriterSeq().equals(userSeq)) {
            throw new CustomException("방명록 삭제 권한이 없습니다.");
        }

        // 4. 방명록 삭제
        guestbook.markAsDeleted();
        guestbook.setDeletedAt(LocalDateTime.now().format(DATE_TIME_FORMATTER));
        guestbookRepository.save(guestbook);
    }
}
