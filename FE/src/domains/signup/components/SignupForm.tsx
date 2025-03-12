import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { GrPowerCycle } from 'react-icons/gr';

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
    <div className="flex flex-col h-[75vh] w-[45vw] bg-white rounded-2xl shadow-2xl p-3">
      <div className="flex justify-end mb-3 mr-4 mt-1">
        <button
          onClick={onClickGoToHome}
          className="text-gray-700 cursor-pointer">
          <FaArrowLeftLong
            size={30}
            className="text-purple-400"
          />
        </button>
      </div>

      <div className="w-full px-15">
        <div>
          <h1 className="text-4xl font-bold galindo-regular">Create Account</h1>
        </div>

        <div className="flex flex-col items-center mt-3 gap-3">
          {/* 이미지와 버튼을 감싸는 컨테이너를 relative로 설정 */}
          <div className="relative w-[60px] h-[60px]">
            <img
              src="defaultProfile.png"
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
            <button className="absolute top-8 left-9 text-[25px] bg- px-1 py-0.5 rounded ">
              <GrPowerCycle className="text-white bg-purple-950 rounded-4xl cursor-pointer border border-white p-0.5 hover:bg-purple-800" />
            </button>
          </div>

          {/* 안내 문구 */}
          <p className="text-gray-400 text-[9px] pretendard-font">
            프로필 아이콘을 선택해주세요
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full pretendard-font">
          <div className="flex gap-3 w-full flex-1">
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className="border-b border-gray-200 shadow-xs w-[90%] text-[13px]"
            />
            <button className="px-3 py-2 text-white bg-purple-300 rounded w-[20%] cursor-pointer hover:bg-purple-400 text-[13px]">
              {' '}
              중복확인
            </button>
          </div>

          <div className="border-b border-gray-200 shadow-xs pb-1 relative text-[13px]">
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full focus:outline-none"
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

          <div className="border-b border-gray-200 shadow-xs pb-1 relative">
            <div className="flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full focus:outline-none text-[13px]"
                placeholder="비밀번호를 한 번 더 입력하세요"
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

          <div className="flex gap-3 w-full flex-1">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              className="border-b border-gray-200 shadow-xs w-[90%] text-[13px]"
            />
            <button className="px-3 py-2 text-white bg-purple-300 rounded w-[20%] cursor-pointer hover:bg-purple-400 text-[13px]">
              {' '}
              중복확인
            </button>
          </div>

          <div className="border-b border-gray-200 shadow-xs">
            <input
              type="text"
              placeholder="생년월일을 입력하세요(양력) (yyyy-mm-dd)"
              className="w-full pb-2 text-[13px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="
                                w-full py-3 rounded-md cursor-pointer text-white
                                bg-gradient-to-t from-purple-300 to-indigo-900
                                hover:from-purple-400 hover:to-indigo-900
                                transition duration-300
                            ">
              Create Account
            </button>

            <div className="flex gap-2 items-center justify-center">
              <p className="text-[12px] text-gray-400">
                Already have an account?
              </p>
              <button
                onClick={onClickGoToLogin}
                className="text-[12px] text-purple-700 cursor-pointer hover:text-purple-400">
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignupForm;
