// 나의 우주페이지
import GuestBook from '@/domains/guestbook/GuestBook';
import Blackhole from '@/domains/mainpage/components/Blackhole';
import GuestbookIcon from '@/domains/mainpage/components/GuestbookIcon';
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

  const dispatch = useAppDispatch();
  const loginUser = useSelector(selectUser);
  const params = useParams();

  const visitUser = useSelector(selectVisitUser);

  const nav = useNavigate();

  //      방명록 표시 여부      //
  const [showGuestbook, setShowGuestbook] = useState(false);
  const onClickGuestBookModal = () => {
    setShowGuestbook(!showGuestbook);
  };

  useEffect(() => {
    if (params.username) {
      console.log('✅ MainPage 마운트됨!');
      dispatch(visitUserpage({ username: params.username }));
      // dispatch(visitUserpage({ username: '2' })); // 일단 백이 userSeq니까 2 해두자
      console.log('방문한 페이지 주인장 정보', visitUser);
    }
  }, [params.username, dispatch]);

  // 방문하려는 유저 정보를 가져오는 데 실패하면 내 페이지로 이동
  useEffect(() => {
    if (params.username === '') {
      nav(`/${loginUser?.username}`, { replace: true });
    }
  }, [params.username, nav]);

  //          좌측 상단 UserSpaceHeader 컴포넌트          //
  const isMySpace = params.username === loginUser?.username ? true : false; // 내 우주인지 여부
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
          nickname={isMySpace ? loginUser?.nickname : visitUser?.nickname}
          onButtonClick={handleButtonClick}
          buttonLabel={isMySpace ? '로그아웃' : '구독취소'}
        />
      </div>
      {/* 주짜니 쓰는 부분  relative z-10 해서 위로 올려둠 */}
      {/* <div className="flex flex-col absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
      </div> */}
      {/* 방명록
      <div className="absolute bottom-0 left-5 mb-10 ml-5 z-10">
        <div onClick={onClickGuestBookModal}>
          <GuestbookIcon size={0.5} />
        </div>
      </div> */}
      {/* 방명록 모달 (조건부 렌더링) */}
      {showGuestbook && <GuestBook onClose={onClickGuestBookModal} />}
    </div>
  );
};
export default MainPage;
