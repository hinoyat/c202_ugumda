import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from './authThunks';
import { AuthState, User } from './authTypes';

// 로그인 상태 인터페이스
// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   isAuthenticated: boolean;
//}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('User') || 'null'),
  accessToken: localStorage.getItem('accessToken') || null, // 로컬스토리지에서 토큰 가져옴
  isAuthenticated: !!localStorage.getItem('accessToken'), // 토큰 존재 여부 확인
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIntro: (state, action)=>{
      state.user!.introduction = action.payload
      console.log("서채서채서채", JSON.stringify(state))
    }

  }, // 직접 사용할 리듀서 제거 - Thunks에서 관리
  extraReducers: (builder) => {
    builder
      // 로그인 성공
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      // 토큰 갱신 성공
      // .addCase(refreshToken.fulfilled, (state, action) => {
      //   state.accessToken = action.payload.accessToken;
      // })
      // 로그아웃 시 상태 초기화
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('User');
      });
  },
});
export const {
  setIntro
} = authSlice.actions

export default authSlice.reducer ;
