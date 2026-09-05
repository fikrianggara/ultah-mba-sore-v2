import { LandmarkInfo } from '../types';

export const LANDMARK_POSITIONS: Record<string, [number, number, number]> = {
  CAKE: [0, 0.06, 0],           // Center of the heart island
  MAILBOX: [8, 0.06, -6],       // Right lobe of the heart
  JUKEBOX: [-8, 0.06, -6],      // Left lobe of the heart
  GALLERY: [7, 0.06, 7],        // South-East path
  BALLOONS_PARK: [-7, 0.06, 7], // South-West path
  WISHING_WELL: [0, 0.06, 12],  // Southern tip of the heart
  GIFT_BOX: [0, 0.06, -8],      // Northern cleft between lobes
};

export const LANDMARKS: LandmarkInfo[] = [
  {
    id: 'cake',
    title: 'Kue Ulang Tahun',
    subtitle: 'Make a wish & tiup lilinnya!',
    description: 'Kue bertingkat tiga spesial buat Dinda tercinta.',
    position: LANDMARK_POSITIONS.CAKE,
    color: '#FF69B4',
    iconName: 'Cake',
  },
  {
    id: 'mailbox',
    title: 'Kotak Surat Cinta',
    subtitle: 'Surat spesial dari Mas Jo',
    description: 'Ada amplop surat bertuliskan pesan cinta & doa terbaik untukmu.',
    position: LANDMARK_POSITIONS.MAILBOX,
    color: '#FFD700',
    iconName: 'Mail',
  },
  {
    id: 'jukebox',
    title: 'Vintage Vinyl Booth',
    subtitle: 'Pemutar Piringan Hitam Nostalgia',
    description: 'Dengarkan lagu Perfect dengan pemutar vinyl klasik yang memutar melodi cinta kita.',
    position: LANDMARK_POSITIONS.JUKEBOX,
    color: '#87CEEB',
    iconName: 'Disc',
  },
  {
    id: 'gallery',
    title: 'Taman Foto Kenangan',
    subtitle: 'Koleksi Polaroid Momen Kita',
    description: 'Kumpulan foto-foto menggemaskan, senyuman manis, dan momen berharga mba sore.',
    position: LANDMARK_POSITIONS.GALLERY,
    color: '#DDA0DD',
    iconName: 'Image',
  },
  {
    id: 'wishing_well',
    title: 'Air Mancur Harapan',
    subtitle: 'Lempar koin & raih doa spesial',
    description: 'Air mancur cinta di ujung pulau hati. Lempar koin emas untuk membuka harapan dan janji manis Mas Jo!',
    position: LANDMARK_POSITIONS.WISHING_WELL,
    color: '#48CAE4',
    iconName: 'Sparkles',
  },
  {
    id: 'gift_box',
    title: 'Kado Kejutan Ultah',
    subtitle: 'Buka kado rahasia dari Mas Jo!',
    description: 'Kotak kado raksasa dengan pita emas. Ketuk untuk membuka kado dan temukan kejutan lucu di dalamnya!',
    position: LANDMARK_POSITIONS.GIFT_BOX,
    color: '#FF758F',
    iconName: 'Gift',
  },
];

export const VEHICLE_CONFIG = {
  MAX_FORWARD_SPEED: 0.18,
  MAX_REVERSE_SPEED: 0.08,
  ACCELERATION: 0.009,
  REVERSE_ACCELERATION: 0.006,
  DECELERATION: 0.94,
  STEER_SPEED: 0.045,
  INTERACTION_DISTANCE: 4.5,
};

export const ISLAND_RADIUS = 28;
