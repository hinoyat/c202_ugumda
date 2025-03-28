// 일기 조회 컴포넌트

import React, { useState, useEffect } from 'react';
import DetailHeader from '@/domains/diary/components/details/DetailHeader';
import DetailVideo from '@/domains/diary/components/details/DetailVideo';
import DetailContent from '@/domains/diary/components/details/DetailContent';
import DetailTags from '@/domains/diary/components/details/DetailTags';
import DetailLike from '@/domains/diary/components/details/DetailLike';
import DetailButtons from '@/domains/diary/components/details/DetailButtons';

import '@/domains/search/styles/DiarySearch.css';

interface Tag {
  tagSeq: number;
  name: string;
}

interface DiaryDetailProps {
  initialDiary: {
    diarySeq: number;
    title: string;
    content: string;
    tags: Tag[];
    createdAt: string;
    isPublic: string;
    videoUrl?: string | null;
    dreamDate?: string;
    emotionName: string;
  };
  onClose: () => void;
}

const DiaryDetail: React.FC<DiaryDetailProps> = ({
  initialDiary, // 일기 초기값
  onClose,
}) => {
  // 현재 보여지는 일기 데이터를 상태로 관리
  const [currentDiary, setCurrentDiary] = useState(initialDiary);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    // "20250324 165553" -> "2025.03.24 16:55"
    if (!dateString || dateString.length < 14) return dateString;

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);

    return `${year}.${month}.${day} ${hour}:${minute}`;
  };

  // 일기 상세 페이지 닫기
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[4px] z-[9999]">
      <div
        className="inset-0 absolute"
        onClick={handleClose}></div>
      {/* 일기 조회 UI */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform w-[27%] h-[75%] bg-[#505050]/90 rounded-lg p-1 z-50">
        {/* 닫기버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 flex items-center justify-center"
          aria-label="닫기">
          <span className="text-white text-lg font-semibold leading-none">
            ×
          </span>
        </button>

        {/* 모달 내용을 전체 감싸는 div태그 시작 */}
        <div className="w-full h-full py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar">
          <div className="pr-3 flex flex-col justify-between w-full h-full gap-3">
            <div>
              <DetailHeader
                title={currentDiary.title}
                created_at={formatDate(currentDiary.createdAt)}
              />
            </div>
            <div>
              <DetailVideo dream_video={currentDiary.videoUrl || undefined} />
            </div>
            {/* 감정 표시 추가
            {currentDiary.emotionName && (
              <div className="text-sm text-white mb-2">
                감정: {currentDiary.emotionName}
              </div>
            )} */}
            {/* contents 칸 크기수정 여기서 */}
            <div className="overflow-y-auto custom-scrollbar whitespace-normal break-words flex-glow min-h-[150px]">
              <DetailContent content={currentDiary.content} />
            </div>
            <div className="">
              <DetailTags
                initialTags={currentDiary.tags}
                isEditing={false}
                emotionName={currentDiary.emotionName}
              />
            </div>
            <div className="h-10 flex items-center justify-end">
              <DetailLike
                likes={0} // 임시 값
                likes_boolean={false} // 임시 값
              />
            </div>
            <div className="">
              <DetailButtons onClose={handleClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetail;
