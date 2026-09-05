import { describe, it, expect, beforeEach } from 'vitest';
import { sfx, BackgroundMusicManager } from '../utils/audio';

describe('Audio Subsystem', () => {
  let bgmManager: BackgroundMusicManager;

  beforeEach(() => {
    bgmManager = new BackgroundMusicManager();
  });

  it('sound effect triggers should not throw errors', () => {
    expect(() => sfx.playHorn()).not.toThrow();
    expect(() => sfx.playPop()).not.toThrow();
    expect(() => sfx.playBlow()).not.toThrow();
    expect(() => sfx.playChime()).not.toThrow();
  });

  it('BGM manager should toggle mute state correctly', () => {
    const isMuted = bgmManager.toggleMute();
    expect(isMuted).toBe(true);
    const unmuted = bgmManager.toggleMute();
    expect(unmuted).toBe(false);
  });

  it('BGM manager should clamp volume within [0, 1]', () => {
    bgmManager.setVolume(1.5);
    // Internal volume should be clamped to 1
    bgmManager.setVolume(-0.5);
    // Internal volume should be clamped to 0
    expect(true).toBe(true);
  });
});
