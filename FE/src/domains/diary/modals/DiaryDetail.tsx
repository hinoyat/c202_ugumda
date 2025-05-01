// 일기 조회 컴포넌트

import React, { useState, useEffect } from 'react';
import DetailHeader from '@/domains/diary/components/details/DetailHeader';
import DetailVideo from '@/domains/diary/components/details/DetailVideo';
import DetailContent from '@/domains/diary/components/details/DetailContent';
import DetailLike from '@/domains/diary/components/details/DetailLike';
import ModalBase from '../components/modalBase';

import '@/domains/search/styles/DiarySearch.css';
import { diaryApi } from '@/domains/diary/api/diaryApi';
import DiaryTags from '@/domains/diary/components/create_edit/DiaryTags';
import UpdateButton from '@/domains/diary/components/details/button/UpdateButton';
import { dreamApi } from '@/domains/diary/api/dreamApi';
import DreamMeaningView from '@/domains/diary/components/details/DreamMeaningView';
import DestinyButton from '@/domains/diary/components/details/button/DestinyButton';
import { Tag } from '@/domains/diary/Types/diary.types';
import { videoApi } from '@/domains/diary/api/videoApi';

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
    likeCount?: number;
    hasLiked?: boolean;
  };
  onClose: () => void;
  onEdit?: () => void;
  isMySpace?: boolean;
}

const DiaryDetail: React.FC<DiaryDetailProps> = ({
  initialDiary, // 일기 초기값
  onClose,
  onEdit,
  isMySpace = false,
}) => {
  // --------------- 상태관리 ----------------- //
  const [currentDiary, setCurrentDiary] = useState(initialDiary);
  const [dreamMeaning, setDreamMeaning] = useState<{
    resultContent: string;
    isGood: string;
  } | null>(null);
  const [loadingDreamMeaning, setLoadingDreamMeaning] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false); // 꿈영상 재생성
  const [isPendingVideo, setIsPendingVideo] = useState(false);       // 꿈영상중 = pending
  // ------------------------------------------ //

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

  // ---------- 좋아요 ---------- //
  const handleLikeChange = async () => {
    try {
      const response = await diaryApi.toggleLike(currentDiary.diarySeq);

      const isLiked = response.data.message.includes('추가'); // 응답에 '추가' 단어가 있는지
      const newLikeCount = isLiked
        ? (currentDiary.likeCount || 0) + 1
        : (currentDiary.likeCount || 0) - 1;

      // 현재 일기 중 좋아요 관련 부분만 업데이트
      setCurrentDiary({
        ...currentDiary,
        hasLiked: isLiked,
        likeCount: newLikeCount,
      });
    } catch (error) {}
  };

  // ---------- 꿈영상 생성중 = pending ----------- //

  useEffect(()=>{

    if(initialDiary.videoUrl === 'pending'){
      setIsPendingVideo(true)
    }else{
      setIsPendingVideo(false)
    }
  },[initialDiary.videoUrl]);
  // ---------- 꿈영상 재생성 ----------- //

  const handleVideoRetry = async () => {
    setIsVideoGenerating(true);
    // try {
    //   const response = await videoApi.createVideo({
    //     diary_pk: initialDiary.diarySeq,
    //     content: initialDiary.content,
    //   });

    //   // 영상 재생성에 성공 시
    //   setCurrentDiary((prevDiary) => ({
    //     ...prevDiary,
    //     videoUrl: response.data.videoUrl,
    //   }));
    // } catch (error) {
    //   alert('영상 재생성에 실패했습니다. 다시 시도해주세요.');
    // } finally {
    //   setIsVideoGenerating(false);
    // }
  };

  // --------- 꿈해몽 ---------- //

  useEffect(() => {
    const fetchDreamMeaning = async () => {
      if (!initialDiary.diarySeq) return;

      setLoadingDreamMeaning(true);
      try {
        const response = await dreamApi.getDreamMeaningById(
          initialDiary.diarySeq
        );

        if (response.data && response.data.data) {
          setDreamMeaning({
            resultContent: response.data.data.resultContent,
            isGood: response.data.data.isGood,
          });
        }
      } catch (error) {
        setDreamMeaning({
          resultContent: '꿈해몽 데이터를 불러오는데 실패했습니다.',
          isGood: 'N',
        });
      } finally {
        setLoadingDreamMeaning(false);
      }
    };

    fetchDreamMeaning();
  }, [initialDiary.diarySeq]);

  // --------- 오늘 날짜 확인  ---------- //
    const isTodayDiary = () => {
      if (!currentDiary.createdAt || currentDiary.createdAt.length < 8) return false;
      
      // createdAt에서 날짜 부분만 추출 (YYYYMMDD)
      const year = currentDiary.createdAt.substring(0, 4);
      const month = currentDiary.createdAt.substring(4, 6);
      const day = currentDiary.createdAt.substring(6, 8);
      const diaryDateStr = `${year}${month}${day}`;
     
      
      // 오늘 날짜를 "YYYYMMDD" 형식으로 변환
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
      const todayDay = String(today.getDate()).padStart(2, '0');
      const todayStr = `${todayYear}${todayMonth}${todayDay}`;

      
      return diaryDateStr === todayStr;
    };

  return (
    <>
      {/* 모달 바깥 부분 */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[4px] z-[9999]">
        <div
          className="inset-0 absolute "
          onClick={handleClose}></div>
        {/* ------------------------------------------ 일기 조회 UI ------------------------------------------ */}

        {/* 모달컨테이너 */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform w-[70%] h-[80%] p-1 z-50">
          <ModalBase>
            {/* -------------- 닫기버튼 -------------- */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 flex items-center justify-center cursor-pointer"
              aria-label="닫기">
              <span className="text-white text-lg font-semibold leading-none">
                ×
              </span>
            </button>
            {/* ------------------------------------------ 2분할 레이아웃 컨테이너 ------------------------------------------ */}
            <div className="flex w-full h-full">
              {/* 왼쪽영역 */}
              <div className="w-1/2 h-full py-7 px-3 pl-7 overflow-hidden ">
                <div className="pr-3 flex flex-col  w-full h-full">
                  <div className="mt-2 ml-2 mb-12">
                    {/* 일기제목, 작성날짜, 공개여부 */}
                    <DetailHeader
                      title={currentDiary.title}
                      created_at={formatDate(currentDiary.createdAt)}
                      isPublic={currentDiary.isPublic === 'Y'}
                    />
                  </div>
                  <div className="w-[90%] mb-14 mx-auto flex justify-center items-center h-64">
                    {/* 영상 */}
                    <DetailVideo
                      dream_video={currentDiary.videoUrl && currentDiary.videoUrl !== 'pending' ? currentDiary.videoUrl : null}
                      onVideoRetry={currentDiary.videoUrl === null ? handleVideoRetry : undefined
                      }
                      isVideoGenerating={isVideoGenerating}
                      isPendingVideo={isPendingVideo}
                      isMySpace={isMySpace}
                    />
                  </div>
                  {/* 태그 */}
                  <div>
                    <DiaryTags
                      initialTags={currentDiary.tags || []}
                      isEditing={false}
                      emotionName={currentDiary.emotionName}
                    />
                  </div>
                  {/* 좋아요 */}
                  <div className="h-10 flex items-center justify-end mr-2">
                    <DetailLike
                      likes={currentDiary.likeCount ?? 0}
                      likes_boolean={currentDiary.hasLiked ?? false}
                      diarySeq={currentDiary.diarySeq}
                      isMyDiary={isMySpace}
                      onLikeToggle={handleLikeChange}
                    />
                  </div>
                </div>
              </div>

              {/* 세로점선 */}
              <div className=" h-[90%] my-auto border-r border-white/30 border-dashed mr-7"></div>

              {/* 오른쪽 영역 - 4개의 개별 div로 구성 */}
              <div className="w-1/2 h-full py-7 px-7 overflow-y-auto custom-scrollbar">
                {/* 1. 꿈일기내용 */}
                <div className="whitespace-normal break-words mb-6 mt-6 h-40 overflow-y-auto">
                  <DetailContent content={currentDiary.content} />
                </div>

                {/* 2. 수정하기 버튼 */}
                {isMySpace && (
                  <div className="mb-6 flex justify-end">
                    <UpdateButton
                      onEdit={onEdit}
                      isMySpace={isMySpace}
                    />
                  </div>
                )}

                {/* 가로선 */}
                {/* <div className="border-b border-white/30 border-dashed mb-6  w-[100%] "></div> */}

                {/* 3. 꿈해몽 섹션 */}
                <div className="p-4 rounded mb-6 h-40 overflow-y-auto">
                  <h3 className="text-white font-bold mb-2">꿈 해몽 🪄</h3>
                  {loadingDreamMeaning ? (
                    <p className="text-white">꿈해몽 데이터를 불러오는 중...</p>
                  ) : dreamMeaning ? (
                    <DreamMeaningView
                      resultContent={dreamMeaning.resultContent}
                      isGood={dreamMeaning.isGood}
                    />
                  ) : (
                    <p className="text-white">꿈해몽 데이터가 없습니다.</p>
                  )}
                </div>

                {/* 4. 운세보러가기 버튼 */}
                <div className="flex flex-col items-end">
                  {dreamMeaning && isMySpace && isTodayDiary() && (
                    <>
                      <DestinyButton isGood={dreamMeaning.isGood} />
                      <p className="text-white/85 text-xs mt-2 text-right">
                        {dreamMeaning.isGood === 'Y'
                          ? '좋은 꿈을 꿨으니, 오늘의 행운을 확인해보세요! 🍀'
                          : '힘든 꿈이었다면, 오늘의 운세를 확인하고 용기를 얻어보세요. 💪'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ModalBase>
        </div>
      </div>
    </>
  );
};

export default DiaryDetail;
