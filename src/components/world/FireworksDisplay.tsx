import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfx } from '../../utils/audio';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  alpha: number;
  decay: number;
}

interface Rocket {
  position: THREE.Vector3;
  targetY: number;
  velocity: THREE.Vector3;
  color: THREE.Color;
  exploded: boolean;
}

interface FireworksDisplayProps {
  active: boolean; // Triggers continuous or burst firework show
  origin?: [number, number, number];
}

const FIREWORK_COLORS = [
  '#FF1493', // Deep Pink
  '#FF69B4', // Hot Pink
  '#FFD700', // Gold
  '#00F5D4', // Mint Turquoise
  '#9B5DE5', // Purple
  '#F15BB5', // Rose
  '#FFF0F5', // Sparkling White-Pink
  '#FEE440', // Golden Yellow
];

export const FireworksDisplay: React.FC<FireworksDisplayProps> = ({
  active,
  origin = [0, 0.06, 0], // Default around Cake Plaza
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const rockets = useRef<Rocket[]>([]);
  const lastLaunchTime = useRef<number>(0);

  const launchRocket = (launchOrigin: [number, number, number]) => {
    const colorHex = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const color = new THREE.Color(colorHex);
    const offsetX = (Math.random() - 0.5) * 6;
    const offsetZ = (Math.random() - 0.5) * 6;

    rockets.current.push({
      position: new THREE.Vector3(
        launchOrigin[0] + offsetX,
        launchOrigin[1],
        launchOrigin[2] + offsetZ
      ),
      targetY: 9 + Math.random() * 8, // Explodes between 9 and 17 altitude
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        14 + Math.random() * 4,
        (Math.random() - 0.5) * 0.8
      ),
      color,
      exploded: false,
    });

    sfx.playFireworkLaunch();
  };

  const explodeRocket = (rocket: Rocket) => {
    const particleCount = 55;
    sfx.playFireworkBurst();

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 2.5 + Math.random() * 4.5;

      const sinPhi = Math.sin(phi);
      const vx = speed * sinPhi * Math.cos(theta);
      const vy = speed * Math.cos(phi) + 1.2;
      const vz = speed * sinPhi * Math.sin(theta);

      particles.current.push({
        position: rocket.position.clone(),
        velocity: new THREE.Vector3(vx, vy, vz),
        color: rocket.color,
        size: 0.22 + Math.random() * 0.15,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.012,
      });
    }
  };

  // Launch initial rocket on active trigger
  useEffect(() => {
    if (active) {
      launchRocket(origin);
    }
  }, [active, origin]);

  useFrame((_, delta) => {
    const now = performance.now();

    // Auto-launch rockets while active
    if (active && now - lastLaunchTime.current > 750) {
      launchRocket(origin);
      lastLaunchTime.current = now;
    }

    // 1. Update Rockets
    for (let i = rockets.current.length - 1; i >= 0; i--) {
      const r = rockets.current[i];
      r.position.addScaledVector(r.velocity, delta);

      // Rocket sparks trail
      particles.current.push({
        position: r.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          -1.0 - Math.random(),
          (Math.random() - 0.5) * 0.4
        ),
        color: new THREE.Color('#FFF5BA'),
        size: 0.12,
        alpha: 0.8,
        decay: 0.06,
      });

      if (r.position.y >= r.targetY) {
        explodeRocket(r);
        rockets.current.splice(i, 1);
      }
    }

    // 2. Update Burst Particles
    const maxParticles = 600;
    if (particles.current.length > maxParticles) {
      particles.current.splice(0, particles.current.length - maxParticles);
    }

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 4.2 * delta; // Gravity
      p.velocity.multiplyScalar(0.97); // Air drag
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.position.y < 0.06) {
        particles.current.splice(i, 1);
      }
    }

    // 3. Render into Points Buffer
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry;
      const count = particles.current.length;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const p = particles.current[i];
        positions[i * 3] = p.position.x;
        positions[i * 3 + 1] = p.position.y;
        positions[i * 3 + 2] = p.position.z;

        const c = p.color;
        colors[i * 3] = c.r * p.alpha;
        colors[i * 3 + 1] = c.g * p.alpha;
        colors[i * 3 + 2] = c.b * p.alpha;
      }

      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.35}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
