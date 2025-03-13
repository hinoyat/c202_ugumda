import React from 'react';
import '../themes/GuestbookIcon.css';

interface GuestbookIconProps {
  size?: number;
}

const GuestbookIcon = ({ size = 1 }: GuestbookIconProps) => {
  const handleClick = () => {
    // 여기에 방명록 모달 띄우는 로직 추가
    console.log('방명록 아이콘 클릭됨');
  };

  // 행성의 크기
  const width = 300 * size;
  const height = 300 * size;

  return (
    <div
      className="section-banner-sun cursor-pointer"
      onClick={handleClick}
      style={{ width: `${width}px`, height: `${height}px` }}>
      {/* 여기 아래는 주변 반짝이 효과라서 나중에 지워야 함. 일단은 이쁘니까 두겠음! */}
      <div id="star-1">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-2">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-3">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-4">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-5">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-6">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-7">
        <div className="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div className="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>
    </div>
  );
};

export default GuestbookIcon;
