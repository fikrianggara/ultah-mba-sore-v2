import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VEHICLE_CONFIG } from '../../utils/constants';
import { isInsideIsland } from '../../utils/heartGeometry';
import { sfx } from '../../utils/audio';

interface PlayerVehicleProps {
  initialPosition?: [number, number, number];
  joystickInput: { x: number; y: number };
  onPositionUpdate: (pos: [number, number, number]) => void;
  isNight?: boolean;
}

export const PlayerVehicle: React.FC<PlayerVehicleProps> = ({
  initialPosition = [0, 0.06, 5],
  joystickInput,
  onPositionUpdate,
  isNight = false,
}) => {
  const vehicleRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const antennaRef = useRef<THREE.Mesh>(null);
  const steeringWheelRef = useRef<THREE.Group>(null);
  const dindaHeadRef = useRef<THREE.Group>(null);
  const joHeadRef = useRef<THREE.Group>(null);

  // Kinematic state refs
  const pos = useRef(new THREE.Vector3(...initialPosition));
  const rotationY = useRef(0);
  const speed = useRef(0);
  const isMoving = useRef(false);

  // Keyboard state
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.current.forward = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.current.backward = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = true;
      if (e.code === 'Space') sfx.playHorn();
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
  }, []);

  useFrame(() => {
    if (!vehicleRef.current) return;

    let throttle = 0;
    let steering = 0;

    if (keys.current.forward) throttle += 1;
    if (keys.current.backward) throttle -= 1;
    if (keys.current.left) steering += 1;
    if (keys.current.right) steering -= 1;

    // Apply joystick input
    if (Math.abs(joystickInput.y) > 0.1) {
      throttle -= joystickInput.y;
    }
    if (Math.abs(joystickInput.x) > 0.1) {
      steering -= joystickInput.x;
    }

    // Accelerate / Decelerate
    if (throttle > 0) {
      speed.current = Math.min(
        VEHICLE_CONFIG.MAX_FORWARD_SPEED,
        speed.current + VEHICLE_CONFIG.ACCELERATION
      );
    } else if (throttle < 0) {
      speed.current = Math.max(
        -VEHICLE_CONFIG.MAX_REVERSE_SPEED,
        speed.current - VEHICLE_CONFIG.REVERSE_ACCELERATION
      );
    } else {
      speed.current *= VEHICLE_CONFIG.DECELERATION;
      if (Math.abs(speed.current) < 0.001) speed.current = 0;
    }

    // Steering
    if (Math.abs(speed.current) > 0.005) {
      const dir = speed.current > 0 ? 1 : -1;
      rotationY.current += steering * VEHICLE_CONFIG.STEER_SPEED * dir;
    }

    // Update position
    const forwardVector = new THREE.Vector3(
      Math.sin(rotationY.current),
      0,
      Math.cos(rotationY.current)
    );
    const nextPos = pos.current.clone().addScaledVector(forwardVector, speed.current);

    // Island boundary clamp
    if (isInsideIsland(nextPos.x, nextPos.z)) {
      pos.current.copy(nextPos);
    } else {
      speed.current *= -0.3; // Gentle bounce off beach water
    }

    // Bouncy cartoon suspension
    isMoving.current = Math.abs(speed.current) > 0.01;
    const bounceOffset = isMoving.current
      ? Math.sin(Date.now() * 0.02) * 0.03
      : 0;

    // Calibrated ground elevation (wheels touch ground at y=0.06)
    vehicleRef.current.position.set(pos.current.x, 0.06 + bounceOffset, pos.current.z);
    vehicleRef.current.rotation.y = rotationY.current;

    // Rotate wheels
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += speed.current * 4;
      }
    });

    // Antenna wiggle
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(Date.now() * 0.015) * 0.2;
    }

    // Steer steering wheel
    if (steeringWheelRef.current) {
      steeringWheelRef.current.rotation.z = -steering * 0.5;
    }

    // Chibi characters animations
    if (dindaHeadRef.current) {
      // Dinda cheerful bobbing and waving
      dindaHeadRef.current.rotation.y = Math.sin(Date.now() * 0.004) * 0.15;
      dindaHeadRef.current.position.y = 0.88 + Math.sin(Date.now() * 0.01) * 0.02;
    }
    if (joHeadRef.current) {
      // Mas Jo focuses on driving with slight turn look-ahead
      joHeadRef.current.rotation.y = steering * 0.25;
    }

    onPositionUpdate([pos.current.x, 0.06, pos.current.z]);
  });

  return (
    <group ref={vehicleRef}>
      {/* 1. Main Convertible Car Body (Pastel Rose Pink) */}
      <mesh position={[0, 0.50, 0]} castShadow>
        <boxGeometry args={[1.5, 0.38, 2.1]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Cockpit Interior Floor (Cream) */}
      <mesh position={[0, 0.46, -0.05]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color="#FFF0F5" roughness={0.4} />
      </mesh>

      {/* Front Hood Bump */}
      <mesh position={[0, 0.60, 0.65]} castShadow>
        <boxGeometry args={[1.3, 0.20, 0.7]} />
        <meshStandardMaterial color="#FF1493" roughness={0.3} />
      </mesh>

      {/* Rear Trunk Bump */}
      <mesh position={[0, 0.58, -0.75]} castShadow>
        <boxGeometry args={[1.3, 0.22, 0.55]} />
        <meshStandardMaterial color="#FF1493" roughness={0.3} />
      </mesh>

      {/* Front Windshield Frame & Glass */}
      <mesh position={[0, 0.82, 0.35]} rotation={[Math.PI / 9, 0, 0]}>
        <boxGeometry args={[1.25, 0.40, 0.04]} />
        <meshStandardMaterial color="#B4E4FF" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Steering Wheel (in front of Mas Jo on left side) */}
      <group ref={steeringWheelRef} position={[-0.32, 0.70, 0.22]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.12, 0.025, 8, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.4} />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* CHIBI PASSENGERS: MAS JO & DINDA ("MBA SORE")       */}
      {/* =================================================== */}

      {/* Driver: Chibi Mas Jo (Left Seat) */}
      <group position={[-0.32, 0, -0.05]}>
        {/* Torso (Navy Blue Polo) */}
        <mesh position={[0, 0.60, 0]} castShadow>
          <boxGeometry args={[0.32, 0.32, 0.24]} />
          <meshStandardMaterial color="#1D3557" roughness={0.6} />
        </mesh>
        {/* Head & Hair */}
        <group ref={joHeadRef} position={[0, 0.88, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FCD5B5" roughness={0.5} />
          </mesh>
          {/* Black Stylized Hair */}
          <mesh position={[0, 0.06, -0.02]}>
            <sphereGeometry args={[0.19, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.8} />
          </mesh>
          {/* Friendly Eyes */}
          <mesh position={[-0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>
      </group>

      {/* Passenger: Chibi Dinda ("Mba Sore") (Right Seat) */}
      <group position={[0.32, 0, -0.05]}>
        {/* Torso (Cute Pastel Pink Dress) */}
        <mesh position={[0, 0.60, 0]} castShadow>
          <boxGeometry args={[0.32, 0.32, 0.24]} />
          <meshStandardMaterial color="#FFB6C1" roughness={0.5} />
        </mesh>
        {/* Head & Hair/Hijab with Birthday Crown */}
        <group ref={dindaHeadRef} position={[0, 0.88, 0]}>
          {/* Face */}
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FCD5B5" roughness={0.5} />
          </mesh>
          {/* Cute Soft Hijab / Hair */}
          <mesh position={[0, 0.04, -0.03]}>
            <sphereGeometry args={[0.20, 14, 14]} />
            <meshStandardMaterial color="#FFE4E1" roughness={0.6} />
          </mesh>
          {/* Eyes & Blushing Cheeks */}
          <mesh position={[-0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Blush spots */}
          <mesh position={[-0.10, -0.03, 0.14]}>
            <circleGeometry args={[0.025, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          <mesh position={[0.10, -0.03, 0.14]}>
            <circleGeometry args={[0.025, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          {/* Golden Birthday Crown on Dinda's Head */}
          <group position={[0, 0.20, 0]}>
            <mesh>
              <cylinderGeometry args={[0.09, 0.07, 0.08, 5]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
        {/* Waving Hand */}
        <mesh position={[0.20, 0.70, 0.10]} rotation={[0.4, 0, -0.6]}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 6]} />
          <meshStandardMaterial color="#FCD5B5" />
        </mesh>
      </group>

      {/* Front Grille & Bumper */}
      <mesh position={[0, 0.38, 1.05]} castShadow>
        <boxGeometry args={[1.2, 0.20, 0.12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.50, 0.52, 1.05]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial
          color="#FFF9A6"
          emissive="#FFD700"
          emissiveIntensity={isNight ? 1.5 : 0.8}
        />
      </mesh>
      <mesh position={[-0.50, 0.52, 1.05]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial
          color="#FFF9A6"
          emissive="#FFD700"
          emissiveIntensity={isNight ? 1.5 : 0.8}
        />
      </mesh>

      {/* Front Spotlights / Beams (Shines further in Night mode) */}
      <spotLight
        position={[0, 0.65, 1.1]}
        target-position={[0, 0, 10]}
        color="#FFF6D6"
        intensity={isNight ? 2.5 : 1.2}
        distance={isNight ? 16 : 10}
        angle={Math.PI / 4}
        penumbra={0.5}
      />

      {/* Cute Rear Antenna with glowing heart */}
      <group position={[0.45, 0.85, -0.9]}>
        <mesh ref={antennaRef} position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#A0A0A0" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 4 Chunky Cartoon Wheels (Bottom of tires is precisely at local y=0.00!) */}
      {[
        { pos: [-0.80, 0.32, 0.6] as [number, number, number] }, // Front Left
        { pos: [0.80, 0.32, 0.6] as [number, number, number] },  // Front Right
        { pos: [-0.80, 0.32, -0.6] as [number, number, number] },// Rear Left
        { pos: [0.80, 0.32, -0.6] as [number, number, number] }, // Rear Right
      ].map((wheelConfig, idx) => (
        <group
          key={idx}
          position={wheelConfig.pos}
          ref={(el) => {
            if (el) wheelsRef.current[idx] = el;
          }}
        >
          {/* Black Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 16]} />
            <meshStandardMaterial color="#222222" roughness={0.8} />
          </mesh>
          {/* White & Pink Hubcap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.26, 12]} />
            <meshStandardMaterial color="#FFF5F7" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
