import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { loginUser, refreshToken, logoutUser } from './authThunks';
import { AuthState } from './authTypes';

// 로그인 상태 인터페이스
// interface AuthState {
//   username: string | null;
//   accessToken: string | null;
//   isAuthenticated: boolean;
//}

const initialState: AuthState = {
  // username: null,
  accessToken: Cookies.get('accessToken') || null, // 쿠키에서 토큰 가져옴
  isAuthenticated: !!Cookies.get('accessToken'), // 토큰 존재 여부 확인
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}, // 직접 사용할 리듀서 제거 - Thunks에서 관리
  extraReducers: (builder) => {
    builder
      // 로그인 성공
      .addCase(loginUser.fulfilled, (state, action) => {
        // state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      // 토큰 갱신 성공
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      // 로그아웃 시 상태 초기화
      .addCase(logoutUser.fulfilled, (state) => {
        // state.username = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
