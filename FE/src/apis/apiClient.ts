import axios from 'axios';
import { store } from '../stores/store';
import { logoutUser, updateToken } from '../stores/auth/authThunks';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
});

interface JwtPayload {
  userSeq: number;
}

// 요청 인터셉터 - Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  console.log('api interceptors', config);

  const token: string = localStorage.getItem('accessToken') || '';
  // const jwtTMP: JwtPayload = jwtDecode(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // config.headers['X-User-Seq'] = jwtTMP.userSeq;
  }
  return config;
});

// 응답 인터셉터 - 401 (Unauthorized) 발생 시 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 갱신 요청 자체가 401 에러를 반환하면 로그아웃 처리
    if (originalRequest.url === '/auth/refresh') {
      store.dispatch(logoutUser());
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResult = await store.dispatch(updateToken()).unwrap();
        originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
        return api(originalRequest);
      } catch {
        store.dispatch(logoutUser());
      }
    }

    // 403 에러 발생 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 403) {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
