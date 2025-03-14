import React from 'react';

interface DiaryListProps {
  data: {
    id: number;
    title: string;
    content: string;
    profile: string;
    user: string;
    tags: string[];
  }[];
}

const DiaryList: React.FC<DiaryListProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-5 mt-4">
      {data.map((diary) => (
        <div
          key={diary.id}
          className="truncate w-full">
          <div className="bg-[#6E6E6E]/47 flex px-10 py-5 gap-8 w-full">
            {/*방명록 왼쪽 시작 */}
            <div className="flex flex-col truncate gap-2 basis-6/8">
              <h1 className="text-2xl text-white font-semibold">
                {diary.title}
              </h1>
              <div className="px-2 flex flex-col gap-2">
                <p className="truncate text-white w-150">{diary.content}</p>
                <div className="flex gap-2">
                  {diary.tags.map((tag, index) => (
                    <p
                      key={index}
                      className="bg-[#D9D9D9]/29 text-white rounded text-[13px] px-2 py-1">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {/* 방명록 왼쪽 끝 */}
            <div className="flex gap-5 items-center ">
              <div className="flex gap-3 items-center">
                <img
                  src={diary.profile}
                  alt=""
                  className="w-8"
                />
                <p className="text-white">{diary.user}</p>
              </div>

              <div>
                <button className="bg-[#363736] text-white px-4 py-1 rounded cursor-pointer hover:bg-neutral-500">
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
