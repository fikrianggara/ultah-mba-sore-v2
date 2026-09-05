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
  isWillow?: boolean;
}

interface Rocket {
  position: THREE.Vector3;
  targetY: number;
  velocity: THREE.Vector3;
  color: THREE.Color;
  type: 'sphere' | 'heart' | 'willow';
}

interface FireworksDisplayProps {
  active: boolean;
}

const FIREWORK_COLORS = [
  '#FF1493', // Vibrant Pink
  '#FF69B4', // Hot Pink
  '#FFD700', // Gold
  '#00F5D4', // Mint Turquoise
  '#9B5DE5', // Purple
  '#F15BB5', // Rose
  '#FFF0F5', // White Sparkle
  '#FEE440', // Golden Yellow
  '#FF477E', // Coral Red
];

// 5 Launching pads around the heart island
const LAUNCH_PADS: [number, number, number][] = [
  [0, 0.06, 0],    // Center Cake Plaza
  [-7.5, 0.06, 0], // West Flank
  [7.5, 0.06, 0],  // East Flank
  [0, 0.06, -8],   // North Bay
  [0, 0.06, 12],   // South Pier
];

export const FireworksDisplay: React.FC<FireworksDisplayProps> = ({ active }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const rockets = useRef<Rocket[]>([]);
  const lastLaunchTime = useRef<number>(0);

  const launchRocket = () => {
    const pad = LAUNCH_PADS[Math.floor(Math.random() * LAUNCH_PADS.length)];
    const colorHex = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const color = new THREE.Color(colorHex);
    const offsetX = (Math.random() - 0.5) * 4;
    const offsetZ = (Math.random() - 0.5) * 4;

    const roll = Math.random();
    const type: 'sphere' | 'heart' | 'willow' =
      roll < 0.35 ? 'heart' : roll < 0.65 ? 'willow' : 'sphere';

    rockets.current.push({
      position: new THREE.Vector3(
        pad[0] + offsetX,
        pad[1],
        pad[2] + offsetZ
      ),
      targetY: 10 + Math.random() * 8, // Altitude 10 to 18
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        15 + Math.random() * 5,
        (Math.random() - 0.5) * 1.2
      ),
      color,
      type,
    });

    sfx.playFireworkLaunch();
  };

  const explodeRocket = (rocket: Rocket) => {
    if (rocket.type === 'heart') {
      // Heart-shaped Particle Shell
      const count = 75;
      sfx.playFireworkBurst();

      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Classic parametric heart curve
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const scale = 0.28;

        particles.current.push({
          position: rocket.position.clone(),
          velocity: new THREE.Vector3(
            hx * scale + (Math.random() - 0.5) * 0.5,
            hy * scale * 0.8 + (Math.random() - 0.5) * 0.5 + 1.0,
            (Math.random() - 0.5) * 1.2
          ),
          color: new THREE.Color('#FF1493'),
          size: 0.38,
          alpha: 1.0,
          decay: 0.012,
        });
      }
    } else if (rocket.type === 'willow') {
      // Golden Willow Rain (Curtain of cascading gold glitter)
      const count = 90;
      sfx.playFireworkBurst();

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        const vx = Math.cos(theta) * speed;
        const vy = Math.random() * 3.5 + 1.0;
        const vz = Math.sin(theta) * speed;

        particles.current.push({
          position: rocket.position.clone(),
          velocity: new THREE.Vector3(vx, vy, vz),
          color: new THREE.Color(Math.random() > 0.3 ? '#FFD700' : '#FFF9D2'),
          size: 0.28,
          alpha: 1.0,
          decay: 0.007, // Long duration
          isWillow: true,
        });
      }
    } else {
      // Spherical Peony Burst
      const count = 65;
      sfx.playFireworkBurst();

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = 2.8 + Math.random() * 4.5;

        const sinPhi = Math.sin(phi);
        const vx = speed * sinPhi * Math.cos(theta);
        const vy = speed * Math.cos(phi) + 1.2;
        const vz = speed * sinPhi * Math.sin(theta);

        particles.current.push({
          position: rocket.position.clone(),
          velocity: new THREE.Vector3(vx, vy, vz),
          color: rocket.color,
          size: 0.32 + Math.random() * 0.15,
          alpha: 1.0,
          decay: 0.015,
        });
      }
    }
  };

  useEffect(() => {
    if (active) {
      // Salvo launch 3 rockets immediately
      launchRocket();
      setTimeout(launchRocket, 180);
      setTimeout(launchRocket, 360);
      sfx.playGrandFireworks();
    }
  }, [active]);

  useFrame((_, delta) => {
    const now = performance.now();

    // Fast celebration salvo rate while active
    if (active && now - lastLaunchTime.current > 420) {
      launchRocket();
      lastLaunchTime.current = now;
    }

    // 1. Update Rockets
    for (let i = rockets.current.length - 1; i >= 0; i--) {
      const r = rockets.current[i];
      r.position.addScaledVector(r.velocity, delta);

      // Spark trail
      particles.current.push({
        position: r.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          -1.5 - Math.random(),
          (Math.random() - 0.5) * 0.5
        ),
        color: new THREE.Color('#FFF5BA'),
        size: 0.14,
        alpha: 0.85,
        decay: 0.07,
      });

      if (r.position.y >= r.targetY) {
        explodeRocket(r);
        rockets.current.splice(i, 1);
      }
    }

    // 2. Update Burst Particles
    const maxParticles = 1400;
    if (particles.current.length > maxParticles) {
      particles.current.splice(0, particles.current.length - maxParticles);
    }

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.position.addScaledVector(p.velocity, delta);

      // Willow rain has slower downward gravity and gentle glitter
      if (p.isWillow) {
        p.velocity.y -= 2.2 * delta; // Gentle gravity
        p.velocity.multiplyScalar(0.985);
      } else {
        p.velocity.y -= 4.2 * delta; // Normal gravity
        p.velocity.multiplyScalar(0.965);
      }

      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.position.y < 0.04) {
        particles.current.splice(i, 1);
      }
    }

    // 3. Render Buffer Geometry
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
        size={0.42}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
