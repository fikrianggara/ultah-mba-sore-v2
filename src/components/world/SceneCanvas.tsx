import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { IslandTerrain } from './IslandTerrain';
import { PlayerVehicle } from './PlayerVehicle';
import { PlayerMotorcycle } from './PlayerMotorcycle';
import { WalkingCharacters } from './WalkingCharacters';
import { FireworksDisplay } from './FireworksDisplay';
import { CinematicCamera } from './CinematicCamera';
import { RomanticPier } from './RomanticPier';
import { StreetLampsAndFauna } from './StreetLampsAndFauna';
import { IslandPets } from './IslandPets';
import { BirthdayCakeObject } from './BirthdayCakeObject';
import { MailboxObject } from './MailboxObject';
import { JukeboxObject } from './JukeboxObject';
import { GalleryBillboardObject } from './GalleryBillboardObject';
import { WishingWellObject } from './WishingWellObject';
import { GiftBoxObject } from './GiftBoxObject';
import { BalloonsField } from './BalloonsField';
import { SkyAndAtmosphere } from './SkyAndAtmosphere';
import { TreasureHuntGems } from './TreasureHuntGems';
import { LANDMARK_POSITIONS } from '../../utils/constants';
import { LandmarkType, TimeOfDay, TreasureShard, TravelMode, WalkingPartnerState, GraphicsQuality } from '../../types';

interface SceneCanvasProps {
  playerPos: [number, number, number];
  onUpdatePlayerPos: (pos: [number, number, number]) => void;
  carPos: [number, number, number];
  onUpdateCarPos: (pos: [number, number, number]) => void;
  motorPos: [number, number, number];
  onUpdateMotorPos: (pos: [number, number, number]) => void;
  travelMode: TravelMode;
  partnerState: WalkingPartnerState;
  onPartnerStateChange: (state: WalkingPartnerState) => void;
  joystickInput: { x: number; y: number };
  onOpenLandmark: (type: LandmarkType) => void;
  timeOfDay: TimeOfDay;
  shards: TreasureShard[];
  onCollectShard: (id: number) => void;
  fireworksActive: boolean;
  isCinematicTour: boolean;
  onCinematicTourEnd: () => void;
  isSittingOnPier: boolean;
  graphicsQuality?: GraphicsQuality;
  onUpdateCatPos?: (pos: [number, number, number]) => void;
  onUpdateDogPos?: (pos: [number, number, number]) => void;
  onClickCat?: () => void;
  onClickDog?: () => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  playerPos,
  onUpdatePlayerPos,
  carPos,
  onUpdateCarPos,
  motorPos,
  onUpdateMotorPos,
  travelMode,
  partnerState,
  onPartnerStateChange,
  joystickInput,
  onOpenLandmark,
  timeOfDay,
  shards,
  onCollectShard,
  fireworksActive,
  isCinematicTour,
  onCinematicTourEnd,
  isSittingOnPier,
  graphicsQuality = 'high',
  onUpdateCatPos,
  onUpdateDogPos,
  onClickCat,
  onClickDog,
}) => {
  const isNight = timeOfDay === 'night';

  return (
    <div
      id="three-canvas-container"
      className="w-full h-full absolute inset-0 transition-colors duration-1000"
      style={{
        backgroundColor:
          timeOfDay === 'night'
            ? '#0B0914'
            : timeOfDay === 'sunset'
            ? '#FF9E9E'
            : '#B4E4FF',
      }}
    >
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <OrthographicCamera
          makeDefault
          zoom={38}
          position={[25, 25, 25]}
          near={-50}
          far={150}
        />

        {/* Dynamic / Tour Camera */}
        <CinematicCamera
          isTouring={isCinematicTour}
          onTourEnd={onCinematicTourEnd}
          targetPosition={playerPos}
        />

        {/* Dynamic Sky, Sun, Stars & Atmosphere Lighting */}
        <SkyAndAtmosphere timeOfDay={timeOfDay} />

        {/* Natural Organic Beach & Central Heart Lawn Terrain */}
        <IslandTerrain timeOfDay={timeOfDay} />

        {/* Romantic Street Lamps along the Heart Road & Fauna (Butterflies/Fireflies) */}
        <StreetLampsAndFauna timeOfDay={timeOfDay} graphicsQuality={graphicsQuality} />

        {/* Free-roaming Island Pets (Cat & Dog) */}
        <IslandPets
          playerPos={playerPos}
          onUpdateCatPos={onUpdateCatPos}
          onUpdateDogPos={onUpdateDogPos}
          onClickCat={onClickCat || (() => {})}
          onClickDog={onClickDog || (() => {})}
        />

        {/* Romantic Wooden Boardwalk Pier extending into sea with sitting bench */}
        <RomanticPier isSitting={isSittingOnPier} isNight={isNight} />

        {/* 1. Convertible Car (Active when travelMode === 'car') */}
        <PlayerVehicle
          initialPosition={carPos}
          joystickInput={joystickInput}
          onPositionUpdate={(pos) => {
            onUpdateCarPos(pos);
            if (travelMode === 'car') onUpdatePlayerPos(pos);
          }}
          isNight={isNight}
          active={travelMode === 'car'}
        />

        {/* 2. Retro Vespa Motorcycle (Active when travelMode === 'motor') */}
        <PlayerMotorcycle
          initialPosition={motorPos}
          joystickInput={joystickInput}
          onPositionUpdate={(pos) => {
            onUpdateMotorPos(pos);
            if (travelMode === 'motor') onUpdatePlayerPos(pos);
          }}
          isNight={isNight}
          active={travelMode === 'motor'}
        />

        {/* 3. On-Foot Walking Characters (Active when travelMode === 'walking' and not seated on bench) */}
        <WalkingCharacters
          initialPosition={playerPos}
          joystickInput={joystickInput}
          onPositionUpdate={onUpdatePlayerPos}
          partnerState={partnerState}
          onPartnerStateChange={onPartnerStateChange}
          active={travelMode === 'walking' && !isSittingOnPier}
        />

        {/* 4. Ultra-Grand Fireworks Display Celebration */}
        <FireworksDisplay active={fireworksActive} />

        {/* 3D Interactive Landmarks */}
        <BirthdayCakeObject
          position={LANDMARK_POSITIONS.CAKE}
          onClick={() => onOpenLandmark('cake')}
        />
        <MailboxObject
          position={LANDMARK_POSITIONS.MAILBOX}
          onClick={() => onOpenLandmark('mailbox')}
        />
        <JukeboxObject
          position={LANDMARK_POSITIONS.JUKEBOX}
          onClick={() => onOpenLandmark('jukebox')}
        />
        <GalleryBillboardObject
          position={LANDMARK_POSITIONS.GALLERY}
          onClick={() => onOpenLandmark('gallery')}
        />
        <WishingWellObject
          position={LANDMARK_POSITIONS.WISHING_WELL}
          onClick={() => onOpenLandmark('wishing_well')}
        />
        <GiftBoxObject
          position={LANDMARK_POSITIONS.GIFT_BOX}
          onClick={() => onOpenLandmark('gift_box')}
        />

        {/* Interactive Floating Balloons */}
        <BalloonsField playerPos={playerPos} />

        {/* 5 Hidden Memory Gems for Treasure Hunt */}
        <TreasureHuntGems
          shards={shards}
          playerPos={playerPos}
          onCollectShard={onCollectShard}
        />
      </Canvas>
    </div>
  );
};
