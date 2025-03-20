package com.c202.subscribe.service;

import com.c202.exception.CustomException;
import com.c202.subscribe.entity.Subscribe;
import com.c202.subscribe.repository.SubscribeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscribeServiceImpl implements SubscribeService {

    private final SubscribeRepository subscribeRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");

    @Transactional
    @Override
    public void subscribe(Integer subscriberSeq, Integer subscribedSeq) {
        if (subscriberSeq == null || subscribedSeq == null) {
            throw new CustomException("subscriberSeq 또는 subscribedSeq 값이 null입니다.");
        }
        if (subscriberSeq.equals(subscribedSeq)) {
            throw new CustomException("본인을 구독할 수 없습니다.");
        }
        if (subscribeRepository.existsBySubscriberSeqAndSubscribedSeq(subscriberSeq, subscribedSeq)) {
            throw new CustomException("이미 구독 중입니다.");
        }
        Subscribe subscribe = Subscribe.builder()
                .subscriberSeq(subscriberSeq)
                .subscribedSeq(subscribedSeq)
                .createdAt(LocalDateTime.now().format(FORMATTER))
                .build();
        subscribeRepository.save(subscribe);
    }

    @Transactional
    @Override
    public void unsubscribe(Integer subscriberSeq, Integer subscribedSeq) {
        if (subscriberSeq == null || subscribedSeq == null) {
            throw new CustomException("subscriberSeq 또는 subscribedSeq 값이 null입니다.");
        }
        Subscribe subscribe = subscribeRepository.findBySubscriberSeqAndSubscribedSeq(subscriberSeq, subscribedSeq)
                .orElseThrow(() -> new CustomException("구독 정보가 없습니다."));
        subscribeRepository.delete(subscribe);
    }

    @Override
    public List<Integer> getSubscriptions(Integer subscriberSeq) {
        if (subscriberSeq == null) {
            throw new CustomException("subscriberSeq 값이 null입니다.");
        }
        return subscribeRepository.findBySubscriberSeq(subscriberSeq)
                .stream()
                .map(Subscribe::getSubscribedSeq)
                .collect(Collectors.toList());
    }
}