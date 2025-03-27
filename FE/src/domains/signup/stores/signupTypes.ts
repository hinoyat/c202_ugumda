export interface SignupState {
  username: string;
  usernameStatus: 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid';
  usernameMessage: string;
  nickname: string;
  nicknameStatus: 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid';
  nicknameMessage: string;
  password: string;
  confirmPassword: string;
  passwordMessage: string;
  iconSeq: number;
  birthDate: string;
}

export interface SignupForm {
  username: string;
  password: string;
  nickname: string;
  iconSeq: number;
  birthDate: string;
}

export interface SignupResponse {
  data: SignupResponseData;
}

export interface SignupResponseData {
  userSeq: number;
  username: string;
  password: string;
  nickname: string;
  iconSeq: number;
  birthDate: string;
}
