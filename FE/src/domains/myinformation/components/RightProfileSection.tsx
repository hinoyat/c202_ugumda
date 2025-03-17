import '../styles/MyInformationContent.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import close from "@/assets/images/closeEye.svg";
import open from "@/assets/images/openEye.svg";
import check from "@/assets/images/pixcelCheck.svg";
import docs from "@/assets/images/pixcelDoc.svg";


interface LeftProfileSectionProps {
  mockdata: {
    id: number;
    profile: string;
    nickname: string;
    birth: string;
  };
}

interface ApiResponse {
  data: {
    response: boolean;
  };
}

const RightProfileSection: React.FC<LeftProfileSectionProps> = ({
  mockdata,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPw_Check, setShowPassword_Check] = useState(false);

  const nav = useNavigate();

  const onClickCancle = () => {
    nav('/spaceship');
  };

  const onClickEvent = (apiResponse: ApiResponse) => {
    if (apiResponse.data.response) {
      nav('/successedit');
    } else {
      nav('/failedit');
    }
  };

  const apiResponse: ApiResponse = {
    data: {
      response: false,
    },
  };

  return (
    <div className="text-white flex-1">
      <div className="w-full h-full flex flex-col items-center justify-center gap-10 px-10 pl-30 pb-10 text-[#86F5FF]">
        {/* 닉네임 행 */}
        <div className="flex items-center gap-4 text-xl w-full">
          <p className="w-1/4">nickname</p>
          <p className="flex-1">{mockdata.nickname}</p>
          <img
            src={check}
            alt="닉네임 확인"
            className="w-6 h-6"
          />
        </div>

        {/* 비밀번호 입력 행 */}
        <div className="flex items-center gap-4 text-xl w-full">
          <p className="w-1/4">password</p>
          <div className="flex items-center gap-2 w-3/4">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-[269px] focus:outline-none rounded p-2"
              placeholder="비밀번호를 입력하세요"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer">
              {showPassword ? (
                <img
                  src={close}
                  alt="비밀번호 숨기기"
                  className="w-6 h-6"
                />
              ) : (
                <img
                  src={open}
                  alt="비밀번호 표시"
                  className="w-6 h-6"
                />
              )}
            </button>
          </div>
        </div>

        {/* 비밀번호 확인 입력 행 */}
        <div className="flex items-center gap-4 text-xl w-full">
          <p className="w-1/4">pw_check</p>
          <div className="flex items-center gap-2 w-3/4">
            <input
              type={showPw_Check ? 'text' : 'password'}
              className="w-[269px] focus:outline-none rounded"
              placeholder="비밀번호를 입력하세요"
            />
            <button
              onClick={() => setShowPassword_Check(!showPw_Check)}
              className="cursor-pointer">
              {showPw_Check ? (
                <img
                  src={close}
                  alt="비밀번호 숨기기"
                  className="w-6 h-6"
                />
              ) : (
                <img
                  src={open}
                  alt="비밀번호 표시"
                  className="w-6 h-6"
                />
              )}
            </button>
          </div>
        </div>

        {/* 생년월일 행 */}
        <div className="flex items-center gap-4 text-xl w-full">
          <p className="w-1/4">birth</p>
          <p className="flex-1">{mockdata.birth}</p>
          <img
            src={docs}
            alt="생년월일 확인"
            className="w-6 h-6"
          />
        </div>

        {/* 취소/수정 버튼 */}
        <div className="flex gap-5 text-black">
          <div className="box-button">
            <button
              onClick={onClickCancle}
              className="button">
              취소
            </button>
          </div>
          <div className="box-button">
            <button
              onClick={() => onClickEvent(apiResponse)}
              className="button">
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightProfileSection;
