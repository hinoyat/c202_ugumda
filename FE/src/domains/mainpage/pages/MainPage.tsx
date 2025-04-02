// 나의 우주페이지
import GuestBook from '@/domains/guestbook/GuestBook';
import Universe from '@/domains/mainpage/components/universe/Universe';
import UserSpaceHeader from '@/domains/mainpage/components/UserSpaceHeader ';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/hooks';
import { logoutUser } from '@/stores/auth/authThunks';
import { useSelector } from 'react-redux';
import { selectUser } from '@/stores/auth/authSelectors';
import { selectVisitUser } from '../stores/userSelectors';
import { visitUserpage } from '../stores/userThunks';

const MainPage = () => {
  console.log('🟡 내 메인 렌더링!');

  const params = useParams();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const loginUser = useSelector(selectUser);
  const visitUser = useSelector(selectVisitUser);

  //      방명록 표시 여부      //
  const [showGuestbook, setShowGuestbook] = useState(false);
  const onClickGuestBookModal = () => {
    setShowGuestbook(!showGuestbook);
  };

  useEffect(() => {
    if (params.username) {
      console.log('✅ MainPage 마운트됨!');
      console.log('내 우주인가?: ' + isMySpace);
      dispatch(visitUserpage({ username: params.username }));
    }
  }, [params, dispatch]);

  // 방문하려는 유저 정보를 가져오는 데 실패하면 내 페이지로 이동
  useEffect(() => {
    if (params.username === '') {
      nav(`/${loginUser?.username}`, { replace: true });
    }
  }, [params.username, nav]);

  //          좌측 상단 UserSpaceHeader 컴포넌트          //
  const isMySpace = params.username === loginUser?.username ? true : false; // 내 우주인지 여부

  const handleButtonClick = async () => {
    // 로그아웃 버튼 로직
    await dispatch(logoutUser());
    nav('/intro', { replace: true });
    window.location.reload(); // 새로고침 -> refresh 삭제하려고, 백엔드한테 삭제 되나 요청해보기
  };

  return (
    <div className="flex flex-col items-start text-white relative w-screen h-screen overflow-hidden">
      {/* 우주영역 */}
      <Universe isMySpace={isMySpace} />

      {/* 닉네임님의 우주입니다 & 버튼 */}
      <div className="absolute top-5 left-5">
        <UserSpaceHeader
          nickname={isMySpace ? loginUser?.nickname : visitUser?.nickname}
          isMySpace={isMySpace}
        />
      </div>

      {/* 방명록 모달 (조건부 렌더링) */}
      {showGuestbook && <GuestBook onClose={onClickGuestBookModal} />}
    </div>
  );
};
export default MainPage;
