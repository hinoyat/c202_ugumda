export interface UserpageState {
  userSeq: number;
  username: string;
  nickname: string;
  birthDate: string;
  introduction: string | null;
  iconSeq: number;
}

export interface visitResponse {
  data: UserpageState;
}
