export interface EmotionCount {
    emotion: string;
    count: number;
  }

export interface PeriodData {
    name: number;
    data: EmotionCount[];
  }


// 기간별 꿈 데이터
export const dreamPeriodData: PeriodData[] = [
    {
      name: 14, // 14일간 데이터
      data: [
        { emotion: '행복', count: 7 },
        { emotion: '슬픔', count: 12 },
        { emotion: '분노', count: 9 },
        { emotion: '불안', count: 11 },
        { emotion: '평화', count: 5 },
        { emotion: '희망', count: 8 },
        { emotion: '공포', count: 10}
      ]
    },
    {
      name: 30, // 30일간 데이터
      data: [
        { emotion: '행복', count: 15},
        { emotion: '슬픔', count: 27 },
        { emotion: '분노', count: 20 },
        { emotion: '불안', count: 25},
        { emotion: '평화', count: 13 },
        { emotion: '희망', count: 18 },
        { emotion: '공포', count: 22 }
      ]
    }
  ];