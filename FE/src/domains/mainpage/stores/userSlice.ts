import { createSlice } from '@reduxjs/toolkit';
import { UserpageState } from './userTypes';
import { visitUserpage, visitOtherUserpage } from './userThunks';

const initialState: UserpageState = {
  userSeq: 0,
  username: '',
  nickname: '',
  birthDate: '',
  introduction: null,
  iconSeq: 0,
  isSubscribed: '',
};

const userpageSlice = createSlice({
  name: 'userpage',
  initialState,
  reducers: {
    // 새로운 액션 추가: 구독 상태 업데이트
    updateSubscriptionStatus: (state, action) => {
      state.isSubscribed = action.payload;
    },
    updateIntroduction: (state, action) => {
      state.introduction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(visitUserpage.fulfilled, (state, action) => {
        state.userSeq = action.payload.userSeq;
        state.username = action.payload.username;
        state.nickname = action.payload.nickname;
        state.birthDate = action.payload.birthDate;
        state.introduction = action.payload.introduction;
        state.iconSeq = action.payload.iconSeq;
        state.isSubscribed = action.payload.isSubscribed;
      })
      .addCase(visitUserpage.rejected, (state) => {
        state.userSeq = 0;
        state.username = '';
        state.nickname = '';
        state.birthDate = '';
        state.introduction = null;
        state.iconSeq = 0;
        state.isSubscribed = '';

      })
      .addCase(visitOtherUserpage.fulfilled, (state, action) => {
        state.userSeq = action.payload.userSeq;
        state.username = action.payload.username;
        state.nickname = action.payload.nickname;
        state.birthDate = action.payload.birthDate;
        state.introduction = action.payload.introduction;
        state.iconSeq = action.payload.iconSeq;
        state.isSubscribed = 'N';
        // 구독 정보 넘어오면 고치기 (웬만하면 거의 다 구독 아님)
      });
  },
});

export const { updateSubscriptionStatus, updateIntroduction } =
  userpageSlice.actions;
export default userpageSlice.reducer;
