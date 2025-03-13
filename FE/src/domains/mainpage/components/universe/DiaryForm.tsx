// 일기 작성 폼

import React, { useState, FormEvent, ChangeEvent } from 'react';

interface DiaryFormProps {
  onSubmit: (content: string) => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState<string>(''); // 일기 내용이 제출될 때 호출될 함수

  // 폼 제출 시 호출되는 함수
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // 내용이 비어있지 않다면 제출하고 내용 초기화
    if (content.trim()) {
      onSubmit(content); // onSubmit 함수 호출하여 내용 전달
      setContent(''); // 내용 초기화
    }
  };

  // 내용이 변경될 때 호출되는 함수
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value); // 내용 상태 업데이트
  };

  return (
    <div className="diary-form-container">
      <form
        onSubmit={handleSubmit} // 폼 제출 시 handleSubmit 호출
        className="diary-form">
        <h2>오늘의 일기 작성하기</h2>

        {/* 일기 내용 입력을 위한 텍스트 영역 */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="오늘 있었던 일을 별에 담아보세요..."
          rows={5}
          required
        />

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="submit-button">
          별 만들기
        </button>
      </form>
    </div>
  );
};

export default DiaryForm;
