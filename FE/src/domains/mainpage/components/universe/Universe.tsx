// 메인 우주 컴포넌트

import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import '../../themes/universe.css';
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

  // 선택된 일기 항목
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  // 폼 표시 여부
  const [showForm, setShowForm] = useState<boolean>(false);

  // 카메라 거리
  const [cameraDistance, setCameraDistance] = useState<number>(30);

  // 카메라 컨트롤 참조
  const controlsRef = useRef<any>(null);

  // 새로 생성된 일기의 ID를 저장하는 상태 추가
  const [newStarId, setNewStarId] = useState<number | null>(null);

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

  // 일기 삭제 핸들러
  const handleDelete = (entry: DiaryEntry) => {
    setEntries((prev) => prev.filter((e) => e.diary_seq !== entry.diary_seq));
    setSelectedEntry(null);
    setSelectedPosition(null);
  };

  // 새로운 일기 생성 위치를 저장
  const [newEntryPosition, setNewEntryPosition] = useState<Position | null>(
    null
  );

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
          camera={{ position: [0, 0, -30], fov: 75 }}
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
              setNewEntryPosition({
                x: e.point.x,
                y: e.point.y,
                z: e.point.z,
              }); // 클릭 위치 저장

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
                isNew={entry.diary_seq === newStarId} // 새 별 여부 전달
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
            // 일기데이터가 있을 때만 새 일기 생성
            if (newDiary) {
              // 새로운 일기 생성
              const newEntry = DiaryEntry.create({
                user_seq: 1, // 기본 유저 ID
                title: newDiary.title || '',
                content: newDiary.content || '',
                tags: newDiary.tags || [],
                is_public: newDiary.isPublic ? 'Y' : 'N',
                position:
                  newEntryPosition ||
                  DiaryEntry.generateRandomSpherePosition(100),
              });

              // 새 일기 추가
              setEntries((prev) => [...prev, newEntry]);

              // 새 별 ID 설정 (하이라이트 효과를 위해)
              setNewStarId(newEntry.diary_seq);

              // 일정 시간 후 하이라이트 효과 제거
              setTimeout(() => {
                setNewStarId(null);
              }, 10000); // 10초 동안 하이라이트 효과 유지
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
