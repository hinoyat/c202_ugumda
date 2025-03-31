// 메인 우주 컴포넌트

import { diaryApi } from '@/domains/diary/api/diaryApi';
import DiaryComponent from '@/domains/diary/modals/DiaryComponent';
import DiaryDetail from '@/domains/diary/modals/DiaryDetail';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';
import BlackHole from '@/domains/mainpage/components/universe/BlackHoles';
import DiaryStar from '@/domains/mainpage/components/universe/DiaryStar';
import StarField from '@/domains/mainpage/components/universe/StarField';
import Ufo from '@/domains/mainpage/components/universe/Ufo';
import { removeDiary } from '@/stores/diary/diarySlice';
import { RootState } from '@/stores/store';
import { Line, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// props의 타입 정의
interface UniverseProps {
  isMySpace?: boolean;
}

const Universe: React.FC<UniverseProps> = ({ isMySpace = true }) => {
  console.log('✅ Universe 컴포넌트가 렌더링됨');

  // 리덕스 설정
  const dispatch = useDispatch();
  const { diaries } = useSelector((state: RootState) => state.diary);

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
  const [currentDiaryDetail, setCurrentDiaryDetail] = useState<any | null>(
    null
  );

  //
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // -------------------------- 우주관련 -------------------------- //
  // 카메라 컨트롤 참조
  const controlsRef = useRef<any>(null);

  // ------------------------- 일기 조회 ----------------------------//

  // 일기 상세 정보 로드 함수 추가 (이 함수를 컴포넌트 내부에 추가)
  const loadDiaryDetail = async (diarySeq: number) => {
    try {
      const response = await diaryApi.getDiaryById(diarySeq);
      console.log('일기 상세데이터 로드됨!!! : ', response);

      if (response && response.data && response.data.data) {
        setCurrentDiaryDetail(response.data.data);
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

  // ------------------- 일기 생성 (작성/수정) ------------------------ //
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

  // ----------------------- 일기 삭제 ---------------------------- //
  const handleDeleteDiary = async () => {
    if (!currentDiaryDetail || !currentDiaryDetail.diarySeq) return;

    try {
      await diaryApi.deleteDiary(currentDiaryDetail.diarySeq);

      // 성공 시 로컬 상태 업데이트
      setDiaryEntries((prevEntries) =>
        prevEntries.filter(
          (entry) => entry.diarySeq !== currentDiaryDetail.diarySeq
        )
      );

      // 리덕스 스토어에서도 제거
      dispatch(removeDiary(currentDiaryDetail.diarySeq));

      // 모달 닫기
      setShowDetail(false);
      setCurrentDiaryDetail(null);

      // 성공 메시지 표시
      alert('일기가 삭제되었습니다.');
    } catch (error) {
      console.error('일기 삭제 중 오류 발생:', error);
      alert('일기 삭제에 실패했습니다. 다시 시도해주세요.');
    }
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

  // 리덕스 스토어의 일기 데이터가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    if (diaries.length > 0) {
      setDiaryEntries(diaries);
    }
  }, [diaries]);

  // ----------------------- 감정 태그가 같은 별끼리 연결 ----------------------- //
  const connectDiariesByEmotion = (entries: any[]) => {
    const connections: { from: any; to: any }[] = [];

    // 감정 태그별로 일기 그룹화
    const diariesByEmotion: Record<string, any[]> = {};

    // 먼저 감정 태그별로 일기들을 분류
    entries.forEach((entry) => {
      const emotion = entry.emotionName || entry.mainEmotion;
      if (!diariesByEmotion[emotion]) {
        diariesByEmotion[emotion] = [];
      }
      diariesByEmotion[emotion].push(entry);
    });

    // 각 감정 태그 그룹 내에서 일기들을 연결
    Object.values(diariesByEmotion).forEach((emotionGroup) => {
      // 같은 감정을 가진 일기가 2개 이상일 때만 연결
      if (emotionGroup.length >= 2) {
        // 첫 번째 일기부터 마지막 일기까지 순차적으로 연결
        for (let i = 0; i < emotionGroup.length - 1; i++) {
          connections.push({
            from: emotionGroup[i],
            to: emotionGroup[i + 1],
          });
        }

        // 마지막 일기와 첫 번째 일기도 연결
        if (emotionGroup.length > 2) {
          connections.push({
            from: emotionGroup[emotionGroup.length - 1],
            to: emotionGroup[0],
          });
        }
      }
    });

    return connections;
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
          {/* 3D블랙홀 */}
          <BlackHole />
          {/* 3D UFO */}
          <Ufo/>

          {/* 일기 별들 추가 */}
          <group>
            {diaryEntries.map((entry) => (
              <DiaryStar
                key={entry.diarySeq}
                entry={entry}
                onClick={(entry, position) => {
                  setSelectedEntry(entry);
                  setSelectedPosition(position);

                  loadDiaryDetail(entry.diarySeq);
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
            minDistance={5}
            maxDistance={200}
            target={[0, 0, 0]} // 항상 구의 중심을 바라보도록
            zoomSpeed={3} // 스크롤 속도 증가
          />

          {/* ---------------- 일기를 별자리처럼 연결 ---------------- */}
          <group>
            {connectDiariesByEmotion(diaryEntries).map((connection, index) => (
              <Line
                key={index}
                points={[
                  [connection.from.x, connection.from.y, connection.from.z],
                  [connection.to.x, connection.to.y, connection.to.z],
                ]}
                color="rgb(220, 230, 255)" // 연한 푸른 빛 흰색
                lineWidth={0.5} // 선 두께 감소
                dashed // 점선 효과 추가
                dashSize={0.8} // 점선 크기
                dashScale={10} // 점선 간격 조정
                dashOffset={0} // 점선 시작 위치
              />
            ))}
          </group>
        </Canvas>
      </div>

      {/* -------------------- 일기별 호버 시 미리보기 뜸 -------------------- */}
      {hoveredEntry && hoveredPosition && (
        <div
          className="absolute z-50"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y - 150}px`, // 별 위에 표시
          }}>
          {/* {console.log('DiaryPreview에 전달되는 데이터:', hoveredEntry)} */}
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
          onEdit={() => {
            // 수정 모드로 전환
            setIsEditing(true);
            // 수정할 일기 데이터 설정
            setSelectedEntry(currentDiaryDetail);
            // 일기 조회 모달 닫기
            setShowDetail(false);
            // 작성/수정 폼 모달 열기
            setShowForm(true);
          }}
          onDelete={handleDeleteDiary}
        />
      )}

      {/* -----------------------일기 작성 모달 열림------------------------- */}
      {showForm && (
        <DiaryComponent
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          isEditing={isEditing}
          diaryData={isEditing ? selectedEntry : undefined}
          onDiaryCreated={handleDiaryCreated}
        />
      )}
    </div>
  );
};

export default Universe;
