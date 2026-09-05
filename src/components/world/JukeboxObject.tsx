import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JukeboxObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const JukeboxObject: React.FC<JukeboxObjectProps> = ({
  position,
  onClick,
}) => {
  const notesRef = useRef<THREE.Group>(null);
  const miniVinylRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (notesRef.current) {
      notesRef.current.position.y = 2.8 + Math.sin(Date.now() * 0.003) * 0.2;
      notesRef.current.rotation.y += delta * 1.5;
    }
    if (miniVinylRef.current) {
      miniVinylRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Floating Musical Note Indicator */}
      <group ref={notesRef} position={[0, 2.8, 0]}>
        <mesh>
          <torusGeometry args={[0.22, 0.06, 8, 16]} />
          <meshStandardMaterial color="#87CEEB" emissive="#A0E7E5" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Jukebox Base Cabinet */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.3, 1.6, 0.9]} />
        <meshStandardMaterial color="#3D3A45" roughness={0.5} />
      </mesh>

      {/* Arched Top Header */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.9, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.3} />
      </mesh>

      {/* Glowing Neon Trim Arch */}
      <mesh position={[0, 1.6, 0.46]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.65, 0.07, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={1} />
      </mesh>

      {/* Front Display Window */}
      <mesh position={[0, 1.1, 0.46]}>
        <planeGeometry args={[0.9, 0.8]} />
        <meshStandardMaterial color="#1E1C22" roughness={0.3} />
      </mesh>

      {/* Mini Rotating Vinyl inside Display */}
      <mesh ref={miniVinylRef} position={[0, 1.1, 0.47]}>
        <circleGeometry args={[0.3, 24]} />
        <meshStandardMaterial color="#111111" roughness={0.2} />
      </mesh>

      {/* Speaker Grill / Slats */}
      <mesh position={[0, 0.35, 0.46]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshStandardMaterial color="#FFD166" roughness={0.6} />
      </mesh>

      {/* Colorful neon glow light */}
      <pointLight position={[0, 1.5, 0.6]} color="#87CEEB" intensity={1.0} distance={5} />
    </group>
  );
};
