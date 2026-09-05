import { describe, it, expect } from 'vitest';
import {
  createOrganicBeachShape,
  createHeartShape,
  createHeartRoadShape,
  isInsideIsland,
  isInsideHeart,
  isInsidePier,
} from '../utils/heartGeometry';

describe('Heart & Organic Island Geometry', () => {
  it('creates natural organic beach shape', () => {
    const shape = createOrganicBeachShape(23);
    expect(shape).toBeDefined();
    expect(shape.curves.length).toBeGreaterThan(50);
  });

  it('creates central heart shape with points', () => {
    const shape = createHeartShape(1.05);
    expect(shape).toBeDefined();
    expect(shape.curves.length).toBeGreaterThan(50);
  });

  it('creates road shape with inner hole', () => {
    const roadShape = createHeartRoadShape(0.85, 0.65);
    expect(roadShape).toBeDefined();
    expect(roadShape.holes.length).toBe(1);
  });

  it('detects interior points as inside island', () => {
    expect(isInsideIsland(0, 0)).toBe(true);
    expect(isInsideIsland(10, 10)).toBe(true);
    expect(isInsideIsland(-10, -10)).toBe(true);
  });

  it('detects far off points as outside island', () => {
    expect(isInsideIsland(60, 60)).toBe(false);
    expect(isInsideIsland(-60, 0)).toBe(false);
  });

  it('verifies romantic pier walkway over ocean water', () => {
    // On the pier walkway extending into water (e.g. Z = 24, X = 0)
    expect(isInsidePier(0, 24)).toBe(true);
    expect(isInsideIsland(0, 24)).toBe(true);
    // At the end pier bench (Z = 25.7, X = 0)
    expect(isInsidePier(0, 25.7)).toBe(true);
    expect(isInsideIsland(0, 25.7)).toBe(true);
    // Deep ocean off to the side of the pier (Z = 24, X = 10)
    expect(isInsidePier(10, 24)).toBe(false);
  });

  it('verifies heart interior test', () => {
    expect(isInsideHeart(0, 0)).toBe(true);
    expect(isInsideHeart(40, 40)).toBe(false);
  });
});
