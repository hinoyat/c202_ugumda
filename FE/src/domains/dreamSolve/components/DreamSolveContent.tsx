import React from 'react';

interface DreamSolveContentProps {
  analysis: string | null;
  onAnalyze: () => void;
}

const DreamSolveContent: React.FC<DreamSolveContentProps> = ({ analysis, onAnalyze }) => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly">
      <div>
        <h1 className="text-2xl font-bold text-[#6C4D2C]">🔮꿈 해몽</h1>
      </div>
      <div className="w-full h-[60%] flex items-center justify-center">
        {analysis ? (
          <div className="text-white p-4 bg-[#6C4D2C] rounded-md">
            {analysis}
          </div>
        ) : (
          <button
            onClick={onAnalyze}
            className="px-4 py-1 bg-[#6C4D2C] w-40 h-10 rounded text-white font-bold cursor-pointer hover:bg-amber-900 mb-20"
          >
            분석하기
          </button>
        )}
      </div>
    </div>
  );
};

export default DreamSolveContent;
