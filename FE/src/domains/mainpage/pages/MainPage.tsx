// 나의 우주페이지
import GuestBook from '@/domains/guestbook/GuestBook';
import Universe from '@/domains/mainpage/components/universe/Universe';
import UserSpaceHeader from '@/domains/mainpage/components/UserSpaceHeader ';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/hooks';
import { logoutUser } from '@/stores/auth/authThunks';
import { useSelector } from 'react-redux';
import { selectUser } from '@/stores/auth/authSelectors';

const MainPage = () => {
  console.log('🟡 내 메인 렌더링!');
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

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
  // const myNickname = '내 우주일때';
  const othernickname = '다른 유저 우주일때';

  const handleButtonClick = async () => {
    await dispatch(logoutUser());
    nav('/login', { replace: true });
    window.location.reload(); // 새로고침 -> refresh 삭제하려고, 백엔드한테 삭제 되나 요청해보기
  };

  return (
    <div className="flex flex-col items-start text-white relative w-screen h-screen overflow-hidden">
      {/* 우주영역 */}
      <Universe isMySpace={true} />
      {/* 닉네임님의 우주입니다 & 버튼 */}
      <div className="absolute top-5 left-5">
        <UserSpaceHeader
          nickname={isMySpace ? user?.nickname : othernickname}
          onButtonClick={handleButtonClick}
          buttonLabel={isMySpace ? '로그아웃' : '구독취소'}
          isMySpace={isMySpace}
        />
      </div>

      {/* 방명록 모달 (조건부 렌더링) */}
      {showGuestbook && <GuestBook onClose={onClickGuestBookModal} />}
    </div>
  );
};
export default MainPage;
