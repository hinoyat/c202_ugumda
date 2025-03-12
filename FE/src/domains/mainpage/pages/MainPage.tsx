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
  return (
    <div className="flex flex-col items-start">
      메인페이지 입니다.
      <div className="flex flex-col">
        <button
          onClick={onClickLogin}
          className="text-blue-500 cursor-pointer">
          {' '}
          로그인
        </button>
        <button
          onClick={onClickSignup}
          className="text-blue-500 cursor-pointer">
          {' '}
          회원가입
        </button>
        <Link
          to="/spaceship"
          className="text-blue-500 cursor-pointer">
          우주선
        </Link>
        <Link
          to="/luckynumber"
          className="text-blue-500 cursor-pointer">
          행운의번호
        </Link>
        <Link
          to="/todayfortune"
          className="text-blue-500 cursor-pointer">
          오늘의 운세
        </Link>
        <Link
          to="/dreamsolve"
          className="text-blue-500 cursor-pointer">
          꿈해몽
        </Link>
      </div>
    </div>
  );
};
export default MainPage;
