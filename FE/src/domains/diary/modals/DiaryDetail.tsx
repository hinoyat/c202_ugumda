import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainPage from '@/domains/mainpage/pages/MainPage';
import DetailHeader from '../components/details/DetailHeader';
import DetailVideo from '../components/details/DetailVideo';
import DetailContent from '../components/details/DetailContent';
import DetailTags from '../components/details/DetailTags';
import DetailLike from '../components/details/DetailLike';
import DetailButtons from '../components/details/DetailButtons';
import DiaryComponent from './DiaryComponent';

import '../../search/styles/DiarySearch.css';

const DiaryDetail = () => {
  console.log("DiaryDetail 컴포넌트 렌더링");
  const { id } = useParams(); // URL에서 일기 ID 가져오기
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 컴포넌트 마운트/업데이트 시 로그
  useEffect(() => {
    console.log("DiaryDetail useEffect 실행, isEditing:", isEditing);
  }, [isEditing]);

  // 예시 데이터 (실제로는 ID를 기반으로 API에서 가져와야 함)
  const diarydata = {
    id: parseInt(id || '1'),
    title: '현호공쥬와 세계최강귀요미왕자의 결혼식',
    created_at: '2025-03-14',
    dream_video: '/loginVideo.mp4',
    content:
      'fdsfasdfjhsakfhjksdhfjkhsdjkfhnjksadfjkshdnfjkhsdjkfhsadjkfhjdskfhjksadhjkdsahjksdhfkjslahfjksdhfjksafhsdaj',
    tags: ['행복', '결혼', '경사'],
    likes_boolean: true,
    likes: 22,
    isPublic: true, // 공개 여부 추가
  };

  // 문자열 앞뒤 공백 제거 후 비교
  const flag = diarydata.dream_video.trim() !== '';

  // 수정 모드 활성화
  const handleEdit = () => {
    console.log("handleEdit 함수 실행됨");
    console.log("수정 전 tags:", diarydata.tags);
    setIsEditing(true);
    console.log("isEditing 상태 변경 후:", true);
  };

  // 수정 모드 종료
  const handleCloseEdit = () => {
    console.log("수정 모드 종료 함수 실행");
    setIsEditing(false);
  };

  // 일기 상세 페이지 닫기
  const handleClose = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  console.log("렌더링 전 현재 isEditing 상태:", isEditing);

  return (
    <div className="relative w-screen h-screen">
      <MainPage />
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {isEditing ? (
        <>
          {console.log("DiaryComponent 렌더링 시작", { 
            diaryData: {
              id: diarydata.id,
              title: diarydata.title,
              content: diarydata.content,
              tags: diarydata.tags,
              dream_video: diarydata.dream_video,
              isPublic: diarydata.isPublic
            }
          })}
          <DiaryComponent 
            onClose={handleCloseEdit} 
            isEditing={true}
            diaryData={{
              id: diarydata.id,
              title: diarydata.title,
              content: diarydata.content,
              tags: diarydata.tags,
              dream_video: diarydata.dream_video,
              isPublic: diarydata.isPublic
            }}
          />
        </>
      ) : (
        <>
          {console.log("상세보기 모달 렌더링")}
          {/* 모달 배경 시작 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform w-[45%] h-[87%] modal-back-color p-1 z-50">
            {/* 모달 내용을 전체 감싸는 div태그 시작 */}
            <div className="w-full h-full py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar">
              <div className="pr-3 flex flex-col gap-3">
                <div className="">
                  <DetailHeader
                    title={diarydata.title}
                    created_at={diarydata.created_at}
                  />
                </div>

                {flag && (
                  <div className="">
                    <DetailVideo dream_video={diarydata.dream_video} />
                  </div>
                )}

                <div className="overflow-y-auto custom-scrollbar whitespace-normal break-words">
                  <DetailContent content={diarydata.content} />
                </div>

                <div className="">
                  <DetailTags initialTags={diarydata.tags} />
                </div>

                <div className="h-10 flex items-center justify-end">
                  <DetailLike
                    likes={diarydata.likes}
                    likes_boolean={diarydata.likes_boolean}
                  />
                </div>

                <div className="">
                  <DetailButtons onEdit={handleEdit} />
                </div>
              </div>
            </div>
            {/* 모달 내용을 전체 감싸는 div태그 끝 */}
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryDetail;