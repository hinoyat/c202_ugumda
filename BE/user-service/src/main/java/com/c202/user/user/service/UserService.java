package com.c202.user.user.service;

import com.c202.user.user.model.request.UpdateIntroductionDto;
import com.c202.user.user.model.request.UpdateUserRequestDto;
import com.c202.user.user.model.response.UserResponseDto;

public interface UserService {

    UserResponseDto getUserInfo(Integer userSeq);

    UserResponseDto updateUser(Integer userSeq, UpdateUserRequestDto request);

    void deleteUser(Integer userSeq);

    UserResponseDto updateIntroduction(Integer userSeq, UpdateIntroductionDto introduction);

    String getUserBirthDate(Integer useSeq);

    UserResponseDto getRandomUser();
}