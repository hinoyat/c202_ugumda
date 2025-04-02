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

  // 유저 정보 확인을 위한 콘솔 로그 추가
  console.log('👤 로그인 유저 정보:', loginUser);
  console.log('🔍 방문 유저 정보:', visitUser);

  //      방명록 표시 여부      //
  const [showGuestbook, setShowGuestbook] = useState(false);
  const onClickGuestBookModal = () => {
    setShowGuestbook(!showGuestbook);
  };

  useEffect(() => {
    if (params.username) {
      console.log('✅ MainPage 마운트됨!');
      dispatch(visitUserpage({ username: params.username }));
    }
  }, [params.username, dispatch]);

  // visitUser가 변경될 때마다 로그 출력
  useEffect(() => {
    if (visitUser) {
      console.log('🌟 visitUser 업데이트됨:', visitUser);
      console.log('🌟 visitUser.userSeq:', visitUser.userSeq);
    }
  }, [visitUser]);

  // 방문하려는 유저 정보를 가져오는 데 실패하면 내 페이지로 이동
  useEffect(() => {
    if (params.username === '') {
      nav(`/${loginUser?.username}`, { replace: true });
    }
  }, [params.username, nav]);

  //          좌측 상단 UserSpaceHeader 컴포넌트          //
  const isMySpace = params.username === loginUser?.username ? true : false; // 내 우주인지 여부
  console.log('🏠 isMySpace:', isMySpace);

  const handleButtonClick = async () => {
    // 로그아웃 버튼 로직
    await dispatch(logoutUser());
    nav('/intro', { replace: true });
    window.location.reload(); // 새로고침 -> refresh 삭제하려고, 백엔드한테 삭제 되나 요청해보기
  };

  return (
    <div className="flex flex-col items-start text-white relative w-screen h-screen overflow-hidden">
      {/* 우주영역 */}
      <Universe
        isMySpace={isMySpace}
        // 내 우주면 userSeq 안넘기고 다른 사람 우주면 넘겨줌 (목록조회를 위해)
        userSeq={isMySpace ? undefined : visitUser?.userSeq}
      />

      {/* 닉네임님의 우주입니다 & 버튼 */}
      <div className="absolute top-5 left-5">
        <UserSpaceHeader
          nickname={isMySpace ? loginUser?.nickname : visitUser?.nickname}
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
