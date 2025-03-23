// 꿈 해몽 분석 컴포넌트
import GlowFrame from '@/domains/dreamSolve/components/GlowFrame';
import React from 'react';

interface DreamSolveContentProps {
  analysis: string | null;
  onAnalyze: () => void;
}

const DreamSolveContent: React.FC<DreamSolveContentProps> = ({
  analysis,
  onAnalyze,
}) => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly">
      <div>
        <h1 className="text-[23px] dung-font text-white/90">[ 꿈 해 몽 ]</h1>
      </div>
      <div className="w-full h-[60%] flex items-center justify-center">
        {analysis ? (
          <GlowFrame>
            <div className="text-[15px] font-normal">{analysis}</div>
          </GlowFrame>
        ) : (
          <button
            onClick={onAnalyze}
            className="px-4 py-1 bg-gradient-to-r from-[#13b37f]/80 to-[#11a3c8]/80 w-40 h-10 rounded text-white/90 font-bold cursor-pointer hover:from-[#13b37f]/60 hover:to-[#11a3c8]/60 transition-colors duration-200 mb-20 shadow-md">
            분석하기
          </button>
        )}
      </div>
    </div>
  );
};

export default DreamSolveContent;
