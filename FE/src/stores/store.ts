import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import signupReducer from '@/domains/signup/stores/signupSlice';
import userpageReducer from '@/domains/mainpage/stores/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // auth 슬라이스 등록
    signup: signupReducer,
    userpage: userpageReducer,
  },
});

// 스토어의 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
