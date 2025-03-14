package com.c202.user.user.model.response;

import com.c202.user.user.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {

    private int userSeq;
    private String username;
    private String nickname;
    private String birthDate;
    
    // Dto 변환
    public static UserResponseDto toDto(User user) {
        return UserResponseDto.builder()
                .userSeq(user.getUserSeq())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .birthDate(user.getBirthDate())
                .build();
    }
}
