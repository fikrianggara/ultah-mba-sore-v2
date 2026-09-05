import { describe, it, expect } from 'vitest';
import { sfx } from '../utils/audio';

describe('New Sound Effects Audio Synthesis', () => {
  it('calls new sound synthesizer methods safely without throwing in headless environment', () => {
    expect(() => sfx.playFootstep()).not.toThrow();
    expect(() => sfx.playMotorHorn()).not.toThrow();
    expect(() => sfx.playCallPartner()).not.toThrow();
    expect(() => sfx.playHandHold()).not.toThrow();
    expect(() => sfx.playFireworkLaunch()).not.toThrow();
    expect(() => sfx.playFireworkBurst()).not.toThrow();
  });
});
