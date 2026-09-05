import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WalkingPartnerState } from '../../types';
import { isInsideIsland } from '../../utils/heartGeometry';
import { sfx } from '../../utils/audio';

interface WalkingCharactersProps {
  initialPosition: [number, number, number];
  joystickInput: { x: number; y: number };
  onPositionUpdate: (pos: [number, number, number]) => void;
  partnerState: WalkingPartnerState;
  onPartnerStateChange: (state: WalkingPartnerState) => void;
  active: boolean; // True when travelMode === 'walking'
}

export const WalkingCharacters: React.FC<WalkingCharactersProps> = ({
  initialPosition,
  joystickInput,
  onPositionUpdate,
  partnerState,
  onPartnerStateChange,
  active,
}) => {
  // Mba Sore refs
  const mbaSoreRef = useRef<THREE.Group>(null);
  const mbaSorePos = useRef(new THREE.Vector3(...initialPosition));
  const mbaSoreRotY = useRef(0);
  const mbaSoreLegL = useRef<THREE.Mesh>(null);
  const mbaSoreLegR = useRef<THREE.Mesh>(null);
  const mbaSoreArmL = useRef<THREE.Mesh>(null);
  const mbaSoreArmR = useRef<THREE.Mesh>(null);
  const mbaSoreHead = useRef<THREE.Group>(null);

  // Mas Jo refs
  const masJoRef = useRef<THREE.Group>(null);
  const masJoPos = useRef(
    new THREE.Vector3(initialPosition[0] + 0.7, 0.06, initialPosition[2])
  );
  const masJoRotY = useRef(0);
  const masJoLegL = useRef<THREE.Mesh>(null);
  const masJoLegR = useRef<THREE.Mesh>(null);
  const masJoArmL = useRef<THREE.Mesh>(null);
  const masJoArmR = useRef<THREE.Mesh>(null);
  const masJoHead = useRef<THREE.Group>(null);
  const masJoEmoteRef = useRef<THREE.Group>(null);

  // Mas Jo Roaming AI state
  const masJoTarget = useRef<THREE.Vector3 | null>(null);
  const masJoIdleTimer = useRef<number>(0);
  const isMasJoWalking = useRef<boolean>(false);

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

  const walkCycle = useRef<number>(0);
  const lastFootstepTime = useRef<number>(0);
  const [showHeartParticle, setShowHeartParticle] = useState<boolean>(false);

  // Sync initial position when transitioning into walking mode
  useEffect(() => {
    if (active) {
      mbaSorePos.current.set(...initialPosition);
      if (partnerState === 'holding_hands') {
        masJoPos.current.set(
          initialPosition[0] + 0.75,
          0.06,
          initialPosition[2]
        );
      }
    }
  }, [active, initialPosition]);

  // Periodic hand-holding heart particle
  useEffect(() => {
    if (partnerState !== 'holding_hands') {
      setShowHeartParticle(false);
      return;
    }
    const interval = setInterval(() => {
      setShowHeartParticle(true);
      setTimeout(() => setShowHeartParticle(false), 1200);
    }, 3500);
    return () => clearInterval(interval);
  }, [partnerState]);

  // Keyboard input listeners
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

  useFrame((_, delta) => {
    if (!mbaSoreRef.current || !masJoRef.current) return;

    const now = performance.now();

    // ==========================================
    // 1. Mba Sore (Player) Movement
    // ==========================================
    let moveX = 0;
    let moveZ = 0;

    if (active) {
      if (keys.current.forward) moveZ -= 1;
      if (keys.current.backward) moveZ += 1;
      if (keys.current.left) moveX -= 1;
      if (keys.current.right) moveX += 1;

      if (Math.abs(joystickInput.y) > 0.1) moveZ += joystickInput.y;
      if (Math.abs(joystickInput.x) > 0.1) moveX += joystickInput.x;
    }

    const isPlayerMoving = Math.hypot(moveX, moveZ) > 0.1;
    const walkSpeed = 3.5;

    if (isPlayerMoving) {
      const inputVector = new THREE.Vector2(moveX, moveZ).normalize();
      const targetAngle = Math.atan2(inputVector.x, inputVector.y);

      // Smooth turn towards walking direction
      let diff = targetAngle - mbaSoreRotY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      mbaSoreRotY.current += diff * 0.15;

      // Next position with island boundary check
      const nextX = mbaSorePos.current.x + Math.sin(mbaSoreRotY.current) * walkSpeed * delta;
      const nextZ = mbaSorePos.current.z + Math.cos(mbaSoreRotY.current) * walkSpeed * delta;

      if (isInsideIsland(nextX, nextZ)) {
        mbaSorePos.current.x = nextX;
        mbaSorePos.current.z = nextZ;
      }

      walkCycle.current += delta * 12;

      // Footstep sound
      if (now - lastFootstepTime.current > 380) {
        sfx.playFootstep();
        lastFootstepTime.current = now;
      }

      onPositionUpdate([mbaSorePos.current.x, 0.06, mbaSorePos.current.z]);
    }

    // Gentle vertical bobbing when walking
    const mbaSoreBob = isPlayerMoving ? Math.abs(Math.sin(walkCycle.current)) * 0.04 : 0;
    mbaSoreRef.current.position.set(
      mbaSorePos.current.x,
      0.06 + mbaSoreBob,
      mbaSorePos.current.z
    );
    mbaSoreRef.current.rotation.y = mbaSoreRotY.current;

    // Mba Sore Limbs Animation
    const legSwingMba = isPlayerMoving ? Math.sin(walkCycle.current) * 0.5 : 0;
    if (mbaSoreLegL.current) mbaSoreLegL.current.rotation.x = legSwingMba;
    if (mbaSoreLegR.current) mbaSoreLegR.current.rotation.x = -legSwingMba;

    if (partnerState === 'holding_hands') {
      // Inner hand (right hand) reaches to Mas Jo's hand
      if (mbaSoreArmR.current) {
        mbaSoreArmR.current.rotation.x = 0.2;
        mbaSoreArmR.current.rotation.z = -0.4;
      }
      if (mbaSoreArmL.current) {
        mbaSoreArmL.current.rotation.x = -legSwingMba * 0.6;
        mbaSoreArmL.current.rotation.z = 0.1;
      }
    } else {
      // Free swinging arms
      if (mbaSoreArmL.current) mbaSoreArmL.current.rotation.x = -legSwingMba * 0.6;
      if (mbaSoreArmR.current) mbaSoreArmR.current.rotation.x = legSwingMba * 0.6;
    }

    // ==========================================
    // 2. Mas Jo State Machine & Movement
    // ==========================================
    let masJoWalkDelta = 0;

    if (partnerState === 'holding_hands') {
      // Mas Jo stays side-by-side with Mba Sore on her right side
      const rightOffset = new THREE.Vector3(0.65, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        mbaSoreRotY.current
      );
      const targetMasJoPos = mbaSorePos.current.clone().add(rightOffset);

      masJoPos.current.lerp(targetMasJoPos, 0.2);
      masJoRotY.current = THREE.MathUtils.lerp(
        masJoRotY.current,
        mbaSoreRotY.current,
        0.2
      );

      isMasJoWalking.current = isPlayerMoving;
      masJoWalkDelta = legSwingMba;

      // Mas Jo left arm holds Mba Sore's right hand
      if (masJoArmL.current) {
        masJoArmL.current.rotation.x = 0.2;
        masJoArmL.current.rotation.z = 0.4;
      }
      if (masJoArmR.current) {
        masJoArmR.current.rotation.x = legSwingMba * 0.6;
        masJoArmR.current.rotation.z = -0.1;
      }
    } else if (partnerState === 'returning') {
      // Mas Jo runs eagerly towards Mba Sore
      const toMba = mbaSorePos.current.clone().sub(masJoPos.current);
      const dist = toMba.length();

      if (dist < 0.85) {
        // Reconnected!
        onPartnerStateChange('holding_hands');
        sfx.playHandHold();
      } else {
        const runDir = toMba.normalize();
        const runSpeed = 4.8;
        const targetAngle = Math.atan2(runDir.x, runDir.z);

        let diff = targetAngle - masJoRotY.current;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        masJoRotY.current += diff * 0.2;

        const nextX = masJoPos.current.x + runDir.x * runSpeed * delta;
        const nextZ = masJoPos.current.z + runDir.z * runSpeed * delta;
        if (isInsideIsland(nextX, nextZ)) {
          masJoPos.current.x = nextX;
          masJoPos.current.z = nextZ;
        }

        isMasJoWalking.current = true;
        const runCycle = now * 0.015;
        masJoWalkDelta = Math.sin(runCycle) * 0.7;

        if (masJoArmL.current) masJoArmL.current.rotation.x = -masJoWalkDelta * 0.8;
        if (masJoArmR.current) masJoArmR.current.rotation.x = masJoWalkDelta * 0.8;
      }
    } else if (partnerState === 'roaming') {
      // Autonomous Island Roaming AI
      if (masJoIdleTimer.current > 0) {
        masJoIdleTimer.current -= delta;
        isMasJoWalking.current = false;
        masJoWalkDelta = 0;

        // Idling: look around gently
        if (masJoHead.current) {
          masJoHead.current.rotation.y = Math.sin(now * 0.002) * 0.3;
        }
      } else {
        // If no target, pick a random valid spot on the island
        if (!masJoTarget.current) {
          let attempts = 0;
          let validTarget: THREE.Vector3 | null = null;
          while (attempts < 10 && !validTarget) {
            const rx = (Math.random() - 0.5) * 22;
            const rz = (Math.random() - 0.5) * 20;
            if (isInsideIsland(rx, rz)) {
              validTarget = new THREE.Vector3(rx, 0.06, rz);
            }
            attempts++;
          }
          masJoTarget.current = validTarget || new THREE.Vector3(0, 0.06, 0);
        }

        const toTarget = masJoTarget.current.clone().sub(masJoPos.current);
        const distToTarget = toTarget.length();

        if (distToTarget < 0.6) {
          // Reached waypoint: pause and relax
          masJoTarget.current = null;
          masJoIdleTimer.current = 2.5 + Math.random() * 3.0; // Idle 2.5 to 5.5s
          isMasJoWalking.current = false;
        } else {
          const moveDir = toTarget.normalize();
          const wanderSpeed = 2.0; // leisurely stroll
          const targetAngle = Math.atan2(moveDir.x, moveDir.z);

          let diff = targetAngle - masJoRotY.current;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          masJoRotY.current += diff * 0.08;

          const nextX = masJoPos.current.x + moveDir.x * wanderSpeed * delta;
          const nextZ = masJoPos.current.z + moveDir.z * wanderSpeed * delta;

          if (isInsideIsland(nextX, nextZ)) {
            masJoPos.current.x = nextX;
            masJoPos.current.z = nextZ;
          } else {
            // Pick a new target if edge encountered
            masJoTarget.current = null;
          }

          isMasJoWalking.current = true;
          const roamCycle = now * 0.008;
          masJoWalkDelta = Math.sin(roamCycle) * 0.45;

          if (masJoArmL.current) masJoArmL.current.rotation.x = -masJoWalkDelta * 0.6;
          if (masJoArmR.current) masJoArmR.current.rotation.x = masJoWalkDelta * 0.6;
        }
      }
    }

    const masJoBob = isMasJoWalking.current ? Math.abs(masJoWalkDelta) * 0.03 : 0;
    masJoRef.current.position.set(
      masJoPos.current.x,
      0.06 + masJoBob,
      masJoPos.current.z
    );
    masJoRef.current.rotation.y = masJoRotY.current;

    if (masJoLegL.current) masJoLegL.current.rotation.x = masJoWalkDelta;
    if (masJoLegR.current) masJoLegR.current.rotation.x = -masJoWalkDelta;

    // Emote rotation and floating effect
    if (masJoEmoteRef.current) {
      masJoEmoteRef.current.position.y = 1.35 + Math.sin(now * 0.006) * 0.06;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* ========================================================
          1. MBA SORE (Pink Birthday Dress, Crown, Long Hair)
      ======================================================== */}
      <group ref={mbaSoreRef}>
        {/* Legs / Shoes */}
        <group position={[-0.12, 0.14, 0]}>
          <mesh ref={mbaSoreLegL} position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.16, 8]} />
            <meshStandardMaterial color="#FCD5B5" />
          </mesh>
          <mesh position={[0, -0.13, 0.02]}>
            <boxGeometry args={[0.07, 0.04, 0.10]} />
            <meshStandardMaterial color="#FF1493" />
          </mesh>
        </group>
        <group position={[0.12, 0.14, 0]}>
          <mesh ref={mbaSoreLegR} position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.16, 8]} />
            <meshStandardMaterial color="#FCD5B5" />
          </mesh>
          <mesh position={[0, -0.13, 0.02]}>
            <boxGeometry args={[0.07, 0.04, 0.10]} />
            <meshStandardMaterial color="#FF1493" />
          </mesh>
        </group>

        {/* Flared Party Dress */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.26, 0.22, 12]} />
          <meshStandardMaterial color="#FF69B4" roughness={0.35} />
        </mesh>
        {/* Dress Top & Belt */}
        <mesh position={[0, 0.44, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.12, 12]} />
          <meshStandardMaterial color="#FF1493" roughness={0.4} />
        </mesh>

        {/* Left Arm */}
        <mesh ref={mbaSoreArmL} position={[-0.19, 0.38, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.20, 8]} />
          <meshStandardMaterial color="#FCD5B5" />
        </mesh>
        {/* Right Arm */}
        <mesh ref={mbaSoreArmR} position={[0.19, 0.38, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.20, 8]} />
          <meshStandardMaterial color="#FCD5B5" />
        </mesh>

        {/* Head & Face */}
        <group ref={mbaSoreHead} position={[0, 0.64, 0]}>
          {/* Head Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FCD5B5" roughness={0.5} />
          </mesh>
          {/* Long Hair Back & Sides */}
          <mesh position={[0, -0.04, -0.06]}>
            <sphereGeometry args={[0.195, 14, 14]} />
            <meshStandardMaterial color="#4A2E18" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.18, -0.08]}>
            <boxGeometry args={[0.32, 0.28, 0.12]} />
            <meshStandardMaterial color="#4A2E18" roughness={0.7} />
          </mesh>
          {/* Hair Bangs */}
          <mesh position={[0, 0.12, 0.12]}>
            <boxGeometry args={[0.26, 0.08, 0.10]} />
            <meshStandardMaterial color="#4A2E18" roughness={0.7} />
          </mesh>
          {/* Cute Eyes */}
          <mesh position={[-0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          {/* Rosy Cheeks */}
          <mesh position={[-0.10, -0.03, 0.14]}>
            <circleGeometry args={[0.03, 8]} />
            <meshStandardMaterial color="#FF8DA1" />
          </mesh>
          <mesh position={[0.10, -0.03, 0.14]}>
            <circleGeometry args={[0.03, 8]} />
            <meshStandardMaterial color="#FF8DA1" />
          </mesh>

          {/* Golden Birthday Crown with Ruby */}
          <group position={[0, 0.20, 0]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.08, 0.09, 5]} />
              <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================
          2. MAS JO (Sky Blue Sweater, Dark Jeans, Sneakers)
      ======================================================== */}
      <group ref={masJoRef}>
        {/* Legs / Jeans */}
        <group position={[-0.12, 0.14, 0]}>
          <mesh ref={masJoLegL} position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.18, 8]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
          {/* White Sneaker */}
          <mesh position={[0, -0.14, 0.03]}>
            <boxGeometry args={[0.08, 0.05, 0.12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
        <group position={[0.12, 0.14, 0]}>
          <mesh ref={masJoLegR} position={[0, -0.07, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.045, 0.18, 8]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
          {/* White Sneaker */}
          <mesh position={[0, -0.14, 0.03]}>
            <boxGeometry args={[0.08, 0.05, 0.12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Torso / Sky Blue Sweater */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.32, 0.28, 0.20]} />
          <meshStandardMaterial color="#89CFF0" roughness={0.6} />
        </mesh>

        {/* Left Arm */}
        <mesh ref={masJoArmL} position={[-0.20, 0.38, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.22, 8]} />
          <meshStandardMaterial color="#89CFF0" />
        </mesh>
        {/* Right Arm */}
        <mesh ref={masJoArmR} position={[0.20, 0.38, 0]}>
          <cylinderGeometry args={[0.04, 0.035, 0.22, 8]} />
          <meshStandardMaterial color="#89CFF0" />
        </mesh>

        {/* Head & Hair */}
        <group ref={masJoHead} position={[0, 0.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FCD5B5" roughness={0.5} />
          </mesh>
          {/* Short Dark Hair */}
          <mesh position={[0, 0.08, -0.03]}>
            <sphereGeometry args={[0.19, 14, 14]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.16, 0.04]}>
            <boxGeometry args={[0.28, 0.08, 0.18]} />
            <meshStandardMaterial color="#2B1E16" roughness={0.8} />
          </mesh>
          {/* Friendly Eyes */}
          <mesh position={[-0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.06, 0.02, 0.16]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>

        {/* Visual Emote above Mas Jo */}
        <group ref={masJoEmoteRef} position={[0, 1.25, 0]}>
          {partnerState === 'returning' && (
            <mesh>
              <sphereGeometry args={[0.12, 10, 10]} />
              <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
            </mesh>
          )}
          {partnerState === 'roaming' && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFC107" emissiveIntensity={0.6} />
            </mesh>
          )}
        </group>
      </group>

      {/* Floating Heart between them when holding hands */}
      {showHeartParticle && partnerState === 'holding_hands' && (
        <group
          position={[
            (mbaSorePos.current.x + masJoPos.current.x) / 2,
            0.9,
            (mbaSorePos.current.z + masJoPos.current.z) / 2,
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.10, 10, 10]} />
            <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={1} />
          </mesh>
        </group>
      )}
    </group>
  );
};
