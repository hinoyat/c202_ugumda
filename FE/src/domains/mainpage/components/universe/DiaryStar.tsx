// DiaryStar 컴포넌트
// 'DiaryEntry' 데이터를 기반으로 별 모양을 생성하고,
// 해당 별을 클릭하면 일기의 상세 정보가 표시됨.

// 별은 마우스 호버 시 확대되며, 간단한 일기 내용 미리보기를 제공.

import React, { useState, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import DiaryEntry from '@/domains/mainpage/models/DiaryEntry';

// THREE.js 메쉬 및 재질 확장
extend({
  Mesh: THREE.Mesh,
  SphereGeometry: THREE.SphereGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
});

interface DiaryStarProps {
  entry: DiaryEntry; // DiaryEntry 객체를 전달받음
  onClick: (entry: DiaryEntry) => void; // 별 클릭 시 호출되는 함수
}

const DiaryStar: React.FC<DiaryStarProps> = ({ entry, onClick }) => {
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
  const handlePointerOver = (): void => setHovered(true);
  const handlePointerOut = (): void => setHovered(false);

  return (
    <group position={[x, y, z]}>
      {' '}
      {/* 별 위치 설정 */}
      <mesh
        ref={meshRef} // 메쉬 참조 연결
        onClick={() => onClick(entry)} // 별 클릭 시 onClick 호출
        onPointerOver={handlePointerOver} // 호버 상태 변경
        onPointerOut={handlePointerOut}>
        {' '}
        {/* 호버 상태 변경 */}
        {/* 별 모양의 지오메트리 */}
        <sphereGeometry args={[entry.size / 2, 16, 16]} />
        {/* 별의 색과 발광 효과 */}
        <meshStandardMaterial
          color={entry.color}
          emissive={entry.color}
          emissiveIntensity={hovered ? 2 : 1}
        />
      </mesh>
      {/* 호버 시 일기 미리보기 HTML 표시 */}
      {hovered && (
        <Html
          position={[0, entry.size / 2 + 1, 0]}
          center
          distanceFactor={10}>
          <div className="diary-preview">
            <p className="diary-date">{entry.date.toLocaleDateString()}</p>
            <p className="diary-content">
              {/* 일기 내용이 50자 이상일 경우 생략 */}
              {entry.content.length > 50
                ? `${entry.content.substring(0, 50)}...`
                : entry.content}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default DiaryStar;
