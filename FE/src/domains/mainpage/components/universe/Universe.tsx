// 메인 우주 컴포넌트

import DiaryComponent from '@/domains/diary/modals/DiaryComponent';
import StarField from '@/domains/mainpage/components/universe/StarField';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';

// props의 타입 정의
interface UniverseProps {
  isMySpace?: boolean;
}

const Universe: React.FC<UniverseProps> = ({ isMySpace = true }) => {
  console.log('✅ Universe 컴포넌트가 렌더링됨');

  // ------------------- 상태관리 ------------------- //
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // 별 관련 상태
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]); // 일기 목록
  const [newStarId, setNewStarId] = useState<number | null>(null); // 새로 생성된 별 ID - 최근 생성된 별을 찾아서 표시해줘야 하기 때문에 필요

  // ------------------- 우주관련 ------------------------ //
  // 카메라 컨트롤 참조
  const controlsRef = useRef<any>(null);

  // ------------------- 일기 생성 ------------------------ //
  // 화면을 더블클릭하면 일기가 생성됨
  const handleDoubleClick = () => {
    console.log('새 일기 생성을 위한 클릭 이벤트!');
    setShowForm(true);
    setIsEditing(false);
  };

  // 일기 별 생성 -> DiaryComponent로 전달
  const handleDiaryCreated = (responseData: any) => {
    const newDiary = responseData.data;

    // 새로 생성된 일기를 diaryEntries 배열에 추가
    setDiaryEntries((prev) => [...prev, newDiary]);

    // 새 별 id 설정 (하이라이트 효과를 위해)
    setNewStarId(newDiary.diarySeq);

    // 카메라를 새로운 별 위치로 이동
    if (controlsRef.current) {
      controlsRef.current.target.set(newDiary.x, newDiary.y, newDiary.z);
      controlsRef.current.update();
    }

    // 일정 시간 후 하이라이트 효과 제거
    setTimeout(() => {
      setNewStarId(null);
    }, 10000);

    setShowForm(false); // 모달 닫기
  };

  return (
    <div
      className="universe-container"
      onDoubleClick={handleDoubleClick}>
      {/* -------------------------------3D 우주 공간--------------------------- */}
      <div
        className="space-scene-container"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          zIndex: 0, // 배경처럼 설정
        }}>
        <Canvas
          // 구 내부에서 별들을 바라보는 느낌
          camera={{ position: [0, 0, -30], fov: 90, far: 5000 }}
          style={{
            background: 'black',
            width: '100vw',
            height: '100vh',
          }}>
          {/* 별 배경 */}
          <StarField />

          {/* 카메라 시선 */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            rotateSpeed={0.5}
            minDistance={5} // 너무 가까이 가지 않도록
            maxDistance={200}
            target={[0, 0, 0]} // 항상 구의 중심을 바라보도록
          />
        </Canvas>
      </div>

      {/* -----------------------일기 작성 모달 열림------------------------- */}
      {showForm && (
        <DiaryComponent
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          isEditing={isEditing}
          onDiaryCreated={handleDiaryCreated}
        />
      )}
    </div>
  );
};

export default Universe;
