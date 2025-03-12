// DiarySearch.tsx
import { useState } from 'react';
import DiaryList from './DiaryList';

const DiarySearch = () => {
  // 실제로는 체크박스 상태나 검색어를 담을 state를 따로 관리해도 됩니다.
  // 여기서는 단순히 "검색" 버튼을 누르면 임시 데이터가 뜨도록 예시만 보여줍니다.
  const [diaries, setDiaries] = useState<any[]>([]);

  // 검색 버튼을 클릭했을 때 호출될 함수
  const handleSearch = () => {
    // 실제로는 fetch/axios로 API 호출 후, 결과값을 setDiaries에 저장
    // 여기서는 샘플(임시) 데이터 예시
    const sampleData = [
      {
        id: 1,
        title: '첫 번째 일기',
        content: '오늘은 날씨가 참 좋았다...',
        author: '닉네임1',
        tags: ['#태그1', '#태그2'],
      },
      {
        id: 2,
        title: '두 번째 일기',
        content: '내용이 조금 길어질 수 있다...',
        author: '닉네임2',
        tags: ['#태그3', '#태그4'],
      },
    ];
    setDiaries(sampleData);
  };

  return (
    <div className="w-full text-white">
      {/* 검색 옵션 영역 */}
      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="checkbox"
            value="현재 우주"
          />
          <span className="ml-1">현재 우주</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="제목"
          />
          <span className="ml-1">제목</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="내용"
          />
          <span className="ml-1">내용</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="태그"
          />
          <span className="ml-1">태그</span>
        </label>
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600 mb-4">
        검색
      </button>

      {/* 검색 결과 리스트: diaries 배열을 순회하여 DiaryList 컴포넌트 렌더링 */}
      <div>
        {diaries.map((diary) => (
          <DiaryList
            key={diary.id}
            diary={diary}
          />
        ))}
      </div>
    </div>
  );
};

export default DiarySearch;
