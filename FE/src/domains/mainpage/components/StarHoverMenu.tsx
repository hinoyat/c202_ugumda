import React, { useState, useRef, useEffect } from 'react';

//          이미지 import          //
import hover_delete from '@/assets/main/hover-delete.svg';
import hover_diary from '@/assets/main/hover-diary.svg';
import hover_edit from '@/assets/main/hover-edit.svg';

interface StarMenuProps {
  position?: { x: number; y: number };
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const StarHoverMenu = ({
  position,
  onEdit,
  onDelete,
  onView,
}: StarMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  // 메뉴 토글 및 마우스 이동 영역 계산을 위한 상태
  const [safePath, setSafePath] = useState(false);

  // 별에서 메뉴 컨테이너로 마우스가 이동할 수 있는 안전 경로 설정
  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 별과 메뉴 컨테이너의 위치 정보
      const starRect = starRef.current?.getBoundingClientRect();
      const menuRect = menuContainerRef.current?.getBoundingClientRect();

      if (!starRect || !menuRect) return;

      // 마우스가 별이나 메뉴 영역 안에 있는지 확인
      const isOverStar =
        e.clientX >= starRect.left &&
        e.clientX <= starRect.right &&
        e.clientY >= starRect.top &&
        e.clientY <= starRect.bottom;

      const isOverMenu =
        e.clientX >= menuRect.left &&
        e.clientX <= menuRect.right &&
        e.clientY >= menuRect.top &&
        e.clientY <= menuRect.bottom;

      // 별과 메뉴 사이의 안전 경로 (넓은 영역 설정)
      const safePathArea = {
        left: starRect.left - 40,
        right: starRect.left + 60, // starRect.left + 200 - 140 (전체 너비 - right)
        top: starRect.top - 40,
        bottom: starRect.top + 20, // starRect.top + 150 - 130 (전체 높이 - bottom)
      };

      const isInSafePath =
        e.clientX >= safePathArea.left &&
        e.clientX <= safePathArea.right &&
        e.clientY >= safePathArea.top &&
        e.clientY <= safePathArea.bottom;

      // 안전 경로에 있으면 메뉴 유지, 아니면 닫기
      if (isOverStar || isOverMenu || isInSafePath) {
        setSafePath(true);
      } else {
        setSafePath(false);
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  //          버튼위치          //
  const buttonLayout = [
    { top: '-22px', left: '-32px' }, // 편집 버튼 위치 (좌측)
    { top: '-35px', left: '-3px' }, // 삭제 버튼 위치 (중앙)
    { top: '-22px', left: '28px' }, // 일기보기 버튼 위치 (우측)
  ];

  //          툴팁관련          //
  const tooltipLayout = [
    { top: '-43px', left: '-34px' }, // 편집 버튼 툴팁
    { top: '-55px', left: '-3px' }, // 삭제 버튼 툴팁
    { top: '-43px', left: '28px' }, // 일기보기 버튼 툴팁
  ];

  return (
    <div className="relative inline-block">
      {/* 호버할 별 요소 */}
      <div
        ref={starRef}
        className="w-4 h-4 bg-white rounded-full cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* 호버 시 나타나는 메뉴 */}
      {isVisible && (
        <div
          ref={menuContainerRef}
          className="absolute z-10"
          style={{
            left: '0px',
            top: '0px',
            width: '200px',
            height: '150px', // 영역 확장
            pointerEvents: 'auto', // 이벤트 캡처 허용
          }}>
          {/* 별과 메뉴 사이 안전 영역 () 확인하려면 background 색상 변경해서 보기*/}
          <div
            className="absolute"
            style={{
              left: '-40px',
              top: '-40px',
              right: '140px',
              bottom: '130px',
              background: 'rgba(255, 255, 0, 0)',
            }}
          />
          {/* ------------------------툴팁들------------------------ */}
          {/* 툴팁 */}
          {hoveredButton === 'edit' && (
            <div
              className="absolute text-white/90 text-xs px-2 py-1 rounded whitespace-nowrap z-20"
              style={{
                ...tooltipLayout[0],
                transform: 'translateX(-25%)',
              }}>
              수정하기
            </div>
          )}

          {hoveredButton === 'delete' && (
            <div
              className="absolute text-white/90 text-xs px-2 py-1 rounded whitespace-nowrap z-20"
              style={{
                ...tooltipLayout[1],
                transform: 'translateX(-25%)',
              }}>
              삭제하기
            </div>
          )}

          {hoveredButton === 'view' && (
            <div
              className="absolute text-white/90 text-xs px-2 py-1 rounded whitespace-nowrap z-20"
              style={{
                ...tooltipLayout[2],
                transform: 'translateX(-25%)',
              }}>
              일기보기
            </div>
          )}
          {/* ------------------------버튼들------------------------ */}
          {/* 편집 버튼 - 좌측 */}
          <div
            className="absolute"
            style={{
              ...buttonLayout[0],
              transition: 'opacity 0.2s, transform 0.2s',
              opacity: isVisible ? 0.5 : 0,
              transform: `translateY(${isVisible ? '0' : '10px'})`,
            }}>
            <button
              onClick={onEdit}
              onMouseEnter={() => setHoveredButton('edit')}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center transition-transform hover:scale-110 group relative">
              {/* 원 부분: 원 자체는 항상 반투명 */}
              <div className="w-full h-full bg-gray-700 rounded-full opacity-50 absolute top-0 left-0"></div>

              {/* 아이콘 부분: 호버 시에만 아이콘 투명도 변경 */}
              <img
                src={hover_edit}
                alt="edit"
                className="w-4 h-4 opacity-50 transition-opacity group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </div>
          {/* 삭제 버튼 - 중앙 */}
          <div
            className="absolute"
            style={{
              ...buttonLayout[1],
              transition: 'opacity 0.3s, transform 0.3s',
              opacity: isVisible ? 0.5 : 0,
              transform: `translateY(${isVisible ? '0' : '10px'})`,
              transitionDelay: '0.05s',
            }}>
            <button
              onClick={onDelete}
              onMouseEnter={() => setHoveredButton('delete')}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center transition-transform hover:scale-110 group relative">
              {/* 원 부분: 원 자체는 항상 반투명 */}
              <div className="w-full h-full bg-gray-700 rounded-full opacity-50 absolute top-0 left-0"></div>

              {/* 아이콘 부분: 호버 시에만 아이콘 투명도 변경 */}
              <img
                src={hover_delete}
                alt="delete"
                className="w-3 h-3 opacity-50 transition-opacity group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </div>
          {/* 일기보기 버튼 - 우측 */}
          <div
            className="absolute"
            style={{
              ...buttonLayout[2],
              transition: 'opacity 0.4s, transform 0.4s',
              opacity: isVisible ? 0.5 : 0,
              transform: `translateY(${isVisible ? '0' : '10px'})`,
              transitionDelay: '0.1s',
            }}>
            <button
              onClick={onView}
              onMouseEnter={() => setHoveredButton('view')}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center transition-transform hover:scale-110 group relative">
              {/* 원 부분: 원 자체는 항상 반투명 */}
              <div className="w-full h-full bg-gray-700 rounded-full opacity-50 absolute top-0 left-0"></div>

              {/* 아이콘 부분: 호버 시에만 아이콘 투명도 변경 */}
              <img
                src={hover_diary}
                alt="view"
                className="w-4 h-4 opacity-50 transition-opacity group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarHoverMenu;
