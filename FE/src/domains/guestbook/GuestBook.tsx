import GuestBookList from './components/GuestBookList';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { getMyGuestbookEntries, UserGuestbookResponse } from './apis/apiUserGuestbook';
import { GuestbookOtherapi } from './apis/apiOthersGuestBook';
import MainPage from '../mainpage/pages/MainPage';
import exampleProfile from '@/assets/images/exampleProfile.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';


interface MainPageProps {
  onClose: () => void;
}


const GuestBook: React.FC<MainPageProps> = ({onClose}) => {
  
  // 페이지 유저 번호
  const LoginUserNumber = useSelector((state: RootState) => state.auth?.user?.userSeq);
  const PageUser = useSelector((state: RootState) => state.userpage);
  const PageUserNumber = useSelector((state: RootState) => state.userpage.userSeq);
  console.log("페이지 주인번호!", PageUserNumber)
  console.log('현재 유저번호:', LoginUserNumber);

  
  // 방명록 데이터를 저장할 상태 
  const [guestbookEntries, setGuestbookEntries] = useState<UserGuestbookResponse[]>([]);
  // 방명록 입력 상태 추가
  const [newEntry, setNewEntry] = useState('');
  // 로딩 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry(e.target.value);
  };

  // 방명록 데이터 가져오기 함수
  const fetchGuestbook = async () => {
    if (!PageUserNumber) return;

    let data;
    if(PageUserNumber === LoginUserNumber){
      data = await getMyGuestbookEntries();
      console.log("📜 내 방명록 데이터:", data);
    }
    else {
      data = await GuestbookOtherapi.getGuestbookEntries(PageUserNumber);
      console.log("📜 다른 사람 방명록 데이터:", data);
    }

    if (data) {
      setGuestbookEntries(data);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    if (PageUserNumber){
      fetchGuestbook();
    }
  }, [PageUserNumber]);



 // 방명록 작성 제출 핸들러
 const handleSubmit = async () => {
  if (!newEntry.trim() || isSubmitting) return;
  
  try {
    setIsSubmitting(true);
    
    // PageUserNumber가 방명록 주인의 번호이므로 이 번호로 작성 API 호출
    const response = await GuestbookOtherapi.createGuestbookEntry(PageUserNumber, newEntry);
    
    if (response) {
      console.log("✅ 방명록 작성 성공:", response);
      // 입력 필드 초기화
      setNewEntry('');
      // 방명록 목록 새로고침
      fetchGuestbook();
    }
  } catch (error) {
    console.error("❌ 방명록 작성 실패:", error);
  } finally {
    setIsSubmitting(false);
  }
};

// 박명록 삭제 함수
const handleDeleteEntry = async (guestbookSeq: number) => {
    try {
      const response = await GuestbookOtherapi.deleteGuestbookEntry(guestbookSeq);
      
      fetchGuestbook();
    } catch (error) {
      console.error("❌ 방명록 삭제 실패:", error);
    }
  }

  
  const nav = useNavigate();
  const onClickHome = () => {
    nav('/');
  };


  return (
    <div className="">
      {/* <MainPage /> */}
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      {/* 모달 가장 바깥 부분 */}
      <div className="absolute w-[60%] h-[75%] rounded-lg bg-[#6E6E6E]/75 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      {/* 모달 콘텐츠 전체 */}
      <div className="absolute w-[60%] h-[75%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* 닫기버튼 */}
        <div
          className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
          onClick={onClose}>
          <IoClose className="text-gray-200 text-3xl hover:text-gray-400" />
        </div>
        <div className="flex flex-col p-10 gap-10 w-full">
          {/*헤더 부분 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-white font-semibold text-xl">
                {PageUser.nickname} 님의 방명록
              </h1>
              {/* 소개글 */}
              <p className="ml-0.5 text-white font-light text-xs">
                {PageUser.introduction}
              </p>
            </div>
            {/* 프로필 아이콘 */}
            <img
              src={PageUser.iconSeq}
              alt=""
              className="w-13"
            />
          </div>

          {/*방명록 남기는 부분 */}
          <div className="flex gap-7 justify-center text-sm">
            <input
              type="text"
              placeholder="내용을 입력해 주세요."
              className="w-[90%] p-1 border-b border-gray-300 text-gray-300 outline-none"
              value={newEntry}
              onChange={handleInputChange}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <button className=" bg-neutral-700 px-2 py-1 text-white rounded text-[13px] w-[10%] cursor-pointer hover:bg-neutral-400"
            onClick={handleSubmit}
            disabled={isSubmitting}
            >
              남기기
            </button>
          </div>

          <GuestBookList 
          data={guestbookEntries?.data || []}
          onDelete={handleDeleteEntry}
          />
        </div>
      </div>
    </div>
  );
};

export default GuestBook;
