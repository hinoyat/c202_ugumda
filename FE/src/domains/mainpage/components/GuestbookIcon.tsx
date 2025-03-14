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
  const width = 200 * size;
  const height = 200 * size;

  return (
    <div
      className="section-banner-sun cursor-pointer"
      onClick={handleClick}
      style={{ width: `${width}px`, height: `${height}px` }}></div>
  );
};

export default GuestbookIcon;
