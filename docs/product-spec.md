# Product Specification: Ultah Dinda V2 (Dindaland / Sore Island)

## 1. Product Overview
**Ultah Dinda V2** is an interactive, immersive 3D birthday celebration web application dedicated to Dinda ("Mba Sore"). Unlike static or flat web greetings, V2 transports the user into a whimsical, cartoonish isometric 3D miniature island ("Dindaland") where the user can drive a cute mini-car or scooter, explore landmarks, uncover memories, enjoy music on a retro vinyl player, and open an interactive letter.

## 2. Target Audience & Core Personas
- **Primary User**: Dinda ("Mba Sore") celebrating her birthday.
- **Secondary Users**: Friends and family viewing the celebration.
- **Tone & Mood**: Heartwarming, nostalgic, playful, romantic, aesthetically delightful (pastel colors, warm lighting, cozy cartoon vibe).

## 3. Core Features & User Stories
### 3.1 3D Isometric Island & Driveable Vehicle
- **User Story**: As Dinda, I want to drive a cute cartoon vehicle around a miniature island so that I feel playful and engaged.
- **Requirements**:
  - Isometric (axonometric / orthographic) camera angle with smooth vehicle tracking.
  - Responsive keyboard controls (WASD / Arrow keys) and on-screen mobile touch joystick.
  - Low-poly cartoon environment: roads, trees, flowers, streetlamps, clouds, balloons.
  - Fun vehicle interactions: bouncy movement, steering rotation, headlight glow.

### 3.2 Vintage Mailbox & Love Letter
- **User Story**: As Dinda, I want to open an envelope from a mailbox to read a heartfelt message from Mas Jo.
- **Requirements**:
  - Interactive 3D mailbox in the world with a fluttering flag or click prompt.
  - Realistic 2D/3D folding envelope animation with wax seal pop.
  - Heartfelt letter with elegant typography and personal memories.

### 3.3 Vinyl Turntable Music Player
- **User Story**: As Dinda, I want romantic background music with an interactive turntable so the experience feels warm and musical.
- **Requirements**:
  - Retro turntable widget with spinning vinyl record and tone arm.
  - Audio playback controls (play, pause, volume, track progress).
  - Pre-loaded with "Perfect" by Ed Sheeran (`assets/audio/perfect.mp3`).

### 3.4 Interactive Polaroid Photo Gallery
- **User Story**: As Dinda, I want to see our photo memories in a tactile, fun way.
- **Requirements**:
  - Billboard / photo garden landmark in the 3D world.
  - Draggable, interactive polaroid cards with 3D tilt hover physics.
  - Click-to-enlarge modal with photo captions and dates.

### 3.5 Birthday Cake & Candle Blow Mini-Game
- **User Story**: As Dinda, I want to blow out birthday candles and see celebratory confetti.
- **Requirements**:
  - 3-tier cartoon birthday cake with animated flames.
  - Interactive candle extinguishing (click/tap to blow).
  - Grand finale with confetti blasts and celebratory wishes.

### 3.6 Floating HUD & Quick Navigation
- **User Story**: As a user on desktop or mobile, I want quick shortcuts to all landmarks so I never get lost.
- **Requirements**:
  - Bottom navigation dock for instant teleport / modal open (Cake, Mailbox, Music, Gallery).
  - Sound mute/unmute quick toggle.
  - Interactive tutorial / help overlay explaining controls.

## 4. Non-Functional Requirements
- **Performance**: 60 FPS rendering on modern browsers, fast asset loading.
- **Responsiveness**: Fully responsive across mobile (iOS/Android) and desktop (macOS/Windows).
- **Accessibility**: Keyboard accessible navigation, clear touch targets on mobile.
