package com.c202.subscribe.service;

import java.util.List;

public interface SubscribeService {
    String toggleSubscription(Integer subscriberSeq, Integer subscribedSeq);
    List<Integer> getSubscriptions(Integer subscriberSeq);
}
