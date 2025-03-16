import React, { useState, FC, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';

interface DetailTagsProps {
  initialTags: string[];
  isEditing?: boolean;
  onTagsChange?: (tags: string[]) => void;
}

const DetailTags: FC<DetailTagsProps> = ({ 
  initialTags, 
  isEditing = false,
  onTagsChange 
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);

  // 상수 정의
  const MAX_TAG_LENGTH = 5;
  const MAX_HISTORY_TAGS = 7;
  const MAX_TAGS = 3;

  const possibleTags = [
    '자전거', '자각몽', '자유', '사자', '애자일', '테스트1', '테스트2',
  ];
  const historyTags = [
    '#태그1', '#태그2', '#태그3', '#태그4', '#태그5', '#태그6', '#태그7', '#태그8', '#태그9',
  ];

  // 수정 모드일 때만 필요한 기능들
  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 relative">
        <h1 className="text-white text-lg">태그</h1>
        <div className="flex flex-col border border-white p-2 rounded w-full relative">
          {/* 선택된 태그 영역 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="text-white bg-[rgba(111,111,111,0.69)] px-2 py-1 rounded-4xl flex items-center justify-center gap-1"
              >
                <div className="flex items-center justify-center gap-3 text-sm ">
                  <p>{tag}</p>
                  <button 
                    onClick={() => {
                      const newTags = tags.filter(t => t !== tag);
                      setTags(newTags);
                      onTagsChange?.(newTags);
                    }} 
                    className="text-white hover:text-gray-400"
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 입력창 */}
          <div ref={inputContainerRef} className="relative w-full">
            <input
              type="text"
              className="bg-transparent outline-none text-white w-full"
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= MAX_TAG_LENGTH) {
                  setInputValue(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim() && tags.length < MAX_TAGS) {
                  const newTags = [...tags, inputValue.trim()];
                  setTags(newTags);
                  onTagsChange?.(newTags);
                  setInputValue('');
                }
              }}
              placeholder={tags.length < MAX_TAGS ? "태그를 입력하세요 (최대 5글자)" : "태그는 최대 3개까지 입력 가능합니다"}
              disabled={tags.length >= MAX_TAGS}
            />
          </div>
        </div>

        {/* history 태그 */}
        <div className="flex gap-3 text-white italic mt-2">
          {historyTags.slice(0, MAX_HISTORY_TAGS).map((tag, index) => (
            <p
              key={index}
              className={`cursor-pointer hover:underline ${tags.length >= MAX_TAGS ? 'opacity-50' : ''}`}
              onClick={() => {
                if (tags.length < MAX_TAGS && !tags.includes(tag)) {
                  const newTags = [...tags, tag];
                  setTags(newTags);
                  onTagsChange?.(newTags);
                }
              }}
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // 읽기 전용 모드 (기존 디자인 유지)
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {initialTags.map((tag) => (
        <div
          key={tag}
          className="text-white bg-[rgba(111,111,111,0.69)] px-2 py-1 rounded-4xl"
        >
          <div className="flex items-center justify-center gap-1 text-sm w-15">
            <p>{tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailTags;