// 일기 생성/ 수정 버튼

import React from 'react';

interface DiaryCreateButtonProps {
  onCreate?: () => void;
  onCreateVideo?: () => void;
  Count?: number;
  isEditing: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

const DiaryCreateButton: React.FC<DiaryCreateButtonProps> = ({
  onCreate,
  onCreateVideo,
  Count,
  isEditing = false,
  onClose,
  onDelete,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {isEditing ? (
        <>
          <button
            onClick={onCreate}
            className="text-white/90 cursor-pointer w-full bg-[#858484]/90 hover:bg-[#707070]/90 py-2 rounded text-sm font-bold">
            수정완료
          </button>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
                  onDelete();
                }
              }}
              className="text-white/90 cursor-pointer w-full bg-[#ff5757]/90 hover:bg-[#e74c4c]/90 py-2 rounded text-sm font-bold">
              삭제하기
            </button>
          )}
        </>
      ) : (
        <button
          onClick={onCreate}
          className="text-white/90 cursor-pointer w-full bg-[#858484]/90 hover:bg-[#707070]/90 py-3 rounded text-[17px] font-bold">
          꿈 일기 등록하기
        </button>
      )}
    </div>
  );
};

export default DiaryCreateButton;
