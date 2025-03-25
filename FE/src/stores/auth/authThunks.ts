import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from 'axios';
import api from '@/apis/apiClient';
import {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  User,
  LoginResponseData,
} from './authTypes';

// 로그인 API 호출
export const loginUser = createAsyncThunk<
  LoginResponseData, // 반환 타입 확장
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      '/api/auth/login',
      credentials
    );
    console.log('로그인 성공✅✅✅✅✅✅✅✅✅✅✅✅✅', response);

    // 쿠키에 토큰 저장
    // Cookies.set('accessToken', response.data.data.accessToken, {
    //   secure: true,
    // });
    // Cookies.set('refreshToken', response.data.refreshToken, { secure: true });
    localStorage.setItem('accessToken', response.data.data.accessToken);

    const userData = await api.get('/users/me');
    localStorage.setItem('User', JSON.stringify(userData.data.data));

    return {
      accessToken: response.data.data.accessToken,
      user: userData.data.data, // user 정보도 함께 반환
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.log('로그인 실패 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴', axiosError);
    return rejectWithValue(axiosError.response?.data?.message || '로그인 실패');
  }
});

// 로그아웃 API 호출
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      console.log('로그아웃!! 성공✅✅✅✅✅✅✅✅✅✅✅✅✅');

      // access token 삭제
      localStorage.removeItem('accessToken');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || '로그아웃 실패'
      );
    }
  }
);

// 토큰 갱신 (refresh)
// export const refreshToken = createAsyncThunk<
//   { accessToken: string },
//   void,
//   { rejectValue: string }
// >('auth/refresh', async (_, { rejectWithValue }) => {
//   try {
//     const refreshToken = .get('refreshToken');
//     if (!refreshToken) throw new Error('Refresh token이 없습니다.');

//     const response = await api.post<RefreshResponse>('/auth/refresh', {
//       refreshToken,
//     });

//     // 새 토큰을 쿠키에 저장
//     Cookies.set('accessToken', response.data.accessToken, { secure: true });

//     return { accessToken: response.data.accessToken };
//   } catch (error) {
//     const axiosError = error as AxiosError<{ message: string }>;
//     return rejectWithValue(
//       axiosError.response?.data?.message || '토큰 갱신 실패'
//     );
//   }
// });
