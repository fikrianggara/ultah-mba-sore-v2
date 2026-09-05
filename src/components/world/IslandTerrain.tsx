import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createHeartShape, createHeartRoadShape } from '../../utils/heartGeometry';
import { TimeOfDay } from '../../types';

// Low-poly Fluffy Cartoon Tree
export const FluffyTree: React.FC<{ position: [number, number, number]; scale?: number; foliageColor?: string }> = ({
  position,
  scale = 1,
  foliageColor = '#52B788',
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 1.4, 8]} />
        <meshStandardMaterial color="#8D5B4C" roughness={0.9} />
      </mesh>
      {/* Foliage spheres */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 2.3, 0.2]} castShadow>
        <sphereGeometry args={[0.65, 8, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </mesh>
      <mesh position={[-0.3, 2.2, -0.3]} castShadow>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </mesh>
    </group>
  );
};

// Low-poly Pine Cone Tree
export const PineTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#784C3D" roughness={0.9} />
      </mesh>
      {/* Cones */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.9, 1.1, 7]} />
        <meshStandardMaterial color="#3D8B63" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[0.7, 1.0, 7]} />
        <meshStandardMaterial color="#4A9C71" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[0.5, 0.8, 7]} />
        <meshStandardMaterial color="#5EB584" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Tropical Palm Tree for Sandy Beach
export const PalmTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Curved Palm Trunk */}
      <mesh position={[0.15, 1.2, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.12, 0.25, 2.4, 7]} />
        <meshStandardMaterial color="#9C6644" roughness={0.85} />
      </mesh>
      {/* Coconut cluster */}
      <mesh position={[0.3, 2.3, 0.1]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#4A2810" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 2.3, -0.1]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#4A2810" roughness={0.8} />
      </mesh>
      {/* Palm Fronds / Leaves */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
        <group key={i} position={[0.3, 2.4, 0]} rotation={[0, angle, -0.4]}>
          <mesh position={[0.7, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[1.4, 0.05, 0.35]} />
            <meshStandardMaterial color="#2D6A4F" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Beach Umbrella for Sandy Shore
export const BeachUmbrella: React.FC<{ position: [number, number, number]; color?: string }> = ({
  position,
  color = '#FF6B6B',
}) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
        <meshStandardMaterial color="#E9ECEF" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 1.7, 0]} rotation={[0, 0, 0.1]} castShadow>
        <coneGeometry args={[1.1, 0.5, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Street Lamp with glowing bulb (activates in evening and night)
export const StreetLamp: React.FC<{ position: [number, number, number]; rotationY?: number; isNight?: boolean }> = ({
  position,
  rotationY = 0,
  isNight = false,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 2.4, 8]} />
        <meshStandardMaterial color="#3A3845" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 2.4, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#3A3845" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 2.3, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial
          color="#FFF9D2"
          emissive="#FFD700"
          emissiveIntensity={isNight ? 1.5 : 0.6}
        />
      </mesh>
      <pointLight
        position={[0.4, 2.3, 0]}
        color="#FFE4A0"
        intensity={isNight ? 1.4 : 0.5}
        distance={8}
      />
    </group>
  );
};

// Animated Floating Cloud
export const FloatingCloud: React.FC<{ position: [number, number, number]; speed?: number }> = ({
  position,
  speed = 0.5,
}) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += delta * speed;
      if (cloudRef.current.position.x > 38) {
        cloudRef.current.position.x = -38;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[1.1, -0.2, 0.2]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[-1.1, -0.2, -0.2]}>
        <sphereGeometry args={[1.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.6, -0.1]}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </group>
  );
};

interface IslandTerrainProps {
  timeOfDay?: TimeOfDay;
}

export const IslandTerrain: React.FC<IslandTerrainProps> = ({ timeOfDay = 'day' }) => {
  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  // 1. Cliff Foundation Base (Tebing Karang Bawah Pulau Hati dari Air)
  const cliffGeometry = useMemo(() => {
    const shape = createHeartShape(1.25);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.75,
      bevelEnabled: false,
      steps: 1,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // 2. Sandy Beach Coastline (Pesisir Pantai Berpasir Emas di Sekeliling Hati)
  const beachGeometry = useMemo(() => {
    const shape = createHeartShape(1.25);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.05,
      bevelEnabled: false,
      steps: 1,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // 3. Central Lush Green Grass Heart Meadow (Padang Rumput Tengah Bentuk Cinta!)
  const grassGeometry = useMemo(() => {
    const shape = createHeartShape(1.05);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.05,
      bevelEnabled: false,
      steps: 1,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // 4. Heart-Shaped Cobblestone Road Track
  const roadGeometry = useMemo(() => {
    const shape = createHeartRoadShape(0.82, 0.62);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.008,
      bevelEnabled: false,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Decorative flora layout
  const { lawnTrees, beachDecorations } = useMemo(() => {
    const lawn: { pos: [number, number, number]; scale: number; type: 'fluffy' | 'pine'; color?: string }[] = [];
    const beach: { pos: [number, number, number]; scale: number; type: 'palm' | 'umbrella'; color?: string }[] = [];

    // Outer lawn boundary trees (along perimeter of heart grass)
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * 0.98;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) + 1.2) * 0.98;
      const z = -y;

      lawn.push({
        pos: [x, 0.05, z],
        scale: 0.75 + (i % 3) * 0.1,
        type: i % 2 === 0 ? 'pine' : 'fluffy',
        color: i % 3 === 0 ? '#FFAAA6' : '#52B788',
      });
    }

    // Inland scenic trees
    const inlandCoords: [number, number][] = [
      [3.5, -3], [-3.5, -3], [4.5, 4], [-4.5, 4],
      [8, 0], [-8, 0], [0, -7],
    ];
    inlandCoords.forEach(([x, z], idx) => {
      lawn.push({
        pos: [x, 0.05, z],
        scale: 0.7 + (idx % 3) * 0.12,
        type: idx % 2 === 0 ? 'fluffy' : 'pine',
        color: idx % 3 === 0 ? '#FFB7B2' : '#40916C',
      });
    });

    // Natural beach decorations (scattered across heart beach coastline)
    const beachSteps = 16;
    for (let i = 0; i < beachSteps; i++) {
      const t = (i / beachSteps) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * 1.15;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) + 1.2) * 1.15;
      const z = -y;

      if (i % 2 === 0) {
        beach.push({
          pos: [x, 0.00, z],
          scale: 0.85 + (i % 3) * 0.1,
          type: 'palm',
        });
      } else {
        beach.push({
          pos: [x, 0.00, z],
          scale: 0.9,
          type: 'umbrella',
          color: i % 4 === 1 ? '#FF758F' : '#48CAE4',
        });
      }
    }

    return { lawnTrees: lawn, beachDecorations: beach };
  }, []);

  return (
    <group>
      {/* Ocean Lagoon Plane */}
      <mesh position={[0, -0.60, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial
          color={isNight ? '#0F172A' : isSunset ? '#264653' : '#48CAE4'}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* Shallow Shoreline Rim */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color={isNight ? '#1E293B' : isSunset ? '#F4A261' : '#ADE8F4'}
          transparent
          opacity={0.65}
          roughness={0.2}
        />
      </mesh>

      {/* 1. Cliff Base (Tebing Karang Bawah Pulau Hati) */}
      <mesh
        geometry={cliffGeometry}
        position={[0, -0.80, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#DEB887"
          roughness={0.9}
        />
      </mesh>

      {/* 2. Sandy Beach Coastline (Pesisir Pantai Emas di Sekitarnya) */}
      <mesh
        geometry={beachGeometry}
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={isNight ? '#BDB298' : '#E9C46A'}
          roughness={0.9}
        />
      </mesh>

      {/* 3. Central Heart Green Lawn (Warna Rumput Bentuk Cinta!) */}
      <mesh
        geometry={grassGeometry}
        position={[0, 0.00, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={isNight ? '#2A6F4E' : isSunset ? '#40916C' : '#52B788'}
          roughness={0.8}
        />
      </mesh>

      {/* 4. Heart-Shaped Elevated Cobblestone Road */}
      <mesh
        geometry={roadGeometry}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#FDF0D5" roughness={0.75} />
      </mesh>

      {/* Center Cake Plaza */}
      <mesh position={[0, 0.054, 0]} receiveShadow>
        <cylinderGeometry args={[4.0, 4.2, 0.008, 32]} />
        <meshStandardMaterial color="#FFE5D9" roughness={0.8} />
      </mesh>

      {/* Connecting Crossroad paths */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, idx) => (
        <mesh
          key={idx}
          position={[0, 0.054, 0]}
          rotation={[0, rot, 0]}
          receiveShadow
        >
          <boxGeometry args={[2.6, 0.008, 9.0]} />
          <meshStandardMaterial color="#FDF0D5" roughness={0.8} />
        </mesh>
      ))}

      {/* Beach Decorations (Palm trees & Umbrellas on sandy shore) */}
      {beachDecorations.map((d, idx) =>
        d.type === 'palm' ? (
          <PalmTree key={idx} position={d.pos} scale={d.scale} />
        ) : (
          <BeachUmbrella key={idx} position={d.pos} color={d.color} />
        )
      )}

      {/* Lawn Trees (On the lush green heart lawn) */}
      {lawnTrees.map((t, idx) =>
        t.type === 'fluffy' ? (
          <FluffyTree
            key={idx}
            position={t.pos}
            scale={t.scale}
            foliageColor={t.color || '#52B788'}
          />
        ) : (
          <PineTree key={idx} position={t.pos} scale={t.scale} />
        )
      )}

      {/* Street Lamps (Glowing brightly at sunset and night) */}
      <StreetLamp position={[8.0, 0.058, -4]} rotationY={Math.PI / 6} isNight={isNight || isSunset} />
      <StreetLamp position={[-8.0, 0.058, -4]} rotationY={-Math.PI / 6} isNight={isNight || isSunset} />
      <StreetLamp position={[6.0, 0.058, 5]} rotationY={Math.PI / 3} isNight={isNight || isSunset} />
      <StreetLamp position={[-6.0, 0.058, 5]} rotationY={-Math.PI / 3} isNight={isNight || isSunset} />

      {/* Floating Animated Clouds */}
      {!isNight && (
        <>
          <FloatingCloud position={[-15, 14, -10]} speed={0.8} />
          <FloatingCloud position={[5, 16, -18]} speed={0.5} />
          <FloatingCloud position={[18, 13, 8]} speed={0.6} />
          <FloatingCloud position={[-10, 15, 14]} speed={0.7} />
        </>
      )}
    </group>
  );
};
