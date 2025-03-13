import Blackhole from '@/domains/mainpage/components/Blackhole';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';
import GuestbookIcon from '@/domains/mainpage/components/GuestbookIcon';
import StarHoverMenu from '@/domains/mainpage/components/StarHoverMenu';
import UserSpaceHeader from '@/domains/mainpage/components/UserSpaceHeader ';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MainPage = () => {
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
    if (isMySpace) {
      console.log('로그아웃 실행');
    } else {
      console.log('구독 취소 실행');
    }
  };

  //          일기 미리보기 DiaryPreview 컴포넌트          //
  const exampleEntry = {
    title: '일기제목',
    content:
      '오늘은 무서운 꿈을 꿨다. 사자가 쫓아왔다. 나무가 엄청 많았고 엄청 빠르게 달렸지만...',
    tags: [
      { id: '1', name: '악몽' },
      { id: '2', name: '사자' },
      { id: '3', name: '달리기' },
    ],
  };

  //          StarHoverMenu 컴포넌트          //
  const handleStarEdit = () => {
    console.log('호버메뉴 - 수정클릭');
  };

  const handleStarDelete = () => {
    console.log('호버메뉴 - 삭제클릭');
  };

  const handleStarView = () => {
    console.log('호버메뉴 - 일기보기');
    nav('/diary/view/123'); // 예시 일기 ID
  };

  return (
    <div className="flex flex-col overflow-hidden items-start min-h-screen bg-black text-white">
      {/* 다이어리 미리보기 컴포넌트 */}
      <div className="absolute top-40 left-5">
        <DiaryPreview {...exampleEntry} />
      </div>
      {/* 닉네임님의 우주입니다 + 버튼 */}
      <div className="absolute top-5 left-5">
        <UserSpaceHeader
          nickname={isMySpace ? myNickname : othernickname}
          onButtonClick={handleButtonClick}
          buttonLabel={isMySpace ? '로그아웃' : '구독취소'}
        />
      </div>
      {/* 별 호버 메뉴 테스트 */}
      <div className="absolute top-1/2 left-1/2">
        <StarHoverMenu
          onEdit={handleStarEdit}
          onDelete={handleStarDelete}
          onView={handleStarView}
        />
      </div>
      메인페이지 입니다.
      <div className="flex flex-col">
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

        {/* 블랙홀 - 다른 사람의 우주로 가기 */}
        <div className="absolute left-20 bottom-30">
          <Blackhole />
        </div>

        {/* 방명록 */}
        <div className="absolute left-70 bottom-60">
          <GuestbookIcon size={0.5} />
        </div>
      </div>
    </div>
  );
};
export default MainPage;
