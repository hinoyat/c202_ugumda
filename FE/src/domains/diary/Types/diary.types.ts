// 일기
export interface DiaryData {
  diarySeq?: number; // 생성 시에는 없을 수 있음
  title: string;
  content: string;
  dreamDate: string;
  isPublic: string;
  mainEmotion: string;
  tags?: string[];
}
