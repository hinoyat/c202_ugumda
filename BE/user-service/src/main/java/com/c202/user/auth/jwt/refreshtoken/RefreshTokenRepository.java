package com.c202.user.auth.jwt.refreshtoken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {


    // 토큰 값으로 리프레시 토큰 조회
    Optional<RefreshToken> findByToken(String token);

    // 사용자 ID로 리프레시 토큰 조회
    Optional<RefreshToken> findByUserSeq(int userSeq);

    // 사용자 ID로 토큰 삭제 (로그아웃 시 사용)
    void deleteByUserSeq(int userSeq);
}