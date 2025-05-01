import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '@/apis/apiClient';

import {
  LoginCredentials,
  LoginResponse,
  RefreshResponseData,
  LoginResponseData,
} from './authTypes';

export const loginUser = createAsyncThunk<
  LoginResponseData,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const accessToken = response.data.data.accessToken;
    localStorage.setItem('accessToken', accessToken);
    const userData = await api.get('/users/me');
    localStorage.setItem('User', JSON.stringify(userData.data.data));

    return {
      accessToken,
      user: userData.data.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return rejectWithValue(axiosError.response?.data?.message || '로그인 실패');
  }
});

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('User');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || '로그아웃 실패'
      );
    }
  }
);

export const updateToken = createAsyncThunk<
  { accessToken: string },
  void,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post<RefreshResponseData>(
      '/auth/refresh',
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.data.accessToken;

    localStorage.setItem('accessToken', newAccessToken);


    return { accessToken: newAccessToken };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    
    return rejectWithValue(
      axiosError.response?.data?.message || '토큰 갱신 실패'
    );
  }
});
