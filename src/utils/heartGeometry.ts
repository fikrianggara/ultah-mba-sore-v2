import * as THREE from 'three';

/**
 * Generates an organic natural coastline shape with gentle bays, coves, and capes.
 */
export function createOrganicBeachShape(baseRadius: number = 23): THREE.Shape {
  const shape = new THREE.Shape();
  const steps = 120;

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    // Harmonic organic perimeter variations (natural bays and points)
    const r =
      baseRadius +
      3.2 * Math.sin(2 * theta + 0.4) -
      2.5 * Math.cos(3 * theta - 0.2) +
      1.6 * Math.sin(5 * theta) -
      1.0 * Math.cos(7 * theta);

    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  return shape;
}

/**
 * Generates a 2D THREE.Shape for the central lush green cartoon heart.
 */
export function createHeartShape(scale: number = 1.05, yOffset: number = 1.2): THREE.Shape {
  const shape = new THREE.Shape();
  const steps = 100;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    const px = x * scale;
    const py = (y + yOffset) * scale;

    if (i === 0) {
      shape.moveTo(px, py);
    } else {
      shape.lineTo(px, py);
    }
  }

  return shape;
}

/**
 * Generates a closed 2D THREE.Shape with a hole for the heart-shaped road loop.
 */
export function createHeartRoadShape(outerScale: number = 0.85, innerScale: number = 0.65): THREE.Shape {
  const roadShape = createHeartShape(outerScale);
  const innerPath = new THREE.Path();
  const steps = 100;

  for (let i = 0; i <= steps; i++) {
    const t = (1 - i / steps) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    const px = x * innerScale;
    const py = (y + 1.2) * innerScale;

    if (i === 0) {
      innerPath.moveTo(px, py);
    } else {
      innerPath.lineTo(px, py);
    }
  }

  roadShape.holes.push(innerPath);
  return roadShape;
}

/**
 * Check if 3D coordinate (x, z) is on the romantic boardwalk pier extending into the water.
 */
export function isInsidePier(x: number, z: number): boolean {
  return Math.abs(x) <= 1.6 && z >= 18.0 && z <= 27.2;
}

/**
 * Check if 3D coordinate (x, z) is inside the island playable area (including beach & pier).
 */
export function isInsideIsland(x: number, z: number): boolean {
  return isInsideHeart(x, z, 1.25) || isInsidePier(x, z);
}

/**
 * Backwards compatibility helper for heart checking
 */
export function isInsideHeart(x: number, z: number, scale: number = 1.05): boolean {
  const px = x / scale;
  const py = (-z) / scale - 1.2;
  const u = px / 16;
  const v = py / 16;
  const term = u * u + v * v - 1;
  return term * term * term - u * u * (v * v * v) <= 0.15;
}
