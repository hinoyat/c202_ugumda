// 메인 우주 컴포넌트

import { diaryApi } from '@/domains/diary/api/diaryApi';
import DiaryComponent from '@/domains/diary/modals/DiaryComponent';
import DiaryDetail from '@/domains/diary/modals/DiaryDetail';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';
import StarHoverMenu from '@/domains/mainpage/components/StarHoverMenu';
import BlackHole from '@/domains/mainpage/components/universe/BlackHoles';
import DiaryStar from '@/domains/mainpage/components/universe/DiaryStar';
import StarField from '@/domains/mainpage/components/universe/StarField';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

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

  // 별 미리보기 및 클릭 시 사용할 상태
  const [hoveredEntry, setHoveredEntry] = useState<any | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [viewingEntry, setViewingEntry] = useState<any | null>(null);
  const [currentDiaryDetail, setCurrentDiaryDetail] = useState<any | null>(
    null
  );

  // -----------------------
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // -------------------------- 우주관련 -------------------------- //
  // 카메라 컨트롤 참조
  const controlsRef = useRef<any>(null);

  // ------------------- 별 선택 시 메뉴 관련 ------------------- //
  // 별의 범위를 벗어남 (선택된 별이 없는 상태)
  const clearSelectedEntry = () => {
    setSelectedEntry(null);
    setSelectedPosition(null);
  };

  // 일기 수정 버튼 클릭
  const handleEditClick = () => {
    console.log('일기수정 클릭');
  };

  const handleDeleteClick = () => {
    console.log('일기 삭제');
  };

  // 일기 보기 버튼 클릭
  const handleViewClick = async () => {
    console.log('일기보기 클릭 - 일기 ID : ', selectedEntry.diarySeq);

    try {
      const response = await diaryApi.getDiaryById(selectedEntry.diarySeq);
      console.log('일기 상세데이터 로드됨!!! : ', response);

      if (response && response.data && response.data.data) {
        setCurrentDiaryDetail(response.data.data);
        clearSelectedEntry();
        setShowDetail(true);
      }
    } catch (error) {
      console.error('일기 조회 중 오류 발생 : ', error);

      // 에러 응답 확인
      const err = error as any;

      if (err.response && err.response.status === 400) {
        // 400 에러일 경우 특정 메시지 처리
        if (
          err.response.data &&
          err.response.data.message === '해당 일기를 찾을 수 없습니다.'
        ) {
          alert('해당 일기를 찾을 수 없습니다.');
        } else {
          alert('일기 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else if (err.response && err.response.status === 401) {
        // 401 권한 오류 처리
        alert(
          '로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.'
        );
      } else {
        // 기타 오류
        alert(
          '일기를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    }
  };

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

    // 20초 후 하이라이트 효과 제거
    setTimeout(() => {
      setNewStarId(null);
    }, 20000);

    setShowForm(false); // 모달 닫기
  };

  // ------------------- 일기 목록 조회 (전체 별들) ------------------------ //
  // 컴포넌트 마운트 시 초기 일기 데이터 로드
  useEffect(() => {
    // api에서 일기 데이터 가져오기
    const fetchDiaries = async () => {
      try {
        const response = await diaryApi.getDiaries();
        console.log('저장된 일기 데이터들 로드됨!! : ', response);

        // api응답에서 일기 데이터 설정
        if (response && response.data && response.data.data) {
          setDiaryEntries(response.data.data);
        }
      } catch (error) {
        console.error('일기 목록 데이터 로드 중 오류 발생 : ', error);
      }
    };

    // 내 우주일 경우에만 데이터 로드
    // 이 부분 다른 사람 메인페이지에서 다르게 해야 함!!! 🌟🌟🌟🌟
    if (isMySpace) {
      fetchDiaries();
    }
  }, [isMySpace]);

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
          {/* 3D블랙홀 */}
          <BlackHole />

          {/* 일기 별들 추가 */}
          <group>
            {diaryEntries.map((entry) => (
              <DiaryStar
                key={entry.diarySeq}
                entry={entry}
                onClick={(entry, position) => {
                  setSelectedEntry(entry);
                  setSelectedPosition(position);
                }}
                // 호버 했을 때는 일기 미리보기
                onHover={(entry, position) => {
                  console.log('호버된 엔트리 전체 데이터:', hoveredEntry);
                  setHoveredEntry(entry);
                  setHoveredPosition(position);
                }}
                isNew={entry.diarySeq === newStarId}
              />
            ))}
          </group>

          {/* 카메라 컨트롤 */}
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

      {/* ----- 일기 별 클릭 시 메뉴 뜸 (다른사람 페이지에서는 일기 조회가 뜸) ----- */}
      {isMySpace && selectedEntry && selectedPosition && (
        <div
          className="absolute z-20"
          style={{
            left: `${selectedPosition.x}px`,
            top: `${selectedPosition.y - 50}px`, // 별 위쪽에 표시
          }}>
          <StarHoverMenu
            position={selectedPosition}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        </div>
      )}

      {/* -------------------- 일기별 호버 시 미리보기 뜸 -------------------- */}
      {hoveredEntry && hoveredPosition && (
        <div
          className="absolute z-50"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y - 150}px`, // 별 위에 표시
          }}>
          {console.log('DiaryPreview에 전달되는 데이터:', hoveredEntry)}
          <DiaryPreview
            title={hoveredEntry.title}
            content={hoveredEntry.content}
            tags={hoveredEntry.tags || []}
            emotion={hoveredEntry.emotionName}
          />
        </div>
      )}

      {/* -----------------------일기 조회 모달 열림------------------------- */}
      {showDetail && currentDiaryDetail && (
        <DiaryDetail
          initialDiary={currentDiaryDetail}
          onClose={() => {
            setShowDetail(false);
            setCurrentDiaryDetail(null);
          }}
        />
      )}

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
