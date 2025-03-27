import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '@/domains/login/themes/SpaceLoginForm.css';
import '@/domains/signup/themes/BoxButton.css';
import BoxButton from '@/domains/signup/components/BoxButton';
import ProfileIconSelector from '@/domains/signup/components/ProfileIconSelector';

// 프로필 아이콘 이미지 추가
const SignupForm = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  // 랜덤 프로필 아이콘
  const [selectedIcon, setSelectedIcon] = useState<{
    src: string;
    index: number;
  }>({
    src: '',
    index: 0,
  });

  const onClickGoToHome = () => {
    nav('/');
  };

  const onClickGoToLogin = () => {
    nav('/login');
  };

  // 아이콘 선택 핸들러
  const handleIconSelect = (iconSrc: string, iconIndex: number): void => {
    setSelectedIcon({ src: iconSrc, index: iconIndex });
    // 필요하다면 여기서 폼 데이터에 아이콘 정보 추가
    console.log('선택된 아이콘:', iconSrc, '인덱스:', iconIndex);
  };

  // 아이디 중복확인 핸들러
  const handleIDCheckDuplicate = () => {
    // 여기서 redux action을 dispatch 하게 됩니다
    console.log('중복 확인할 아이디:', username);
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="form"
        style={{ width: '750px', maxWidth: '95vw' }}>
        {/* 폼 타이틀 부분 */}
        <div
          className="form-title"
          style={{ marginBottom: '3px' }}>
          <span className="dung-font tracking-wider ">create your</span>
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
            marginTop: '25px',
            marginBottom: '23px',
          }}>
          {/* 왼쪽 칼럼: 아이디, 비밀번호, 비밀번호 확인 */}
          <div style={{ flex: 1 }}>
            {/* 아이디 입력 부분 */}
            <div
              className="input-container"
              style={{
                display: 'flex',
                flexDirection: 'column', // 세로 방향으로 변경
                width: '100%',
                marginTop: '20px',
              }}>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input
                  className="input-mail"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  style={{ flex: 3, width: 'auto' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <BoxButton
                  text="중복확인"
                  onClick={handleIDCheckDuplicate}
                />
              </div>

              {/* 유효성 검사 메시지 */}
              <p
                className="validation-message dung-font"
                style={{
                  color: '#ff6b6b', // 오류 메시지 색상
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  marginLeft: '4px',
                  height: '16px', // 고정 높이로 공간 확보
                }}>
                아이디는 5자에서 12자 사이로 입력해주세요.
              </p>
            </div>

            {/* 비밀번호 입력 부분 */}
            <div
              className="input-container"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
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

              <p
                className="validation-message dung-font"
                style={{
                  color: '#ff6b6b',
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  marginLeft: '4px',
                  height: '16px',
                }}>
                비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            </div>

            {/* 비밀번호 확인 입력 부분 */}
            <div
              className="input-container"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
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

              <p
                className="validation-message dung-font"
                style={{
                  color: '#4ade80', // 성공 메시지는 초록색으로 (파란색으로 할까?)
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  marginLeft: '4px',
                  height: '16px',
                }}>
                비밀번호가 일치합니다.
              </p>
            </div>
          </div>

          {/* 오른쪽 칼럼: 프로필 아이콘, 닉네임, 생년월일 */}
          <div style={{ flex: 1 }}>
            {/* 프로필 이미지 부분 */}

            <div
              style={{
                marginBottom: '15px',
                marginLeft: '23px',
                marginTop: '10.5px',
              }}>
              <ProfileIconSelector onSelectIcon={handleIconSelect} />
            </div>

            {/* 닉네임 입력 부분 */}
            <div
              className="input-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginTop: '26.5px',
              }}>
              <div
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

              <p
                className="validation-message dung-font"
                style={{
                  color: '#ff6b6b',
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  marginLeft: '4px',
                  height: '16px',
                }}>
                닉네임은 2자에서 10자 사이로 입력해주세요.
              </p>
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
