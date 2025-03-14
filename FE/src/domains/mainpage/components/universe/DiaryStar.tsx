// DiaryStar 컴포넌트
// 'DiaryEntry' 데이터를 기반으로 별 모양을 생성하고,
// 해당 별을 클릭하면 일기의 상세 정보가 표시됨.

// 별은 마우스 호버 시 확대되며, 간단한 일기 내용 미리보기를 제공.

import React, { useState, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';
import DiaryPreview from '@/domains/mainpage/components/DiaryPreview';

// THREE.js 메쉬 및 재질 확장
extend({
  Mesh: THREE.Mesh,
  SphereGeometry: THREE.SphereGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
});

// 타입 정의
interface DiaryStarProps {
  entry: DiaryEntry;
  onClick: (entry: DiaryEntry, position: { x: number; y: number }) => void;
  onHover: (
    entry: DiaryEntry | null,
    position: { x: number; y: number } | null
  ) => void;
}

const DiaryStar: React.FC<DiaryStarProps> = ({ entry, onClick, onHover }) => {
  const { x, y, z } = entry.position; // 일기 위치
  const [hovered, setHovered] = useState<boolean>(false); // 마우스 호버 상태
  const meshRef = useRef<THREE.Mesh>(null); // 메쉬 참조

  // 매 프레임마다 실행되는 애니메이션 로직
  useFrame((state) => {
    if (meshRef.current) {
      // 별의 확대/축소 효과 (펄스 애니메이션)
      const pulseFactor = 0.05;
      const pulseSpeed = 1.5;
      const scale =
        1 + pulseFactor * Math.sin(state.clock.elapsedTime * pulseSpeed);

      const baseScale = hovered ? 1.2 : 1.0; // 호버 상태에 따른 기본 크기

      // 별의 크기 조정
      meshRef.current.scale.set(
        baseScale * scale,
        baseScale * scale,
        baseScale * scale
      );
    }
  });

  // 마우스가 별에 올려졌을 때와 벗어났을 때의 핸들러
  const handlePointerOver = (event: THREE.Event): void => {
    setHovered(true);
    // 마우스 포인터 위치 가져오기
    const x = event.clientX + 20; // 오른쪽으로 20만큼 이동
    const y = event.clientY + 20; // 아래로 20만큼 이동
    onHover(entry, { x, y });
  };

  const handlePointerOut = (): void => {
    setHovered(false);
    onHover(null, null);
  };

  return (
    <group position={[x, y, z]}>
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
        {/* 별 모양의 지오메트리 */}
        <sphereGeometry args={[entry.size / 2, 16, 16]} />
        {/* 별의 색과 발광 효과 */}
        <meshStandardMaterial
          color={entry.color}
          emissive={entry.color}
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>
    </group>
  );
};

export default DiaryStar;
