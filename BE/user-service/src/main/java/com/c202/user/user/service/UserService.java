package com.c202.user.user.service;

import com.c202.user.user.model.request.UpdateUserRequestDto;
import com.c202.user.user.model.response.UserResponseDto;

public interface UserService {

    UserResponseDto getUserInfo(int userSeq);

    UserResponseDto updateUser(int userSeq, UpdateUserRequestDto request);

    void deleteUser(int userSeq);
}
