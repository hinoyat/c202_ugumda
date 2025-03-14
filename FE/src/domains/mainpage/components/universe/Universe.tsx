// 메인 우주 컴포넌트

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import DiaryStar from './DiaryStar';
import DiaryForm from './DiaryForm';
import DiaryDetail from './DiaryDetail';
import '../../themes/universe.css';
import { useDiaryEntries } from '@/domains/mainpage/hooks/useDiaryEntries';
import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';
import StarHoverMenu from '@/domains/mainpage/components/StarHoverMenu';

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

  // 별 선택 핸들러 - 클릭 시 메뉴 보임
  const handleSelectEntry = (
    entry: DiaryEntry,
    position: { x: number; y: number }
  ): void => {
    // 이미 선택된 별을 다시 클릭하면 선택 해제
    if (selectedEntry && selectedEntry.id === entry.id) {
      setSelectedEntry(null);
      setSelectedPosition(null);
    } else {
      // 새로운 별 선택
      setSelectedEntry(entry);
      setSelectedPosition(position);
    }
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

  //          우주공간 더블 클릭 시 일기 생성          //
  const handleCanvasDoubleClick = (event: any) => {
    console.log('일기생성! 위치는 ---> ', event.point);
    // 여기에 일기 추가 로직 구현
  };

  //          호버된 일기 항목          //
  const [hoveredEntry, setHoveredEntry] = useState<DiaryEntry | null>(null);

  //          미리보기를 위해 별의 위치를 2D 좌표로 변환          //
  const [hoveredPosition, setHoveredPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //          별 클릭 위치 저장          //
  const [selectedPosition, setSelectedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //          별 클릭 시 StarHoverMenu 보임          //
  const handleEdit = () => {
    console.log('일기 수정??');
    // 일기 수정 로직 구현..?
  };

  return (
    <div className="universe-container">
      {/* 3D 우주 공간 */}
      <div
        className="space-scene-container"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          zIndex: 0, // 배경처럼 설정
        }}>
        <Canvas
          camera={{ position: [0, 0, cameraDistance], fov: 75 }}
          // -----------------------------------------------------------------width: '100vw', height: '100vh' 추가
          style={{ background: 'black', width: '100vw', height: '100vh' }}>
          {/* ---------------------------- 정확한 위치 파악을 위해서 넓은 투명 네모 추가 */}
          <mesh
            position={[0, 0, -100]}
            onDoubleClick={(e) => {
              console.log('일기생성! 위치는 --->', e.point);
              e.stopPropagation();
              setShowForm(true); // 일기 작성 모달 표시
            }}>
            <planeGeometry args={[2000, 2000]} />
            <meshBasicMaterial
              transparent
              opacity={0}
            />
          </mesh>

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
                onClick={(entry, position) => {
                  setSelectedEntry(entry);
                  setSelectedPosition(position);
                }}
                onHover={(entry, position) => {
                  setHoveredEntry(entry);
                  setHoveredPosition(position);
                }}
              />
            ))}
          </group>
        </Canvas>
      </div>

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

      {/* 별 클릭 시 StarHoverMenu 보임 */}
      {selectedEntry && selectedPosition && (
        <div
          className="absolute z-20"
          style={{
            left: `${selectedPosition.x}px`,
            top: `${selectedPosition.y - 50}px`, // 별 위쪽에 표시
          }}>
          <StarHoverMenu
            position={selectedPosition}
            onEdit={() => console.log('수정하기 클릭')}
            onDelete={() => {
              console.log('삭제하기 클릭');
              removeEntry(selectedEntry.id);
            }}
            onView={() => {
              console.log('일기보기 클릭');
            }}
          />
        </div>
      )}

      {/* 호버된 일기 미리보기 */}
      {hoveredEntry && hoveredPosition && (
        <div
          className="absolute z-10"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y}px`,
          }}>
          <DiaryPreview
            title={hoveredEntry.date.toLocaleDateString()}
            content={hoveredEntry.content}
            tags={[{ id: '1', name: '일기' }]}
          />
        </div>
      )}
    </div>
  );
};

export default Universe;
