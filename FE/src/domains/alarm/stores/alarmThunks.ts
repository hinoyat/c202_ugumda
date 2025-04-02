import { createAsyncThunk } from '@reduxjs/toolkit';
import { Alarm } from './alarmTypes';
import { RootState } from '@/stores/store';
import api from '@/apis/apiClient';

export const fetchAlarms = createAsyncThunk<
  { alarms: Alarm[]; totalPages: number; currentPage: number },
  void,
  { state: RootState }
>('alarm/fetchAlarms', async (_, { getState }) => {
  const { page, size } = getState().alarm;
  const response = await api.get('/notifications/list/page', {
    params: { page, size },
  });
  console.log('⏰⏰⏰⏰⏰알람 목록 페이지네이션 thunks', response);
  return {
    alarms: response.data.data.alarms,
    totalPages: response.data.data.totalPages,
    currentPage: response.data.data.currentPage,
  };
});

export const updateAlarm = createAsyncThunk<void, number>(
  'alarm/updateAlarm',
  async (alarmSeq, { dispatch }) => {
    await api.put(`/notifications/read/${alarmSeq}`);
  }
);
