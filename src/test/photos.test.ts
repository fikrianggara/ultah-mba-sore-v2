import { describe, it, expect } from 'vitest';
import { PHOTO_ITEMS } from '../data/photos';

describe('Photo Catalog Integrity', () => {
  it('should have photos defined', () => {
    expect(PHOTO_ITEMS.length).toBeGreaterThan(0);
  });

  it('each photo should have valid properties', () => {
    PHOTO_ITEMS.forEach((photo) => {
      expect(photo.id).toBeTruthy();
      expect(photo.filename).toBeTruthy();
      expect(photo.title).toBeTruthy();
      expect(photo.caption).toBeTruthy();
      expect(['moment', 'cute', 'sweet', 'special']).toContain(photo.tag);
    });
  });

  it('photo ids should be unique', () => {
    const ids = PHOTO_ITEMS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
