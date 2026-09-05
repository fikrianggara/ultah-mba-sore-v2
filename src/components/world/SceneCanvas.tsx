import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { IslandTerrain } from './IslandTerrain';
import { PlayerVehicle } from './PlayerVehicle';
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
import { LandmarkType, TimeOfDay, TreasureShard } from '../../types';

interface CameraFollowProps {
  targetPosition: [number, number, number];
}

const CameraFollow: React.FC<CameraFollowProps> = ({ targetPosition }) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(...targetPosition));

  useFrame(() => {
    currentTarget.current.x = THREE.MathUtils.lerp(
      currentTarget.current.x,
      targetPosition[0],
      0.06
    );
    currentTarget.current.z = THREE.MathUtils.lerp(
      currentTarget.current.z,
      targetPosition[2],
      0.06
    );

    const isoOffset = 22;
    camera.position.x = currentTarget.current.x + isoOffset;
    camera.position.y = isoOffset + 5;
    camera.position.z = currentTarget.current.z + isoOffset;

    camera.lookAt(currentTarget.current.x, 0.70, currentTarget.current.z);
  });

  return null;
};

interface SceneCanvasProps {
  playerPos: [number, number, number];
  onUpdatePlayerPos: (pos: [number, number, number]) => void;
  joystickInput: { x: number; y: number };
  onOpenLandmark: (type: LandmarkType) => void;
  timeOfDay: TimeOfDay;
  shards: TreasureShard[];
  onCollectShard: (id: number) => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  playerPos,
  onUpdatePlayerPos,
  joystickInput,
  onOpenLandmark,
  timeOfDay,
  shards,
  onCollectShard,
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

        <CameraFollow targetPosition={playerPos} />

        {/* Dynamic Sky, Sun, Stars & Atmosphere Lighting */}
        <SkyAndAtmosphere timeOfDay={timeOfDay} />

        {/* Natural Organic Beach & Central Heart Lawn Terrain */}
        <IslandTerrain timeOfDay={timeOfDay} />

        {/* Driveable Player Vehicle with Chibi Mas Jo & Dinda */}
        <PlayerVehicle
          initialPosition={[0, 0.06, 5]}
          joystickInput={joystickInput}
          onPositionUpdate={onUpdatePlayerPos}
          isNight={isNight}
        />

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
