// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
}

// 인증 상태 타입
export interface AuthState {
  // user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// 로그인 요청 시 필요한 데이터 타입
export interface LoginCredentials {
  username: string;
  password: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponse {
  user: User;
  accessToken: string;
  // refreshToken: string;
}

// 리프레시 토큰 응답 데이터 타입
export interface RefreshResponse {
  accessToken: string;
}
