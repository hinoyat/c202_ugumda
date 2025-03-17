import React, { useState } from 'react';
import DreamContent from './DreamContent';
import DreamSolveContent from './DreamSolveContent';
import dreamFrame from "@/assets/images/dreamFrame.svg"

const RightDreamSection = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);

  // 목데이터 (필요에 따라 text값을 활용할 수 있음)
  const mockData = {
    content:
      '미로에서 길을 잃는 꿈은 현재 삶에서 혼란을 겪고 있거나, 중요한 결정을 앞두고 갈등하고 있는 상황을 의미해. 같은 길을 반복해서 걷는 건 해결책을 찾기 어려운 문제를 반영할 수도 있어. 하지만 마지막에 빛을 발견하고 출구를 찾았다면, 곧 문제를 해결할 수 있는 실마리를 얻게 될 가능성이 크다는 신호야. 특히 방이 나타난 건 안정과 평온을 되찾을 것을 의미할 수도 있어. 😊✨',
  };

  const handleAnalyze = () => {
    // 여기서 text를 기반으로 API 호출 등 실제 해몽 로직을 구현할 수도 있습니다.
    // 지금은 목데이터를 사용합니다.
    setAnalysis(mockData.content);
  };

  return (
    <div className="basis-2/3">
      <div className="w-full h-full relative">
        <img src={dreamFrame} className="w-full h-full object-fill" />
        <div className="absolute w-[85%] h-[85%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3">
          <div className="flex flex-col items-center justify-around h-full">
            <div className="w-full h-[50%] flex flex-col items-center justify-center">
              <DreamContent text={text} setText={setText} />
            </div>
            <div className="w-full h-[50%] flex flex-col items-center justify-center">
              <DreamSolveContent analysis={analysis} onAnalyze={handleAnalyze} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightDreamSection;
