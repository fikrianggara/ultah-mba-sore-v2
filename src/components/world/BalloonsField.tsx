import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { sfx } from '../../utils/audio';

interface BalloonData {
  id: number;
  pos: [number, number, number];
  color: string;
  isPopped: boolean;
  scale: number;
  bobOffset: number;
}

interface BalloonsFieldProps {
  playerPos: [number, number, number];
}

const INITIAL_BALLOONS: BalloonData[] = [
  { id: 1, pos: [-7, 1.6, 6], color: '#FF69B4', isPopped: false, scale: 1, bobOffset: 0 },
  { id: 2, pos: [-6.2, 2.0, 7.2], color: '#87CEEB', isPopped: false, scale: 1.1, bobOffset: 1 },
  { id: 3, pos: [-7.8, 1.8, 7.5], color: '#FFD700', isPopped: false, scale: 0.9, bobOffset: 2 },
  { id: 4, pos: [-6.5, 2.3, 5.8], color: '#FFAAA6', isPopped: false, scale: 1.05, bobOffset: 3 },
  { id: 5, pos: [-8.2, 1.9, 6.2], color: '#DDA0DD', isPopped: false, scale: 1, bobOffset: 4 },
  { id: 6, pos: [3, 1.8, -8], color: '#A0E7E5', isPopped: false, scale: 1, bobOffset: 1.5 },
  { id: 7, pos: [4.2, 2.1, -7.5], color: '#FF69B4', isPopped: false, scale: 1.1, bobOffset: 2.5 },
  { id: 8, pos: [-3, 1.8, -8.5], color: '#FFD166', isPopped: false, scale: 1, bobOffset: 0.5 },
];

export const BalloonsField: React.FC<BalloonsFieldProps> = ({ playerPos }) => {
  const [balloons, setBalloons] = useState<BalloonData[]>(INITIAL_BALLOONS);

  const popBalloon = (id: number) => {
    sfx.playPop();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );

    // Auto-respawn balloon after 5 seconds
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isPopped: false } : b))
      );
    }, 5000);
  };

  // Check collision between player car and balloons
  useFrame(() => {
    balloons.forEach((b) => {
      if (b.isPopped) return;
      const dist = Math.hypot(playerPos[0] - b.pos[0], playerPos[2] - b.pos[2]);
      if (dist < 1.4) {
        popBalloon(b.id);
      }
    });
  });

  return (
    <group>
      {balloons.map((b) => {
        if (b.isPopped) return null;
        const bob = Math.sin(Date.now() * 0.003 + b.bobOffset) * 0.12;

        return (
          <group
            key={b.id}
            position={[b.pos[0], b.pos[1] + bob, b.pos[2]]}
            scale={b.scale}
            onClick={(e) => {
              e.stopPropagation();
              popBalloon(b.id);
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            {/* Balloon Body */}
            <mesh castShadow>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color={b.color} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Balloon Knot */}
            <mesh position={[0, -0.45, 0]}>
              <coneGeometry args={[0.07, 0.08, 8]} />
              <meshStandardMaterial color={b.color} />
            </mesh>

            {/* Balloon String */}
            <mesh position={[0, -1.0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 1.1, 4]} />
              <meshStandardMaterial color="#CCCCCC" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
