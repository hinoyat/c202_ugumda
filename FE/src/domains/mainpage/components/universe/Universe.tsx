// 메인 우주 컴포넌트

import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import '../../themes/universe.css';
import { useDiaryEntries } from '@/domains/mainpage/hooks/useDiaryEntries';
import DiaryEntry, { Position } from '@/domains/mainpage/models/DiaryEntry';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';
import StarHoverMenu from '@/domains/mainpage/components/StarHoverMenu';
import StarField from '@/domains/mainpage/components/universe/StarField';
import DiaryComponent from '@/domains/diary/modals/DiaryComponent';

// 목데이터 import - 이미 존재하는 목데이터를 가져옵니다
import { dummyDiaries } from '@/data/dummyDiaries';
import DiaryStar from '@/domains/mainpage/components/universe/DiaryStar';

const Universe: React.FC = () => {
  console.log('✅ Universe 컴포넌트가 렌더링됨');

  // 일기 항목 관리 훅 사용
  const { entries: hookEntries, addEntry, removeEntry } = useDiaryEntries();

  // 목데이터로 초기화된 일기 항목 상태
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  // ------------------목데이터로 일기 별 뿌려두기----------------------- //
  useEffect(() => {
    // 더미 데이터를 DiaryEntry 객체로 변환
    const diaryEntries = dummyDiaries.map((dummy, index) => {
      // 각 더미 데이터의 dream_date를 Date 객체로 변환 (YYYYMMDD 형식에서)
      const year = parseInt(dummy.dream_date.substring(0, 4));
      const month = parseInt(dummy.dream_date.substring(4, 6)) - 1; // JS의 월은 0부터 시작
      const day = parseInt(dummy.dream_date.substring(6, 8));

      // 3D 공간에서의 랜덤 위치 생성
      const position: Position = DiaryEntry.generateRandomSpherePosition(100);

      // DiaryEntry 객체 생성
      const entry = DiaryEntry.create({
        user_seq: dummy.user_seq,
        title: dummy.title,
        content: dummy.content,
        video_url: dummy.video_url,
        dream_date: dummy.dream_date,
        is_public: dummy.is_public as 'Y' | 'N',
        position: position,
        tags: [], // 더미 데이터에 태그가 없다면 빈 배열로 초기화
      });

      // diary_seq를 명시적으로 설정 (인덱스에 1000을 더해 충분히 큰 고유값 생성)
      // date.now()일 때의 키 중복 방지용
      // api 연결 후 지울부분
      entry.diary_seq = 1000 + index;

      return entry;
    });

    setEntries(diaryEntries);
  }, []);

  // 새로 추가된 일기 위치로 카메라 이동 함수
  const moveCameraToNewEntry = (entry: DiaryEntry) => {
    if (controlsRef.current) {
      // 카메라를 별을 바라보는 위치로 이동
      const { x, y, z } = entry.position;

      // 별을 타겟으로 설정
      controlsRef.current.target.set(x, y, z);

      // 별로부터 적당한 거리에 카메라 위치
      const distance = 20;
      const scaleFactor = 0.7;

      // 카메라 위치 계산 (별 방향에서 약간 떨어진 위치)
      const cameraX = x * scaleFactor;
      const cameraY = y * scaleFactor;
      const cameraZ = z * scaleFactor + distance;

      // 카메라 위치 설정
      controlsRef.current.object.position.set(cameraX, cameraY, cameraZ);

      // 카메라 거리 설정
      setCameraDistance(Math.sqrt(x * x + y * y + z * z) * 0.3);

      // 컨트롤 업데이트
      controlsRef.current.update();

      // 사용자가 다음에 마우스/컨트롤을 움직이면 자유롭게 탐색 가능하도록
      // 사용자 상호작용 감지를 위한 리스너 추가
      const handleUserInteraction = () => {
        // 사용자가 상호작용하면 리스너 제거
        controlsRef.current.removeEventListener(
          'change',
          handleUserInteraction
        );
        // 여기서 추가 설정을 할 수 있음 (필요하다면)
      };

      // 컨트롤이 변경될 때(사용자가 움직일 때) 이벤트 감지
      controlsRef.current.addEventListener('change', handleUserInteraction);
    }
  };

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
    if (selectedEntry && selectedEntry.diary_seq === entry.diary_seq) {
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
  const handleFormSubmit = (formData: any) => {
    // DiaryEntry의 create 메서드를 사용하여 새 일기 생성
    const newEntry = DiaryEntry.create({
      user_seq: 1, // 기본 유저 ID
      title: formData.title || '',
      content: formData.content || '',
      tags: formData.tags || [],
      is_public: formData.isPublic ? 'Y' : 'N',
    });

    // 새 일기 추가
    setEntries((prev) => [...prev, newEntry]);

    // 폼 닫기
    setShowForm(false);
  };

  //          우주공간 더블 클릭 시 일기 생성          //
  const handleCanvasDoubleClick = (event: any) => {
    console.log('일기생성! 위치는 ---> ', event.point);
    // 여기에 일기 추가 로직 구현 (임시로 공간에 더블 클릭 시 별 생성되게 해 둠)
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

  // 일기 삭제 핸들러
  const handleDelete = (entry: DiaryEntry) => {
    setEntries((prev) => prev.filter((e) => e.diary_seq !== entry.diary_seq));
    setSelectedEntry(null);
    setSelectedPosition(null);
  };

  return (
    <div className="universe-container">
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
          // camera={{ position: [0, 0, cameraDistance], fov: 90 }}
          // 구 내부에서 별들을 바라보는 느낌
          camera={{ position: [0, 0, 30], fov: 75 }}
          style={{
            background: 'black',
            width: '100vw',
            height: '100vh',
          }}>
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

          {/*-------------- 별 배경 컴포넌트 -------------------*/}
          <StarField />

          {/* 카메라 컨트롤 */}
          {/* <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={200}
          /> */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            rotateSpeed={0.5}
            minDistance={5} // 너무 가까이 가지 않도록
            maxDistance={50} // 너무 멀리 가지 않도록 (구 반경보다 작게)
            target={[0, 0, 0]} // 항상 구의 중심을 바라보도록
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

          {/* ------------------일기 항목들을 별로 표현-------------------------- */}
          <group>
            {entries.map((entry) => (
              <DiaryStar
                key={entry.diary_seq}
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
      {/* ----------------------일기 작성 폼 (조건부 렌더링)----------------------- */}
      {showForm && (
        <DiaryComponent
          onClose={(newDiary) => {
            setShowForm(false);
            if (newDiary) {
              // 새로운 일기 생성
              const newEntry = DiaryEntry.create({
                user_seq: 1, // 기본 유저 ID
                title: newDiary.title || '',
                content: newDiary.content || '',
                tags: newDiary.tags || [],
                is_public: newDiary.isPublic ? 'Y' : 'N',
              });

              // 새 일기 추가
              setEntries((prev) => [...prev, newEntry]);

              // 새 일기 위치로 카메라 이동
              setTimeout(() => {
                moveCameraToNewEntry(newEntry);
              }, 500); // 약간의 딜레이를 두고 카메라 이동
            }
          }}
          isEditing={false}
        />
      )}
      ~~
      {/* --------------------별 클릭 시 StarHoverMenu 보임--------------------- */}
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
              handleDelete(selectedEntry);
            }}
            onView={() => {
              console.log('일기보기 클릭');
            }}
          />
        </div>
      )}
      {/* ---------------------호버된 일기 미리보기------------------------ */}
      {hoveredEntry && hoveredPosition && (
        <div
          className="absolute z-10"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y}px`,
          }}>
          <DiaryPreview
            title={hoveredEntry.title}
            content={hoveredEntry.content}
            tags={
              hoveredEntry.tags?.map((tag, index) => ({
                id: index.toString(),
                name: tag,
              })) || []
            }
          />
        </div>
      )}
    </div>
  );
};

export default Universe;
