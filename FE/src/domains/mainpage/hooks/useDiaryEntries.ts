// 일기 항목 관리 커스텀 훅
// 1. 일기목록 상태관리 : 앱 전체에서 사용될 수 있는 일기 목록 상태를 제공
// 2. 로컬 스토리지 동기화
// 3. 일기 추가, 수정, 삭제

import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';
import { useState, useEffect } from 'react';

export interface Position {
  x: number;
  y: number;
  z: number;
}

// 일기 목록, 일기 추가 및 삭제 메서드의 타입
interface UseDiaryEntriesReturn {
  entries: DiaryEntry[];
  addEntry: (
    newEntry:
      | DiaryEntry
      | {
          title: string;
          content: string;
          tags: string[];
          is_public: 'Y' | 'N';
        }
  ) => void;
  removeEntry: (id: number) => void;
}

export const useDiaryEntries = (): UseDiaryEntriesReturn => {
  // 일기 목록 상태 관리
  // 앱 전체에서 사용될 일기 목록 상태
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // 로컬 스토리지에서 일기 데이터 불러오기
  // 앱 초기 로드 시 실행되며, 저장된 데이터가 없으면 더미 데이터 사용
  useEffect(() => {
    const storedEntries = localStorage.getItem('diaryEntries');
    if (storedEntries) {
      try {
        const parsedData = JSON.parse(storedEntries);
        const parsedEntries = parsedData.map((entry: any) => {
          // 태그를 문자열 배열로 확실히 변환
          // 아직 ERD 수정 중. 태그가 int로 되어있기 때문에 문자로 변환해야함
          const tags = Array.isArray(entry.tags)
            ? entry.tags.map((tag: any) => String(tag))
            : [];

          return DiaryEntry.create({
            user_seq: entry.user_seq || 1, // 기본값 설정. 추후 currentUserId
            title: entry.title,
            content: entry.content,
            tags: tags,
            is_public: entry.is_public ? 'Y' : 'N', // boolean을 'Y'/'N'으로 변환
            video_url: entry.video_url || null,
            dream_date: entry.dream_date,
          });
        });
        setEntries(parsedEntries);
      } catch (error) {
        console.error('일기 데이터를 불러오는 중 오류 발생:', error);
        setEntries([]);
      }
    } else {
      setEntries([]);
    }
  }, []);

  // 일기 목록 변경 시 로컬 스토리지에 저장
  // 일기 추가/삭제 시 자동으로 로컬 스토리지 업데이트
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }
  }, [entries]);

  //------------------------일기 수정 / 생성 -------------------------------//
  // DiaryEntry 객체 또는 일기 데이터 객체를 받아 entries 상태에 추가
  const addEntry = (
    newEntry:
      | DiaryEntry
      | {
          title: string;
          content: string;
          tags: string[];
          is_public: 'Y' | 'N';
        }
  ): void => {
    //      DiaryEntry 객체인 경우 그대로 추가(일기수정)     //
    if (newEntry instanceof DiaryEntry) {
      setEntries((prevEntries) => [...prevEntries, newEntry]);
    }

    //      객체 리터럴인 경우 DiaryEntry로 변환 후 추가(일기생성)     //
    else {
      const entry = DiaryEntry.create({
        user_seq: 1,
        title: newEntry.title,
        content: newEntry.content,
        tags: newEntry.tags,
        is_public: newEntry.is_public,
      });
      setEntries((prevEntries) => [...prevEntries, entry]);
    }
  };

  //----------------일기 삭제 메서드------------------------//
  const removeEntry = (id: number): void => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.diary_seq !== id)
    );
  };

  return {
    entries,
    addEntry,
    removeEntry,
  };
};
