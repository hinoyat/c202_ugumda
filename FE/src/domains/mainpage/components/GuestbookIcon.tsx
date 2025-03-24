// 방명록 아이콘? 버튼? 컴포넌트. 태양같이 생긴거

import '@/domains/mainpage/themes/GuestbookIcon.css';
import { Tooltip } from 'react-tooltip';

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
    <>
      <div
        className="section-banner-sun cursor-pointer"
        onClick={handleClick}
        style={{ width: `${width}px`, height: `${height}px` }}
        data-tooltip-id="Guestbook"
        data-tooltip-content="방명록"></div>
      <Tooltip id="Guestbook" />
    </>
  );
};

export default GuestbookIcon;
