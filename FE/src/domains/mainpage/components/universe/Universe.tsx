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

// 목데이터 import - 초기 데이터 로드용
import { dummyDiaries } from '@/data/dummyDiaries';
import DiaryStar from '@/domains/mainpage/components/universe/DiaryStar';
import DiaryDetail from '@/domains/diary/modals/DiaryDetail';
import { useDiaryEntries } from '@/domains/mainpage/hooks/useDiaryEntries';

const Universe: React.FC = () => {
  console.log('✅ Universe 컴포넌트가 렌더링됨');

  // 수정 모드를 위한 상태 추가
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 변경: useDiaryEntries 훅 사용하여 일기 관리
  const { entries, addEntry, editEntry, removeEntry } = useDiaryEntries();

  // ------------------목데이터로 일기 별 뿌려두기----------------------- //
  // 변경: useDiaryEntries 훅이 이미 로컬 스토리지에서 데이터를 불러오므로,
  // 데이터가 없을 때만 목데이터를 추가합니다.
  useEffect(() => {
    // 초기 데이터가 없을 경우에만 목데이터 추가
    if (entries.length === 0) {
      // 더미 데이터를 DiaryEntry 객체로 변환
      dummyDiaries.forEach((dummy, index) => {
        // 각 더미 데이터의 dream_date를 Date 객체로 변환 (YYYYMMDD 형식에서)
        const year = parseInt(dummy.dream_date.substring(0, 4));
        const month = parseInt(dummy.dream_date.substring(4, 6)) - 1; // JS의 월은 0부터 시작
        const day = parseInt(dummy.dream_date.substring(6, 8));

        // 3D 공간에서의 랜덤 위치 생성
        const position: Position = DiaryEntry.generateRandomSpherePosition(100);

        // 새 일기 추가
        const newEntry = addEntry({
          title: dummy.title,
          content: dummy.content,
          tags: [],
          isPublic: dummy.is_public === 'Y',
          video_url: dummy.video_url || undefined,
          dream_date: dummy.dream_date,
        });

        // 임시: 목데이터에 임의로 ID 할당 (추후 API 연동 시 제거)
        newEntry.diary_seq = 1000 + index;
        newEntry.position = position;
      });
    }
  }, [entries.length, addEntry]);

  // 선택된 일기 항목
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  //-----------일기 조회----------//
  // 일기 조회
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);

  // 일기 조회 핸들러 추가
  const handleView = () => {
    if (selectedEntry) {
      setViewingEntry(selectedEntry);
    }
  };

  // 일기 조회 모달 닫기 핸들러
  const handleCloseView = () => {
    setViewingEntry(null);
  };

  // 폼 표시 여부
  const [showForm, setShowForm] = useState<boolean>(false);

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
    removeEntry(entry.diary_seq);
    setSelectedEntry(null);
    setSelectedPosition(null);
  };

  // 일기 수정 핸들러
  const handleEdit = () => {
    if (selectedEntry) {
      setIsEditing(true);
      setShowForm(true);
    }
  };

  // 화면 더블클릭 - 새 일기 생성 모드
  const handleDoubleClick = () => {
    console.log('새 일기 생성 모드 시작');
    setShowForm(true);
    setIsEditing(false);
    setSelectedEntry(null);
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
          {/*-------------- 별 배경 컴포넌트 -------------------*/}
          <StarField />

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
      {/* ----------------------일기 작성/수정 폼 (조건부 렌더링)----------------------- */}
      {showForm && (
        <DiaryComponent
          onClose={(newDiaryData) => {
            setShowForm(false);

            // 새 일기 작성 완료
            if (!isEditing && newDiaryData) {
              // 변경: 일기 추가 로직을 커스텀 훅 사용으로 대체
              const newEntry = addEntry({
                title: newDiaryData.title || '',
                content: newDiaryData.content || '',
                tags: newDiaryData.tags || [],
                isPublic: newDiaryData.isPublic || false,
                video_url: newDiaryData.dream_video,
              });

              // 새 별 ID 설정 (하이라이트 효과를 위해)
              setNewStarId(newEntry.diary_seq);

              // 카메라를 새로운 별 위치로 이동
              if (controlsRef.current) {
                // 카메라가 바라볼 목표 위치 설정
                controlsRef.current.target.set(
                  newEntry.position.x,
                  newEntry.position.y,
                  newEntry.position.z
                );

                // 카메라 위치를 새로운 별 근처로 이동 (별에서 약간 떨어진 위치)
                const distance = 20; // 별과의 거리
                const cameraPos = {
                  x: newEntry.position.x * 1.2,
                  y: newEntry.position.y * 1.2,
                  z: newEntry.position.z * 1.2,
                };

                // 카메라 업데이트
                controlsRef.current.update();
              }

              // 일정 시간 후 하이라이트 효과 제거
              setTimeout(() => {
                setNewStarId(null);
              }, 10000); // 10초 동안 하이라이트 효과 유지
            }

            // 일기 수정 완료
            else if (isEditing && newDiaryData && selectedEntry) {
              // 변경: 일기 수정 로직을 커스텀 훅 사용으로 대체
              editEntry(selectedEntry.diary_seq, {
                title: newDiaryData.title,
                content: newDiaryData.content,
                tags: newDiaryData.tags,
                isPublic: newDiaryData.isPublic,
                video_url: newDiaryData.dream_video,
              });

              // 수정된 selectedEntry를 viewingEntry로 설정하여 조회 화면 표시
              const updatedEntry = { ...selectedEntry };
              updatedEntry.title = newDiaryData.title || selectedEntry.title;
              updatedEntry.content =
                newDiaryData.content || selectedEntry.content;
              updatedEntry.tags = newDiaryData.tags || selectedEntry.tags;
              updatedEntry.is_public = newDiaryData.isPublic ? 'Y' : 'N';

              // video_url은 있는 경우에만 업데이트
              if (newDiaryData.dream_video !== undefined) {
                updatedEntry.video_url = newDiaryData.dream_video;
              }

              // 선택된 항목 초기화
              setSelectedEntry(null);
              setSelectedPosition(null);
            }

            // 수정 모드 종료
            setIsEditing(false);
          }}
          // 수정 모드 및 현재 선택된 일기 데이터 전달
          isEditing={isEditing}
          diaryData={
            isEditing && selectedEntry
              ? {
                  id: selectedEntry.diary_seq,
                  title: selectedEntry.title,
                  content: selectedEntry.content,
                  tags: selectedEntry.tags,
                  isPublic: selectedEntry.is_public === 'Y', // 변경: 'Y'/'N'을 불리언으로 변환
                }
              : undefined
          }
        />
      )}

      {/* ---------------------일기 조회 모달------------------------ */}
      {viewingEntry && (
        <DiaryDetail
          initialDiary={{
            id: viewingEntry.diary_seq,
            title: viewingEntry.title,
            content: viewingEntry.content,
            tags: viewingEntry.tags,
            created_at: viewingEntry.dream_date,
            isPublic: viewingEntry.is_public === 'Y', // 변경: 'Y'/'N'을 불리언으로 변환
            // 추가 정보가 필요하다면 여기에 추가
            dream_video: viewingEntry.video_url,
          }}
          onClose={handleCloseView}
          onUpdateDiary={(updatedDiary) => {
            console.log('Universe: 일기 업데이트 수신', updatedDiary);

            // 현재 보고 있는 일기 항목 업데이트
            if (viewingEntry) {
              // 타입 호환성을 위한 변수 생성
              const modelUpdate = {
                title: updatedDiary.title,
                content: updatedDiary.content,
                tags: updatedDiary.tags,
                isPublic: updatedDiary.isPublic,
              };

              // video_url이 있는 경우에만 추가 (선택적 속성)
              if (updatedDiary.dream_video !== undefined) {
                // TypeScript에게 이것이 안전한 타입 변환임을 알려줌
                (modelUpdate as any).video_url =
                  updatedDiary.dream_video || null;
              }

              // editEntry 함수 호출하여 데이터 업데이트
              editEntry(viewingEntry.diary_seq, modelUpdate);

              // 현재 보고 있는 항목 복사
              const updatedViewingEntry = { ...viewingEntry };

              // 필요한 필드만 개별적으로 업데이트
              updatedViewingEntry.title = updatedDiary.title;
              updatedViewingEntry.content = updatedDiary.content;
              updatedViewingEntry.tags = updatedDiary.tags;
              updatedViewingEntry.is_public = updatedDiary.isPublic ? 'Y' : 'N';

              // video_url이 있는 경우에만 업데이트
              if (updatedDiary.dream_video !== undefined) {
                updatedViewingEntry.video_url = updatedDiary.dream_video;
              }

              // 상태 업데이트
              setViewingEntry(updatedViewingEntry as DiaryEntry);
            }
          }}
        />
      )}

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
            onEdit={handleEdit}
            onDelete={() => {
              console.log('삭제하기 클릭');
              handleDelete(selectedEntry);
            }}
            onView={handleView}
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
