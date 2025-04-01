import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAppDispatch } from '@/hooks/hooks';
import { visitOtherUserpage } from '@/domains/mainpage/stores/userThunks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectVisitUser } from '@/domains/mainpage/stores/userSelectors';

export default function BlackHole() {
  const { scene } = useGLTF('/universe/blackholes/scene.gltf');

  // useEffect(() => {
  //   // scene의 구조를 콘솔에 출력
  //   scene.traverse((child) => {
  //     console.log('Mesh name:', child.name, 'Type:', child.type);
  //   });
  // }, [scene]);

  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const visitUser = useSelector(selectVisitUser);

  const handleClick = async (e: THREE.Event) => {
    e.stopPropagation(); // 이벤트 전파 중단

    try {
      const result = await dispatch(visitOtherUserpage()).unwrap(); // API 응답 기다림
      console.log('누구를 랜덤 방문할까?', result);

      if (result.username) {
        nav(`/${result.username}`); // API에서 받은 값으로 이동
        window.location.reload(); // 새로고침
      }
    } catch (error) {
      console.error('랜덤 방문 실패:', error);
    }
  };
  return (
    <primitive
      object={scene}
      onClick={handleClick}
      position={[-150, 150, 150]}
      scale={[20, 20, 20]}
      rotation={[Math.PI / 1.2, Math.PI / 3.3, Math.PI / 1.4]} // X, Y, Z
    />
  );
}
