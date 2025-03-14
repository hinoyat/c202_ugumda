import React from 'react';
const DetailButtons = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <button className="bg-[rgba(255,255,255,0.7)] hover:bg-cyan-400 text-[#3A3A3A] rounded cursor-pointer h-10">
        수정완료
      </button>

      <button className="bg-[rgba(189,189,189,0.7)] hover:bg-indigo-700 text-white rounded cursor-pointer h-10">
        영상 생성하러가기
      </button>
    </div>
  );
};

export default DetailButtons;
