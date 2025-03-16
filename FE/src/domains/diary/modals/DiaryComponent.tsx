import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiaryHeader from '../components/create_edit/DiaryHeader';
import DiaryInput from '../components/create_edit/DiaryInput';
import DiaryTags from '../components/create_edit/DiaryTags';
import DiaryDisclose from '../components/create_edit/DiaryDisclose';
import DiaryCreateButton from '../components/create_edit/DiaryCreateButton';
import DetailTags from '../components/details/DetailTags';
import MainPage from '@/domains/mainpage/pages/MainPage';

interface DiaryData {
  id?: number;
  title?: string;
  content?: string;
  tags?: string[];
  dream_video?: string;
  isPublic?: boolean;
}

interface DiaryProps {
  onClose?: () => void;
  isEditing?: boolean;
  diaryData?: DiaryData;
}

const DiaryComponent: React.FC<DiaryProps> = ({ 
  onClose, 
  isEditing = false, 
  diaryData 
}) => {
  console.log("DiaryComponent 렌더링 시작", { isEditing, diaryData });
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  // 상태 관리
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // 데이터 초기화 (props 또는 API에서 가져오기)
  useEffect(() => {
    console.log("DiaryComponent useEffect 실행", { isEditing, diaryData, id });
    
    if (isEditing) {
      // props로 전달된 데이터가 있으면 사용
      if (diaryData) {
        console.log("props로 전달된 데이터 사용", diaryData);
        setTitle(diaryData.title || '');
        setContent(diaryData.content || '');
        setTags(diaryData.tags || []);
        setIsPublic(diaryData.isPublic !== undefined ? diaryData.isPublic : true);
      } 
      // props로 전달된 데이터가 없고 id가 있으면 API 호출
      else if (id) {
        console.log("API에서 데이터 가져오기 시도", { id });
        // 여기서 API 호출을 통해 데이터를 가져오는 로직을 구현
        // 예: fetchDiaryById(id).then(data => { ... })
        
        // 임시 데이터 (실제로는 API 응답으로 대체)
        const tempData = {
          id: parseInt(id),
          title: '수정할 일기 제목',
          content: '수정할 일기 내용',
          tags: ['태그1', '태그2'],
          isPublic: true
        };
        
        setTitle(tempData.title);
        setContent(tempData.content);
        setTags(tempData.tags);
        setIsPublic(tempData.isPublic);
      }
    }
  }, [isEditing, diaryData, id]);

  // 모달 닫기 핸들러
  const handleClose = () => {
    console.log("DiaryComponent 닫기 시도", { onClose });
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  // 이벤트 버블링 중지 함수
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 일기 저장 (생성/수정) 핸들러
  const handleSave = () => {
    console.log("일기 저장 시도", { isEditing, title, content, tags, isPublic });
    
    const diaryToSave = {
      id: isEditing ? (diaryData?.id || parseInt(id || '0')) : undefined,
      title,
      content,
      tags,
      isPublic
    };

    if (isEditing) {
      console.log('일기 수정:', diaryToSave);
      // 수정 API 호출
      // api.updateDiary(diaryToSave).then(() => { ... })
      
      // 성공 후 상세 페이지로 이동 또는 모달 닫기
      if (onClose) {
        console.log("onClose 함수 호출");
        onClose();
      } else {
        navigate(`/diary/${diaryToSave.id}`);
      }
    } else {
      console.log('일기 생성:', diaryToSave);
      // 생성 API 호출
      // api.createDiary(diaryToSave).then(newDiary => { ... })
      
      // 성공 후 메인 페이지 또는 상세 페이지로 이동
      navigate('/');
    }
  };

  // 동영상 생성 핸들러
  const handleCreateVideo = () => {
    console.log('등록 후 동영상 생성하기');
    // 동영상 생성 API 호출
  };

  const Count = 3; // 동영상 생성 가능 횟수

  return (
    <div className="absolute inset-0">
      {isEditing ? (
        // 수정 모드일 때는 위치 지정 스타일 제거
        <div className="w-full h-full py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar bg-[rgba(110,110,110,0.47)]" onClick={stopPropagation}>
          <div className="pr-3 flex flex-col gap-5">
            <div>
              <DiaryHeader onClose={handleClose} isEditing={isEditing} />
            </div>

            <div>
              <DiaryInput 
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
              />
            </div>

            <div>
              <DetailTags 
                initialTags={diaryData?.tags || []}
                isEditing={true}
                onTagsChange={setTags}
              />
            </div>

            <div>
              <DiaryDisclose 
                isPublic={isPublic}
                onToggle={setIsPublic}
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
      ) : (
        // 생성 모드일 때는 중앙 정렬 위치 지정
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[87%] py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar bg-[rgba(110,110,110,0.47)]" onClick={stopPropagation}>
          <div className="pr-3 flex flex-col gap-5">
            <div>
              <DiaryHeader onClose={handleClose} isEditing={isEditing} />
            </div>

            <div>
              <DiaryInput 
                title={title}
                content={content}
                onTitleChange={setTitle}
                onContentChange={setContent}
              />
            </div>

            <div>
              <DetailTags 
                initialTags={diaryData?.tags || []}
                isEditing={true}
                onTagsChange={setTags}
              />
            </div>

            <div>
              <DiaryDisclose 
                isPublic={isPublic}
                onToggle={setIsPublic}
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
      )}
    </div>
  );
};

export default DiaryComponent;