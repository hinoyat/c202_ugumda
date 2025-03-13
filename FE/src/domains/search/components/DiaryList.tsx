// DiaryList.tsx
interface Diary {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
}

interface DiaryListProps {
  diary: Diary;
}

const DiaryList: React.FC<DiaryListProps> = ({ diary }) => {
  return (
    <div className="flex flex-col bg-neutral-700 p-4 rounded-md text-white mb-4">
      {/* 일기 제목 */}
      <h1 className="text-xl font-bold mb-2">{diary.title}</h1>

      {/* 일기 내용 + 작성자 */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-2/3">{diary.content}</div>
        <div className="flex items-center gap-2">
          {/* 작성자 프로필 이미지가 있다면 표시 */}
          {/* <img src={diary.authorImage} alt="프로필" className="w-8 h-8 rounded-full" /> */}
          <p>{diary.author}</p>
        </div>
        <button className="px-3 py-1 bg-black bg-opacity-70 rounded hover:bg-opacity-100">
          보러가기
        </button>
      </div>

      {/* 태그 목록 */}
      <div className="flex gap-2 flex-wrap">
        {diary.tags.map((tag, idx) => (
          <div
            key={idx}
            className="bg-neutral-600 px-2 py-1 rounded text-sm">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryList;
