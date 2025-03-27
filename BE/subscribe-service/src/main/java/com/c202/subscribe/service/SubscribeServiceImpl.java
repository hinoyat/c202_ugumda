package com.c202.subscribe.service;

import com.c202.exception.types.*;
import com.c202.subscribe.entity.Subscribe;
import com.c202.subscribe.repository.SubscribeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscribeServiceImpl implements SubscribeService {

    private final SubscribeRepository subscribeRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Transactional
    @Override
    public String toggleSubscription(Integer subscriberSeq, Integer subscribedSeq) {
        if (subscriberSeq == null || subscribedSeq == null) {
            throw new BadRequestException("구독자 정보가 유효하지 않습니다.");
        }

        if (subscriberSeq.equals(subscribedSeq)) {
            throw new BadRequestException("본인을 구독할 수 없습니다.");
        }

        Optional<Subscribe> existingSubscription =
                subscribeRepository.findBySubscriberSeqAndSubscribedSeq(subscriberSeq, subscribedSeq);

        if (existingSubscription.isPresent()) {
            // 이미 구독 중이면 삭제 (구독 해제)
            subscribeRepository.delete(existingSubscription.get());
            return "구독 해제";
        } else {
            // 구독이 없으면 추가 (구독 등록)
            Subscribe subscribeEntity = Subscribe.builder()
                    .subscriberSeq(subscriberSeq)
                    .subscribedSeq(subscribedSeq)
                    .createdAt(LocalDateTime.now().format(FORMATTER))
                    .build();
            subscribeRepository.save(subscribeEntity);
            return "구독 성공";
        }
    }

    @Override
    public List<Integer> getSubscriptions(Integer subscriberSeq) {
        if (subscriberSeq == null) {
            throw new BadRequestException("구독자 정보가 유효하지 않습니다.");
        }
        return subscribeRepository.findBySubscriberSeq(subscriberSeq)
                .stream()
                .map(Subscribe::getSubscribedSeq)
                .collect(Collectors.toList());
    }
}