// 확대/축소 등 컨트롤

import React from 'react';

interface ControlsProps {
  onZoomIn: () => void; // 확대를 위한 함수
  onZoomOut: () => void; // 축소를 위한 함수
}

const Controls: React.FC<ControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="controls-container">
      {/* 확대/축소 컨트롤 */}
      <div className="zoom-controls">
        <button
          className="zoom-button zoom-in"
          onClick={onZoomIn}
          title="확대">
          {' '}
          {/* 버튼에 마우스를 올렸을 때 "확대"라는 툴팁 표시 */}+
        </button>
        <button
          className="zoom-button zoom-out"
          onClick={onZoomOut}
          title="축소">
          {' '}
          {/* 버튼에 마우스를 올렸을 때 "축소"라는 툴팁 표시 */}-
        </button>
      </div>
    </div>
  );
};

export default Controls;
