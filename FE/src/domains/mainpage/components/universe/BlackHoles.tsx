import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function BlackHole() {
  const { scene } = useGLTF('/universe/blackholes/scene.gltf')
  return (
    <primitive
      object={scene}
      position={[-150, 150, 150]}
      scale={[20, 20, 20]}
      rotation={[Math.PI / 1.2, Math.PI / 3.3, Math.PI/ 1.4]}  // X, Y, Z
    />
  )
}
