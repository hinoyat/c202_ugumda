import api from '@/apis/apiClient';

export interface Tag {
  tagSeq: number;
  name: string;
}

export const tagApi = {
  // 최근 사용 태그 7개 가져오기
  getRecentTags: async (limit: number = 7) => {
    return await api.get('/tags/recent');
  },
};
