import { useNavigate } from 'react-router-dom';
import profileFrame from '@/assets/images/profileFrame.svg';

interface LeftProfileSectionProps {
  mockdata: {
    id: number;
    profile: string;
    nickname: string;
    birth: string;
  };
}

const LeftProfileSection: React.FC<LeftProfileSectionProps> = ({
  mockdata,
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
            src={mockdata.profile}
            alt="프로필 이미지"
            className="w-20 object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="flex flex-col items-center justify-center text-[20px] tracking-wide dung-font">
          <p>Hello, {mockdata.nickname} !!!</p>
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
