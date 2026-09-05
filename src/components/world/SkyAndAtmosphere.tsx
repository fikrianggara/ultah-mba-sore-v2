import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types';

interface SkyAndAtmosphereProps {
  timeOfDay: TimeOfDay;
}

export const SkyAndAtmosphere: React.FC<SkyAndAtmosphereProps> = ({ timeOfDay }) => {
  const starsRef = useRef<THREE.Points>(null);

  // Generate starfield for Night mode
  const { starPositions, starColors } = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Upper dome coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2.5);
      const radius = 60 + Math.random() * 20;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + 15;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Pastel twinkling star tints (white, gold, pink, cyan)
      const tintChoice = i % 4;
      if (tintChoice === 0) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.8; // Gold
      } else if (tintChoice === 1) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 0.85; // Pink
      } else if (tintChoice === 2) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0; // Cyan
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // Pure white
      }
    }

    return { starPositions: positions, starColors: colors };
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current && timeOfDay === 'night') {
      starsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group>
      {/* 1. Dynamic Ambient Light */}
      <ambientLight
        color={
          timeOfDay === 'night'
            ? '#3A0CA3'
            : timeOfDay === 'sunset'
            ? '#FFB703'
            : '#FFFBF5'
        }
        intensity={
          timeOfDay === 'night'
            ? 0.38
            : timeOfDay === 'sunset'
            ? 0.65
            : 0.75
        }
      />

      {/* 2. Hemisphere Light */}
      <hemisphereLight
        args={[
          timeOfDay === 'night'
            ? '#1E1B4B'
            : timeOfDay === 'sunset'
            ? '#FF758F'
            : '#B4E4FF',
          timeOfDay === 'night'
            ? '#0F172A'
            : timeOfDay === 'sunset'
            ? '#78290F'
            : '#FFE4E1',
          timeOfDay === 'night' ? 0.35 : 0.5,
        ]}
      />

      {/* 3. Directional Celestial Light (Sun or Moon) */}
      <directionalLight
        position={
          timeOfDay === 'sunset'
            ? [30, 15, 20]
            : timeOfDay === 'night'
            ? [-20, 35, -20]
            : [20, 35, 20]
        }
        intensity={
          timeOfDay === 'night'
            ? 0.55
            : timeOfDay === 'sunset'
            ? 1.1
            : 1.3
        }
        color={
          timeOfDay === 'night'
            ? '#E0AAFF'
            : timeOfDay === 'sunset'
            ? '#FF8FA3'
            : '#FFFDF7'
        }
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0005}
      />

      {/* 4. Twinkling Starfield in Night Mode */}
      {timeOfDay === 'night' && (
        <points ref={starsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[starPositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[starColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.5}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};
