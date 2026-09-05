import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isInsideIsland } from '../../utils/heartGeometry';
import { sfx } from '../../utils/audio';

interface PlayerMotorcycleProps {
  initialPosition?: [number, number, number];
  initialRotation?: number;
  joystickInput: { x: number; y: number };
  onPositionUpdate: (pos: [number, number, number]) => void;
  active: boolean; // True if player is riding the motorcycle
  isNight?: boolean;
}

export const PlayerMotorcycle: React.FC<PlayerMotorcycleProps> = ({
  initialPosition = [4.0, 0.06, 6.0],
  initialRotation = -Math.PI / 4,
  joystickInput,
  onPositionUpdate,
  active,
  isNight = false,
}) => {
  const motorRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const handlebarRef = useRef<THREE.Group>(null);
  const kickstandRef = useRef<THREE.Group>(null);

  // Chibi refs on motorcycle
  const dindaArmWave = useRef<THREE.Mesh>(null);
  const masJoHead = useRef<THREE.Group>(null);

  // Position & Kinematics
  const pos = useRef(new THREE.Vector3(...initialPosition));
  const rotationY = useRef(initialRotation);
  const speed = useRef(0);

  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.current.forward = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.current.backward = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = true;
      if (e.code === 'Space') sfx.playMotorHorn();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.current.forward = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.current.backward = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [active]);

  useFrame(() => {
    if (!motorRef.current) return;

    const now = performance.now();

    if (active) {
      let throttle = 0;
      let steering = 0;

      if (keys.current.forward) throttle += 1;
      if (keys.current.backward) throttle -= 1;
      if (keys.current.left) steering += 1;
      if (keys.current.right) steering -= 1;

      if (Math.abs(joystickInput.y) > 0.1) throttle -= joystickInput.y;
      if (Math.abs(joystickInput.x) > 0.1) steering -= joystickInput.x;

      const MAX_SPEED = 0.24;
      const MAX_REVERSE = 0.08;
      const ACCEL = 0.009;
      const DECEL = 0.94;
      const STEER_RATE = 0.055;

      if (throttle > 0) {
        speed.current = Math.min(MAX_SPEED, speed.current + ACCEL);
      } else if (throttle < 0) {
        speed.current = Math.max(-MAX_REVERSE, speed.current - ACCEL * 0.6);
      } else {
        speed.current *= DECEL;
        if (Math.abs(speed.current) < 0.001) speed.current = 0;
      }

      // Steering
      if (Math.abs(speed.current) > 0.005) {
        const dir = speed.current > 0 ? 1 : -1;
        rotationY.current += steering * STEER_RATE * dir;
      }

      // Turn handlebars
      if (handlebarRef.current) {
        handlebarRef.current.rotation.y = THREE.MathUtils.lerp(
          handlebarRef.current.rotation.y,
          -steering * 0.35,
          0.2
        );
      }

      // Move forward
      const forwardVec = new THREE.Vector3(
        Math.sin(rotationY.current),
        0,
        Math.cos(rotationY.current)
      );
      const nextPos = pos.current.clone().addScaledVector(forwardVec, speed.current);

      if (isInsideIsland(nextPos.x, nextPos.z)) {
        pos.current.copy(nextPos);
      } else {
        speed.current *= -0.25;
      }

      // Lean into turns
      const leanAngle = -steering * 0.18 * (Math.abs(speed.current) / MAX_SPEED);
      motorRef.current.rotation.z = THREE.MathUtils.lerp(
        motorRef.current.rotation.z,
        leanAngle,
        0.15
      );

      // Rotate wheels
      if (frontWheelRef.current) frontWheelRef.current.rotation.x += speed.current * 7;
      if (rearWheelRef.current) rearWheelRef.current.rotation.x += speed.current * 7;

      // Kickstand up
      if (kickstandRef.current) {
        kickstandRef.current.rotation.z = -Math.PI / 2;
      }

      // Dinda waving hand
      if (dindaArmWave.current) {
        dindaArmWave.current.rotation.x = Math.sin(now * 0.008) * 0.3 + 0.5;
      }
      if (masJoHead.current) {
        masJoHead.current.rotation.y = steering * 0.2;
      }

      const bounce = Math.abs(speed.current) > 0.01 ? Math.sin(now * 0.02) * 0.02 : 0;
      motorRef.current.position.set(pos.current.x, 0.06 + bounce, pos.current.z);
      motorRef.current.rotation.y = rotationY.current;

      onPositionUpdate([pos.current.x, 0.06, pos.current.z]);
    } else {
      // Parked state: kickstand down, slight tilt
      if (kickstandRef.current) {
        kickstandRef.current.rotation.z = 0.35;
      }
      motorRef.current.rotation.z = 0.08;
      motorRef.current.position.set(pos.current.x, 0.06, pos.current.z);
      motorRef.current.rotation.y = rotationY.current;
    }
  });

  return (
    <group ref={motorRef}>
      {/* ========================================================
          1. RETRO VESPA MOTORCYCLE BODY (Pastel Mint & Cream)
      ======================================================== */}
      {/* Main Curved Chassis */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.42, 0.28, 1.4]} />
        <meshStandardMaterial color="#88D49E" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Front Curved Leg Shield / Apron */}
      <mesh position={[0, 0.55, 0.52]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.46, 0.08]} />
        <meshStandardMaterial color="#FAF3DD" roughness={0.3} />
      </mesh>

      {/* Floorboard Base */}
      <mesh position={[0, 0.22, 0.1]}>
        <boxGeometry args={[0.50, 0.06, 0.6]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>

      {/* Rear Rounded Engine Cowls */}
      <mesh position={[-0.20, 0.36, -0.45]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#88D49E" roughness={0.3} />
      </mesh>
      <mesh position={[0.20, 0.36, -0.45]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#88D49E" roughness={0.3} />
      </mesh>

      {/* Tan Leather Dual Seat */}
      <mesh position={[0, 0.54, -0.22]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.85]} />
        <meshStandardMaterial color="#9C6644" roughness={0.6} />
      </mesh>

      {/* Handlebar & Headlight Assembly */}
      <group ref={handlebarRef} position={[0, 0.82, 0.50]}>
        {/* Horizontal Handlebar */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.68, 8]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Rubber Grips */}
        <mesh position={[-0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.08, 8]} />
          <meshStandardMaterial color="#2B2B2B" />
        </mesh>
        <mesh position={[0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.08, 8]} />
          <meshStandardMaterial color="#2B2B2B" />
        </mesh>

        {/* Chrome Round Mirrors */}
        <mesh position={[-0.26, 0.14, -0.04]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 10]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.26, 0.14, -0.04]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 10]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Round Vintage Headlight */}
        <mesh position={[0, 0.05, 0.08]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial
            color="#FFFBEB"
            emissive="#FFD700"
            emissiveIntensity={isNight ? 1.6 : 0.8}
          />
        </mesh>
      </group>

      {/* Front Spotlight Beam */}
      <spotLight
        position={[0, 0.85, 0.65]}
        target-position={[0, 0, 8]}
        color="#FFF9D2"
        intensity={active && isNight ? 2.5 : active ? 1.0 : 0}
        distance={14}
        angle={Math.PI / 5}
        penumbra={0.4}
      />

      {/* Chrome Kickstand */}
      <group ref={kickstandRef} position={[-0.22, 0.18, 0]}>
        <mesh position={[0, -0.10, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.22, 6]} />
          <meshStandardMaterial color="#B0B0B0" metalness={0.8} />
        </mesh>
      </group>

      {/* Chrome Exhaust Pipe */}
      <mesh position={[0.22, 0.16, -0.50]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.5, 8]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Front Wheel (Touches ground at local y=0.00) */}
      <group ref={frontWheelRef} position={[0, 0.22, 0.58]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#2B2B2B" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.13, 10]} />
          <meshStandardMaterial color="#FAF3DD" />
        </mesh>
      </group>

      {/* Rear Wheel */}
      <group ref={rearWheelRef} position={[0, 0.22, -0.55]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#2B2B2B" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.13, 10]} />
          <meshStandardMaterial color="#FAF3DD" />
        </mesh>
      </group>

      {/* ========================================================
          2. CHIBI MAS JO & MBA SORE RIDING TOGETHER (Active Mode)
      ======================================================== */}
      {active && (
        <>
          {/* Mas Jo (Front Driver) */}
          <group position={[0, 0.60, 0.10]}>
            {/* Torso */}
            <mesh position={[0, 0.26, 0]} castShadow>
              <boxGeometry args={[0.28, 0.32, 0.20]} />
              <meshStandardMaterial color="#89CFF0" roughness={0.5} />
            </mesh>
            {/* Arms reaching to handlebars */}
            <mesh position={[-0.18, 0.22, 0.20]} rotation={[0.6, -0.3, 0]}>
              <cylinderGeometry args={[0.035, 0.03, 0.26, 8]} />
              <meshStandardMaterial color="#89CFF0" />
            </mesh>
            <mesh position={[0.18, 0.22, 0.20]} rotation={[0.6, 0.3, 0]}>
              <cylinderGeometry args={[0.035, 0.03, 0.26, 8]} />
              <meshStandardMaterial color="#89CFF0" />
            </mesh>
            {/* Legs on floorboard */}
            <mesh position={[-0.14, 0.02, 0.10]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.09, 0.28, 0.10]} />
              <meshStandardMaterial color="#2C3E50" />
            </mesh>
            <mesh position={[0.14, 0.02, 0.10]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[0.09, 0.28, 0.10]} />
              <meshStandardMaterial color="#2C3E50" />
            </mesh>
            {/* Head */}
            <group ref={masJoHead} position={[0, 0.54, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.17, 14, 14]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
              <mesh position={[0, 0.06, -0.02]}>
                <sphereGeometry args={[0.18, 12, 12]} />
                <meshStandardMaterial color="#2B1E16" />
              </mesh>
            </group>
          </group>

          {/* Mba Sore (Pillion Passenger Hugging Mas Jo) */}
          <group position={[0, 0.62, -0.35]}>
            {/* Pink Dress */}
            <mesh position={[0, 0.24, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.22, 0.30, 10]} />
              <meshStandardMaterial color="#FF69B4" roughness={0.3} />
            </mesh>
            {/* Left Arm Hugging Mas Jo's Waist */}
            <mesh position={[-0.15, 0.22, 0.20]} rotation={[0.5, 0.5, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.24, 6]} />
              <meshStandardMaterial color="#FCD5B5" />
            </mesh>
            {/* Right Arm Waving Joyfully */}
            <mesh ref={dindaArmWave} position={[0.18, 0.36, 0]} rotation={[0.4, 0, -0.7]}>
              <cylinderGeometry args={[0.03, 0.03, 0.22, 6]} />
              <meshStandardMaterial color="#FCD5B5" />
            </mesh>
            {/* Head with Birthday Crown */}
            <group position={[0, 0.52, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.17, 14, 14]} />
                <meshStandardMaterial color="#FCD5B5" />
              </mesh>
              {/* Hair */}
              <mesh position={[0, -0.03, -0.05]}>
                <sphereGeometry args={[0.18, 12, 12]} />
                <meshStandardMaterial color="#4A2E18" />
              </mesh>
              {/* Golden Crown */}
              <group position={[0, 0.18, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.10, 0.07, 0.08, 5]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
                </mesh>
              </group>
            </group>
          </group>
        </>
      )}
    </group>
  );
};
