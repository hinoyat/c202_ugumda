// 검색 모달. 탭 전환

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface AlarmProps {
  isOpen: boolean;
  onClose: () => void;
}

const Alarm: React.FC<AlarmProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0">
      {/* 모달 배경 */}
      <div className="absolute w-[30%] h-80 rounded-lg py-6 px-6 top-[60px] left-7/12 bg-[#6E6E6E]/90 z-25 flex flex-col items-center">
        {/* 닫기버튼 */}
        <div
          className="absolute z-40 top-[2%] right-[1%] cursor-pointer"
          onClick={onClose}>
          <IoClose className="text-white text-3xl" />
        </div>
        <div className="bg-amber-500 w-full h-full">
          여기에 스크롤로 알람 띄우기
        </div>
      </div>
    </div>
  );
};

export default Alarm;
