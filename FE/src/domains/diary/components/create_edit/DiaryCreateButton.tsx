import React from 'react'

interface DiaryCreateButtonProps {
  onCreate: () => void;
  onCreateVideo: () => void;
  Count: number;
  isEditing?: boolean; // 수정 모드 여부 추가
}

const DiaryCreateButton: React.FC<DiaryCreateButtonProps> = ({
  onCreate,
  onCreateVideo,
  Count,
  isEditing = false
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {isEditing ? (
        <button 
          onClick={onCreate} 
          className="text-[#3A3A3A] cursor-pointer w-full bg-[rgba(255,255,255,0.7)] py-2 rounded text-lg font-bold hover:bg-neutral-500 hover:text-white"
        >
          수정완료
        </button>
      ) : (
        <>
          <button 
            onClick={onCreate} 
            className="text-white cursor-pointer w-full bg-[rgba(84,84,84,1)] py-2 rounded text-lg font-bold"
          >
            꿈 일기 등록하기
          </button>
          <button 
            onClick={onCreateVideo} 
            className="text-white cursor-pointer w-full bg-[rgba(189,189,189,0.7)] py-2 rounded text-lg font-bold"
          >
            등록 후 영상 생성하기({Count}/3)
          </button>
        </>
      )}
    </div>
  )
}

export default DiaryCreateButton