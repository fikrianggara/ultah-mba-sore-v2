# Technical Specification: Ultah Dinda V2

## 1. Architecture Overview
Ultah Dinda V2 is a client-side Single Page Application (SPA) combining WebGL 3D rendering with a React-based component tree and responsive overlay HUD.

```
+----------------------------------------------------------------+
|                          Application Window                    |
|  +----------------------------------------------------------+  |
|  |             Canvas (React Three Fiber / Three.js)        |  |
|  |  - Isometric Orthographic Camera                         |  |
|  |  - Cartoon Island Terrain (Ground, Roads, Flora, Lamps)  |  |
|  |  - PlayerVehicle (Kinematic movement, steer, bounce)     |  |
|  |  - Interactive 3D POIs:                                  |  |
|  |      * Mailbox (Love Letter trigger)                     |  |
|  |      * Jukebox (Vinyl Player trigger)                    |  |
|  |      * Cake (Candle Blow Game trigger)                   |  |
|  |      * Gallery Billboard (Polaroids trigger)             |  |
|  |      * Balloon Field (Collision pop particles)           |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +----------------------------------------------------------+  |
|  |             Overlay UI & HUD (React + Framer Motion)     |  |
|  |  - Top Navigation & Audio Status                         |  |
|  |  - Mobile Virtual Joystick & Action Button               |  |
|  |  - Modals: LoveLetterModal, VinylPlayerModal,            |  |
|  |            PolaroidGalleryModal, CandleBlowGameModal     |  |
|  |  - Particle Confetti Canvas                              |  |
|  +----------------------------------------------------------+  |
+----------------------------------------------------------------+
```

## 2. Technology Stack & Dependencies
- **Core Framework**: React 18 / 19 + TypeScript + Vite
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Styling**: `tailwindcss`, `postcss`, `autoprefixer`
- **Animation**: `framer-motion`
- **Icons**: `lucide-react`
- **Audio & Particles**: HTML5 Web Audio API, `canvas-confetti`
- **Testing**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## 3. Key Systems & Modules

### 3.1 3D World Engine
- **Isometric Projection**: Configured using orthographic camera (`zoom: 45`, position: `[30, 30, 30]`, looking at `[0, 0, 0]`). Camera smoothly follows player vehicle via `lerp` in `useFrame`.
- **Low-Poly Cartoon Shading**: Soft toon-like palette using `meshStandardMaterial` with roughness 0.6, directional sunlight with soft shadow bias, and ambient hemisphere lighting.
- **Procedural Island & Roads**: Modular grid/spline layout featuring a circular road connecting all 4 main POIs, surrounded by low-poly pine trees, round trees, mushrooms, and flower clusters.

### 3.2 Vehicle Physics & Controls
- **Kinematic Physics Controller**:
  - `speed`, `maxSpeed` (0.15 units/frame), `acceleration` (0.008), `friction` (0.95), `turnSpeed` (0.04 rad/frame).
  - Inputs: Keyboard (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `KeyW`, `KeyA`, `KeyS`, `KeyD`, `Space` for horn/jump) and touch joystick (`dx`, `dy`).
  - Suspension bounce: procedural sinusoidal bobbing calculated from vehicle velocity.

### 3.3 POI Proximity Detection & Interaction
- Landmark positions are registered in `constants.ts`.
- In `useFrame`, Euclidean distance $d = \sqrt{(x_{veh} - x_{poi})^2 + (z_{veh} - z_{poi})^2}$ is computed.
- When $d < 4.0$ units, interactive HUD prompt appears ("Tekan E atau Ketuk untuk membuka [Nama Landmark]").
- Clicking the 3D landmark directly or clicking the HUD button immediately opens the respective modal.

### 3.4 Audio Architecture
- Singleton `AudioManager` wraps HTML5 `Audio` with smooth volume crossfades.
- Supports background music looping, sound effects (balloon pop, envelope rustle, candle blow puff, horn honk).

## 4. Testing Strategy
- Unit tests for game logic, math helpers, and audio state managers.
- Component tests for modal states, envelope interactions, and gallery rendering.
