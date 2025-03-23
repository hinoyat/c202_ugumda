// 꿈 내용 적는 곳

import React from 'react';

interface DreamContentProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const DreamContent: React.FC<DreamContentProps> = ({ text, setText }) => {
  const maxLength = 255;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly gap-1 relative">
      {/* 제목 */}
      <div className="mt-6">
        <h1 className="text-[20px] font-bold text-white/90">[ 꿈 내 용 ]</h1>
      </div>

      {/* textarea 영역 */}
      <div className="w-full h-[60%] px-10 relative">
        <textarea
          value={text}
          onChange={handleChange}
          maxLength={maxLength}
          className="w-full h-full text-white outline-none resize-none p-3 bg-transparent rounded-md"
          placeholder="최대 255자 작성하실 수 있습니다."
        />

        {/* 글자 수 카운트 */}
        <div className="absolute bottom-2 right-12 text-sm text-[#6C4D2C]">
          {text.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default DreamContent;
