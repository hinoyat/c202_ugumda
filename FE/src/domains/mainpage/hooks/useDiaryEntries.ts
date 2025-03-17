// 일기 항목 관리 커스텀 훅

import { useState, useEffect } from 'react';
import DiaryEntry, { Position } from '../models/DiaryEntry';

interface DummyEntryData {
  id: string;
  content: string;
  date: Date;
  position: Position;
}

interface UseDiaryEntriesReturn {
  entries: DiaryEntry[];
  addEntry: (content: string) => void;
  removeEntry: (id: string) => void;
}

export const useDiaryEntries = (): UseDiaryEntriesReturn => {
  const createDummyEntries = (): DiaryEntry[] => {
    //          일기 별 예시를 위한 목데이터          //
    const dummyData: DummyEntryData[] = [
      {
        id: '1',
        content:
          '오늘은 정말 좋은 하루였다. 친구들과 함께 놀이공원에 가서 재미있게 놀았다.',
        date: new Date(2023, 2, 15),
        position: { x: 25.604, y: -96.667, z: 0.0 },
      },
      {
        id: '2',
        content: '시험 준비가 힘들었지만 좋은 결과를 얻어서 기분이 좋다.',
        date: new Date(2023, 3, 2),
        position: { x: -32.141, y: -90.0, z: 29.444 },
      },
      {
        id: '3',
        content: '새로운 프로젝트를 시작했다. 우주 테마 일기장을 만들고 있다.',
        date: new Date(2023, 4, 10),
        position: { x: 4.833, y: -83.333, z: -55.065 },
      },
      {
        id: '4',
        content:
          '오늘은 가족들과 함께 소풍을 갔다. 자연 속에서 맛있는 음식을 먹으며 휴식을 취했다.',
        date: new Date(2023, 5, 20),
        position: { x: 70.192, y: 12.345, z: -30.789 },
      },
      {
        id: '5',
        content:
          '새로운 취미로 그림 그리기를 시작했다. 아직 서툴지만 즐겁게 그리고 있다.',
        date: new Date(2023, 6, 8),
        position: { x: -50.987, y: 45.678, z: 90.123 },
      },
      {
        id: '6',
        content: '비가 오는 날이었다. 창밖을 보며 따뜻한 차 한 잔을 마셨다.',
        date: new Date(2023, 7, 15),
        position: { x: 10.245, y: -20.987, z: 35.678 },
      },
      {
        id: '7',
        content: '오랜만에 독서를 했다. 책 속에서 새로운 세상을 만났다.',
        date: new Date(2023, 8, 3),
        position: { x: -15.678, y: 30.456, z: -40.123 },
      },
      {
        id: '8',
        content: '하루 종일 음악을 들었다. 좋아하는 노래가 위로가 되었다.',
        date: new Date(2023, 9, 22),
        position: { x: 22.456, y: -5.321, z: 60.789 },
      },
      {
        id: '9',
        content: '새로운 친구를 사귀었다. 공통 관심사가 많아서 즐거웠다.',
        date: new Date(2023, 10, 11),
        position: { x: -40.987, y: 15.678, z: -25.432 },
      },
      {
        id: '10',
        content:
          '오랜만에 가족들과 보드게임을 했다. 승패보다 함께한 시간이 소중했다.',
        date: new Date(2023, 11, 5),
        position: { x: 50.123, y: -35.789, z: 12.345 },
      },
      {
        id: '11',
        content: '조깅을 시작했다. 아침 공기가 상쾌하고 기분이 좋다.',
        date: new Date(2024, 0, 18),
        position: { x: -60.432, y: 22.987, z: 45.678 },
      },
      {
        id: '12',
        content: '좋아하는 카페에서 커피를 마셨다. 여유로운 시간이 좋았다.',
        date: new Date(2024, 1, 27),
        position: { x: 35.678, y: -12.456, z: -55.123 },
      },
      {
        id: '13',
        content: '첫 요리에 도전했다. 맛은 부족했지만 성취감이 컸다.',
        date: new Date(2024, 2, 9),
        position: { x: -25.123, y: 40.567, z: 30.789 },
      },
      {
        id: '14',
        content: '새로운 도시로 여행을 떠났다. 낯선 곳에서의 경험이 신선했다.',
        date: new Date(2024, 3, 14),
        position: { x: 70.89, y: -28.456, z: 15.678 },
      },
      {
        id: '15',
        content:
          '밤하늘의 별을 보며 많은 생각을 했다. 우주는 참 넓고 신비롭다.',
        date: new Date(2024, 4, 25),
        position: { x: -80.234, y: 10.987, z: -20.543 },
      },
    ];

    return dummyData.map(
      (entry) =>
        new DiaryEntry(entry.id, entry.content, entry.date, entry.position)
    );
  };

  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('diaryEntries');
    if (storedEntries) {
      try {
        const parsedData = JSON.parse(storedEntries);
        const parsedEntries = parsedData.map(
          (entry: any) =>
            new DiaryEntry(
              entry.id,
              entry.content,
              new Date(entry.date),
              entry.position
            )
        );
        setEntries(parsedEntries);
      } catch (error) {
        console.error('일기 데이터를 불러오는 중 오류 발생:', error);
        setEntries(createDummyEntries());
      }
    } else {
      setEntries(createDummyEntries());
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = (content: string): void => {
    const newEntry = new DiaryEntry(Date.now().toString(), content, new Date());

    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const removeEntry = (id: string): void => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  return {
    entries,
    addEntry,
    removeEntry,
  };
};
