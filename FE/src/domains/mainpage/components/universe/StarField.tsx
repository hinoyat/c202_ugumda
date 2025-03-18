// 별 배경 컴포넌트

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const StarField = () => {
  // 두 개의 별 레이어 생성
  const starLayers = useMemo(() => {
    return [
      createStarLayer(1000, 2000), // 첫 번째 레이어
      createStarLayer(1000, 2000), // 두 번째 레이어
    ];
  }, []);

  // 각 레이어의 머티리얼 참조
  const materialRefs = useRef<THREE.PointsMaterial[]>([]);

  // 별 모양을 동그랗게
  const starTexture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/sprites/circle.png'
  );

  // 프레임마다 실행되는 애니메이션 로직
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    starLayers.forEach((layer, index) => {
      const material = materialRefs.current[index];
      if (material) {
        // 두 레이어의 위상을 180도 차이나게 설정
        const phaseOffset = index * Math.PI;

        // 각 레이어마다 다른 주기로 반짝임 (속도 조절 여기서! time * ____)
        // 최종 불투명도 = 기본값(평균밝기 0.6) + (사인파 * 변동 폭)= 0.6   + (sin(시간) * 0.3)
        material.opacity = 0.6 + Math.sin(time * 2 + phaseOffset) * 0.3;
      }
    });
  });

  return (
    <>
      {starLayers.map((layer, index) => (
        <points key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={layer.positions.length / 3}
              array={layer.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={(ref) => {
              if (ref) materialRefs.current[index] = ref;
            }}
            color="white"
            size={6} // 배경 별 사이즈
            sizeAttenuation
            transparent
            opacity={1.0}
            map={starTexture}
            depthWrite={false}
          />
        </points>
      ))}
    </>
  );
};

// 별 레이어 생성 헬퍼 함수
function createStarLayer(count: number, spread: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }

  return { positions };
}

export default StarField;
