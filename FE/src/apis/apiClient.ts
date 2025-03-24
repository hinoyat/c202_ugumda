import axios from 'axios';
import Cookies from 'js-cookie';
import { store } from '../stores/store';
import { refreshToken, logoutUser } from '../stores/auth/authThunks';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
});

// 요청 인터셉터 - Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 401 (Unauthorized) 발생 시 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResult = await store.dispatch(refreshToken()).unwrap();
        error.config.headers.Authorization = `Bearer ${refreshResult.accessToken}`;

        // 원래 요청 재시도
        return axios(error.config);
      } catch {
        store.dispatch(logoutUser());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
