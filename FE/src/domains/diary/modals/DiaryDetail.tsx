// 일기 조회 컴포넌트

import React, { useState, useEffect } from 'react';
import DetailHeader from '@/domains/diary/components/details/DetailHeader';
import DetailVideo from '@/domains/diary/components/details/DetailVideo';
import DetailContent from '@/domains/diary/components/details/DetailContent';
import DetailTags from '@/domains/diary/components/details/DetailTags';
import DetailLike from '@/domains/diary/components/details/DetailLike';
import DetailButtons from '@/domains/diary/components/details/DetailButtons';
import DiaryComponent from '@/domains/diary/modals/DiaryComponent';

import '@/domains/search/styles/DiarySearch.css';

interface DiaryDetailProps {
  initialDiary: {
    id: number;
    title: string;
    content: string;
    tags: string[];
    created_at: string;
    isPublic: boolean;
    dream_video?: string | null;
  };
  onClose: () => void;
  //  수정된 데이터를 부모 컴포넌트에 전달하는 콜백 함수
  onUpdateDiary?: (updatedDiary: DiaryDetailProps['initialDiary']) => void;
}

const DiaryDetail: React.FC<DiaryDetailProps> = ({
  initialDiary,
  onClose,
  onUpdateDiary,
}) => {
  // 수정 모드 상태와 폼 표시 상태 분리 (Universe 방식으로 통일)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false); // 추가: 폼 표시 여부를 별도로 관리

  // 현재 보여지는 일기 데이터를 상태로 관리하여 수정 후 반영할 수 있게 함
  const [currentDiary, setCurrentDiary] = useState(initialDiary);

  // 컴포넌트 마운트/업데이트 시 로그
  useEffect(() => {
    console.log(
      'DiaryDetail useEffect 실행, isEditing:',
      isEditing,
      'showForm:',
      showForm
    );
  }, [isEditing, showForm]);

  // 수정 모드 활성화 함수 변경 (Universe 방식으로 통일)
  const handleEdit = () => {
    console.log('수정 모드 활성화');
    setIsEditing(true);
    setShowForm(true); // 폼 표시 설정
  };

  // 일기 상세 페이지 닫기
  const handleClose = () => {
    onClose();
  };

  console.log('렌더링 전 현재 상태:', { isEditing, showForm });

  return (
    <div className="relative w-full h-full backdrop-blur-[4px] bg-black/50">
      <div
        className="inset-0 absolute"
        onClick={handleClose}></div>
      {/* Universe 방식처럼 showForm으로 모달 표시 여부 제어  */}
      {showForm && (
        <DiaryComponent
          onClose={(newDiaryData) => {
            console.log('DiaryComponent onClose 호출됨', newDiaryData);
            setShowForm(false);

            // 수정된 데이터가 있으면 현재 일기 데이터 업데이트
            if (isEditing && newDiaryData) {
              console.log('일기 데이터 업데이트', newDiaryData);

              // 현재 일기 데이터 업데이트
              const updatedDiary = {
                ...currentDiary,
                title: newDiaryData.title || currentDiary.title,
                content: newDiaryData.content || currentDiary.content,
                tags: newDiaryData.tags || currentDiary.tags,
                isPublic:
                  newDiaryData.isPublic !== undefined
                    ? newDiaryData.isPublic
                    : currentDiary.isPublic,
                // 동영상 관련 데이터도 있다면 업데이트
                dream_video:
                  newDiaryData.dream_video || currentDiary.dream_video,
              };

              setCurrentDiary(updatedDiary);

              // 부모 컴포넌트에 수정된 데이터 전달
              if (onUpdateDiary) {
                console.log('부모 컴포넌트에 수정된 데이터 전달', updatedDiary);
                onUpdateDiary(updatedDiary);

                onClose();
              }
            }

            // 수정 모드 종료
            setIsEditing(false);
          }}
          isEditing={isEditing}
          diaryData={{
            id: currentDiary.id,
            title: currentDiary.title,
            content: currentDiary.content,
            tags: currentDiary.tags,
            isPublic: currentDiary.isPublic,
          }}
        />
      )}

      {/* 일기 조회 UI (폼 표시 중이 아닐 때만 보임) */}
      {!showForm && (
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
                  created_at={currentDiary.created_at}
                />
              </div>

              {/* {currentDiary.dream_video && (
                <div className="">
                  <DetailVideo dream_video={currentDiary.dream_video} />
                </div>
              )} */}

              <div>
                <DetailVideo
                  dream_video={currentDiary.dream_video || undefined}
                />
              </div>

              {/* contents 칸 크기수정 여기서 */}
              <div className="overflow-y-auto custom-scrollbar whitespace-normal break-words flex-glow min-h-[150px]">
                <DetailContent content={currentDiary.content} />
              </div>

              <div className="">
                <DetailTags
                  initialTags={currentDiary.tags}
                  isEditing={false}
                />
              </div>

              <div className="h-10 flex items-center justify-end">
                <DetailLike
                  likes={0} // 임시 값
                  likes_boolean={false} // 임시 값
                />
              </div>

              <div className="">
                <DetailButtons
                  onEdit={handleEdit}
                  onClose={handleClose}
                />
              </div>
            </div>
          </div>
          {/* 모달 내용을 전체 감싸는 div태그 끝 */}
        </div>
      )}
    </div>
  );
};

export default DiaryDetail;
