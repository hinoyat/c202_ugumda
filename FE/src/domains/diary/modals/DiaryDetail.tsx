import React, { useState } from 'react';
import MainPage from '@/domains/mainpage/pages/MainPage';
import DetailHeader from '../components/details/DetailHeader';
import DetailVideo from '../components/details/DetailVideo';
import DetailContent from '../components/details/DetailContent';
import DetailTags from '../components/details/DetailTags';
import DetailLike from '../components/details/DetailLike';
import DetailButtons from '../components/details/DetailButtons';
import DiaryComponent from './DiaryComponent'; // 수정 모달용 컴포넌트 import

import '../../search/styles/DiarySearch.css';

const DiaryDetail = () => {
  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const diarydata = {
    id: 1,
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
    setIsEditing(true);
  };

  // 수정 모드 종료
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="relative w-screen h-screen">
      <MainPage />
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* 수정 모드일 때 DiaryComponent 표시 */}
      {isEditing ? (
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
      ) : (
        /* 모달 배경 시작 */
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform w-[45%] h-[87%] modal-back-color p-1 z-50">
          {/* 모달 내용을 전체 감싸는 div태그 시작 */}
          <div className="w-full h-full py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar">
            <div className=" pr-3 flex flex-col gap-3">
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

              <div className=" overflow-y-auto custom-scrollbar whitespace-normal break-words">
                <DetailContent content={diarydata.content} />
              </div>

              <div className="">
                <DetailTags tags={diarydata.tags} />
              </div>

              <div className=" h-10 flex items-center justify-end">
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
      )}
      {/* 모달 배경 끝 */}
    </div>
  );
};

export default DiaryDetail;