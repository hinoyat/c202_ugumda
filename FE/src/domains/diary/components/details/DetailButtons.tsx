// 조회 쪽 버튼

import React from 'react';

interface DetailButtonsProps {
  onEdit?: () => void; // 수정 버튼 클릭 핸들러 추가
  onClose?: () => void;
}

const DetailButtons: React.FC<DetailButtonsProps> = ({ onEdit, onClose }) => {
  // 버튼 직접 클릭 핸들러
  const handleEditClick = () => {
    console.log('수정 버튼 직접 클릭');
    if (onEdit) {
      console.log('onEdit 함수 존재함, 호출 전');
      onEdit();
      console.log('onEdit 함수 호출 후');
    } else {
      console.log('onEdit이 undefined임');
    }
  };

  // 꿈 해몽 핸들러
  const handleDreamInterpretation = () => {
    console.log('꿈 해몽 페이지로 이동');
    // 해몽 페이지로 이동하는 로직 추가
  };

  return (
    <div className="flex w-full flex-col gap-3 ">
      <button
        className="text-white/90 cursor-pointer w-full bg-[#323232]/90 hover:bg-[#282828]/90 py-2 rounded text-sm font-bold"
        onClick={handleDreamInterpretation}>
        꿈 해몽 하러가기
      </button>

      <button
        className="text-white/90 cursor-pointer w-full bg-[#858484]/90 hover:bg-[#707070]/90 py-2 rounded text-sm font-bold"
        onClick={handleEditClick}>
        수정하기
      </button>
    </div>
  );
};

export default DetailButtons;
