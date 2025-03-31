import { DiaryData } from '@/domains/diary/Types/diary.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 일기 인터페이스 정의
// export interface DiaryData {
//   diarySeq?: number;
//   title: string;
//   content: string;
//   dreamDate: string;
//   isPublic: string;
//   mainEmotion: string;
//   tags: string[];
// }

// 일기 상태 인터페이스 정의
interface DiaryState {
  diaries: DiaryData[];
  currentDiary: DiaryData | null;
  loading: boolean;
  error: string | null;
}

// 초기 상태 정의
const initialState: DiaryState = {
  diaries: [],
  currentDiary: null,
  loading: false,
  error: null,
};

// 슬라이스 생성
const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    // 일기 목록 설정
    setDiaries: (state, action: PayloadAction<DiaryData[]>) => {
      state.diaries = action.payload;
    },
    // 새 일기 추가
    addDiary: (state, action: PayloadAction<DiaryData>) => {
      state.diaries.push(action.payload);
    },

    // 현재 편집 중인 일기 설정
    setCurrentDiary: (state, action: PayloadAction<DiaryData | null>) => {
      state.currentDiary = action.payload;
    },
    // 일기 업데이트
    updateDiary: (state, action: PayloadAction<DiaryData>) => {
      const index = state.diaries.findIndex(
        (diary) => diary.diarySeq === action.payload.diarySeq
      );
      if (index !== -1) {
        state.diaries[index] = action.payload;
      }
    },
    // 로딩 상태 설정
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // 에러 설정
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const {
  setDiaries,
  addDiary,
  setCurrentDiary,
  updateDiary,
  setLoading,
  setError,
} = diarySlice.actions;

// 리듀서 내보내기
export default diarySlice.reducer;
