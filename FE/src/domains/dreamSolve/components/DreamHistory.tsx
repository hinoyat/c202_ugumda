import React, { useState } from 'react';

// 1) 데이터 타입 정의
interface HistoryItem {
  id: number;
  title: string;
  created_at: string;
}

const DreamHistory: React.FC = () => {
  // 2) Mock 데이터 & 페이지네이션 상태
  const historyData: HistoryItem[] = [
    { id: 1, title: '마음 속을 헤메다.', created_at: '2025-03-12' },
    { id: 2, title: '이상한 문을 열다.', created_at: '2025-03-11' },
    { id: 3, title: '말하는 동물들.', created_at: '2025-03-10' },
    { id: 4, title: '시간 여행을 하다.', created_at: '2025-03-09' },
    { id: 5, title: '하늘을 날아다녔다.', created_at: '2025-03-08' },
    { id: 6, title: '잊을 수 없는 낮선 도시', created_at: '2025-03-07' },
  ];

  // 페이지네이션 관련 state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // 페이지당 표시할 아이템 수
  const totalItems = historyData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지에 따라 슬라이싱할 범위
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = historyData.slice(startIndex, endIndex);

  // 페이지 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 이전 페이지
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // 다음 페이지
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 3) JSX 렌더링
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-[#6C4D2C] ml-10">MY DREAM HISTORY</h1>

      {/* 히스토리 목록 */}
      {/*이거 created_at 호버 효과 나중에 해야함 진짜 나중에 글씨 진해지게 */}
      <div className="flex flex-col gap-1 mx-10 px-2">
        {displayedData.map((item) => (
          <div
            key={item.id}
            className="text-[12px]">
            <div className="flex justify-between">
              <h2 className="text-white hover:underline cursor-pointer">
                {item.title}
              </h2>
              <p className="text-[#6C4D2C]">{item.created_at}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 영역 */}
      <div className="flex items-center gap-2 justify-center mt-4">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="text-[#6C4D2C] text-xl disabled:opacity-50">
          &laquo;
        </button>

        {/* 페이지 번호들 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-white text-sm cursor-pointer
              ${page === currentPage ? 'bg-[#6C4D2C]' : 'bg-[#8B4513]'}`}>
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="text-[#6C4D2C] text-xl disabled:opacity-50">
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default DreamHistory;
