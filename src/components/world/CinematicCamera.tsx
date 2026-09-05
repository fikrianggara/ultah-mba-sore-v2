import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CinematicCameraProps {
  isTouring: boolean;
  onTourEnd: () => void;
  targetPosition: [number, number, number];
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  isTouring,
  onTourEnd,
  targetPosition,
}) => {
  const { camera } = useThree();
  const progress = useRef<number>(0);
  const currentTarget = useRef(new THREE.Vector3(...targetPosition));
  const cameraPos = useRef(new THREE.Vector3(25, 25, 25));

  useFrame((_, delta) => {
    if (isTouring) {
      // Tour duration: ~8 seconds
      progress.current += delta / 8.0;

      if (progress.current >= 1.0) {
        progress.current = 1.0;
        onTourEnd();
        return;
      }

      const p = progress.current;
      // Orbit angle sweeps 360 degrees smoothly
      const angle = p * Math.PI * 2 - Math.PI / 4;
      const radius = THREE.MathUtils.lerp(28, 20, Math.sin(p * Math.PI));
      const height = THREE.MathUtils.lerp(26, 18, Math.sin(p * Math.PI));

      const camX = Math.cos(angle) * radius;
      const camZ = Math.sin(angle) * radius;

      cameraPos.current.set(camX, height, camZ);
      camera.position.copy(cameraPos.current);

      // Look slightly above center towards Cake Plaza and landmarks
      camera.lookAt(0, 1.2, 0);
    } else {
      // Reset progress
      progress.current = 0;

      // Normal Isometric Follow
      currentTarget.current.x = THREE.MathUtils.lerp(
        currentTarget.current.x,
        targetPosition[0],
        0.06
      );
      currentTarget.current.z = THREE.MathUtils.lerp(
        currentTarget.current.z,
        targetPosition[2],
        0.06
      );

      const isoOffset = 22;
      const targetCamX = currentTarget.current.x + isoOffset;
      const targetCamY = isoOffset + 5;
      const targetCamZ = currentTarget.current.z + isoOffset;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

      camera.lookAt(currentTarget.current.x, 0.70, currentTarget.current.z);
    }
  });

  return null;
};
