import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/LuckyNumber.css';

const LuckyNumber = () => {
  const [visibleStars, setVisibleStars] = useState<number[]>([]);
  const [visibleLines, setVisibleLines] = useState<number[][]>([]);
  const [showText, setShowText] = useState(false);

  const nav = useNavigate();
  const onClickHome = () => {
    nav('/spaceship');
  };

  // 별 배열 업데이트
  // 별자리 위치 옮기고 싶으면 여기 고치면 됩니다.!!
  // x 좌표는 커질수록 오른쪽으로
  // y 좌표는 커질수록 아래로 이동합니다.!
  // 고칠 때 참고 부탁드립니다.!
  const stars = [
    { id: 16, x: 20, y: 56 },
    { id: 32, x: 33, y: 35 },
    { id: 27, x: 36, y: 68 },
    { id: 3, x: 59, y: 44 },
    { id: 15, x: 72, y: 22 },
    { id: 9, x: 99, y: 20 },
  ];

  const connections = [
    [0, 1],
    [1, 3],
    [3, 4],
    [4, 5],
    [3, 2],
    [2, 0],
  ];

  useEffect(() => {
    setVisibleStars([]);
    setVisibleLines([]);
    setShowText(false);

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
                      (line) => [line[0], line[1]].sort().join('-') === lineKey
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
            setShowText(true);
          }, 1000);
        }
      }, 800 * index);
    });
  }, []);

  return (
    <div className="w-screen h-screen relative galmuri-font">
      {/* 배경 이미지 */}
      <img
        src="space.png"
        alt="space background"
        className="w-full h-full"
      />

      <div className="absolute top-3 right-4 text-2xl text-white">
        <button
          onClick={onClickHome}
          className="cursor-pointer hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* SVG 영역 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: 'none' }}>
        {/* 연결선 */}
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
              strokeWidth="0.6"
              className={`constellation-line ${isVisible ? 'visible' : ''}`}
            />
          );
        })}

        {/* 별들 */}
        {stars.map((star) => {
          const visible = visibleStars.includes(star.id);
          return (
            <g
              key={`star-${star.id}`}
              className={`star ${visible ? 'visible' : ''}`}>
              {/* 별 주변 빛 효과 */}
              <circle
                cx={star.x}
                cy={star.y}
                r="4"
                fill="rgba(255, 255, 255, 0.3)"
                className={`star-glow ${visible ? 'visible' : ''}`}
              />
              {/* 별 중심 */}
              <circle
                cx={star.x}
                cy={star.y}
                r="1.8"
                fill="white"
                className={`star-center ${visible ? 'visible' : ''}`}
              />
              {/* 별 번호 */}
              <text
                x={star.x}
                y={star.y - 2}
                fontSize="3.5"
                fill="white"
                textAnchor="middle">
                {star.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 행운의 번호 텍스트 */}
      <div
        className={`lucky-text ${showText ? 'visible' : ''} absolute bottom-38 left-0 right-0 mx-auto w-full text-center text-white text-2xl galmuri-font tracking-widest`}>
        오늘의 행운의 번호는 {stars.map((star) => star.id).join(' ')} 입니다.
      </div>
    </div>
  );
};

export default LuckyNumber;
