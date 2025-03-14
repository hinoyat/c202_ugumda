package com.c202.gateway.filter;

import com.c202.gateway.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;


@Component
@Slf4j
public class JwtAuthFilter  extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        super(JwtAuthFilter.Config.class);
        this.jwtUtil = jwtUtil;
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String token = resolveToken(exchange);

            if (token != null && jwtUtil.validateToken(token)) {

                // JWT에서 사용자 정보 추출 (예: username, roles)
                int userSeq = jwtUtil.getUserSeq(token);

                // 헤더에 사용자 정보 추가
                ServerWebExchange modifiedExchange = exchange.mutate()
                        .request(builder -> builder
                                .header("X-User-Seq", String.valueOf(userSeq))  // 사용자 ID 추가
                        )
                        .build();
                log.info("[JWT 필터] 유효성 검증 성공 >>> userSeq: {}", userSeq);
                return chain.filter(modifiedExchange);
            } else {
                log.warn("유효하지 않은 토큰 또는 없음");
            }

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        };
    }

    private String resolveToken(ServerWebExchange exchange) {
        String bearerToken = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
