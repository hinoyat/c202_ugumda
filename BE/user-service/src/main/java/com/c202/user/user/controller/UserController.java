package com.c202.user.user.controller;

import com.c202.user.user.model.request.UpdateUserRequestDto;
import com.c202.user.user.model.response.UserResponseDto;
import com.c202.user.user.service.UserService;
import com.c202.user.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserInfo(@RequestHeader("X-User-Seq") String userSeqStr) {
        Long userSeq = null;
        // 헤더 값이 null이 아니면 Long으로 변환

        if (userSeqStr != null) {
            try {
                userSeq = Long.parseLong(userSeqStr); // String을 Long으로 변환
            } catch (NumberFormatException e) {
                log.error("잘못된 X-User-Seq 값: {}", userSeqStr);
            }
        }
        UserResponseDto user = userService.getUserInfo(userSeq);
        return ResponseEntity.ok(ApiResponse.success(user, "사용자 정보 조회 성공"));
    }

    // 사용자 정보 수정
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @RequestHeader("X-User-Seq") Long userSeq,
            @RequestBody UpdateUserRequestDto requestDto) {
        UserResponseDto user = userService.updateUser(userSeq, requestDto);
        return ResponseEntity.ok(ApiResponse.success(user, "사용자 정보 수정 성공"));
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@RequestHeader("X-User-Seq") Long userSeq) {
        userService.deleteUser(userSeq);
        return ResponseEntity.ok(ApiResponse.success(null, "회원 탈퇴 성공"));
    }

}