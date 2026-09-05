import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay, GraphicsQuality } from '../../types';

interface StreetLampsAndFaunaProps {
  timeOfDay: TimeOfDay;
  graphicsQuality?: GraphicsQuality;
}

// 8 Street Lamp positions placed along the outer curb of the heart road
const LAMP_POSITIONS: [number, number, number][] = [
  // Upper Lobes
  [-4.5, 0.06, -5.2],
  [4.5, 0.06, -5.2],
  [-7.5, 0.06, -1.8],
  [7.5, 0.06, -1.8],
  // Mid body
  [-6.2, 0.06, 3.5],
  [6.2, 0.06, 3.5],
  // Lower tip
  [-2.8, 0.06, 7.8],
  [2.8, 0.06, 7.8],
];

export const StreetLampsAndFauna: React.FC<StreetLampsAndFaunaProps> = ({
  timeOfDay,
  graphicsQuality = 'high',
}) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';
  const isHighQuality = graphicsQuality === 'high';

  // Butterfly wings refs
  const butterflyWingsRef = useRef<THREE.Group[]>([]);
  const firefliesPointsRef = useRef<THREE.Points>(null);

  // 4 Optimized Butterfly spawn seeds
  const butterflies = useMemo(() => {
    return [
      { base: [-3, 0.8, -2], color: '#FF69B4', speed: 1.1, radius: 1.8 },
      { base: [3, 0.7, -3], color: '#FFD700', speed: 0.9, radius: 2.1 },
      { base: [-5, 0.9, 2], color: '#00F5D4', speed: 1.0, radius: 1.6 },
      { base: [4, 0.8, 2], color: '#B388FF', speed: 1.2, radius: 1.9 },
    ];
  }, []);

  // Fireflies buffer data (18 fireflies rendered in 1 single draw call via THREE.Points)
  const { fireflyInitialData, fireflyPositionsArray } = useMemo(() => {
    const count = 18;
    const initial: { x: number; y: number; z: number; phase: number; speed: number }[] = [];
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = Math.sin(i * 1.3) * 8 + Math.cos(i * 0.7) * 2;
      const y = 0.4 + (i % 5) * 0.25;
      const z = Math.cos(i * 1.3) * 7 + Math.sin(i * 0.9) * 2;
      initial.push({
        x,
        y,
        z,
        phase: i * 0.8,
        speed: 0.8 + (i % 3) * 0.4,
      });
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return { fireflyInitialData: initial, fireflyPositionsArray: positions };
  }, []);

  // Shared Butterfly Wing Geometry to minimize draw call allocations
  const wingGeo = useMemo(() => new THREE.BoxGeometry(0.12, 0.01, 0.10), []);
  const bodyGeo = useMemo(() => new THREE.CylinderGeometry(0.015, 0.015, 0.08, 6), []);
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2B2D42' }), []);

  useFrame(() => {
    // ⚡ Low Graphics Quality: Skip entire computation loop for maximum performance
    if (!isHighQuality) return;

    const now = performance.now();

    // 1. Fluttering Butterflies (Day & Sunset only)
    if (!isNight) {
      const flap = Math.sin(now * 0.022) * 0.75;
      for (let idx = 0; idx < butterflies.length; idx++) {
        const wingGroup = butterflyWingsRef.current[idx];
        if (!wingGroup) continue;
        const b = butterflies[idx];
        const angle = now * 0.001 * b.speed + idx;
        const posX = b.base[0] + Math.cos(angle) * b.radius;
        const posZ = b.base[2] + Math.sin(angle) * b.radius;
        const posY = b.base[1] + Math.sin(now * 0.003 * b.speed) * 0.25;

        wingGroup.position.set(posX, posY, posZ);
        wingGroup.rotation.y = -angle + Math.PI / 2;

        if (wingGroup.children[0]) wingGroup.children[0].rotation.y = flap;
        if (wingGroup.children[1]) wingGroup.children[1].rotation.y = -flap;
      }
    }

    // 2. High-Performance Single-DrawCall Fireflies (Night only)
    if (isNight && firefliesPointsRef.current) {
      const geo = firefliesPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute | undefined;
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        for (let idx = 0; idx < fireflyInitialData.length; idx++) {
          const f = fireflyInitialData[idx];
          const drift = Math.sin(now * 0.0015 * f.speed + f.phase) * 0.4;
          arr[idx * 3] = f.x + drift;
          arr[idx * 3 + 1] = f.y + Math.sin(now * 0.002 * f.speed + f.phase) * 0.2;
          arr[idx * 3 + 2] = f.z + Math.cos(now * 0.0015 * f.speed + f.phase) * 0.4;
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* ========================================================
          1. ROMANTIC STREET LAMPS (Lentera Sirkuit Hati)
      ======================================================== */}
      {LAMP_POSITIONS.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Concrete Base */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.16, 0.20, 0.10, 8]} />
            <meshStandardMaterial color="#8D99AE" roughness={0.7} />
          </mesh>

          {/* Cast Iron Classic Lamp Post */}
          <mesh position={[0, 0.70, 0]} castShadow={isHighQuality}>
            <cylinderGeometry args={[0.04, 0.06, 1.25, 8]} />
            <meshStandardMaterial color="#2B2D42" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Curved Bracket Arm */}
          <mesh position={[0, 1.34, 0.08]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.24, 6]} />
            <meshStandardMaterial color="#2B2D42" metalness={0.8} />
          </mesh>

          {/* Hexagonal Glass Lantern Cap & Frame */}
          <group position={[0, 1.42, 0.16]}>
            {/* Top Pyramid Roof */}
            <mesh position={[0, 0.14, 0]}>
              <coneGeometry args={[0.14, 0.12, 6]} />
              <meshStandardMaterial color="#2B2D42" metalness={0.7} />
            </mesh>

            {/* Glowing Glass Lantern Bulb (Always glows warmly with zero lighting cost) */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 0.16, 6]} />
              <meshStandardMaterial
                color={isNight ? '#FFE29A' : isSunset ? '#FFBE0B' : '#FFF9D2'}
                emissive={isNight ? '#FFD166' : isSunset ? '#FFAA00' : '#FFEEBB'}
                emissiveIntensity={isNight ? 2.2 : isSunset ? 1.4 : 0.3}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Warm Night Point Light (Rendered only on High Quality to prevent GPU shader lag) */}
            {isHighQuality && (isNight || isSunset) && (
              <pointLight
                position={[0, 0, 0]}
                color="#FFE5A3"
                intensity={isNight ? 1.6 : 0.8}
                distance={7.5}
                decay={2}
              />
            )}
          </group>
        </group>
      ))}

      {/* ========================================================
          2. OPTIMIZED BUTTERFLIES (Enabled only on High Quality)
      ======================================================== */}
      {isHighQuality &&
        !isNight &&
        butterflies.map((b, idx) => (
          <group
            key={idx}
            ref={(el) => {
              if (el) butterflyWingsRef.current[idx] = el;
            }}
          >
            {/* Left Wing */}
            <mesh geometry={wingGeo} position={[-0.07, 0, 0]}>
              <meshStandardMaterial color={b.color} roughness={0.4} />
            </mesh>
            {/* Right Wing */}
            <mesh geometry={wingGeo} position={[0.07, 0, 0]}>
              <meshStandardMaterial color={b.color} roughness={0.4} />
            </mesh>
            {/* Body */}
            <mesh geometry={bodyGeo} material={bodyMat} />
          </group>
        ))}

      {/* ========================================================
          3. HIGH-PERFORMANCE GPU POINTS FIREFLIES (1 Draw Call)
      ======================================================== */}
      {isHighQuality && isNight && (
        <points ref={firefliesPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[fireflyPositionsArray, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            color="#E2F952"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
