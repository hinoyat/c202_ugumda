import { useNavigate } from 'react-router-dom';
import profileFrame from '@/assets/images/profileFrame.svg';
import exampleProfile from "@/assets/images/exampleProfile.svg"

interface LeftProfileSectionProps {
  userData: {
    birthDate: string,
    introduction: string | null
    nickname: string,
    userSeq: number,
    username: string
  } | null
}

const LeftProfileSection: React.FC<LeftProfileSectionProps> = ({
  userData,
}) => {
  return (
    <div className="text-white flex-1">
      <div className="w-full h-full flex flex-col gap-10 items-center justify-center pr-20 pb-10">
        <div className="relative">
          <img
            src={profileFrame}
            alt="Profile Frame"
            className="w-33"
          />
          {/* 여기에 mockdata.profile 값을 이미지로 표시 */}
          <img
            src={exampleProfile}
            alt="프로필 이미지"
            className="w-20 object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex flex-col items-center justify-center text-[20px] tracking-wide dung-font">
          <p>Hello, {userData?.nickname || "Guest"} !!!</p>
          <p>버튼을 눌러 아이콘을 수정하세요</p>
        </div>
        <div className="box-button">
          <button className="button text-black dung-font">
            <span>Shuffle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftProfileSection;