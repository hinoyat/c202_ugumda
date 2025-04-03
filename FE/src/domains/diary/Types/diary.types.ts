// 일기
export interface DiaryData {
  diarySeq?: number; // 생성 시에는 없을 수 있음
  userSeq: number;
  title: string;
  content: string;
  videoUrl?: string | null;
  dreamDate: string;
  isPublic: string;
  mainEmotion?: string;
  emotionName?: string;
  emotionSeq?: number;
  tags?: string[] | { tagSeq: number; name: string }[];

  createdAt?: string;
  updatedAt?: string;

  likeCount?: number;
  hasLiked?: boolean;
  x?: number;
  y?: number;
  z?: number;
  connectedDiaries?: number[] | null;
}

// 영상 생성
export interface VideoCreateData {
  diary_pk: number;
  content: string;
}
