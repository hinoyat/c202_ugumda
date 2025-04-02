import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAlarms } from './alarmThunks';
import { Alarm, AlarmState } from './alarmTypes';

const initialState: AlarmState = {
  alarms: [],
  size: 5,
  hasMore: true,
  loading: false,
  page: 0,
  totalItems: 1,
  totalPages: 0,
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    resetAlarms: (state) => {
      state.alarms = [];
      state.hasMore = true;
      state.page = 0;
      state.totalItems = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlarms.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAlarms.fulfilled,
        (
          state,
          action: PayloadAction<{
            alarms: Alarm[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.alarms = [...state.alarms, ...action.payload.alarms];
          state.page = action.payload.currentPage + 1;
          state.totalPages = action.payload.totalPages;
          state.hasMore = state.page < state.totalPages;
          state.loading = false;
        }
      )
      .addCase(fetchAlarms.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetAlarms } = alarmSlice.actions;
export default alarmSlice.reducer;
