import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '@/apis/apiClient';
import { UserpageState, visitResponse } from './userTypes';

// 방문하는 우주의 주인장 정보 탐색
export const visitUserpage = createAsyncThunk<
  UserpageState, // 반환타입
  { username: string },
  { rejectValue: string }
>('userpage/visit', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.get<visitResponse>(
      `/users/name/${credentials.username}`
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    // slice에서 실패하면 내 페이지로 이동
    console.log(
      '방문하려는 주인장 정보 불러오기 실패 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴',
      axiosError
    );
    return rejectWithValue(
      axiosError.response?.data?.message || '방문 정보 조회 실패'
    );
  }
});
