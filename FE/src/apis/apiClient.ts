import axios from 'axios';
import { store } from '../stores/store';
import { logoutUser } from '../stores/auth/authThunks';
import { jwtDecode } from 'jwt-decode';

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
  const jwtTMP: JwtPayload = jwtDecode(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['X-User-Seq'] = jwtTMP.userSeq;
  }
  return config;
});

// 응답 인터셉터 - 401 (Unauthorized) 발생 시 토큰 갱신
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         const refreshResult = await store.dispatch(refreshToken()).unwrap();
//         error.config.headers.Authorization = `Bearer ${refreshResult.accessToken}`;

//         // 원래 요청 재시도
//         return axios(error.config);
//       } catch {
//         store.dispatch(logoutUser());
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
