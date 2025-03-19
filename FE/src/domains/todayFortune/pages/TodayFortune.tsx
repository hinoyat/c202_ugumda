import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../style/TodayFortune.css';
import card from '@/assets/images/fortune_card.svg';
import space_bg from '@/assets/images/space_bg.svg';
import StarField from '@/domains/mainpage/components/universe/StarField';
import { Canvas } from '@react-three/fiber';

const TodayFortune = () => {
  const nav = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const onClickHome = () => {
    nav('/spaceship');
  };

  const mockdata = [
    {
      content:
        '오늘은 작은 변화가 큰 기회를 가져올 날! 긍정적인 마음으로 도전해보세요.',
    },
  ];

  // 단일 useEffect로 통합
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true);

      // 애니메이션 완료 상태 설정
      setTimeout(() => {
        setInitialAnimationComplete(true);

        // 빛나는 효과 시작
        setIsGlowing(true);

        // 2초 후 빛나는 효과 제거
        setTimeout(() => {
          setIsGlowing(false);
        }, 1000); // 빛나는 효과 지속 시간
      }, 1000); // 카드 등장 후 빛나는 효과가 시작되는 시간
    }, 100);
  }, []);

  return (
    <div className="w-screen h-screen relative">
      {/* <img
        src={space_bg}
        alt="space background"
        className="w-full h-full object-cover"
      /> */}

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

      <div className="absolute top-3 right-4 text-2xl text-white">
        <button
          onClick={onClickHome}
          className="cursor-pointer hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* 카드 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`card-container 
          ${isAnimated ? 'animated' : ''} 
          ${initialAnimationComplete ? 'animation-complete' : ''} 
          ${isGlowing ? 'temp-glow' : ''}
          `}>
          <img
            src={card}
            alt="fortune card"
            className="w-65"
          />

          {/* 카드 내용 (텍스트) */}
          {isAnimated && (
            <div className="maru-font text-[14px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 fortune-text">
              <p>{mockdata[0].content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayFortune;
