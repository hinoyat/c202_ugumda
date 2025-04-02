import '../../styles/DetailLike.css';
import React from 'react';
import Heartbox from '@/common/HeartBox';

interface DiaryDetailProps {
  likes_boolean: boolean;
  likes: number;
  diarySeq: number;
  isMyDiary: boolean;
  onLikeToggle: () => void;
}

const DetailLike: React.FC<DiaryDetailProps> = ({
  likes,
  likes_boolean,
  diarySeq,
  isMyDiary,
  onLikeToggle,
}) => {
  const handleClick = () => {
    if (!isMyDiary) {
      onLikeToggle();
    }
  };

  return (
    <div className="flex items-center justify-end pr-2 gap-1">
      <div
        onClick={handleClick}
        className={`${!isMyDiary ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        title={isMyDiary ? '자신의 일기에는 좋아요를 누를 수 없습니다.' : ''}>
        <Heartbox filled={likes_boolean} />
      </div>
      <p className="text-white">{likes}</p>
    </div>
  );
};

export default DetailLike;
