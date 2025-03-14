import React from 'react';
interface DiaryDetailProps {
  tags: string[];
}

const DetailTags: React.FC<DiaryDetailProps> = ({ tags }) => {
  return (
    <div className="flex gap-5 text-white p-1 text-[12px]">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-[rgba(111,111,111,0.69)] rounded-lg py-0.5 px-3 w-15 flex items-center justify-center">
          {tag}
        </div>
      ))}
    </div>
  );
};

export default DetailTags;
