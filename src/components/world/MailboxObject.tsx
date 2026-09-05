import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MailboxObjectProps {
  position: [number, number, number];
  onClick: () => void;
}

export const MailboxObject: React.FC<MailboxObjectProps> = ({
  position,
  onClick,
}) => {
  const envelopeIconRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (envelopeIconRef.current) {
      envelopeIconRef.current.position.y = 2.6 + Math.sin(Date.now() * 0.004) * 0.15;
      envelopeIconRef.current.rotation.y += delta * 1.2;
    }
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(Date.now() * 0.003) * 0.15;
    }
  });

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Floating Envelope Indicator above Mailbox */}
      <group ref={envelopeIconRef} position={[0, 2.6, 0]}>
        {/* White Envelope base */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.45, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Red Heart Seal */}
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color="#FF1493" emissive="#FF69B4" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Wooden Post */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 1.4, 8]} />
        <meshStandardMaterial color="#8D5B4C" roughness={0.8} />
      </mesh>

      {/* Mailbox Mounting Platform */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.08, 1.1]} />
        <meshStandardMaterial color="#6D4337" roughness={0.8} />
      </mesh>

      {/* Mailbox Body (Lower rectangular half) */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.6, 0.45, 0.95]} />
        <meshStandardMaterial color="#E63946" roughness={0.4} />
      </mesh>

      {/* Mailbox Rounded Roof (Half-cylinder) */}
      <mesh position={[0, 1.82, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.95, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#D90429" roughness={0.4} />
      </mesh>

      {/* Mailbox Front Handle */}
      <mesh position={[0, 1.6, 0.49]}>
        <boxGeometry args={[0.15, 0.06, 0.06]} />
        <meshStandardMaterial color="#FFD166" roughness={0.3} />
      </mesh>

      {/* Cute Red Mailbox Flag */}
      <group ref={flagRef} position={[0.32, 1.7, 0.2]}>
        {/* Flag Pole */}
        <mesh position={[0.02, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          <meshStandardMaterial color="#FFD166" roughness={0.3} />
        </mesh>
        {/* Flag Pennant */}
        <mesh position={[0.02, 0.3, -0.1]}>
          <boxGeometry args={[0.02, 0.15, 0.22]} />
          <meshStandardMaterial color="#FF1493" roughness={0.3} />
        </mesh>
      </group>

      {/* Warm gentle beacon light */}
      <pointLight position={[0, 2.2, 0]} color="#FFAAA6" intensity={0.6} distance={4} />
    </group>
  );
};
