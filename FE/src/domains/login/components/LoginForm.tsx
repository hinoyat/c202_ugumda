import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@/domains/login/style/SpaceLoginForm.css';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const onClickGoToSignup = () => {
    nav('/signup');
  };
  const onClickGoToHome = () => {
    nav('/');
  };

  return (
    <form className="form">
      {/* 뒤로가기 버튼 아직 뒤로가기 기능 안넣음 나중에 link나 useNavigate로 뒤로가기 기능 넣으면 될듯! */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px',
        }}>
        <button
          type="button"
          onClick={onClickGoToHome}
          style={{
            color: '#fff',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}>
          <FaArrowLeftLong size={20} />
        </button>
      </div>

      {/* 폼 타이틀 부분 */}
      <div className="form-title">
        <span>sign in to your</span>
      </div>
      <div className="title-2">
        <span>SPACE</span>
      </div>

      {/* 로그인 입력 폼 피그마 그대로 했는데 아이디랑 비밀번호 border-b gray-200 했더니 그냥 안보여서 400으로 up */}
      {/* 이메일 입력 부분 - placeholder 한국어로 유지 */}
      <div className="input-container">
        <input
          className="input-mail"
          type="text"
          placeholder="아이디를 입력하세요"
        />
        <span> </span>
      </div>

      {/* 별이 흐르는 배경 효과 */}
      <section className="bg-stars">
        <span className="star"></span>
        <span className="star"></span>
        <span className="star"></span>
        <span className="star"></span>
      </section>

      {/* 비밀번호 입력 부분 - 기존 코드의 보이기/숨기기 기능 유지 */}
      <div className="input-container">
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            className="input-pwd"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
          />
          {/* 비밀번호 보이고 안보이게 하는거 */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
            }}>
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="submit">
        <span className="sign-text">Login</span>
      </button>

      {/* 회원가입 링크 */}
      <p className="signup-link">
        Don't have an account?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClickGoToSignup();
          }}
          className="up">
          Signup Here
        </a>
      </p>
      {/*버튼 영역 종료 */}
      {/*로그인 폼 종료 */}
      {/* 로그인 패딩 준거 종료 */}
    </form>
  );
};

export default LoginForm;
