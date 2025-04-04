import React, { useState, useEffect } from 'react';
import { useGLTF, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useAppDispatch } from '@/hooks/hooks';
import { visitOtherUserpage } from '@/domains/mainpage/stores/userThunks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectVisitUser } from '@/domains/mainpage/stores/userSelectors';

export default function BlackHole() {
  const { scene } = useGLTF('/universe/blackholes/scene.gltf');
  const [modelReady, setModelReady] = useState(false);
  const [hovered, setHovered] = useState(false);

  // useCursor 훅을 사용하여 hovered 상태에 따라 커서를 변경합니다.
  useCursor(hovered, 'pointer', 'auto');

  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const visitUser = useSelector(selectVisitUser);

  // 모델이 로드되었는지 확인
  useEffect(() => {
    if (scene) {
      // scene을 복제하여 사용하면 참조 문제를 방지할 수 있습니다
      const clonedScene = scene.clone();
      setModelReady(true);
    }
  }, [scene]);

  const handleClick = async (e) => {
    if (!modelReady) return; // 모델이 로드되지 않았으면 무시

    e.stopPropagation();
    try {
      const result = await dispatch(visitOtherUserpage()).unwrap();
      console.log('누구를 랜덤 방문할까?', result);

      if (result?.username) {
        nav(`/${result.username}`);
        window.location.reload();
      }
    } catch (error) {
      console.error('랜덤 방문 실패:', error);
    }
  };

  // 모델이 로드되지 않았으면 아무것도 렌더링하지 않음
  if (!modelReady) return null;

  return (
    <group>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        position={[-150, 150, 150]}
        scale={[20, 20, 20]}
        rotation={[Math.PI / 1.2, Math.PI / 3.3, Math.PI / 1.4]}>
        <primitive object={scene} />
      </mesh>
    </group>
  );
}
