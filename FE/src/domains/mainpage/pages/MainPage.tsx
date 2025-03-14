// 나의 우주페이지
import GuestBook from '@/domains/guestbook/GuestBook';
import Blackhole from '@/domains/mainpage/components/Blackhole';
import GuestbookIcon from '@/domains/mainpage/components/GuestbookIcon';
import Universe from '@/domains/mainpage/components/universe/Universe';
import UserSpaceHeader from '@/domains/mainpage/components/UserSpaceHeader ';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MainPage = () => {
  console.log('🟡 내 메인 렌더링!');

  //      방명록 표시 여부      //
  const [showGuestbook, setShowGuestbook] = useState(false);
  const onClickGuestBookModal = () => {
    setShowGuestbook(!showGuestbook);
  };

  useEffect(() => {
    console.log('✅ MainPage 마운트됨!');
  }, []);

  const nav = useNavigate();

  const onClickLogin = () => {
    nav('/login');
  };
  const onClickSignup = () => {
    nav('/signup');
  };

  //          좌측 상단 UserSpaceHeader 컴포넌트          //
  const isMySpace = true; // 내 우주인지 여부
  const myNickname = '내 우주일때';
  const othernickname = '다른 유저 우주일때';

  const handleButtonClick = () => {
    console.log('로그아웃 버튼 클릭됨');
  };

  return (
    <div className="flex flex-col items-start bg-black text-white relative w-screen h-screen overflow-hidden">
      {/* 우주영역 */}
      <Universe />

      {/* 닉네임님의 우주입니다 & 버튼 */}
      <div className="absolute top-5 left-5">
        <UserSpaceHeader
          nickname={isMySpace ? myNickname : othernickname}
          onButtonClick={handleButtonClick}
          buttonLabel={isMySpace ? '로그아웃' : '구독취소'}
        />
      </div>

      {/* 주짜니 쓰는 부분  relative z-10 해서 위로 올려둠 */}
      <div className="flex flex-col absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p>메인페이지 입니다.</p>
        <button
          onClick={onClickLogin}
          className="text-yellow-500 cursor-pointer">
          {' '}
          로그인
        </button>
        <button
          onClick={onClickSignup}
          className="text-yellow-500 cursor-pointer">
          {' '}
          회원가입
        </button>
        <Link
          to="/spaceship"
          className="text-yellow-500 cursor-pointer">
          우주선
        </Link>
        <Link
          to="/luckynumber"
          className="text-yellow-500 cursor-pointer">
          행운의번호
        </Link>
        <Link
          to="/todayfortune"
          className="text-yellow-500 cursor-pointer">
          오늘의 운세
        </Link>
        <Link
          to="/dreamsolve"
          className="text-yellow-500 cursor-pointer">
          꿈해몽
        </Link>
      </div>

      {/* 블랙홀 - 다른 사람의 우주로 가기 */}
      <div className="absolute top-0 right-0">
        <Blackhole />
      </div>

      {/* 방명록 */}
      <div className="absolute bottom-0 left-0 mb-5 ml-5 z-10">
        <div onClick={onClickGuestBookModal}>
          <GuestbookIcon size={0.5} />
        </div>
      </div>

      {/* 방명록 모달 (조건부 렌더링) */}
      {showGuestbook && <GuestBook onClose={onClickGuestBookModal} />}
    </div>
  );
};
export default MainPage;
