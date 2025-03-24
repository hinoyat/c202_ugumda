// DiaryStar 컴포넌트
// 'DiaryEntry' 데이터를 기반으로 별 모양을 생성하고,
// 해당 별을 클릭하면 일기의 상세 정보가 표시됨.

// 별은 마우스 호버 시 확대됨.
// 일기 미리보기는 universe.tsx에서!

// 호버했을 때 위치를 universe로 넘겨서 2D위치에 맞게 미리보기 띄우는걸로 추후 수정해봐야겠음
// 나중에 작성 날짜에 따라서 별의 수명주기에 맞게 별 색상을 표현해도 재밌을 것 같음

import React, { useState, useRef, useEffect } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';

// THREE.js 메쉬 및 재질 확장
extend({
  Mesh: THREE.Mesh,
  SphereGeometry: THREE.SphereGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
});

interface DiaryStarProps {
  entry: DiaryEntry; // 일기 데이터
  onClick: (entry: DiaryEntry, position: { x: number; y: number }) => void; // 클릭했을 때 위치
  onHover: (
    // 호버했을 때 위치
    entry: DiaryEntry | null,
    position: { x: number; y: number } | null
  ) => void;
  isNew?: boolean; // 새로 생성된 별인지 여부
}

const DiaryStar: React.FC<DiaryStarProps> = ({
  entry,
  onClick,
  onHover,
  isNew,
}) => {
  const { x, y, z } = entry.position; // 일기 위치
  const [hovered, setHovered] = useState<boolean>(false); // 마우스 호버 상태
  const meshRef = useRef<THREE.Mesh>(null); // 메쉬 참조

  // 별 색상 - 새 별은 노란색, 기존 별은 파란색
  const starColor = new THREE.Color(
    entry.created_at &&
    Date.now() - new Date(entry.created_at).getTime() < 30 * 60 * 1000
      ? '#ffcc00' // 30분 이내 생성: 노란색
      : '#00ffe0' // 30분 지남: 파란색
  );

  // 새 별을 위한 상태 추가
  const [highlightIntensity, setHighlightIntensity] = useState(isNew ? 8 : 3);

  // 새 별 주변에 발광 효과를 위한 참조
  const glowRef = useRef<THREE.Mesh>(null);

  // 새 별의 경우 특별한 애니메이션 효과 적용
  useEffect(() => {
    if (isNew) {
      // 10초 동안 깜빡임 효과
      const startTime = Date.now();
      const duration = 20000; // 20초동안 반짝임!

      const animateNewStar = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          // 깜빡임 효과 (사인 파동)
          const intensity = 8 + 7 * Math.sin(elapsed / 300);
          setHighlightIntensity(intensity);
          requestAnimationFrame(animateNewStar);
        } else {
          // 20초 후 일반 별로 변환
          setHighlightIntensity(3);
        }
      };

      const animationFrame = requestAnimationFrame(animateNewStar);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isNew]);

  // 매 프레임마다 실행되는 애니메이션 로직
  useFrame((state) => {
    if (meshRef.current) {
      // 별의 확대/축소 효과 (펄스 애니메이션)
      const pulseFactor = isNew ? 0.15 : 0.05; // 새 별은 더 큰 펄스 효과
      const pulseSpeed = isNew ? 3 : 1.5; // 새 별은 더 빠른 펄스
      const scale =
        1 + pulseFactor * Math.sin(state.clock.elapsedTime * pulseSpeed);

      const baseScale = hovered ? 1.3 : 1.0; // 호버 상태에 따른 기본 크기

      // 별의 크기 조정
      meshRef.current.scale.set(
        baseScale * scale,
        baseScale * scale,
        baseScale * scale
      );
    }

    // 새 별의 경우 발광 효과 애니메이션
    if (isNew && glowRef.current) {
      const glowScale = 2.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2);
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  // 마우스가 별에 올려졌을 때와 벗어났을 때의 핸들러
  const handlePointerOver = (event: THREE.Event): void => {
    setHovered(true);
    // 마우스 포인터 위치 가져오기
    const x = event.clientX + 20; // 오른쪽으로 20만큼 이동
    const y = event.clientY + 20; // 아래로 20만큼 이동
    onHover(entry, { x, y });
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (): void => {
    setHovered(false);
    onHover(null, null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={[x, y, z]}>
      {/* 새 별이라면 발광 효과 추가 */}
      {isNew && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[(entry.size / 2) * 6, 16, 16]} />
          <meshBasicMaterial
            color={starColor}
            transparent={true}
            opacity={0.2}
          />
        </mesh>
      )}

      {/* 별 위치 설정 */}
      <mesh
        ref={meshRef} // 메쉬 참조 연결
        onClick={(e) => {
          e.stopPropagation();
          // 클릭위치 전달
          onClick(entry, { x: e.clientX, y: e.clientY });
        }}
        // 영역 내 마우스 올라와 있는지 상태
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}>
        {/* 별 모양의 지오메트리 /// size / ___ (반지름) */}
        <sphereGeometry
          args={[(entry.size / 2) * (isNew ? 2.5 : 1.3), 16, 16]}
        />
        {/* 별의 색과 발광 효과 */}
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={hovered ? 5 : highlightIntensity} // 하이라이트 강도 사용
        />
      </mesh>
      {/* 새 별이라면 빛나는 효과 추가 */}
      {isNew && (
        <pointLight
          color={starColor}
          intensity={2.5}
          distance={15}
          decay={2}
        />
      )}
    </group>
  );
};

export default DiaryStar;
