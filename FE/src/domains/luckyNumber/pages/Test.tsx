import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/LuckyNumber.css';
import { Canvas } from '@react-three/fiber';
import StarField from '@/domains/mainpage/components/universe/StarField';
import LuckyDrawButton from '@/domains/luckyNumber/components/LuckyDrawButton';

// Redux 상태에서 필요한 데이터 불러오기 위해 import
import { useSelector } from 'react-redux';
import { selectUser } from '@/stores/auth/authSelectors';

const LuckyNumber = () => {
  const [visibleStars, setVisibleStars] = useState<number[]>([]);
  const [visibleLines, setVisibleLines] = useState<number[][]>([]);
  const [showText, setShowText] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [visibleNumbers, setVisibleNumbers] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  // selectUser 불러오기
  const user = useSelector(selectUser);
  console.log('유저가 불러와지는지 보자', user);

  const nav = useNavigate();
  const onClickHome = () => {
    nav('/spaceship');
  };

  // 별자리 위치 옮기고 싶으면 여기 고치면 됩니다.!!
  // x 좌표는 커질수록 오른쪽으로
  // y 좌표는 커질수록 아래로 이동합니다.!
  // 고칠 때 참고 부탁드립니다.!
  // size는 별 자체 크기, glowSize는 주변 빛 효과 크기
  const stars = [
    { id: 16, x: 20, y: 56, size: 1.5, glowSize: 3.2 }, //  더 큰 별
    { id: 32, x: 33, y: 35, size: 0.9, glowSize: 2.0 }, //  작은 별
    { id: 27, x: 36, y: 68, size: 1.8, glowSize: 3.6 }, //  가장 큰 별
    { id: 3, x: 59, y: 44, size: 1.2, glowSize: 2.6 }, //  기본 크기
    { id: 15, x: 72, y: 22, size: 1.0, glowSize: 2.2 }, //  중간 크기
    { id: 9, x: 99, y: 20, size: 1.4, glowSize: 3.0 }, //  큰 별
  ];

  const connections = [
    [0, 1],
    [1, 3],
    [3, 4],
    [4, 5],
    [3, 2],
    [2, 0],
  ];

  const handleDrawClick = () => {
    setShowButton(false);
    setShowText(true);
    setAnimationStage(1);
  };

  useEffect(() => {
    if (animationStage === 1) {
      const fullText = '오늘의 행운의 번호는';
      let currentText = '';
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText[index];
          setTypingText(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
          setAnimationStage(2);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [animationStage]);

  useEffect(() => {
    if (animationStage === 2) {
      const timer = setTimeout(() => {
        stars.forEach((star, index) => {
          setTimeout(() => {
            setVisibleStars((prev) => [...prev, star.id]);

            if (index > 0) {
              setTimeout(() => {
                const visibleStarIds = stars
                  .filter((_, starIdx) => starIdx <= index)
                  .map((s) => s.id);

                connections.forEach((conn) => {
                  const star1 = stars[conn[0]];
                  const star2 = stars[conn[1]];

                  if (
                    visibleStarIds.includes(star1.id) &&
                    visibleStarIds.includes(star2.id)
                  ) {
                    setVisibleLines((prev) => {
                      const lineKey = [conn[0], conn[1]].sort().join('-');
                      if (
                        prev.some(
                          (line) =>
                            [line[0], line[1]].sort().join('-') === lineKey
                        )
                      ) {
                        return prev;
                      }
                      return [...prev, conn];
                    });
                  }
                });
              }, 200);
            }

            if (index === stars.length - 1) {
              setTimeout(() => {
                setAnimationStage(3);
              }, 1000);
            }
          }, 800 * index);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [animationStage]);

  useEffect(() => {
    if (animationStage === 3) {
      stars.forEach((s, numIndex) => {
        setTimeout(() => {
          setVisibleNumbers((prev) => [...prev, s.id]);

          // 마지막 숫자가 추가되면 다음 단계로
          if (numIndex === stars.length - 1) {
            setTimeout(
              () => {
                setAnimationStage(4);
              },
              600 * numIndex + 300
            );
          }
        }, 600 * numIndex);
      });
    }
  }, [animationStage]);

  return (
    <div className="w-screen h-screen relative clover-font">
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
      {showText && (
        <div className="lucky-text visible absolute bottom-38 left-0 right-0 mx-auto w-full text-center text-white text-[22px] clover-font tracking-widest">
          {typingText}
          {(animationStage === 3 || animationStage === 4) && (
            <span
              className="number-container"
              style={{ fontSize: '22px' }}>
              {stars.map((star, index) => (
                <span
                  key={star.id}
                  className={`number-slot ${visibleNumbers.includes(star.id) ? 'filled' : ''}`}>
                  <span className="number-value">
                    {visibleNumbers.includes(star.id) ? star.id : ''}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      {animationStage >= 2 && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="-3 -11 130 130"
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: 'none' }}>
          {connections.map((conn, index) => {
            const isVisible = visibleLines.some(
              (line) =>
                (line[0] === conn[0] && line[1] === conn[1]) ||
                (line[0] === conn[1] && line[1] === conn[0])
            );
            return (
              <line
                key={`line-${index}`}
                x1={stars[conn[0]].x}
                y1={stars[conn[0]].y}
                x2={stars[conn[1]].x}
                y2={stars[conn[1]].y}
                stroke="white"
                strokeWidth="0.2"
                className={`constellation-line ${isVisible ? 'visible' : ''}`}
              />
            );
          })}

          {stars.map((star) => {
            const visible = visibleStars.includes(star.id);
            return (
              <g
                key={`star-${star.id}`}
                className={`star ${visible ? 'visible' : ''}`}>
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.glowSize}
                  fill="rgba(255, 255, 255, 0.3)"
                  className={`star-glow ${visible ? 'visible' : ''}`}
                />
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size}
                  fill="white"
                  className={`star-center ${visible ? 'visible' : ''}`}
                />
                <text
                  x={star.x}
                  y={star.y - star.size - 1}
                  fontSize="3"
                  fill="white"
                  textAnchor="middle">
                  {star.id}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {showButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LuckyDrawButton
            onClick={handleDrawClick}
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default LuckyNumber;
