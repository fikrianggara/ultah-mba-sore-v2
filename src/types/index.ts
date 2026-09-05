export type LandmarkType =
  | 'cake'
  | 'mailbox'
  | 'jukebox'
  | 'gallery'
  | 'balloons'
  | 'wishing_well'
  | 'gift_box'
  | 'scrapbook';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface LandmarkInfo {
  id: LandmarkType;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  color: string;
  iconName: string;
}

export interface PhotoItem {
  id: string;
  filename: string;
  title: string;
  caption: string;
  date?: string;
  tag: 'moment' | 'cute' | 'sweet' | 'special';
}

export interface VehicleState {
  position: [number, number, number];
  rotation: number;
  speed: number;
  isMoving: boolean;
  honking: boolean;
}

export interface ModalState {
  activeModal:
    | 'letter'
    | 'vinyl'
    | 'gallery'
    | 'cake'
    | 'wishing_well'
    | 'gift_box'
    | 'scrapbook'
    | 'treasure_reward'
    | 'help'
    | null;
  selectedPhoto?: PhotoItem | null;
}

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

export interface TreasureShard {
  id: number;
  title: string;
  hint: string;
  position: [number, number, number];
  isCollected: boolean;
  color: string;
}
