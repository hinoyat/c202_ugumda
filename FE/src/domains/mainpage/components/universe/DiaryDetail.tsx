// 일기 상세 보기

import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';
import React from 'react';

interface DiaryDetailProps {
  entry: DiaryEntry;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const DiaryDetail: React.FC<DiaryDetailProps> = ({
  entry, // 일기 데이터를 포함하는 객체
  onClose, // 상세 보기 닫기 함수
  onDelete, // 일기 삭제 함수
}) => {
  // 일기를 삭제하는 함수
  const handleDelete = (): void => {
    onDelete(entry.id); // 삭제하려는 일기의 ID를 전달
  };

  return (
    <div className="diary-detail">
      <div className="diary-detail-header">
        <h2>일기 상세</h2>
        {/* 닫기 버튼, 클릭 시 onClose 함수 실행 */}
        <button
          className="close-button"
          onClick={onClose}>
          ×
        </button>
      </div>

      <div className="diary-detail-content">
        <div className="diary-date">
          {/* 일기의 작성일을 표시 */}
          <span>작성일: {entry.date.toLocaleDateString()}</span>
        </div>

        <div className="diary-position">
          {/* 일기의 위치 좌표를 표시 (소수점 2자리로 포맷) */}
          <span>
            위치: ({entry.position.x.toFixed(2)}, {entry.position.y.toFixed(2)},{' '}
            {entry.position.z.toFixed(2)})
          </span>
        </div>

        <div className="diary-text">
          {/* 일기의 내용을 표시 */}
          <p>{entry.content}</p>
        </div>
      </div>

      <div className="diary-detail-footer">
        {/* 삭제 버튼, 클릭 시 handleDelete 함수 실행 */}
        <button
          className="delete-button"
          onClick={handleDelete}>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default DiaryDetail;
