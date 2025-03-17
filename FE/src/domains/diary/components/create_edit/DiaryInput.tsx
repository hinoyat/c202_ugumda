import React, { ChangeEvent } from 'react'

interface DiaryInputProps {
  title?: string;           // 제목 초기값
  content?: string;         // 내용 초기값
  onTitleChange?: (title: string) => void;     // 제목 변경 핸들러
  onContentChange?: (content: string) => void; // 내용 변경 핸들러
}

const DiaryInput: React.FC<DiaryInputProps> = ({
  title = '',
  content = '',
  onTitleChange,
  onContentChange
}) => {
  // 제목 변경 핸들러
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onTitleChange) {
      onTitleChange(e.target.value);
    }
  };

  // 내용 변경 핸들러
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onContentChange) {
      onContentChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="제목을 입력해주세요" 
          className="border-b border-white p-2 text-white placeholder-[rgba(255,255,255,0.7)] text-xl outline-none"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea 
          placeholder="내용을 작성해주세요" 
          className="p-2 bg-[rgba(110,110,110,0.47)] placeholder-[rgba(255,255,255,0.7)] text-md h-70 text-[rgba(255,255,255,0.7)]"
          value={content}
          onChange={handleContentChange}
        />
    </div>
  )
}

export default DiaryInput