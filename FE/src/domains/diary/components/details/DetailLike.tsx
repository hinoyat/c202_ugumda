import '../../styles/DetailLike.css';
import React from 'react';
import Heartbox from '@/common/HeartBox';
interface DiaryDetailProps {
  likes_boolean: boolean;
  likes: number;
}
const DetailLike: React.FC<DiaryDetailProps> = ({ likes, likes_boolean }) => {
  return (
    <div className="flex items-center justify-end pr-2 gap-1">
      {likes_boolean}
      <Heartbox />
      <p className="text-white">{likes}</p>
    </div>
  );
};

export default DetailLike;
