import { useState } from 'react';
import { Guestbookdata } from '../apis/apiOthersGuestBook';
import exampleProfile from '@/assets/images/exampleProfile.svg';
import trash from '@/assets/images/trash.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

interface GuestBookListProps {
  data?: Guestbookdata[];
  onDelete?: (guestbookSeq: number) => void;
}

const GuestBookList: React.FC<GuestBookListProps> = ({ data = [], onDelete }) => {

  const LoginUserNumber = useSelector((state: RootState) => state.auth?.user?.userSeq);
    // 페이지네이션 관련 state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; // 페이지당 표시할 아이템 수
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    // 현재 페이지에 따라 슬라이싱할 범위
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];
    console.log('GuestBookList received data:', data);
    console.log('Data type:', typeof data, Array.isArray(data));
  
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
      {/* 내용 부분 */}
      {displayedData.map((item) => (
        <div
          key={item.guestbookSeq}
          className="flex items-center gap-4 p-2 w-full text-[14px]">
          <p className="w-[78%] truncate">{item.content}</p>
          {/* 프로필과 닉네임 영역 */}
          <div className="flex items-center gap-2 w-32">
            <img
            //  어떻게 줘야하지?
              // src={item.writerIconSeq}
              alt="profile"
              className="w-6"
            />
            <p className="truncate">{item.writerNickname}</p>
          </div>
          {/* 작성일 영역 */}
          <div className="flex gap-3">
            <p className="w-24">{item.createdAt}</p>
            <div className="w-8 text-center">
              {LoginUserNumber === item.writerSeq || LoginUserNumber === item.ownerSeq ? (
                <img
                  src={trash}
                  className="w-4 h-6 hover:animate-pulse cursor-pointer"
                  onClick={() => onDelete && onDelete(item.guestbookSeq)}
                />
              ) : (
                ''
              )}
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
