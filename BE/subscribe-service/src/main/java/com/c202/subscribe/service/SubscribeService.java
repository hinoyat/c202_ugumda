package com.c202.subscribe.service;

import java.util.List;

public interface SubscribeService {
    void subscribe(Integer subscriberSeq, Integer subscribedSeq);
    void unsubscribe(Integer subscriberSeq, Integer subscribedSeq);
    List<Integer> getSubscriptions(Integer subscriberSeq);
}
