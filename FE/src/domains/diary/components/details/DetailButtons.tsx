import React from 'react';

interface DetailButtonsProps {
  onEdit?: () => void; // 수정 버튼 클릭 핸들러 추가
}

const DetailButtons: React.FC<DetailButtonsProps> = ({ onEdit }) => {
  // 일기 수정 핸들러
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  // 꿈 해몽 핸들러
  const handleDreamInterpretation = () => {
    console.log('꿈 해몽 페이지로 이동');
    // 해몽 페이지로 이동하는 로직 추가
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <button 
        className="bg-[#545454] hover:bg-cyan-400 text-white rounded cursor-pointer h-10"
        onClick={handleEdit}
      >
        수정하기
      </button>

      <button 
        className="bg-[rgba(255,255,255,0.7)] hover:bg-indigo-700 text-black rounded cursor-pointer h-10"
        onClick={handleDreamInterpretation}
      >
        꿈 해몽 하러가기
      </button>
    </div>
  );
};

export default DetailButtons;