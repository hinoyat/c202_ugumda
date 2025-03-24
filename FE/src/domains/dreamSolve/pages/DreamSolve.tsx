import { useNavigate } from 'react-router-dom';
import LeftDreamSection from '../components/LeftDreamSection';
import RightDreamSection from '../components/RightDreamSection';
import dreamSolve_bg from '@/assets/images/dreamSolve_bg.svg';
import { Canvas } from '@react-three/fiber';
import StarField from '@/domains/mainpage/components/universe/StarField';

const DreamSolve: React.FC = () => {
  const nav = useNavigate();
  const onClickHome = () => {
    nav('/spaceship');
  };

  return (
    <div className="w-screen h-screen relative">
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'black',
        }}
        camera={{ position: [0, 0, 5] }}>
        <StarField />
      </Canvas>

      {/* 닫기버튼 */}
      <div className="absolute top-3 right-3 text-2xl text-white">
        <button
          onClick={onClickHome}
          className="cursor-pointer hover:text-gray-200">
          ✕
        </button>
      </div>

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
