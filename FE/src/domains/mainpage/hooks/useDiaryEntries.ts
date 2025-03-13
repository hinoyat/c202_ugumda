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
