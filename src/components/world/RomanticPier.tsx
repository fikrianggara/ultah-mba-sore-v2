import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RomanticPierProps {
  isSitting: boolean;
  isNight?: boolean;
}

export const RomanticPier: React.FC<RomanticPierProps> = ({ isSitting, isNight = false }) => {
  const heartFloatRef = useRef<THREE.Group>(null);
  const dindaLegsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const now = performance.now();
    if (isSitting) {
      // Gentle floating heart above couple
      if (heartFloatRef.current) {
        heartFloatRef.current.position.y = 1.35 + Math.sin(now * 0.004) * 0.08;
      }
      // Dinda dangling feet gently
      if (dindaLegsRef.current) {
        dindaLegsRef.current.rotation.x = 0.4 + Math.sin(now * 0.003) * 0.15;
      }
    }
  });

  return (
    <group position={[0, 0, 22.5]}>
      {/* ========================================================
          1. WOODEN BOARDWALK PIER EXTENSION INTO THE WATER (8 METERS)
      ======================================================== */}
      {/* Main Wooden Deck Planks */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 0.08, 8.0]} />
        <meshStandardMaterial color="#B08968" roughness={0.7} />
      </mesh>

      {/* Cross-beams Planks Texturing */}
      {[-3.6, -2.6, -1.6, -0.6, 0.4, 1.4, 2.4, 3.4].map((z, idx) => (
        <mesh key={idx} position={[0, 0.085, z]}>
          <boxGeometry args={[2.22, 0.015, 0.12]} />
          <meshStandardMaterial color="#7F5539" roughness={0.8} />
        </mesh>
      ))}

      {/* Heavy Wooden Pilings/Stilts into water */}
      {[
        [-1.0, -0.40, -3.6],
        [1.0, -0.40, -3.6],
        [-1.0, -0.40, -1.8],
        [1.0, -0.40, -1.8],
        [-1.0, -0.40, 0],
        [1.0, -0.40, 0],
        [-1.0, -0.40, 1.8],
        [1.0, -0.40, 1.8],
        [-1.0, -0.40, 3.7],
        [1.0, -0.40, 3.7],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.09, 0.9, 8]} />
          <meshStandardMaterial color="#5C4033" roughness={0.9} />
        </mesh>
      ))}

      {/* Wooden Railing Posts */}
      {[
        [-1.05, 0.35, -3.8],
        [-1.05, 0.35, -1.9],
        [-1.05, 0.35, 0],
        [-1.05, 0.35, 1.9],
        [-1.05, 0.35, 3.8],
        [1.05, 0.35, -3.8],
        [1.05, 0.35, -1.9],
        [1.05, 0.35, 0],
        [1.05, 0.35, 1.9],
        [1.05, 0.35, 3.8],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#7F5539" roughness={0.8} />
          </mesh>
          {/* Romantic Pier Lanterns on End Posts */}
          {pos[2] > 3.0 && (
            <group position={[0, 0.35, 0]}>
              <mesh>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial
                  color="#FFF3B0"
                  emissive="#FFD166"
                  emissiveIntensity={isNight ? 2.2 : 0.7}
                />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* Horizontal Railing Bars Along Both Sides */}
      <mesh position={[-1.05, 0.45, 0]}>
        <boxGeometry args={[0.05, 0.05, 7.8]} />
        <meshStandardMaterial color="#7F5539" roughness={0.8} />
      </mesh>
      <mesh position={[1.05, 0.45, 0]}>
        <boxGeometry args={[0.05, 0.05, 7.8]} />
        <meshStandardMaterial color="#7F5539" roughness={0.8} />
      </mesh>
      {/* End Railing Bar Behind Bench facing Ocean */}
      <mesh position={[0, 0.45, 3.85]}>
        <boxGeometry args={[2.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#7F5539" roughness={0.8} />
      </mesh>

      {/* ========================================================
          2. ROMANTIC WOODEN BENCH AT THE END OF THE PIER (Z = 25.7)
      ======================================================== */}
      <group position={[0, 0.12, 3.2]}>
        {/* Bench Seat */}
        <mesh position={[0, 0.20, 0]} castShadow>
          <boxGeometry args={[1.3, 0.06, 0.45]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
        {/* Bench Backrest */}
        <mesh position={[0, 0.45, -0.20]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.3, 0.38, 0.05]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.6} />
        </mesh>
        {/* Bench Legs */}
        {[-0.55, 0.55].map((x, idx) => (
          <mesh key={idx} position={[x, 0.10, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.22, 6]} />
            <meshStandardMaterial color="#2B2D42" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          3. MAS JO & MBA SORE SITTING TOGETHER (When isSitting === true)
      ======================================================== */}
      {isSitting && (
        <group position={[0, 0.12, 3.2]}>
          {/* Mas Jo (Sitting on Left, arm wrapping Mba Sore) */}
          <group position={[-0.26, 0.22, 0.05]}>
            {/* Legs folded over bench */}
            <mesh position={[0, 0.02, 0.16]} rotation={[0.6, 0, 0]}>
              <boxGeometry args={[0.10, 0.26, 0.10]} />
              <meshStandardMaterial color="#2C3E50" />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 0.26, 0]} castShadow>
              <boxGeometry args={[0.26, 0.30, 0.20]} />
              <meshStandardMaterial color="#89CFF0" roughness={0.6} />
            </mesh>
            {/* Right Arm Wrapping around Mba Sore's Shoulder */}
            <mesh position={[0.16, 0.32, -0.05]} rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.035, 0.03, 0.28, 8]} />
              <meshStandardMaterial color="#89CFF0" />
            </mesh>
            {/* Head looking warmly at Dinda */}
            <group position={[0, 0.52, 0]} rotation={[0.1, -0.3, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.16, 14, 14]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
              <mesh position={[0, 0.06, -0.02]}>
                <sphereGeometry args={[0.17, 12, 12]} />
                <meshStandardMaterial color="#2B1E16" />
              </mesh>
            </group>
          </group>

          {/* Mba Sore (Sitting on Right, head resting on Mas Jo's shoulder) */}
          <group position={[0.24, 0.20, 0.05]}>
            {/* Pink Dress folded on seat */}
            <mesh position={[0, 0.20, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.22, 0.26, 10]} />
              <meshStandardMaterial color="#FF69B4" roughness={0.35} />
            </mesh>
            {/* Dangling Feet */}
            <group ref={dindaLegsRef} position={[0, 0.02, 0.16]}>
              <mesh position={[-0.06, -0.08, 0]}>
                <cylinderGeometry args={[0.035, 0.03, 0.20, 8]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
              <mesh position={[0.06, -0.08, 0]}>
                <cylinderGeometry args={[0.035, 0.03, 0.20, 8]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
            </group>
            {/* Head resting sweetly on Mas Jo's shoulder (tilt left) */}
            <group position={[-0.04, 0.48, 0]} rotation={[0, 0, 0.25]}>
              <mesh castShadow>
                <sphereGeometry args={[0.16, 14, 14]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
              {/* Hair */}
              <mesh position={[0, -0.03, -0.05]}>
                <sphereGeometry args={[0.17, 12, 12]} />
                <meshStandardMaterial color="#4A2E18" />
              </mesh>
              {/* Crown */}
              <group position={[0, 0.18, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.09, 0.07, 0.07, 5]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
                </mesh>
              </group>
            </group>
          </group>

          {/* Floating Heart above their heads */}
          <group ref={heartFloatRef} position={[0, 1.25, 0]}>
            <mesh>
              <sphereGeometry args={[0.10, 10, 10]} />
              <meshStandardMaterial
                color="#FF1493"
                emissive="#FF69B4"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
