import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BirthdayCakeObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const BirthdayCakeObject: React.FC<BirthdayCakeObjectProps> = ({
  position,
  onClick,
}) => {
  const flamesRef = useRef<THREE.Group>(null);
  const badgeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (flamesRef.current) {
      flamesRef.current.children.forEach((flame, i) => {
        flame.scale.y = 1 + Math.sin(Date.now() * 0.01 + i * 2) * 0.25;
      });
    }
    if (badgeRef.current) {
      badgeRef.current.rotation.y += delta * 0.8;
      badgeRef.current.position.y = 4.8 + Math.sin(Date.now() * 0.003) * 0.15;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Interactive Floating Badge Indicator */}
      <group ref={badgeRef} position={[0, 4.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Plate Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.2, 32]} />
        <meshStandardMaterial color="#FFFDF9" roughness={0.3} />
      </mesh>

      {/* Tier 1 (Bottom Cake - Strawberry / Rose) */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.7, 2.7, 1.2, 32]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.4} />
      </mesh>

      {/* Tier 1 White Cream Trim */}
      <mesh position={[0, 1.45, 0]}>
        <torusGeometry args={[2.7, 0.12, 12, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* Tier 2 (Middle Cake - Vanilla Cream) */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 1.0, 32]} />
        <meshStandardMaterial color="#FFF0F5" roughness={0.3} />
      </mesh>

      {/* Tier 2 Pink Drip Trim */}
      <mesh position={[0, 2.45, 0]}>
        <torusGeometry args={[1.9, 0.1, 12, 32]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.3} />
      </mesh>

      {/* Tier 3 (Top Cake - Golden Honey) */}
      <mesh position={[0, 2.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.8, 32]} />
        <meshStandardMaterial color="#FFE4E1" roughness={0.3} />
      </mesh>

      {/* Candles Group */}
      <group position={[0, 3.25, 0]}>
        {/* 3 Candles */}
        {[-0.4, 0, 0.4].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            {/* Candle Stick */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
              <meshStandardMaterial
                color={idx === 0 ? '#FF69B4' : idx === 1 ? '#87CEEB' : '#FFD700'}
                roughness={0.4}
              />
            </mesh>
          </group>
        ))}

        {/* Animated Flames */}
        <group ref={flamesRef}>
          {[-0.4, 0, 0.4].map((x, idx) => (
            <mesh key={idx} position={[x, 0.85, 0]}>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial
                color="#FFA500"
                emissive="#FFD700"
                emissiveIntensity={1.2}
              />
            </mesh>
          ))}
        </group>

        {/* Warm Candle Light glow */}
        <pointLight position={[0, 1.2, 0]} color="#FFB84C" intensity={1.5} distance={7} />
      </group>
    </group>
  );
};
