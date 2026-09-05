import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SceneCanvas } from './components/world/SceneCanvas';
import { HUD } from './components/ui/HUD';
import { VirtualJoystick } from './components/ui/VirtualJoystick';
import { WelcomeModal } from './components/ui/WelcomeModal';
import { LoveLetterModal } from './components/modals/LoveLetterModal';
import { VinylPlayer } from './components/modals/VinylPlayer';
import { PolaroidGallery } from './components/modals/PolaroidGallery';
import { CandleBlowGame } from './components/modals/CandleBlowGame';
import { WishingWellModal } from './components/modals/WishingWellModal';
import { SurpriseGiftModal } from './components/modals/SurpriseGiftModal';
import { ScrapbookModal } from './components/modals/ScrapbookModal';
import { TreasureRewardModal } from './components/modals/TreasureRewardModal';
import { INITIAL_SHARDS } from './components/world/TreasureHuntGems';
import { LANDMARKS, VEHICLE_CONFIG } from './utils/constants';
import { LandmarkType, LandmarkInfo, TimeOfDay, TreasureShard } from './types';
import { bgm, sfx } from './utils/audio';

export const App: React.FC = () => {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<LandmarkType | 'treasure_reward' | null>(null);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0.06, 5]);
  const [joystickInput, setJoystickInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [shards, setShards] = useState<TreasureShard[]>(INITIAL_SHARDS);

  // Calculate closest landmark
  const nearbyLandmark = useMemo<LandmarkInfo | null>(() => {
    for (const lm of LANDMARKS) {
      const dist = Math.hypot(playerPos[0] - lm.position[0], playerPos[2] - lm.position[2]);
      if (dist <= VEHICLE_CONFIG.INTERACTION_DISTANCE) {
        return lm;
      }
    }
    return null;
  }, [playerPos]);

  // Handle keyboard 'E' shortcut for interacting with nearby landmark
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyLandmark && !activeModal) {
        setActiveModal(nearbyLandmark.id);
      }
      if (e.code === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyLandmark, activeModal]);

  const handleStartAdventure = async () => {
    setWelcomeOpen(false);
    sfx.playChime();
    await bgm.play();
  };

  const handleOpenLandmark = (type: LandmarkType) => {
    setActiveModal(type);
  };

  const handleTeleportTo = (type: LandmarkType) => {
    const target = LANDMARKS.find((l) => l.id === type);
    if (target) {
      setPlayerPos([target.position[0], 0.06, target.position[2] + 3]);
      sfx.playChime();
    }
  };

  const handleToggleTimeOfDay = () => {
    setTimeOfDay((prev) => {
      if (prev === 'day') return 'sunset';
      if (prev === 'sunset') return 'night';
      return 'day';
    });
    sfx.playChime();
  };

  const handleCollectShard = (id: number) => {
    setShards((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, isCollected: true } : s));
      const allDone = updated.every((s) => s.isCollected);
      if (allDone) {
        setTimeout(() => {
          setActiveModal('treasure_reward');
        }, 500);
      }
      return updated;
    });
  };

  const handleJoystickMove = useCallback((dx: number, dy: number) => {
    setJoystickInput({ x: dx, y: dy });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#FFEFEF]">
      {/* 3D Isometric Canvas with Dynamic Atmosphere */}
      <SceneCanvas
        playerPos={playerPos}
        onUpdatePlayerPos={setPlayerPos}
        joystickInput={joystickInput}
        onOpenLandmark={handleOpenLandmark}
        timeOfDay={timeOfDay}
        shards={shards}
        onCollectShard={handleCollectShard}
      />

      {/* Floating HUD with Radar, Atmosphere Switcher, and Nav Dock */}
      <HUD
        nearbyLandmark={nearbyLandmark}
        onOpenLandmark={handleOpenLandmark}
        onTeleportTo={handleTeleportTo}
        onHorn={() => sfx.playHorn()}
        timeOfDay={timeOfDay}
        onToggleTimeOfDay={handleToggleTimeOfDay}
        shards={shards}
        playerPos={playerPos}
      />

      {/* Mobile Virtual Joystick & Action Button */}
      <VirtualJoystick
        onMove={handleJoystickMove}
        onAction={nearbyLandmark ? () => handleOpenLandmark(nearbyLandmark.id) : undefined}
        actionPrompt={nearbyLandmark ? `Buka ${nearbyLandmark.title}` : null}
      />

      {/* Welcome & First Experience Modal */}
      <WelcomeModal
        isOpen={welcomeOpen}
        onStart={handleStartAdventure}
      />

      {/* Interactive Modals */}
      <LoveLetterModal
        isOpen={activeModal === 'mailbox'}
        onClose={() => setActiveModal(null)}
      />

      <VinylPlayer
        isOpen={activeModal === 'jukebox'}
        onClose={() => setActiveModal(null)}
      />

      <PolaroidGallery
        isOpen={activeModal === 'gallery'}
        onClose={() => setActiveModal(null)}
      />

      <CandleBlowGame
        isOpen={activeModal === 'cake'}
        onClose={() => setActiveModal(null)}
      />

      <WishingWellModal
        isOpen={activeModal === 'wishing_well'}
        onClose={() => setActiveModal(null)}
      />

      <SurpriseGiftModal
        isOpen={activeModal === 'gift_box'}
        onClose={() => setActiveModal(null)}
      />

      <ScrapbookModal
        isOpen={activeModal === 'scrapbook'}
        onClose={() => setActiveModal(null)}
      />

      <TreasureRewardModal
        isOpen={activeModal === 'treasure_reward'}
        onClose={() => setActiveModal(null)}
        onOpenScrapbook={() => setActiveModal('scrapbook')}
      />
    </div>
  );
};

export default App;
