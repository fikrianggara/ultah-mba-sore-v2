import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreasureShard } from '../../types';
import { sfx } from '../../utils/audio';

interface TreasureHuntGemsProps {
  shards: TreasureShard[];
  playerPos: [number, number, number];
  onCollectShard: (id: number) => void;
}

export const INITIAL_SHARDS: TreasureShard[] = [
  {
    id: 1,
    title: 'Kepingan Pantai Bahagia',
    hint: 'Di pesisir pantai berpasir emas dekat deretan pohon kelapa',
    position: [16, 0.40, 6],
    isCollected: false,
    color: '#FF758F',
  },
  {
    id: 2,
    title: 'Kepingan Sakura Manis',
    hint: 'Di padang rumput hijau dekat pepohonan sakura merah muda',
    position: [-11, 0.45, -2],
    isCollected: false,
    color: '#FFB703',
  },
  {
    id: 3,
    title: 'Kepingan Melodi Cinta',
    hint: 'Di dekat Vintage Vinyl Booth pemutar lagu Perfect',
    position: [-12, 0.45, -8],
    isCollected: false,
    color: '#48CAE4',
  },
  {
    id: 4,
    title: 'Kepingan Doa Abadi',
    hint: 'Di ujung selatan pulau dekat Air Mancur Harapan',
    position: [0, 0.45, 14],
    isCollected: false,
    color: '#BA55D3',
  },
  {
    id: 5,
    title: 'Kepingan Bintang Senja',
    hint: 'Di tanjung utara pulau dengan pemandangan laut lepas',
    position: [10, 0.45, -10],
    isCollected: false,
    color: '#52B788',
  },
];

export const TreasureHuntGems: React.FC<TreasureHuntGemsProps> = ({
  shards,
  playerPos,
  onCollectShard,
}) => {
  const gemsGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gemsGroupRef.current) {
      gemsGroupRef.current.children.forEach((child, idx) => {
        child.rotation.y += delta * 2;
        child.position.y =
          shards[idx]?.position[1] + Math.sin(Date.now() * 0.004 + idx) * 0.15;
      });
    }

    // Proximity collection detection
    shards.forEach((shard) => {
      if (shard.isCollected) return;
      const dist = Math.hypot(
        playerPos[0] - shard.position[0],
        playerPos[2] - shard.position[2]
      );
      if (dist < 2.0) {
        sfx.playChime();
        onCollectShard(shard.id);
      }
    });
  });

  return (
    <group ref={gemsGroupRef}>
      {shards.map((shard) => {
        if (shard.isCollected) return null;

        return (
          <group
            key={shard.id}
            position={shard.position}
            onClick={() => {
              sfx.playChime();
              onCollectShard(shard.id);
            }}
          >
            {/* Glowing Gem Octahedron */}
            <mesh castShadow>
              <octahedronGeometry args={[0.32]} />
              <meshStandardMaterial
                color={shard.color}
                emissive={shard.color}
                emissiveIntensity={0.9}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>

            {/* Pulsing Sparkle Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.42, 0.03, 8, 16]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FFF"
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Point Light Glow */}
            <pointLight
              position={[0, 0.2, 0]}
              color={shard.color}
              intensity={1.0}
              distance={4}
            />
          </group>
        );
      })}
    </group>
  );
};
