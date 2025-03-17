import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyInformationContent.css';
import LeftProfileSection from './LeftProfileSection';
import RightProfileSection from './RightProfileSection';
import { IoClose } from 'react-icons/io5';
import exampleProfile from "@/assets/images/exampleProfile.svg";
import information_bg from "@/assets/images/information_bg.svg";


const MyInformationContent: React.FC = () => {
  const glowingTextStyle: React.CSSProperties = {
    textShadow: '0 0 5px #9decf9, 0 0 10px #9decf9, 0 0 15px #67e8f9',
  };

  const nav = useNavigate();
  const onClickHome = () => {
    nav('/');
  };

  //   const [showPassword, setShowPassword] = useState(false);

  const mockdata = {
    id: 1,
    profile: `${exampleProfile}`,
    nickname: 'Test',
    birth: '1999-06-22',
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
      <img
        src={information_bg}
        alt=""
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-320 animate-pulse"
      />
      <div className="absolute z-31 top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/6">
        <h1
          className="text-white text-[33px]  press-start-2p-regular"
          style={glowingTextStyle}>
          Update Profile
        </h1>
      </div>
      {/* LeftProfileSection과 RightProfileSection이 들어갈 자리 */}
      <div className="flex absolute z-32 top-19/32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-290 h-115 items-center">
        <LeftProfileSection mockdata={mockdata} />
        <RightProfileSection mockdata={mockdata} />

        {/*오른쪽 영역끝 */}
      </div>
    </div>
  );
};

export default MyInformationContent;
