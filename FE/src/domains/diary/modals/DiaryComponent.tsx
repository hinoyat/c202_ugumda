import React, { useEffect, useState } from 'react';
import DiaryHeader from '../components/create_edit/DiaryHeader';
import DiaryInput from '../components/create_edit/DiaryInput';
import DiaryDisclose from '../components/create_edit/DiaryDisclose';
import DiaryCreateButton from '../components/create_edit/DiaryCreateButton';
import DetailTags from '../components/details/DetailTags';
import StarTag from '@/domains/diary/components/create_edit/StarTag';
import { diaryApi } from '@/domains/diary/api/diaryApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import {
  addDiary,
  setCurrentDiary,
  updateDiary,
} from '@/stores/diary/diarySlice';
import { DiaryData } from '@/domains/diary/Types/diary.types';
import { Tag } from '@/domains/diary/api/tagApi';
import { videoApi } from '@/domains/diary/api/videoApi';

// 일기 생성 인터페이스
// interface DiaryData {
//   diarySeq: number;
//   title: string;
//   content: string;
//   dreamDate: string;
//   isPublic: string;
//   mainEmotion: string;
//   tags?: string[];

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
  onDiaryUpdated?: (data: any) => void;
  isMySpace?: boolean;
}

const DiaryComponent: React.FC<DiaryComponentProps> = ({
  isOpen,
  onClose,
  isEditing = false,
  diaryData,
  onDiaryCreated,
  onDiaryUpdated,
  isMySpace = true,
}) => {
  // 리덕스 관련 설정
  const dispatch = useDispatch();
  const { currentDiary } = useSelector((state: RootState) => state.diary);

  // 상태 관리
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [emotion, setEmotion] = useState<string>(''); // 감정태그

  //   //-------------동영상 생성 가능 횟수도 영상 api 통신 하면서 수정 해야함 --------------//
  //   const Count = 3; // 동영상 생성 가능 횟수

  // -------------------- 일기 수정 --------------------//
  // 수정모드에서 데이터 불러오기
  useEffect(() => {
    if (isEditing && diaryData) {
      console.log('수정 모드 데이터 로드:', {
        diaryData,
        메인감정쓰: diaryData.emotionName,
      });

      setTitle(diaryData.title);
      setContent(diaryData.content);
      setTags(diaryData?.tags || []);
      setIsPublic(diaryData.isPublic === 'Y');
      setEmotion(diaryData.emotionName || diaryData.mainEmotion || '');

      // 리덕스에 현재 편집중인 일기 설정
      dispatch(setCurrentDiary(diaryData));
    }
  }, [isEditing, diaryData, dispatch]);

  // -------------------- 일기 저장 -------------------- //
  const handleSave = async () => {
    // 수정 시 감정 태그가 비어있으면 기존 값 사용
    const finalEmotion =
      isEditing && !emotion && diaryData ? diaryData.mainEmotion : emotion;

    // 백에 넘길 데이터
    const diaryToSave = {
      title,
      content,
      dreamDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      isPublic: isPublic ? 'Y' : 'N',
      mainEmotion: finalEmotion,
      tags: Array.isArray(tags)
        ? tags.map((tag) => (typeof tag === 'string' ? tag : (tag as Tag).name))
        : [],
    };

    console.log('저장될 일기 내용', diaryToSave);

    try {
      if (isEditing && diaryData?.diarySeq) {
        // 수정모드
        const response = await diaryApi.updateDiary(
          diaryData.diarySeq,
          diaryToSave
        );
        console.log('일기 수정에 성공!!!', response);

        // 리덕스 스토어 업데이트
        dispatch(updateDiary(response.data.data));

        if (onDiaryUpdated) {
          console.log('onDiaryUpdated 호출됨');
          onDiaryUpdated(response.data);
        }
      } else {
        // --------------- 생성 모드 ----------------

        const response = await diaryApi.createDiary(diaryToSave);

        console.log('일기 생성에 성공!!!!', response);

        // 리덕스 스토어에 추가
        dispatch(addDiary(response.data.data));

        // 영상 생성 API 요청
        const diarySeq = response.data.data.diarySeq;

        // content 문자아닌 것 앞에 / 붙임

        const escapeSpecialCharsForVideo = (text: string) => {
          return text
            .split('')
            .map((char) => {
              // 백슬래시는 특별한 이스케이프 문자이기 때문에 정규표현식에서 추가 처리가 필요
              // 백슬래시는 먼저 처리
              if (char === '\\') return '/\\';

              // 한글 음절, 자음, 모음, 알파벳, 숫자, 공백인 경우 그대로 유지
              return /[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/.test(char)
                ? char
                : `/${char}`;
            })
            .join('');
        };

        const escapedContent = escapeSpecialCharsForVideo(content);

        console.log('영상 생성 요청 데이터:', {
          diary_pk: diarySeq,
          content: escapedContent,
        });
        videoApi
          .createVideo({
            diary_pk: diarySeq,
            content: escapedContent,
          })
          .then((response) => {
            console.log('영상 생성 API 요청 성공:', response);
          }) // 지우기
          .catch((videoError) => {
            console.error('영상 생성 요청 중 오류:', videoError);
          });

        // 성공 시 onDiaryCreated 콜백 호출
        // 부모 컴포넌트(유니버스)로 전달 -> 새로운 일기 별 생성에 사용
        if (onDiaryCreated) {
          onDiaryCreated(response.data);
        }
      }

      onClose();
    } catch (error) {
      console.error(
        isEditing
          ? '일기 수정 중에 발생한 오류 : '
          : '일기 생성 중에 발생한 오류 : ',
        error
      );

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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[80%] py-8 px-4 pl-8 overflow-y-scroll custom-scrollbar bg-[#505050]/90 rounded-lg"
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
              initialEmotion={
                diaryData?.emotionName || diaryData?.mainEmotion || ''
              }
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
