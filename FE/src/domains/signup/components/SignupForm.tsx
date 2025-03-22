import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GrPowerCycle } from 'react-icons/gr';
import exampleProfile from '@/assets/images/exampleProfile.svg';
import '@/domains/login/style/SpaceLoginForm.css';
import '@/domains/signup/style/BoxButton.css';
import BoxButton from '@/domains/signup/components/BoxButton';

const SignupForm = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onClickGoToHome = () => {
    nav('/');
  };

  const onClickGoToLogin = () => {
    nav('/login');
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="form"
        style={{ width: '750px', maxWidth: '95vw' }}>
        {/* 폼 타이틀 부분 */}
        <div className="form-title">
          <span>create your</span>
        </div>
        <div className="title-2">
          <span>ACCOUNT</span>
        </div>

        {/* 별이 흐르는 배경 효과 */}
        <section className="bg-stars">
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </section>

        {/* 두 칼럼으로 나누기 위한 컨테이너 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '45px',
            marginTop: '20px',
          }}>
          {/* 왼쪽 칼럼: 아이디, 비밀번호, 비밀번호 확인 */}
          <div style={{ flex: 1 }}>
            {/* 아이디 입력 부분 */}
            <div
              className="input-container"
              style={{
                display: 'flex',
                gap: '8px',
                width: '100%',
                marginTop: '36px',
              }}>
              <input
                className="input-mail"
                type="text"
                placeholder="아이디를 입력하세요"
                style={{ flex: 3, width: 'auto' }}
              />

              <BoxButton text="중복확인" />
            </div>

            {/* 비밀번호 입력 부분 */}
            <div
              className="input-container"
              style={{ width: '100%' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-mail"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  style={{ width: '100%' }}
                />
                {/* 비밀번호 보이고 안보이게 하는거 */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '35%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#333',
                    zIndex: 10,
                  }}>
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 입력 부분 */}
            <div
              className="input-container"
              style={{ width: '100%' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-mail"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  style={{ width: '100%' }}
                />
                {/* 비밀번호 보이고 안보이게 하는거 */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '35%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#333',
                    zIndex: 10,
                  }}>
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 칼럼: 프로필 아이콘, 닉네임, 생년월일 */}
          <div style={{ flex: 1 }}>
            {/* 프로필 이미지 부분 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '15px',
              }}>
              {/* 이미지와 버튼을 감싸는 컨테이너를 relative로 설정 */}
              <div
                style={{ position: 'relative', width: '60px', height: '60px' }}>
                <img
                  src={exampleProfile}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '36px',
                    zIndex: 5,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}>
                  <GrPowerCycle
                    className="text-white bg-blue-700 rounded-full cursor-pointer border border-white hover:bg-blue-500"
                    size={20}
                    style={{
                      background: '#2563eb',
                      borderRadius: '50%',
                      border: '1px solid white',
                      padding: '2px',
                    }}
                  />
                </button>
              </div>

              {/* 안내 문구 */}
              <p
                style={{
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  marginTop: '5px',
                }}>
                프로필 아이콘을 선택해주세요
              </p>
            </div>

            {/* 닉네임 입력 부분 */}
            <div
              className="input-container"
              style={{
                display: 'flex',
                gap: '8px',
                width: '100%',
              }}>
              <input
                className="input-mail"
                type="text"
                placeholder="닉네임을 입력하세요"
                style={{ flex: 3, width: 'auto' }}
              />
              <BoxButton text="중복확인" />
            </div>

            {/* 생년월일 입력 부분 */}
            <div
              className="input-container"
              style={{ width: '100%' }}>
              <input
                className="input-mail"
                type="text"
                placeholder="생년월일을 입력하세요(양력) (yyyy-mm-dd)"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="submit dung-font"
          style={{ marginTop: '20px' }}>
          <span className="sign-text dung-font">CREATE ACCOUNT</span>
        </button>

        {/* 로그인 링크 */}
        <p className="signup-link">
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClickGoToLogin();
            }}
            className="up">
            Log in
          </a>
        </p>
      </form>

      {/* 뒤로가기 버튼 */}
      <button
        type="button"
        onClick={onClickGoToHome}
        className="mt-4 flex items-center text-white hover:text-gray-300 transition-colors duration-300 cursor-pointer"
        style={{
          fontFamily: 'monospace',
          fontSize: '1rem',
        }}>
        뒤로가기
      </button>
    </div>
  );
};

export default SignupForm;
