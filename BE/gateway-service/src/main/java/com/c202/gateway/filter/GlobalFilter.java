package com.c202.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class GlobalFilter extends AbstractGatewayFilterFactory<GlobalFilter.Config> {
    private StopWatch stopWatch;

    public GlobalFilter() {
        super(Config.class);
        stopWatch = new StopWatch("API Gateway"); // 초기화
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // 필터 전 처리: 요청 경로 출력
            ServerHttpRequest request = exchange.getRequest();
            String path = exchange.getRequest().getURI().getPath();
            log.info("Request path: " + path);

            stopWatch.start();
            // 예시: 특정 경로가 포함된 경우 403 상태 코드 반환
            if (path.contains("/blocked")) {
                System.out.println("Request blocked: " + path);
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }


            // 필터 체인 계속 진행
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                stopWatch.stop();
                // 후 처리: 응답이 완료된 후 처리할 작업
                log.info("[글로벌 필터] RESPONSE 응답 >>> IP : {}, URI : {} , 응답코드 : {} ---> 처리시간 : {} ms",
                        request.getRemoteAddress().getAddress(),
                        request.getURI(),
                        request.getMethod(),
                        stopWatch.lastTaskInfo().getTimeMillis());
            }));
        };
    }

    @Override
    public List<String> shortcutFieldOrder() {
        // 필터 설정에 필요한 필드들의 순서를 설정
        return new ArrayList<>();
    }

    public static class Config {
        // 필터에 필요한 설정을 여기에 정의할 수 있습니다.
        // 예: 특정 키 값을 추가로 받을 수 있습니다.
    }
}
