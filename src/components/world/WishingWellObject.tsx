import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WishingWellObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const WishingWellObject: React.FC<WishingWellObjectProps> = ({
  position,
  onClick,
}) => {
  const coinRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coinRef.current) {
      coinRef.current.position.y = 3.1 + Math.sin(Date.now() * 0.003) * 0.15;
      coinRef.current.rotation.y += delta * 1.5;
    }
    if (waterRef.current) {
      waterRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Floating Golden Coin Indicator */}
      <group ref={coinRef} position={[0, 3.1, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFA500"
            emissiveIntensity={0.8}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Stone Well Outer Basin */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 1.2, 16]} />
        <meshStandardMaterial color="#B0A8B9" roughness={0.85} />
      </mesh>

      {/* Stone Rim Trim */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.15, 8, 24]} />
        <meshStandardMaterial color="#8B8589" roughness={0.8} />
      </mesh>

      {/* Sparkling Water Surface */}
      <mesh ref={waterRef} position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 24]} />
        <meshStandardMaterial
          color="#48CAE4"
          emissive="#0096C7"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Two Wooden Support Posts for Roof */}
      <mesh position={[-1.1, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial color="#784C3D" roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
        <meshStandardMaterial color="#784C3D" roughness={0.8} />
      </mesh>

      {/* Crossbeam */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.3, 8]} />
        <meshStandardMaterial color="#683C2D" roughness={0.8} />
      </mesh>

      {/* Pitched Roof (Pastel Tile Roof) */}
      <mesh position={[0, 2.85, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.8, 0.9, 4]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.5} />
      </mesh>

      {/* Magical blue/cyan point light */}
      <pointLight position={[0, 1.6, 0]} color="#90E0EF" intensity={0.9} distance={6} />
    </group>
  );
};
