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
      <button 
        onClick={onCreate} 
        className="text-white cursor-pointer w-full bg-[rgba(84,84,84,1)] py-2 rounded"
      >
        {isEditing ? '꿈 일기 수정하기' : '꿈 일기 등록하기'}
      </button>
      
      {!isEditing && (
        <button 
          onClick={onCreateVideo} 
          className="text-white cursor-pointer w-full bg-[rgba(189,189,189,0.7)] py-2 rounded"
        >
          등록 후 영상 생성하기({Count}/3)
        </button>
      )}
    </div>
  )
}

export default DiaryCreateButton