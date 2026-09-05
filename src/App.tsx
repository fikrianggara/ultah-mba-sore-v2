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
import { LandmarkType, LandmarkInfo, TimeOfDay, TreasureShard, TravelMode, WalkingPartnerState } from './types';
import { bgm, sfx } from './utils/audio';

export const App: React.FC = () => {
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<LandmarkType | 'treasure_reward' | null>(null);

  // Travel Mode & Entity Positions
  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [partnerState, setPartnerState] = useState<WalkingPartnerState>('holding_hands');
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0.06, 5]);
  const [carPos, setCarPos] = useState<[number, number, number]>([0, 0.06, 5]);
  const [motorPos, setMotorPos] = useState<[number, number, number]>([3, 0.06, 2]);

  // Controls & Atmosphere
  const [joystickInput, setJoystickInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [shards, setShards] = useState<TreasureShard[]>(INITIAL_SHARDS);
  const [isCinematicTour, setIsCinematicTour] = useState<boolean>(false);
  const [fireworksActive, setFireworksActive] = useState<boolean>(false);

  // Proximity to parked vehicles when walking
  const distToCar = Math.hypot(playerPos[0] - carPos[0], playerPos[2] - carPos[2]);
  const isNearCar = travelMode === 'walking' && distToCar < 3.2;

  const distToMotor = Math.hypot(playerPos[0] - motorPos[0], playerPos[2] - motorPos[2]);
  const isNearMotor = travelMode === 'walking' && distToMotor < 3.2;

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

  // Handle keyboard shortcuts (E for landmark, F for mount/dismount, Escape for modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearbyLandmark && !activeModal) {
        setActiveModal(nearbyLandmark.id);
      }
      if (e.code === 'Escape' && activeModal) {
        setActiveModal(null);
      }
      if (e.code === 'KeyF' && !activeModal) {
        if (travelMode === 'car') {
          // Dismount car to walking
          setTravelMode('walking');
          setPartnerState('holding_hands');
          setPlayerPos([carPos[0] + 1.2, 0.06, carPos[2]]);
          sfx.playChime();
        } else if (travelMode === 'motor') {
          // Dismount motor to walking
          setTravelMode('walking');
          setPartnerState('holding_hands');
          setPlayerPos([motorPos[0] + 0.8, 0.06, motorPos[2]]);
          sfx.playChime();
        } else if (travelMode === 'walking') {
          // Mount closest vehicle
          if (isNearCar) {
            setTravelMode('car');
            setPlayerPos(carPos);
            sfx.playChime();
          } else if (isNearMotor) {
            setTravelMode('motor');
            setPlayerPos(motorPos);
            sfx.playChime();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyLandmark, activeModal, travelMode, isNearCar, isNearMotor, carPos, motorPos]);

  const handleStartAdventure = async () => {
    setWelcomeOpen(false);
    sfx.playChime();
    await bgm.play();
    // Launch cinematic opening tour
    setIsCinematicTour(true);
  };

  const handleOpenLandmark = (type: LandmarkType) => {
    setActiveModal(type);
  };

  const handleTeleportTo = (type: LandmarkType) => {
    const target = LANDMARKS.find((l) => l.id === type);
    if (target) {
      const newPos: [number, number, number] = [target.position[0], 0.06, target.position[2] + 3];
      setPlayerPos(newPos);
      if (travelMode === 'car') setCarPos(newPos);
      if (travelMode === 'motor') setMotorPos(newPos);
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
        setFireworksActive(true);
        setTimeout(() => {
          setActiveModal('treasure_reward');
        }, 500);
      }
      return updated;
    });
  };

  const handleCallMasJo = () => {
    setPartnerState('returning');
    sfx.playCallPartner();
  };

  const handleTriggerFireworks = () => {
    setFireworksActive(true);
    sfx.playChime();
    setTimeout(() => {
      setFireworksActive(false);
    }, 12000); // 12-second firework show
  };

  const handleChangeTravelMode = (mode: TravelMode) => {
    if (mode === 'walking') {
      if (travelMode === 'car') {
        setPlayerPos([carPos[0] + 1.2, 0.06, carPos[2]]);
      } else if (travelMode === 'motor') {
        setPlayerPos([motorPos[0] + 0.8, 0.06, motorPos[2]]);
      }
      setPartnerState('holding_hands');
    } else if (mode === 'car') {
      setPlayerPos(carPos);
    } else if (mode === 'motor') {
      setPlayerPos(motorPos);
    }
    setTravelMode(mode);
  };

  const handleJoystickMove = useCallback((dx: number, dy: number) => {
    setJoystickInput({ x: dx, y: dy });
  }, []);

  // Action Button on Mobile
  const actionConfig = useMemo<{ prompt: string; action: () => void } | null>(() => {
    if (nearbyLandmark) {
      return {
        prompt: `Buka ${nearbyLandmark.title}`,
        action: () => handleOpenLandmark(nearbyLandmark.id),
      };
    }
    if (travelMode === 'walking') {
      if (isNearCar) {
        return {
          prompt: 'Naik Mobil 🚗',
          action: () => handleChangeTravelMode('car'),
        };
      }
      if (isNearMotor) {
        return {
          prompt: 'Naik Motor 🛵',
          action: () => handleChangeTravelMode('motor'),
        };
      }
    }
    return null;
  }, [nearbyLandmark, travelMode, isNearCar, isNearMotor]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#FFEFEF]">
      {/* 3D Isometric Canvas with Dynamic Atmosphere & Entities */}
      <SceneCanvas
        playerPos={playerPos}
        onUpdatePlayerPos={setPlayerPos}
        carPos={carPos}
        onUpdateCarPos={setCarPos}
        motorPos={motorPos}
        onUpdateMotorPos={setMotorPos}
        travelMode={travelMode}
        partnerState={partnerState}
        onPartnerStateChange={setPartnerState}
        joystickInput={joystickInput}
        onOpenLandmark={handleOpenLandmark}
        timeOfDay={timeOfDay}
        shards={shards}
        onCollectShard={handleCollectShard}
        fireworksActive={fireworksActive}
        isCinematicTour={isCinematicTour}
        onCinematicTourEnd={() => setIsCinematicTour(false)}
      />

      {/* Floating HUD with Radar, Mode Switchers, Tour, and Controls */}
      <HUD
        nearbyLandmark={nearbyLandmark}
        onOpenLandmark={handleOpenLandmark}
        onTeleportTo={handleTeleportTo}
        onHorn={() => (travelMode === 'motor' ? sfx.playMotorHorn() : sfx.playHorn())}
        timeOfDay={timeOfDay}
        onToggleTimeOfDay={handleToggleTimeOfDay}
        shards={shards}
        playerPos={playerPos}
        carPos={carPos}
        motorPos={motorPos}
        travelMode={travelMode}
        onChangeTravelMode={handleChangeTravelMode}
        partnerState={partnerState}
        onChangePartnerState={setPartnerState}
        onCallMasJo={handleCallMasJo}
        isCinematicTour={isCinematicTour}
        onStartTour={() => setIsCinematicTour(true)}
        onSkipTour={() => setIsCinematicTour(false)}
        onTriggerFireworks={handleTriggerFireworks}
        fireworksActive={fireworksActive}
      />

      {/* Mobile Virtual Joystick & Contextual Action Button */}
      <VirtualJoystick
        onMove={handleJoystickMove}
        onAction={actionConfig?.action}
        actionPrompt={actionConfig?.prompt || null}
        onHorn={() => (travelMode === 'motor' ? sfx.playMotorHorn() : sfx.playHorn())}
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
        onBlown={() => handleTriggerFireworks()}
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
