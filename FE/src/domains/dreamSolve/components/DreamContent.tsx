import { useState } from 'react';

const DreamContent = () => {
  const [text, setText] = useState('');
  const maxLength = 255;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const mockData = [
    {
      content:
        '미로에서 길을 잃는 꿈은 현재 삶에서 혼란을 겪고 있거나, 중요한 결정을 앞두고 갈등하고 있는 상황을 의미해. 같은 길을 반복해서 걷는 건 해결책을 찾기 어려운 문제를 반영할 수도 있어. 하지만 마지막에 빛을 발견하고 출구를 찾았다면, 곧 문제를 해결할 수 있는 실마리를 얻게 될 가능성이 크다는 신호야. 특히 방이 나타난 건 안정과 평온을 되찾을 것을 의미할 수도 있어. 😊✨',
    },
  ];

  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly gap-1 relative">
      {/* 제목 */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-[#6C4D2C]">📜꿈 내용</h1>
      </div>

      {/* textarea 영역 */}
      <div className="w-full h-[60%] px-10 relative">
        <textarea
          value={text}
          onChange={handleChange}
          maxLength={maxLength}
          className="w-full h-full text-white outline-none resize-none p-3 bg-transparent rounded-md"
          placeholder="최대 255자 작성하실 수 있습니다."></textarea>

        {/* 글자 수 카운트 */}
        <div className="absolute bottom-2 right-12 text-sm text-[#6C4D2C]">
          {text.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default DreamContent;
