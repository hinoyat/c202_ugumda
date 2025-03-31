import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import signupReducer from '@/domains/signup/stores/signupSlice';
import diaryReducer from '@/stores/diary/diarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // auth 슬라이스 등록
    signup: signupReducer,
    diary: diaryReducer,
  },
});

// 스토어의 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
