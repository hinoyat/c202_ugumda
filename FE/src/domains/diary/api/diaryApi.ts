import api from '@/apis/apiClient';
import { DiaryData } from '@/domains/diary/Types/diary.types';

// interface DiaryData {
//   title: string;
//   content: string;
//   dreamDate: string;
//   isPublic: string;
//   mainEmotion: string;
//   tags: string[];
// }

// 가져온 타입
// export interface DiaryData {
//   diarySeq?: number; // 생성 시에는 없을 수 있음
//   title: string;
//   content: string;
//   dreamDate: string;
//   isPublic: string;
//   mainEmotion: string;
//   tags?: string[];
// }

export const diaryApi = {
  // 일기 생성
  createDiary: async (diaryData: DiaryData) => {
    return await api.post('/diaries', diaryData);
  },

  // 일기 목록 조회
  getDiaries: async () => {
    return await api.get('/diaries/me');
  },

  // 일기 개별 조회
  getDiaryById: async (diarySeq: number) => {
    return await api.get(`/diaries/${diarySeq}`);
  },

  // 일기 수정
  updateDiary: async (diarySeq: number, diaryData: DiaryData) => {
    return await api.put(`/diaries/${diarySeq}`, diaryData);
  },

  // 수정할 예정입니다,,,

  // // 일기 삭제
  // deleteDiary: async (diarySeq) => {
  //   return await axios.delete(`${API_BASE_URL}/diaries/${diarySeq}`);
  // },
};
