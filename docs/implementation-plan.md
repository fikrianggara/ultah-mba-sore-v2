# Implementation Plan: Ultah Dinda V2

## 1. Plan Overview
Step-by-step roadmap to build, test, and polish the 3D isometric interactive birthday experience for Dinda.

## 2. Phases & Milestones

### Phase 1: Project Scaffold & Asset Integration
- Initialize Vite React TypeScript project.
- Install 3D packages (`three`, `@react-three/fiber`, `@react-three/drei`), styling (`tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`), animation (`framer-motion`, `canvas-confetti`), and testing (`vitest`, `@testing-library/react`, `jsdom`).
- Configure Vite for port 3100.
- Copy audio and photo assets from `../birthday-card/assets` into `public/assets/`.
- Verify project builds and runs cleanly.

### Phase 2: Core Data & Audio Subsystem
- Create photo catalog (`src/data/photos.ts`) with metadata and tags.
- Create audio manager (`src/utils/audio.ts`) with BGM and Web Audio sound synthesizers/effects.
- Write unit tests for data structures and audio manager logic.

### Phase 3: 3D Isometric World & Vehicle Controls
- Build isometric camera system with smooth vehicle-following interpolation (`SceneCanvas.tsx`).
- Create low-poly cartoon island terrain: grass ground, circular road, cartoon trees, stones, flowers, and clouds.
- Create driveable cartoon vehicle (`PlayerVehicle.tsx`) with headlights, wheel rotation, body bounce, and smoke particles.
- Implement dual controls: Keyboard controller (`useVehicleControls.ts`) + mobile virtual joystick.

### Phase 4: 3D Interactive Landmarks & POIs
- Create 3D Mailbox (`MailboxObject.tsx`) with animated fluttering flag and proximity indicator.
- Create 3D Vintage Jukebox (`JukeboxObject.tsx`) with neon lights and floating musical notes.
- Create 3D Photo Billboard (`GalleryBillboardObject.tsx`) with hanging miniature polaroids.
- Create 3D Giant Birthday Cake (`BirthdayCakeObject.tsx`) with 3 tiers and flickering candle flames.
- Create 3D Floating Balloons (`BalloonsField.tsx`) with collision popping and sparkle bursts.

### Phase 5: Interactive Modals & Rich Overlays
- **Love Letter Modal**: Folding envelope opening animation, wax seal pop, handwritten font styling, and personalized romantic letter.
- **Vinyl Music Player Modal**: Realistic spinning vinyl record, moving tone arm, lyrics snippet display, play/pause and progress scrubbing.
- **Polaroid Photo Gallery Modal**: Draggable polaroids, 3D tilt hover physics, photo viewer modal, and filter tags.
- **Candle Blow & Wish Mini-Game**: Interactive candle blowing, flame extinguishing animation, and grand confetti/fireworks celebration.
- **Floating HUD**: Quick navigation dock to teleport or open landmarks directly, mute button, help overlay, and mini-map.

### Phase 6: Automated Testing & Verification
- Implement comprehensive Vitest unit and component tests.
- Verify test pass rates and production build bundle size.
- Manual verification across desktop and simulated mobile viewports.
