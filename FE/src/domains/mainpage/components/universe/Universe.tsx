// 메인 우주 컴포넌트

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import DiaryStar from './DiaryStar';
import DiaryForm from './DiaryForm';
import DiaryDetail from './DiaryDetail';
import Controls from './Controls';
import '../../themes/universe.css';
import { useDiaryEntries } from '@/domains/mainpage/hooks/useDiaryEntries';
import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';

const Universe: React.FC = () => {
  console.log('✅ Universe 컴포넌트가 렌더링됨');
  // 일기 항목 관리 훅 사용
  const { entries, addEntry, removeEntry } = useDiaryEntries();

  // 선택된 일기 항목
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  // 폼 표시 여부
  const [showForm, setShowForm] = useState<boolean>(false);

  // 카메라 거리
  const [cameraDistance, setCameraDistance] = useState<number>(30);

  // 카메라 컨트롤 참조
  const controlsRef = useRef<any>(null);

  // 일기 항목 선택 핸들러
  const handleSelectEntry = (entry: DiaryEntry): void => {
    setSelectedEntry(entry);
  };

  // 선택 해제 핸들러
  const handleClearSelection = (): void => {
    setSelectedEntry(null);
  };

  // 일기 작성 폼 제출 핸들러
  const handleFormSubmit = (content: string): void => {
    addEntry(content);
    setShowForm(false);
  };

  // 줌 인 핸들러
  const handleZoomIn = (): void => {
    setCameraDistance((prev) => Math.max(prev - 5, 5));
  };

  // 줌 아웃 핸들러
  const handleZoomOut = (): void => {
    setCameraDistance((prev) => Math.min(prev + 5, 200));
  };

  return (
    <div className="universe-container">
      {/* 3D 우주 공간 */}
      <div
        className="space-scene-container"
        style={{ width: '100%', height: '100vh' }}>
        <Canvas
          camera={{ position: [0, 0, cameraDistance], fov: 75 }}
          // -----------------------------------------------------------------width: '100vw', height: '100vh' 추가
          style={{ background: 'black', width: '100vw', height: '100vh' }}>
          {/* 우주 배경 - 작은 별들 */}
          <Stars
            radius={300}
            depth={100}
            count={5000}
            factor={4}
            saturation={0.5}
          />

          {/* 은하수 느낌의 더 밝은 별들 */}
          <Stars
            radius={150}
            depth={50}
            count={1000}
            factor={6}
            saturation={1}
          />

          {/* 카메라 컨트롤 */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={200}
          />

          {/* 주변 조명 */}
          <ambientLight intensity={0.1} />

          {/* 중앙에서 빛이 퍼져나가는 효과 */}
          <pointLight
            position={[0, 0, 0]}
            intensity={1}
            distance={300}
            decay={2}
          />

          {/* 일기 항목들을 별로 표현 */}
          <group>
            {entries.map((entry) => (
              <DiaryStar
                key={entry.id}
                entry={entry}
                onClick={handleSelectEntry}
              />
            ))}
          </group>
        </Canvas>
      </div>

      {/* 사용자 UI 컨트롤 */}
      <Controls
        onAddEntry={() => setShowForm(true)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* 일기 작성 폼 (조건부 렌더링) */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <DiaryForm onSubmit={handleFormSubmit} />
            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* 선택된 일기 상세 정보 (조건부 렌더링) */}
      {selectedEntry && (
        <div className="detail-overlay">
          <DiaryDetail
            entry={selectedEntry}
            onClose={handleClearSelection}
            onDelete={removeEntry}
          />
        </div>
      )}
    </div>
  );
};

export default Universe;
