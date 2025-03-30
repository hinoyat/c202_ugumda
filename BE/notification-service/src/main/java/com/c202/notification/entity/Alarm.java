package com.c202.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 알림 정보를 담는 엔티티 클래스
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "alarm")
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_seq")
    private Integer alarmSeq;

    @Column(name = "user_seq", nullable = false)
    private Integer userSeq;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 50)
    private String type;

    @Column(name = "is_read", nullable = false, length = 1)
    private String isRead;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = "N";
        }
    }

    // 알림을 읽음 상태로 변경
    public void markAsRead() {
        this.isRead = "Y";
    }

    // 알림이 읽었는지 확인
    public boolean isReadYn() {
        return "Y".equals(this.isRead);
    }

    // 알림 생성 팩토리 메소드
    public static Alarm createAlarm(Integer userSeq, String content, String type) {
        return Alarm.builder()
                .userSeq(userSeq)
                .content(content)
                .type(type)
                .createdAt(LocalDateTime.now())
                .isRead("N")
                .build();
    }
}