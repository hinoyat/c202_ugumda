import api from '@/apis/apiClient';

interface DreamSolveRequest {
  inputContent: string;
}

interface DreamSolveResponse {
  dreamMeaningSeq: number;
  userSeq: number;
  diarySeq: number;
  isGood: string;
  inputContent: string;
  resultContent: string;
  createdAt: string;
}

export const dreamApi = {
  // 꿈해몽 생성
  createDreamSove: async (diarySeq: number, content: string) => {
    const requestData: DreamSolveRequest = {
      inputContent: content,
    };
    return await api.post(`/dream-meaning/${diarySeq}`, requestData);
  },

  // 꿈해몽조회
  getDreamSolveById: async (diarySeq: number) => {
    return await api.get(`/dream-meaning/${diarySeq}`);
  },
};
