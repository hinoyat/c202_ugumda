import { useState } from "react";

const GuestBookList = () => {
    const owner = { user_id: 1 };
  
    const mockdata = [
      { id: 1, user_id: 1, content: "방명록 테스트입니다.룰루랄라", profile: "exampleprofile.svg", nickname: "어린왕자", created_at: "2025-03-13" },
      { id: 2, user_id: 6, content: "방명록 테스트입니다.룰루랄라1", profile: "exampleprofile.svg", nickname: "꿈여행자2", created_at: "2025-03-13" },
      { id: 3, user_id: 5, content: "방명록 테스트입니다.룰루랄라12", profile: "exampleprofile.svg", nickname: "꿈여행자3", created_at: "2025-03-13" },
      { id: 4, user_id: 4, content: "방명록 테스트입니다.룰루랄라123", profile: "exampleprofile.svg", nickname: "꿈여행자4", created_at: "2025-03-13" },
      { id: 5, user_id: 2, content: "방명록 테스트입니다.룰루랄라1234", profile: "exampleprofile.svg", nickname: "꿈여행자5", created_at: "2025-03-13" },
    ];

    // 페이지네이션 관련 state
      const [currentPage, setCurrentPage] = useState<number>(1);
      const itemsPerPage = 10; // 페이지당 표시할 아이템 수
      const totalItems = mockdata.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
    
      // 현재 페이지에 따라 슬라이싱할 범위
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const displayedData = mockdata.slice(startIndex, endIndex);
    
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
  
    return (
      <div className="w-full text-white">
        {mockdata.map((visitor) => (
          <div
            key={visitor.id}
            className="flex items-center gap-4 p-2 w-full"
          >
            <p className="w-[78%] truncate">{visitor.content}</p>
            {/* 프로필과 닉네임 영역 */}
            <div className="flex items-center gap-2 w-32">
              <img src={visitor.profile} alt="profile" className="w-6" />
              <p className="truncate">{visitor.nickname}</p>
            </div>
            {/* 작성일 영역 */}
            <div className="flex gap-3">
                <p className="w-24">{visitor.created_at}</p>
                <div className="w-8 text-center">
                {owner.user_id === visitor.user_id ? <img src="trash.svg" className="w-4 h-6 hover:animate-pulse cursor-pointer" /> : ""}
                </div>
            </div>
          </div>
        ))}
        {/* 페이지네이션 영역 */}
      <div className="flex items-center gap-2 justify-center absolute bottom-15 left-1/2 transform -translate-x-1/2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="text-[#FBFBFB] text-xl disabled:opacity-50">
          &laquo;
        </button>

        {/* 페이지 번호들 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-black text-sm cursor-pointer
              ${page === currentPage ? 'bg-[#fbfbfb91]' : 'bg-[#FBFBFB]'}`}>
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="text-[#FBFBFB] text-xl disabled:opacity-50">
          &raquo;
        </button>
      </div>
      </div>

      

      
    );
  };
  
  export default GuestBookList;
  