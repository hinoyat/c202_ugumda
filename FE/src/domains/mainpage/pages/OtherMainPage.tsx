// 다른 사람의 우주 페이지

import Blackhole from '@/domains/mainpage/components/Blackhole';
import GuestbookIcon from '@/domains/mainpage/components/GuestbookIcon';
import Universe from '@/domains/mainpage/components/universe/Universe';
import UserSpaceHeader from '@/domains/mainpage/components/UserSpaceHeader ';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const OtherMainPage = () => {
  console.log('🟡 다른 사람 메인 렌더링됨');

  useEffect(() => {
    console.log('✅ OtherMainPage 마운트됨!');
  }, []);

  const nav = useNavigate();

  //          좌측 상단 UserSpaceHeader 컴포넌트          //
  const isMySpace = false; // 내 우주인지 여부
  const myNickname = '내 우주일때';
  const othernickname = '다른 유저 우주일때';

  const handleButtonClick = () => {
    console.log('구독취소 버튼 클릭됨');
  };

  return (
    <div className="flex flex-col items-start min-h-screen bg-black text-white relative">
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

      {/* 블랙홀 - 다른 사람의 우주로 가기 */}
      <div className="absolute top-0 right-0">
        <Blackhole />
      </div>

      {/* 방명록 */}
      <div className="absolute bottom-0 left-0 mb-5 ml-5">
        <GuestbookIcon size={0.5} />
      </div>
    </div>
  );
};
export default OtherMainPage;
