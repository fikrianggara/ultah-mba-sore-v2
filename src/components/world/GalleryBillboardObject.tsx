import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalleryBillboardObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const GalleryBillboardObject: React.FC<GalleryBillboardObjectProps> = ({
  position,
  onClick,
}) => {
  const badgeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (badgeRef.current) {
      badgeRef.current.position.y = 3.2 + Math.sin(Date.now() * 0.0035) * 0.15;
      badgeRef.current.rotation.y += delta * 1.0;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Floating Camera Badge Indicator */}
      <group ref={badgeRef} position={[0, 3.2, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.35, 0.2]} />
          <meshStandardMaterial color="#DDA0DD" emissive="#BA55D3" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Two Wooden Support Posts */}
      <mesh position={[-0.9, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 8]} />
        <meshStandardMaterial color="#784C3D" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 8]} />
        <meshStandardMaterial color="#784C3D" roughness={0.9} />
      </mesh>

      {/* Main Cork / Wooden Board */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.12]} />
        <meshStandardMaterial color="#D4A373" roughness={0.8} />
      </mesh>

      {/* Wooden Frame */}
      <mesh position={[0, 1.7, 0.06]}>
        <boxGeometry args={[2.3, 1.5, 0.04]} />
        <meshStandardMaterial color="#6B4226" roughness={0.8} />
      </mesh>

      {/* Striped Canopy / Awning Roof */}
      <mesh position={[0, 2.45, 0.2]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[2.4, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.4} />
      </mesh>

      {/* Mini hanging polaroid cards pinned on the board */}
      {[-0.55, 0, 0.55].map((x, idx) => (
        <group key={idx} position={[x, 1.7, 0.1]} rotation={[0, 0, (idx - 1) * 0.08]}>
          {/* Polaroid Frame */}
          <mesh>
            <boxGeometry args={[0.42, 0.52, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          {/* Mini photo picture */}
          <mesh position={[0, 0.05, 0.015]}>
            <planeGeometry args={[0.34, 0.34]} />
            <meshStandardMaterial
              color={idx === 0 ? '#FFAAA6' : idx === 1 ? '#FFD3B6' : '#A8E6CF'}
            />
          </mesh>
          {/* Pushpin */}
          <mesh position={[0, 0.23, 0.02]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#E63946" />
          </mesh>
        </group>
      ))}

      {/* Soft warm gallery illumination */}
      <pointLight position={[0, 2.0, 0.6]} color="#FFF3B0" intensity={0.8} distance={5} />
    </group>
  );
};
