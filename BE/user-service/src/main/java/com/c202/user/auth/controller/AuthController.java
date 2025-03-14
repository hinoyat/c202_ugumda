package com.c202.user.auth.controller;

import com.c202.user.auth.service.AuthService;
import com.c202.user.auth.service.AuthServiceImpl;
import com.c202.user.auth.model.request.LoginRequestDto;
import com.c202.user.auth.model.request.SignupRequestDto;
import com.c202.user.user.model.response.UserResponseDto;
import com.c202.user.auth.jwt.JwtTokenProvider;
import com.c202.user.auth.jwt.TokenDto;
import com.c202.user.global.common.response.ApiResponse;
import com.c202.user.global.exception.ServiceException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@RequestBody SignupRequestDto requestDto) {
        UserResponseDto user = authService.register(requestDto);
        return ResponseEntity.ok(ApiResponse.success(user, "회원가입 성공"));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(
            @RequestBody LoginRequestDto requestDto,
            HttpServletResponse response) {

        TokenDto.TokenResponseDto tokens = authService.login(requestDto);

        System.out.println("로그인 성공 access" + tokens.getAccessToken() + "refresh" + tokens.getRefreshToken());

        // 리프레시 토큰을 쿠키에 설정
        jwtTokenProvider.addRefreshTokenToCookie(response, tokens.getRefreshToken());

        // 응답에는 액세스 토큰만 포함
        Map<String, String> tokenResponse = Map.of("accessToken", tokens.getAccessToken());
        
        // 헤더에 토큰 추가
        response.addHeader("Authorization", "Bearer " + tokens.getAccessToken());

        return ResponseEntity.ok(ApiResponse.success(tokenResponse, "로그인이 성공했습니다."));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader("X-User-Seq") int userSeq,
            HttpServletResponse response) {

        System.out.println("요청이 들어왔다");

        authService.logout(userSeq);

        // 리프레시 토큰 쿠키 삭제
        jwtTokenProvider.deleteRefreshTokenCookie(response);

        return ResponseEntity.ok(ApiResponse.success(null, "로그아웃이 성공했습니다."));
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUsernameAvailability(@PathVariable String username) {
        boolean isAvailable = authService.isUsernameAvailable(username);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("available", isAvailable),
                isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."
        ));
    }

    @GetMapping("/check-nickname/{nickname}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkNicknameAvailability(@PathVariable String nickname) {
        boolean isAvailable = authService.isNicknameAvailable(nickname);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("available", isAvailable),
                isAvailable ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
        ));
    }

    // 토큰 갱신
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        // 쿠키에서 리프레시 토큰 추출
        String refreshToken = jwtTokenProvider.extractRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            throw new ServiceException.AuthenticationException("리프레시 토큰이 없습니다.");
        }

        // 리프레시 토큰으로 새 액세스 토큰 발급
        String newAccessToken = jwtTokenProvider.refreshAccessToken(refreshToken);

        // 응답에 새 액세스 토큰만 포함
        Map<String, String> tokenResponse = Map.of("accessToken", newAccessToken);

        return ResponseEntity.ok(ApiResponse.success(tokenResponse, "토큰이 갱신되었습니다."));
    }

}
