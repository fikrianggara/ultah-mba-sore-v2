import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GiftBoxObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const GiftBoxObject: React.FC<GiftBoxObjectProps> = ({
  position,
  onClick,
}) => {
  const boxGroupRef = useRef<THREE.Group>(null);
  const bowRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (boxGroupRef.current) {
      // Gentle playful bounce
      boxGroupRef.current.position.y = position[1] + Math.abs(Math.sin(Date.now() * 0.004)) * 0.12;
    }
    if (bowRef.current) {
      bowRef.current.rotation.y += delta * 1.0;
    }
  });

  return (
    <group
      ref={boxGroupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Floating Sparkle / Star Indicator above Gift */}
      <group ref={bowRef} position={[0, 2.5, 0]}>
        <mesh>
          <octahedronGeometry args={[0.22]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Main Gift Box Body (Pastel Rose) */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.4, 1.5]} />
        <meshStandardMaterial color="#FF758F" roughness={0.35} />
      </mesh>

      {/* Box Lid */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[1.62, 0.25, 1.62]} />
        <meshStandardMaterial color="#FF4D6D" roughness={0.3} />
      </mesh>

      {/* Gold Ribbon Vertical 1 */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.25, 1.42, 1.52]} />
        <meshStandardMaterial color="#FFD166" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Gold Ribbon Vertical 2 */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.52, 1.42, 0.25]} />
        <meshStandardMaterial color="#FFD166" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Ribbon Bow on Top Lid */}
      <group position={[0, 1.62, 0]}>
        {/* Left loop */}
        <mesh position={[-0.25, 0.18, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <torusGeometry args={[0.25, 0.08, 8, 16]} />
          <meshStandardMaterial color="#FFD166" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Right loop */}
        <mesh position={[0.25, 0.18, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <torusGeometry args={[0.25, 0.08, 8, 16]} />
          <meshStandardMaterial color="#FFD166" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Center knot */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#FFAA00" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>

      {/* Warm Golden Glow Light */}
      <pointLight position={[0, 1.8, 0]} color="#FFE6A7" intensity={0.8} distance={5} />
    </group>
  );
};
