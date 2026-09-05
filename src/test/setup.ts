import '@testing-library/jest-dom';

// Mock Web Audio API for tests
class MockAudioContext {
  currentTime = 0;
  state = 'running';
  destination = {};
  createGain() {
    return {
      connect: () => {},
      gain: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
      },
    };
  }
  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: {
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      type: 'sine',
    };
  }
  createBiquadFilter() {
    return {
      connect: () => {},
      frequency: {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {},
      },
    };
  }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(100),
    };
  }
  createBufferSource() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      buffer: null,
    };
  }
  resume() {
    return Promise.resolve();
  }
}

// Attach mock AudioContext to window
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});

// Mock HTMLMediaElement play/pause
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
