import { useNavigate } from 'react-router-dom';
import LeftDreamSection from '../components/LeftDreamSection';
import RightDreamSection from '../components/RightDreamSection';

const DreamSolve: React.FC = () => {
  const nav = useNavigate();
  const onClickHome = () => {
    nav('/');
  };

  return (
    <div className="w-screen h-screen relative">
      <img
        src="dreamsolve_bg.png"
        alt="꿈해몽 배경 사진"
        className="w-full h-full"
      />
      <div className="absolute top-3 right-3 text-2xl text-white">
        <button
          onClick={onClickHome}
          className="cursor-pointer hover:text-gray-200">
          ✕
        </button>
      </div>

      <div className="absolute w-[93%] h-[88%] bg-white opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md"></div>

      <div className="absolute w-[93%] h-[88%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full h-full flex">
          <LeftDreamSection />
          <RightDreamSection />
        </div>
      </div>
    </div>
  );
};

export default DreamSolve;
