import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isInsideIsland } from '../../utils/heartGeometry';

interface IslandPetsProps {
  playerPos: [number, number, number];
  onUpdateCatPos?: (pos: [number, number, number]) => void;
  onUpdateDogPos?: (pos: [number, number, number]) => void;
  onClickCat: () => void;
  onClickDog: () => void;
}

export const IslandPets: React.FC<IslandPetsProps> = ({
  playerPos,
  onUpdateCatPos,
  onUpdateDogPos,
  onClickCat,
  onClickDog,
}) => {
  // ==========================================
  // 1. CAT STATE & REFS (Si Meong)
  // ==========================================
  const catRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Group>(null);
  const catLegFL = useRef<THREE.Mesh>(null);
  const catLegFR = useRef<THREE.Mesh>(null);
  const catLegBL = useRef<THREE.Mesh>(null);
  const catLegBR = useRef<THREE.Mesh>(null);
  const catHeartRef = useRef<THREE.Group>(null);

  const catPos = useRef(new THREE.Vector3(2.5, 0.06, 2.5));
  const catTarget = useRef(new THREE.Vector3(3.5, 0.06, 4.0));
  const catRotY = useRef(0);
  const catState = useRef<'walking' | 'idle' | 'sitting'>('walking');
  const catTimer = useRef(0);

  // ==========================================
  // 2. DOG STATE & REFS (Si Guguk)
  // ==========================================
  const dogRef = useRef<THREE.Group>(null);
  const dogTailRef = useRef<THREE.Group>(null);
  const dogLegFL = useRef<THREE.Group>(null);
  const dogLegFR = useRef<THREE.Group>(null);
  const dogLegBL = useRef<THREE.Group>(null);
  const dogLegBR = useRef<THREE.Group>(null);
  const dogHeartRef = useRef<THREE.Group>(null);

  const dogPos = useRef(new THREE.Vector3(-2.8, 0.06, 3.0));
  const dogTarget = useRef(new THREE.Vector3(-4.0, 0.06, 5.0));
  const dogRotY = useRef(0);
  const dogState = useRef<'walking' | 'idle' | 'sniffing'>('walking');
  const dogTimer = useRef(0);

  // Helper to get random point inside heart island
  const getRandomIslandPoint = (curX: number, curZ: number, radius = 5.5): THREE.Vector3 => {
    for (let attempts = 0; attempts < 15; attempts++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 2.0 + Math.random() * radius;
      const nx = curX + Math.cos(angle) * dist;
      const nz = curZ + Math.sin(angle) * dist;
      if (isInsideIsland(nx, nz) && Math.abs(nx) < 14 && nz > -10 && nz < 15) {
        return new THREE.Vector3(nx, 0.06, nz);
      }
    }
    return new THREE.Vector3(0, 0.06, 2);
  };

  useFrame((_, delta) => {
    const time = performance.now() * 0.001;

    // Proximity checks
    const pVec = new THREE.Vector3(playerPos[0], 0.06, playerPos[2]);
    const distPlayerToCat = catPos.current.distanceTo(pVec);
    const distPlayerToDog = dogPos.current.distanceTo(pVec);

    // ==========================================
    // CAT AI & LOCOMOTION
    // ==========================================
    catTimer.current += delta;
    if (catTimer.current > 6.0) {
      catTimer.current = 0;
      // Switch state randomly
      const rand = Math.random();
      if (rand < 0.45) {
        catState.current = 'walking';
        catTarget.current = getRandomIslandPoint(catPos.current.x, catPos.current.z, 6);
      } else if (rand < 0.8) {
        catState.current = 'idle';
      } else {
        catState.current = 'sitting';
      }
    }

    if (catState.current === 'walking') {
      const dir = new THREE.Vector3().subVectors(catTarget.current, catPos.current);
      const dist = dir.length();
      if (dist < 0.4) {
        catState.current = 'idle';
      } else {
        dir.normalize();
        const targetRot = Math.atan2(dir.x, dir.z);
        // Smooth rotation
        let diff = targetRot - catRotY.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        catRotY.current += diff * Math.min(1, delta * 4);

        const moveSpeed = 0.016;
        const nextX = catPos.current.x + Math.sin(catRotY.current) * moveSpeed;
        const nextZ = catPos.current.z + Math.cos(catRotY.current) * moveSpeed;

        if (isInsideIsland(nextX, nextZ)) {
          catPos.current.x = nextX;
          catPos.current.z = nextZ;
        } else {
          catTarget.current = getRandomIslandPoint(0, 0, 4);
        }

        // Cat walking leg animation
        const legSwing = Math.sin(time * 8) * 0.4;
        if (catLegFL.current) catLegFL.current.rotation.x = legSwing;
        if (catLegFR.current) catLegFR.current.rotation.x = -legSwing;
        if (catLegBL.current) catLegBL.current.rotation.x = -legSwing;
        if (catLegBR.current) catLegBR.current.rotation.x = legSwing;
      }
    } else {
      // Idle / Sitting leg reset
      if (catLegFL.current) catLegFL.current.rotation.x = 0;
      if (catLegFR.current) catLegFR.current.rotation.x = 0;
      if (catLegBL.current) catLegBL.current.rotation.x = catState.current === 'sitting' ? 0.6 : 0;
      if (catLegBR.current) catLegBR.current.rotation.x = catState.current === 'sitting' ? 0.6 : 0;
    }

    // Gentle Cat Tail Swish
    if (catTailRef.current) {
      catTailRef.current.rotation.z = Math.sin(time * 2.5) * 0.35 + 0.1;
      catTailRef.current.rotation.y = Math.cos(time * 2) * 0.2;
    }

    // Cat Heart float when player near
    if (catHeartRef.current) {
      catHeartRef.current.position.y = 0.55 + Math.sin(time * 3) * 0.06;
      catHeartRef.current.scale.setScalar(distPlayerToCat < 3.0 ? 1 : 0.0001);
    }

    if (catRef.current) {
      catRef.current.position.copy(catPos.current);
      catRef.current.rotation.y = catRotY.current;
    }
    if (onUpdateCatPos) {
      onUpdateCatPos([catPos.current.x, catPos.current.y, catPos.current.z]);
    }

    // ==========================================
    // DOG AI & LOCOMOTION
    // ==========================================
    dogTimer.current += delta;
    if (dogTimer.current > 5.5) {
      dogTimer.current = 0;
      const rand = Math.random();
      if (rand < 0.55) {
        dogState.current = 'walking';
        dogTarget.current = getRandomIslandPoint(dogPos.current.x, dogPos.current.z, 7);
      } else if (rand < 0.85) {
        dogState.current = 'sniffing';
      } else {
        dogState.current = 'idle';
      }
    }

    if (dogState.current === 'walking') {
      const dir = new THREE.Vector3().subVectors(dogTarget.current, dogPos.current);
      const dist = dir.length();
      if (dist < 0.4) {
        dogState.current = 'idle';
      } else {
        dir.normalize();
        const targetRot = Math.atan2(dir.x, dir.z);
        let diff = targetRot - dogRotY.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        dogRotY.current += diff * Math.min(1, delta * 5);

        const moveSpeed = 0.022;
        const nextX = dogPos.current.x + Math.sin(dogRotY.current) * moveSpeed;
        const nextZ = dogPos.current.z + Math.cos(dogRotY.current) * moveSpeed;

        if (isInsideIsland(nextX, nextZ)) {
          dogPos.current.x = nextX;
          dogPos.current.z = nextZ;
        } else {
          dogTarget.current = getRandomIslandPoint(0, 0, 4);
        }

        // Dog trotting leg animation
        const legSwing = Math.sin(time * 10) * 0.45;
        if (dogLegFL.current) dogLegFL.current.rotation.x = legSwing;
        if (dogLegFR.current) dogLegFR.current.rotation.x = -legSwing;
        if (dogLegBL.current) dogLegBL.current.rotation.x = -legSwing;
        if (dogLegBR.current) dogLegBR.current.rotation.x = legSwing;
      }
    } else {
      if (dogLegFL.current) dogLegFL.current.rotation.x = 0;
      if (dogLegFR.current) dogLegFR.current.rotation.x = 0;
      if (dogLegBL.current) dogLegBL.current.rotation.x = 0;
      if (dogLegBR.current) dogLegBR.current.rotation.x = 0;
    }

    // Enthusiastic Dog Tail Wag (faster when player near)
    if (dogTailRef.current) {
      const wagSpeed = distPlayerToDog < 3.0 ? 14 : 7;
      dogTailRef.current.rotation.y = Math.sin(time * wagSpeed) * 0.6;
    }

    // Dog Heart float when player near
    if (dogHeartRef.current) {
      dogHeartRef.current.position.y = 0.65 + Math.sin(time * 3 + 1) * 0.06;
      dogHeartRef.current.scale.setScalar(distPlayerToDog < 3.0 ? 1 : 0.0001);
    }

    if (dogRef.current) {
      dogRef.current.position.copy(dogPos.current);
      dogRef.current.rotation.y = dogRotY.current;
    }
    if (onUpdateDogPos) {
      onUpdateDogPos([dogPos.current.x, dogPos.current.y, dogPos.current.z]);
    }
  });

  return (
    <group>
      {/* ========================================================
          1. KUCING MANIS (Si Meong / Calico Ginger Cat)
      ======================================================== */}
      <group
        ref={catRef}
        onClick={(e) => {
          e.stopPropagation();
          onClickCat();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Floating Heart Indicator when near */}
        <group ref={catHeartRef} position={[0, 0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Cat Body (Ginger Orange) */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.32]} />
          <meshStandardMaterial color="#FF9F43" roughness={0.7} />
        </mesh>

        {/* White Belly Patch */}
        <mesh position={[0, 0.11, 0.02]}>
          <boxGeometry args={[0.14, 0.09, 0.26]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>

        {/* Cat Head */}
        <group position={[0, 0.24, 0.18]}>
          <mesh castShadow>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#FF9F43" roughness={0.7} />
          </mesh>

          {/* Pointed Left Ear */}
          <mesh position={[-0.07, 0.11, -0.02]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.045, 0.08, 4]} />
            <meshStandardMaterial color="#FF9F43" />
          </mesh>
          <mesh position={[-0.07, 0.10, 0.0]}>
            <coneGeometry args={[0.03, 0.05, 4]} />
            <meshStandardMaterial color="#FFB6C1" />
          </mesh>

          {/* Pointed Right Ear */}
          <mesh position={[0.07, 0.11, -0.02]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.045, 0.08, 4]} />
            <meshStandardMaterial color="#FF9F43" />
          </mesh>
          <mesh position={[0.07, 0.10, 0.0]}>
            <coneGeometry args={[0.03, 0.05, 4]} />
            <meshStandardMaterial color="#FFB6C1" />
          </mesh>

          {/* Cute Cat Eyes */}
          <mesh position={[-0.045, 0.02, 0.10]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.045, 0.02, 0.10]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#222222" />
          </mesh>

          {/* Pink Nose */}
          <mesh position={[0, -0.01, 0.12]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#FF6B8B" />
          </mesh>
        </group>

        {/* 4 Little Cat Paws */}
        <mesh ref={catLegFL} position={[-0.07, 0.05, 0.10]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.10, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh ref={catLegFR} position={[0.07, 0.05, 0.10]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.10, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh ref={catLegBL} position={[-0.07, 0.05, -0.10]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.10, 6]} />
          <meshStandardMaterial color="#FF9F43" />
        </mesh>
        <mesh ref={catLegBR} position={[0.07, 0.05, -0.10]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.10, 6]} />
          <meshStandardMaterial color="#FF9F43" />
        </mesh>

        {/* Curled Cat Tail */}
        <group ref={catTailRef} position={[0, 0.18, -0.16]}>
          <mesh position={[0, 0.08, -0.06]} rotation={[0.6, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.015, 0.18, 6]} />
            <meshStandardMaterial color="#FF9F43" />
          </mesh>
          {/* White Tail Tip */}
          <mesh position={[0, 0.16, -0.11]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          2. ANJING CERIA (Si Husky / Siberian Husky)
      ======================================================== */}
      <group
        ref={dogRef}
        onClick={(e) => {
          e.stopPropagation();
          onClickDog();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Floating Heart Indicator when near */}
        <group ref={dogHeartRef} position={[0, 0.65, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FF477E" emissive="#FF1493" emissiveIntensity={1.3} />
          </mesh>
        </group>

        {/* Dog Body (Husky Dark Charcoal / Slate Saddle) */}
        <mesh position={[0, 0.17, 0]} castShadow>
          <boxGeometry args={[0.22, 0.20, 0.38]} />
          <meshStandardMaterial color="#2B2D42" roughness={0.7} />
        </mesh>

        {/* White Underbelly Fur */}
        <mesh position={[0, 0.125, 0]}>
          <boxGeometry args={[0.224, 0.10, 0.37]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>

        {/* Fluffy White Chest Ruff */}
        <mesh position={[0, 0.17, 0.13]}>
          <boxGeometry args={[0.18, 0.15, 0.14]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>

        {/* Royal Blue Husky Collar with Silver Tag */}
        <group position={[0, 0.25, 0.16]}>
          <mesh>
            <torusGeometry args={[0.13, 0.024, 8, 16]} />
            <meshStandardMaterial color="#3A86FF" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.10, 0.06]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Husky Head & Face Mask */}
        <group position={[0, 0.31, 0.22]}>
          {/* Charcoal Skull Cap */}
          <mesh castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#2B2D42" roughness={0.7} />
          </mesh>

          {/* White Muzzle & Snout */}
          <mesh position={[0, -0.02, 0.12]}>
            <boxGeometry args={[0.11, 0.09, 0.12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>

          {/* White Cheeks Mask */}
          <mesh position={[0, 0.01, 0.07]}>
            <boxGeometry args={[0.19, 0.10, 0.12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>

          {/* Iconic Husky White Eyebrow Spots */}
          <mesh position={[-0.052, 0.088, 0.11]} rotation={[0.1, 0, 0.2]} scale={[1.1, 0.7, 0.6]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>
          <mesh position={[0.052, 0.088, 0.11]} rotation={[0.1, 0, -0.2]} scale={[1.1, 0.7, 0.6]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>

          {/* Jet Black Snow Nose */}
          <mesh position={[0, 0.012, 0.18]}>
            <sphereGeometry args={[0.024, 6, 6]} />
            <meshStandardMaterial color="#111111" roughness={0.25} />
          </mesh>

          {/* Piercing Arctic Ice-Blue Left Eye */}
          <group position={[-0.052, 0.045, 0.12]}>
            <mesh>
              <sphereGeometry args={[0.023, 8, 8]} />
              <meshStandardMaterial color="#48CAE4" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.016]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshStandardMaterial color="#0A0A0A" />
            </mesh>
            <mesh position={[-0.005, 0.006, 0.02]}>
              <sphereGeometry args={[0.005, 4, 4]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Piercing Arctic Ice-Blue Right Eye */}
          <group position={[0.052, 0.045, 0.12]}>
            <mesh>
              <sphereGeometry args={[0.023, 8, 8]} />
              <meshStandardMaterial color="#48CAE4" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.016]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshStandardMaterial color="#0A0A0A" />
            </mesh>
            <mesh position={[-0.005, 0.006, 0.02]}>
              <sphereGeometry args={[0.005, 4, 4]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>

          {/* Husky Erect Left Ear (Triangular Pointed Ear) */}
          <group position={[-0.08, 0.14, 0.01]} rotation={[0.08, 0, 0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.048, 0.11, 4]} />
              <meshStandardMaterial color="#2B2D42" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.01, 0.012]} scale={[0.65, 0.75, 0.5]}>
              <coneGeometry args={[0.048, 0.11, 4]} />
              <meshStandardMaterial color="#F8EDEB" roughness={0.9} />
            </mesh>
          </group>

          {/* Husky Erect Right Ear (Triangular Pointed Ear) */}
          <group position={[0.08, 0.14, 0.01]} rotation={[0.08, 0, -0.22]}>
            <mesh castShadow>
              <coneGeometry args={[0.048, 0.11, 4]} />
              <meshStandardMaterial color="#2B2D42" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.01, 0.012]} scale={[0.65, 0.75, 0.5]}>
              <coneGeometry args={[0.048, 0.11, 4]} />
              <meshStandardMaterial color="#F8EDEB" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* 4 Dog Legs - Husky White Boots */}
        <group ref={dogLegFL} position={[-0.08, 0.06, 0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </group>
        <group ref={dogLegFR} position={[0.08, 0.06, 0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </group>
        <group ref={dogLegBL} position={[-0.08, 0.06, -0.12]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.03, 0.08, 6]} />
            <meshStandardMaterial color="#2B2D42" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.035, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </group>
        <group ref={dogLegBR} position={[0.08, 0.06, -0.12]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.03, 0.08, 6]} />
            <meshStandardMaterial color="#2B2D42" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.035, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </group>

        {/* Husky Bushy Sickle Tail (Curled Plume over Back) */}
        <group ref={dogTailRef} position={[0, 0.22, -0.18]}>
          <mesh position={[0, 0.10, -0.05]} rotation={[1.1, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.022, 0.20, 6]} />
            <meshStandardMaterial color="#2B2D42" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.18, -0.10]} rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[0.042, 6, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
