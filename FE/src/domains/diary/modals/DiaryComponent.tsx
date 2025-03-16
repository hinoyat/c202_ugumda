import React, { useState, useEffect } from 'react'
import DiaryHeader from '../components/create_edit/DiaryHeader'
import DiaryInput from '../components/create_edit/DiaryInput'
import DiaryTags from '../components/create_edit/DiaryTags'
import DiaryDisclose from '../components/create_edit/DiaryDisclose'
import DiaryCreateButton from '../components/create_edit/DiaryCreateButton'

interface DiaryData {
  id?: number;
  title?: string;
  content?: string;
  tags?: string[];
  dream_video?: string;
  isPublic?: boolean; // 공개 여부 추가
}

interface DiaryProps {
  onClose: () => void;
  isEditing?: boolean;
  diaryData?: DiaryData;
}

const DiaryComponent: React.FC<DiaryProps> = ({ onClose, isEditing = false, diaryData }) => {
  // 일기 상태 관리
  const [title, setTitle] = useState<string>(diaryData?.title || '');
  const [content, setContent] = useState<string>(diaryData?.content || '');
  const [tags, setTags] = useState<string[]>(diaryData?.tags || []);
  const [isPublic, setIsPublic] = useState<boolean>(diaryData?.isPublic || false);

  // 초기 데이터 설정
  useEffect(() => {
    if (isEditing && diaryData) {
      setTitle(diaryData.title || '');
      setContent(diaryData.content || '');
      setTags(diaryData.tags || []);
      setIsPublic(diaryData.isPublic || false);
    }
  }, [isEditing, diaryData]);

  // 일기 생성/수정 핸들러
  const handleSave = () => {
    const updatedDiary = {
      id: diaryData?.id,
      title,
      content,
      tags,
      isPublic
    };

    if (isEditing) {
      console.log("일기 수정:", updatedDiary);
      // 여기에 수정 API 호출 로직 추가
    } else {
      console.log("일기 생성:", updatedDiary);
      // 여기에 생성 API 호출 로직 추가
    }
  };

  // 영상 생성 핸들러
  const handleCreateVideo = () => {
    console.log("등록 후 동영상 생성하기");
    // 여기에 동영상 생성 API 호출 로직 추가
  };

  const Count = 3; // 글자 수 카운트 또는 다른 용도로 사용

  return (
    <div className="w-screen h-screen relative">
      <div className="absolute inset-0 backdrop-blur-sm bg-black" onClick={onClose}></div>
      {/*모달 시작하는 부분 */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform w-[43%] h-[65%] bg-[rgba(110,110,110,0.47)] p-1">
        {/*모달 내용*/}
        <div className="w-full h-full py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar">
          {/*모달 컴포넌트 모아둘 공간 */}
          <div className="pr-3 flex flex-col gap-5">
            <div>
              <DiaryHeader 
                onClose={onClose} 
                isEditing={isEditing} 
              />
            </div>

            <div>
              <DiaryInput 
                title={title}
                content={content}
                onTitleChange={(newTitle) => setTitle(newTitle)}
                onContentChange={(newContent) => setContent(newContent)}
              />
            </div>

            <div>
              <DiaryTags 
                initialTags={tags}
                onTagsChange={(newTags) => setTags(newTags)}
              />
            </div>

            <div>
              <DiaryDisclose 
                isPublic={isPublic}
                onToggle={(value) => setIsPublic(value)}
              />
            </div>

            <div>
              <DiaryCreateButton 
                onCreate={handleSave} 
                onCreateVideo={handleCreateVideo} 
                Count={Count}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiaryComponent