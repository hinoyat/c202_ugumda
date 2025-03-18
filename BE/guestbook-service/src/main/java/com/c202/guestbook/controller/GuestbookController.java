package com.c202.guestbook.controller;
import com.c202.dto.ResponseDto;
import com.c202.exception.CustomException;
import com.c202.guestbook.model.GuestbookDto;
import com.c202.guestbook.service.GuestbookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guestbook")
public class GuestbookController {

    @Autowired
    private GuestbookService guestbookService;

    @GetMapping("/me")
    public ResponseEntity<ResponseDto<List<GuestbookDto>>> getMyGuestbooks(@RequestHeader("X-User-Seq") Integer userSeq) {
        List<GuestbookDto> guestbooks = guestbookService.getAllGuestbooks(userSeq);
        return ResponseEntity.ok(ResponseDto.success(200, "내 방명록 조회 성공", guestbooks));
    }

    @GetMapping("/users/{userSeq}")
    public ResponseEntity<ResponseDto<List<GuestbookDto>>> getUserGuestbooks(@PathVariable Integer userSeq) {
        if (userSeq == null) {
            throw new CustomException("userSeq 값을 다시 확인해주세요. (null)");
        }
        List<GuestbookDto> guestbooks = guestbookService.getAllGuestbooks(userSeq);
        return ResponseEntity.ok(ResponseDto.success(200, "타인 방명록 조회 성공", guestbooks));
    }

    @PostMapping("/users/{ownerSeq}")
    public ResponseEntity<ResponseDto<Object>> createGuestbook(@RequestHeader("X-User-Seq") Integer writerSeq, @PathVariable Integer ownerSeq, @RequestBody GuestbookDto guestbookDto){
        if (ownerSeq == null) {
            throw new CustomException("ownerSeq 값을 다시 확인해주세요. (null)");
        }

        GuestbookDto createdGuestbook = guestbookService.createGuestbook(ownerSeq, writerSeq, guestbookDto);
        return ResponseEntity.ok(ResponseDto.success(201, "방명록 작성 완료", createdGuestbook));
    }

    @DeleteMapping("/{guestbookSeq}")
    public ResponseEntity<ResponseDto<Object>> deleteGuestbook(
            @RequestHeader("X-User-Seq") Integer userSeq, @PathVariable Integer guestbookSeq) {
        if (guestbookSeq == null) {
            throw new CustomException("guestbookSeq 값을 다시 확인해주세요. (null)");
        }
        guestbookService.deleteGuestbook(userSeq, guestbookSeq);
        return ResponseEntity.ok(ResponseDto.success(204, "방명록 삭제 완료"));
    }
}