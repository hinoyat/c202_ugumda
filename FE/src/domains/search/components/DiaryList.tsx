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
    <div>
      {data.map((diary) => (
        <div key={diary.id}>
          <h2>{diary.title}</h2>
          <p className="truncate">{diary.content}</p>
          <img src={diary.profile} alt=""  className="w-6 h-6"/>
          <p>{diary.user}</p>
          <p>{diary.tags.join(' ')}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
