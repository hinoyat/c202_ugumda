// 블랙홀( 다른 사람 페이지로 랜덤이동 ) 컴포넌트
import React from 'react';
import '../themes/Blackhole.css';

const Blackhole = () => {
  const handleBlackholeClick = () => {
    // 여기에 랜덤으로 페이지 방문 로직 추가
    console.log('블랙홀(랜덤 페이지 이동) 클릭됨');
  };

  return (
    <div
      className="blackhole-container cursor-pointer"
      onClick={handleBlackholeClick}>
      <div className="blackhole">
        <div className="blackhole-circle"></div>
        <div className="blackhole-disc"></div>
      </div>
      <div className="curve">
        <svg viewBox="0 0 500 500">
          <path
            id="loading"
            d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"></path>
          <text width="500">
            <textPath xlinkHref="#loading">Interstellar Jump</textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Blackhole;
