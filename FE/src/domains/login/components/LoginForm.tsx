import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    <div className="flex flex-col h-[75vh] w-[45vw] bg-white rounded-2xl shadow-2xl p-9">
      {/* 뒤로가기 버튼 아직 뒤로가기 기능 안넣음 나중에 link나 useNavigate로 뒤로가기 기능 넣으면 될듯! */}
      <div className="flex justify-end mb-3">
        <button
          onClick={onClickGoToHome}
          className="text-gray-700 cursor-pointer">
          <FaArrowLeftLong size={30} />
        </button>
      </div>

      {/* 로그인 폼 전에 패딩 줘서 조금 안쪽으로 들어가 보이게 한거 */}
      <div className="px-7">
        {/* 로그인 타이틀 */}
        <div className="mb-4 p-7">
          <h1 className="text-3xl font-bold galindo-regular">Login</h1>
        </div>

        {/* 로그인 입력 폼  피그마 그대로 했는데 아이디랑 비밀번호 border-b gray-200 했더니 그냥 안보여서 400으로 up*/}
        <div className=" flex flex-col gap-6 space-y-6 flex-grow p-7 pretendard-font">
          <div className="border-b border-gray-300 pb-2">
            <input
              type="text"
              className="w-full focus:outline-none text-[15px]"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="border-b border-gray-300 pb-2 relative">
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full focus:outline-none shadow-2xl text-[15px]"
                placeholder="비밀번호를 입력하세요"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 cursor-pointer">
                {/* 비밀번호 보이고 안보이게 하는거 */}
                {showPassword ? (
                  <FaEyeSlash
                    size={20}
                    className="text-gray-400"
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="text-gray-400"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="">
            <button
              className="
                w-full py-3 rounded-md cursor-pointer text-white
                bg-gradient-to-t from-indigo-800 to-indigo-950
                hover:from-indigo-600 hover:to-indigo-950
                transition duration-300 garlindo-regular
              ">
              Login
            </button>

            {/* 회원가입 링크 */}
            <div className="text-center mt-4 text-[13px] text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={onClickGoToSignup}
                className="text-indigo-800 cursor-pointer hover:text-indigo-500">
                Signup Here
              </button>
            </div>
          </div>
          {/*버튼 영역 종료 */}
        </div>
        {/*로그인 폼 종료 */}
      </div>
      {/* 로그인 패딩 준거 종료 */}
    </div>
  );
};

export default LoginForm;
