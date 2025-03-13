package com.c202.user.user.service;

import com.c202.user.user.model.request.UpdateUserRequestDto;
import com.c202.user.user.model.response.UserResponseDto;

public interface UserService {

    UserResponseDto getUserInfo(Long userSeq);

    UserResponseDto updateUser(Long userSeq, UpdateUserRequestDto request);

    void deleteUser(Long userSeq);
}
