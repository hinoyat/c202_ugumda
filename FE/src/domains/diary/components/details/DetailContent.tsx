import React from 'react';
interface DiaryDetailProps {
  content: string;
}
const DetailContent: React.FC<DiaryDetailProps> = ({ content }) => {
  return <div className="text-white tracking-wide">{content}</div>;
};

export default DetailContent;
