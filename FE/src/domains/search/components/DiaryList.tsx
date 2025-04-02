import React from 'react';

interface Tag {
  tagSeq: number | null;
  name: string;
}

interface Diary {
  diarySeq: number;
  userSeq: number;
  title: string;
  content: string;
  dreamDate: string;
  isPublic: string;
  mainEmotion: string;
  tags: Tag[];
  userNickname?: string;
  profileImage?: string;
}

interface DiaryListProps {
  data: Diary[];
}

const DiaryList: React.FC<DiaryListProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-white text-center mt-4">검색 결과가 없습니다.</div>
    );
  }

  return (
    <div className="flex flex-col gap-5 mt-4">
      {data.map((diary) => (
        <div
          key={diary.diarySeq}
          className="truncate w-full">
          <div className="bg-[#505050]/90 flex px-10 py-5 gap-8 w-full rounded-lg">
            {/*방명록 왼쪽 시작 */}
            {/* 제목 */}
            <div className="flex flex-col truncate gap-2 basis-6/8">
              <h1 className="text-lg text-white font-semibold">
                {diary.title || '(제목 없음)'}
              </h1>
              <div className="px-2 flex flex-col gap-2">
                <p className="text-[14px] truncate text-white w-full">
                  {diary.content}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {Array.isArray(diary.tags) && diary.tags.length > 0 ? (
                    diary.tags.map((tag, index) => (
                      <p
                        key={index}
                        className="bg-[#D9D9D9]/29 text-white rounded text-xs px-2 py-1">
                        {tag.name}
                      </p>
                    ))
                  ) : (
                    <p className="text-white/50 text-xs">태그 없음</p>
                  )}
                </div>
              </div>
            </div>
            {/* 방명록 왼쪽 끝 */}
            <div className="flex gap-5 items-center ">
              <div className="flex gap-3 items-center">
                {diary.profileImage ? (
                  <img
                    src={diary.profileImage}
                    alt="프로필"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
                    {String(diary.userSeq).charAt(0)}
                  </div>
                )}
                <p className="text-[15px] text-white">
                  {diary.userNickname || `사용자 ${diary.userSeq}`}
                </p>
              </div>

              <div>
                <button
                  className="text-[14px] bg-[#363736] text-white px-4 py-1 rounded cursor-pointer hover:bg-neutral-500"
                  onClick={() =>
                    (window.location.href = `/diary/${diary.diarySeq}`)
                  }>
                  보러가기
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
