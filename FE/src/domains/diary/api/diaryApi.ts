import api from '@/apis/apiClient';

interface DiaryData {
  title: string;
  content: string;
  dreamDate: string;
  isPublic: string;
  mainEmotion: string;
  tags: string[];
}

export const diaryApi = {
  // 일기 생성
  createDiary: async (diaryData: DiaryData) => {
    return await api.post('/diaries', diaryData);
  },

  // 일기 목록 조회
  getDiaries: async () => {
    return await api.get('/diaries/me');
  },

  // 수정할 예정입니다,,,
  // // 일기 수정
  // updateDiary: async (diarySeq, diaryData) => {
  //   return await axios.put(`${API_BASE_URL}/diaries/${diarySeq}`, diaryData);
  // },

  // // 일기 조회
  // getDiaryById: async (diarySeq) => {
  //   return await axios.get(`${API_BASE_URL}/diaries/${diarySeq}`);
  // },

  // // 일기 삭제
  // deleteDiary: async (diarySeq) => {
  //   return await axios.delete(`${API_BASE_URL}/diaries/${diarySeq}`);
  // },
};
