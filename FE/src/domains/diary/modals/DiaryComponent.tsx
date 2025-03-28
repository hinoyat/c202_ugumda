import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiaryHeader from '../components/create_edit/DiaryHeader';
import DiaryInput from '../components/create_edit/DiaryInput';
import DiaryTags from '../components/create_edit/DiaryTags';
import DiaryDisclose from '../components/create_edit/DiaryDisclose';
import DiaryCreateButton from '../components/create_edit/DiaryCreateButton';
import DetailTags from '../components/details/DetailTags';
import MainPage from '@/domains/mainpage/pages/MainPage';
import StarTag from '@/domains/diary/components/create_edit/StarTag';
import { diaryApi } from '@/domains/diary/api/diaryApi';

// 일기 생성 인터페이스
interface DiaryData {
  diarySeq: number;
  title: string;
  content: string;
  dreamDate: string;
  isPublic: string;
  mainEmotion: string;
  tags?: string[];
}

// interface DiaryProps {
//   onClose?: (diaryData?: DiaryData) => void; // 일기 데이터 전달
//   isEditing?: boolean;
//   diaryData?: DiaryData;
// }

interface DiaryComponentProps {
  isOpen?: boolean;
  onClose: () => void;
  isEditing?: boolean;
  diaryData?: DiaryData;
  onDiaryCreated?: (responseData: any) => void;
}

const DiaryComponent: React.FC<DiaryComponentProps> = ({
  isOpen,
  onClose,
  isEditing = false,
  diaryData,
  onDiaryCreated,
}) => {
  //   onClose,
  //   isEditing = false,
  //   diaryData,
  // }) => {
  //   console.log('DiaryComponent 렌더링 시작', { isEditing, diaryData });

  //   const navigate = useNavigate();
  //   const { id } = useParams();

  //   // 상태 관리
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [emotion, setEmotion] = useState<string>(''); // 감정태그

  //   // 데이터 초기화 (props 또는 API에서 가져오기)
  //   useEffect(() => {
  //     console.log('DiaryComponent useEffect 실행', { isEditing, diaryData, id });

  //     if (isEditing) {
  //       // props로 전달된 데이터가 있으면 사용
  //       if (diaryData) {
  //         console.log('props로 전달된 데이터 사용', diaryData);
  //         setTitle(diaryData.title || '');
  //         setContent(diaryData.content || '');
  //         setTags(diaryData.tags || []);
  //         setIsPublic(diaryData.isPublic === 'Y');
  //       }
  //       // props로 전달된 데이터가 없고 id가 있으면 API 호출
  //       else if (id) {
  //         console.log('API에서 데이터 가져오기 시도', { id });
  //         // 여기서 API 호출을 통해 데이터를 가져오는 로직을 구현
  //         // 예: fetchDiaryById(id).then(data => { ... })

  //         // 임시 데이터 (실제로는 API 응답으로 대체)
  //         const tempData = {
  //           id: parseInt(id),
  //           title: '수정할 일기 제목',
  //           content: '수정할 일기 내용',
  //           tags: ['태그1', '태그2'],
  //           isPublic: true,
  //         };

  //         setTitle(tempData.title);
  //         setContent(tempData.content);
  //         setTags(tempData.tags);
  //         setIsPublic(tempData.isPublic);
  //       }
  //     }
  //   }, [isEditing, diaryData, id]);

  //   // 일기를 저장해서 UniverseDiaryForm으로 넘김
  //   const handleSave = () => {
  //     console.log('저장될 일기 내용', {
  //       title,
  //       content,
  //       dreamDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  //       isPublic: isPublic ? 'Y' : 'N',
  //       mainEmotion: emotion,
  //       tags,
  //     });

  //     // 백에 넘길 데이터
  //     const diaryToSave = {
  //       title,
  //       content,
  //       dreamDate: new Date().toISOString().slice(0, 10).replace(/=/g, ''),
  //       isPublic: isPublic ? 'Y' : 'N',
  //       mainEmotion: emotion,
  //       tags,
  //     };

  //     if (isEditing) {
  //       console.log('일기 수정:', diaryToSave);
  //       // 수정 API 호출은 여기에 구현
  //     } else {
  //       console.log('일기 생성:', diaryToSave);
  //       // 생성 API 호출은 여기에 구현
  //     }

  //     // 데이터 전달 및 모달 닫기
  //     if (onClose) {
  //       onClose(diaryToSave);
  //     } else {
  //       navigate('/');
  //     }
  //   };

  //   // -----------------------------이 부분 삭제 or 수정 필요 --------------------------//
  //   // 임시 비디오 부분이라서 api연동하면 수정해야 함 //

  //   // 동영상 생성 핸들러
  //   const handleCreateVideo = () => {
  //     console.log('등록 후 동영상 생성하기');
  //     // 동영상 생성 API 호출

  //     const diaryToSave = {
  //       title,
  //       content,
  //       dreamDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  //       isPublic: isPublic ? 'Y' : 'N',
  //       mainEmotion: emotion,
  //       tags,
  //       dream_video: 'Y', // 동영상 생성 요청 표시
  //     };

  //     if (onClose) {
  //       onClose(diaryToSave);
  //     } else {
  //       navigate('/');
  //     }
  //   };

  //   //-------------동영상 생성 가능 횟수도 영상 api 통신 하면서 수정 해야함 --------------//
  //   const Count = 3; // 동영상 생성 가능 횟수

  // -------------------- 일기 저장 -------------------- //
  const handleSave = async () => {
    console.log('저장될 감정 태그:', emotion);
    // 백에 넘길 데이터
    const diaryToSave = {
      title,
      content,
      dreamDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      isPublic: isPublic ? 'Y' : 'N',
      mainEmotion: emotion,
      tags: tags.map((tag) => (typeof tag === 'object' ? tag.name : tag)),
    };

    console.log('저장될 일기 내용', diaryToSave);

    try {
      // api 호출
      const response = await diaryApi.createDiary(diaryToSave);
      console.log('일기 생성에 성공!!!!', response);

      // 성공 시 onDiaryCreated 콜백 호출
      // 부모 컴포넌트(유니버스)로 전달 -> 새로운 일기 별 생성에 사용
      if (onDiaryCreated) {
        onDiaryCreated(response.data);
      }

      onClose();
    } catch (error) {
      console.error('일기 생성 중에 발생한 오류 : ', error);

      // error 객체를 any로 타입 캐스팅하여 속성에 접근
      const err = error as any;

      // 에러 응답 확인
      if (err.response && err.response.status === 400) {
        // 400 에러인 경우 태그 관련 에러 메시지 표시
        alert('태그는 한글, 영문, 숫자만 사용 가능합니다.');
      } else {
        // 기타 에러
        alert('일기 저장에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // -------------------- 동영상 생성 -------------------- //
  const handleCreateVideo = () => {
    console.log('등록 후 동영상 생성하기 버튼 누름');
    // 여기서 AI 쪽으로 데이터 넘겨야함
    // 특수문자에는 앞에 '/' 붙여서 넘겨야함
    // 버튼 눌렀을 때 하루 생성 가능 횟수 차감

    onClose();
  };

  // ---------- 모달 바깥쪽을 누르면 모달이 닫힘 ---------- //

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 backdrop-blur-[4px] bg-black/50"
      onClick={onClose}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[27%] h-[75%] py-7 px-3 pl-7 overflow-y-scroll custom-scrollbar bg-[#505050]/90 rounded-lg"
        onClick={(e) => e.stopPropagation()}>
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
              onTitleChange={setTitle}
              onContentChange={setContent}
            />
          </div>

          {/* 별자리를 이어줄 감정태그 */}
          <div className="mt-3">
            <h2 className="text-white text-base font-semibold mb-1">
              감정 태그
            </h2>
            <StarTag
              onSelect={setEmotion}
              initialEmotion={diaryData?.mainEmotion || ''}
            />
          </div>

          {/* 태그 */}
          <div className="mt-3">
            <DetailTags
              initialTags={diaryData?.tags || []}
              isEditing={true}
              onTagsChange={setTags}
              emotionName={emotion}
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
              isEditing={isEditing}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryComponent;
