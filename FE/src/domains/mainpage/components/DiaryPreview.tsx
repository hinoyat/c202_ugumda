import React from 'react';

interface Tag {
  id: string;
  name: string;
}

interface DiaryPreviewProps {
  title: string;
  content: string;
  tags: Tag[];
}

const DiaryPreview = ({ title, content, tags }: DiaryPreviewProps) => {
  return (
    <div className="relative w-[420px] h-[136px] bg-white/21 bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
      <h2 className="text-base font-bold text-white px-3">{title}</h2>
      <p className="text-xs text-white mt-2 line-clamp px-3">{content}</p>
      <div className="absolute bottom-4 left-7 flex space-x-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="px-2 py-1 bg-[#D9D9D9]/29 bg-opacity-30 backdrop-blur-sm rounded-[7px] text-xs text-white">
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryPreview;
