import React, { useState, FC, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';

interface DiaryTagsProps {
  initialTags?: string[]; // 수정 시 기존 태그 전달
  onTagsChange?: (tags: string[]) => void; // 태그 변경 시 부모 컴포넌트에 알림
}

const DiaryTags: FC<DiaryTagsProps> = ({ initialTags = [], onTagsChange }) => {
  console.log("DiaryTags 컴포넌트 렌더링, initialTags:", initialTags);
  
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);

  // 상수 정의
  const MAX_TAG_LENGTH = 5; // 태그 글자수 최대 5글자
  const MAX_HISTORY_TAGS = 7; // 최근 태그는 7개까지 보여줌
  const MAX_TAGS = 3; // 태그는 최대 3개까지 등록 가능

  const possibleTags: string[] = [
    '자전거',
    '자각몽',
    '자유',
    '사자',
    '애자일',
    '테스트1',
    '테스트2',
  ];
  const historyTags: string[] = [
    '#태그1',
    '#태그2',
    '#태그3',
    '#태그4',
    '#태그5',
    '#태그6',
    '#태그7',
    '#태그8',
    '#태그9',
  ];

  // initialTags가 변경되면 tags 상태 업데이트
  useEffect(() => {
    console.log("DiaryTags useEffect - initialTags 변경 감지:", initialTags);
    if (initialTags && initialTags.length > 0) {
      setTags(initialTags);
    }
  }, [initialTags]);

  // 부모 컴포넌트에 태그 변경 알림
  useEffect(() => {
    console.log("DiaryTags useEffect - tags 변경 감지:", tags);
    if (onTagsChange) {
      onTagsChange(tags);
    }
  }, [tags, onTagsChange]);

  // 앞뒤 공백 제거한 값을 사용
  const searchTerm = inputValue.trim();
  // searchTerm이 있으면 includes로 필터링, 없으면 빈 배열
  const filteredOptions: string[] = searchTerm
    ? possibleTags.filter(
        (tag) => tag.includes(searchTerm) && !tags.includes(tag)
      )
    : [];

  // input 컨테이너 너비 업데이트 - 초기 렌더링 및 태그/입력값 변경 시마다 실행
  useEffect(() => {
    const updateWidth = () => {
      if (inputContainerRef.current) {
        setDropdownWidth(inputContainerRef.current.offsetWidth);
      }
    };
    
    // 초기 로드 및 리사이징 시 너비 업데이트
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // 인풋의 변화 이벤트 핸들러 (5글자 제한 추가)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 최대 글자수 제한
    if (value.length <= MAX_TAG_LENGTH) {
      setInputValue(value);
    }
  };

  // history 태그 클릭 시 태그를 바로 선택 (중복 체크 및 최대 개수 제한 추가)
  const handleHistoryTagClick = (tag: string) => {
    console.log("history 태그 클릭:", tag);
    if (!tags.includes(tag) && tags.length < MAX_TAGS) {
      setTags([...tags, tag]);
    }
  };

  // 자동완성 옵션 클릭 시 태그 추가 및 인풋 초기화 (중복 체크 및 최대 개수 제한 추가)
  const handleOptionClick = (tag: string) => {
    console.log("자동완성 옵션 클릭:", tag);
    if (!tags.includes(tag) && tags.length < MAX_TAGS) {
      setTags([...tags, tag]);
      setInputValue('');
    }
  };

  // 선택된 태그 삭제
  const removeTag = (tagToRemove: string) => {
    console.log("태그 삭제:", tagToRemove);
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Enter 키를 눌렀을 때 inputValue를 태그로 추가 (중복 체크 및 최대 개수 제한 추가)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      console.log("Enter 키 입력, 태그 추가:", inputValue);
      if (!tags.includes(inputValue) && tags.length < MAX_TAGS) {
        setTags([...tags, inputValue]);
        setInputValue('');
      }
    }
  };

  // 검색어를 강조하는 함수 - 인라인 스타일 사용
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const matches = text.match(regex);
    
    if (!matches) return text;
    
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => {
          // 검색어와 일치하는 부분인지 확인
          if (part.toLowerCase() === searchTerm.toLowerCase()) {
            return (
              <span 
                key={i} 
                style={{ 
                  color: '#FFFFFF', // 흰색
                  fontSize: '16px',  // 글씨 크기
                  fontWeight: 'bold' // 굵은 글씨
                }}
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  // 태그 입력 가능 여부
  const canAddMoreTags = tags.length < MAX_TAGS;

  console.log("DiaryTags 렌더링 완료, 현재 tags:", tags);

  return (
    <div className="flex flex-col gap-1 relative">
      <h1 className="text-white text-lg">태그</h1>

      {/* 메인 컨테이너 - 태그와 입력창을 분리 */}
      <div className="flex flex-col border border-white p-2 rounded w-full relative">
        {/* 선택된 태그 영역 */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="text-white bg-[rgba(111,111,111,0.69)] px-2 py-1 rounded-4xl flex items-center gap-1"
            >
              <div className="flex items-center justify-center gap-1 text-sm">
                <p>{tag}</p>
                <button onClick={() => removeTag(tag)} className="text-white">
                  x
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 입력창 컨테이너 - 고정 너비 유지 */}
        <div 
          ref={inputContainerRef}
          className="relative w-full"
        >
          <input
            type="text"
            className="bg-transparent outline-none text-white w-full"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={canAddMoreTags ? "태그를 입력하세요 (최대 5글자)" : "태그는 최대 3개까지 입력 가능합니다"}
            disabled={!canAddMoreTags}
          />
          
          {/* 입력된 글자 수 표시 */}
          {inputValue && (
            <div className="absolute right-0 top-0 text-xs text-gray-400">
              {inputValue.length}/{MAX_TAG_LENGTH}
            </div>
          )}
          
          {/* 고정된 너비의 드롭다운 */}
          {inputValue && filteredOptions.length > 0 && canAddMoreTags && (
            <ul 
              className="absolute top-full left-0 bg-[rgba(0,0,0,0.48)] text-[rgba(255,255,255,0.6)] border border-gray-300 overflow-y-scroll backdrop-blur-2xl z-10 mt-1 max-h-40"
              style={{ width: `${dropdownWidth}px` }}
            >
              {filteredOptions.map((option) => (
                <li
                  key={option}
                  className="cursor-pointer p-2 hover:bg-[rgba(151,151,151,0.24)] flex items-center gap-5"
                  onClick={() => handleOptionClick(option)}
                >
                  <img src="/diary_history.svg" alt="" className="w-5" />
                  <p>{highlightSearchTerm(option)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* history 태그 - 최대 7개만 표시 */}
      <div className="flex gap-3 text-white italic mt-2">
        {historyTags.slice(0, MAX_HISTORY_TAGS).map((tag, index) => (
          <p
            key={index}
            className={`cursor-pointer hover:underline ${!canAddMoreTags ? 'opacity-50' : ''}`}
            onClick={() => canAddMoreTags && handleHistoryTagClick(tag)}
          >
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DiaryTags;