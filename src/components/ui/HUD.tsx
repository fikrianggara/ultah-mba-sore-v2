import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Mail,
  Disc,
  Image as ImageIcon,
  Cake,
  Compass,
  Coins,
  Gift,
  BookOpen,
  Sun,
  Sunset,
  Moon,
  Maximize2,
  Minimize2,
  Video,
  Flame,
  Heart,
  UserCheck,
  Fish,
  Anchor,
  MessageCircleHeart,
  Zap,
} from 'lucide-react';
import {
  LandmarkType,
  LandmarkInfo,
  TimeOfDay,
  TreasureShard,
  TravelMode,
  WalkingPartnerState,
  GraphicsQuality,
} from '../../types';
import { bgm, sfx } from '../../utils/audio';
import { TreasureRadar } from './TreasureRadar';

interface HUDProps {
  nearbyLandmark: LandmarkInfo | null;
  onOpenLandmark: (type: LandmarkType) => void;
  onTeleportTo?: (type: LandmarkType) => void;
  onHorn: () => void;
  timeOfDay: TimeOfDay;
  onToggleTimeOfDay: () => void;
  shards: TreasureShard[];
  playerPos: [number, number, number];
  carPos?: [number, number, number];
  motorPos?: [number, number, number];
  travelMode?: TravelMode;
  onChangeTravelMode?: (mode: TravelMode) => void;
  partnerState?: WalkingPartnerState;
  onChangePartnerState?: (state: WalkingPartnerState) => void;
  onCallMasJo?: () => void;
  isCinematicTour?: boolean;
  onStartTour?: () => void;
  onSkipTour?: () => void;
  onTriggerFireworks?: () => void;
  fireworksActive?: boolean;
  isSittingOnPier?: boolean;
  onToggleSittingPier?: () => void;
  onOpenFishing?: () => void;
  onOpenLoveModal?: () => void;
  graphicsQuality?: GraphicsQuality;
  onToggleGraphicsQuality?: () => void;
  isNearCat?: boolean;
  isNearDog?: boolean;
  onOpenPetModal?: (type: 'cat' | 'dog') => void;
}

export const HUD: React.FC<HUDProps> = ({
  nearbyLandmark,
  onOpenLandmark,
  onTeleportTo,
  onHorn,
  timeOfDay,
  onToggleTimeOfDay,
  shards,
  playerPos,
  carPos = [0, 0.06, 5],
  motorPos = [4.0, 0.06, 6.0],
  travelMode = 'car',
  onChangeTravelMode = () => {},
  partnerState = 'holding_hands',
  onChangePartnerState = () => {},
  onCallMasJo = () => {},
  isCinematicTour = false,
  onStartTour = () => {},
  onSkipTour = () => {},
  onTriggerFireworks = () => {},
  fireworksActive = false,
  isSittingOnPier = false,
  onToggleSittingPier = () => {},
  onOpenFishing = () => {},
  onOpenLoveModal = () => {},
  graphicsQuality = 'high',
  onToggleGraphicsQuality = () => {},
  isNearCat = false,
  isNearDog = false,
  onOpenPetModal = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(bgm.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControlsHelp, setShowControlsHelp] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    return bgm.subscribe((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleToggleAudio = () => {
    const nextState = bgm.toggle();
    setIsPlaying(nextState);
  };

  const handleToggleMute = () => {
    const nextMute = bgm.toggleMute();
    setIsMuted(nextMute);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Check proximity to Cake Plaza (Fireworks show)
  const distToCake = Math.hypot(playerPos[0], playerPos[2]);
  const isNearCake = distToCake < 6.5;

  // Check proximity to parked vehicles when on foot
  const distToCar = Math.hypot(playerPos[0] - carPos[0], playerPos[2] - carPos[2]);
  const isNearCar = travelMode === 'walking' && distToCar < 3.2;

  const distToMotor = Math.hypot(playerPos[0] - motorPos[0], playerPos[2] - motorPos[2]);
  const isNearMotor = travelMode === 'walking' && distToMotor < 3.2;

  // Check proximity to Romantic Pier Bench [0, 0.04, 25.7]
  const distToPierBench = Math.hypot(playerPos[0] - 0, playerPos[2] - 25.7);
  const isNearPierBench = travelMode === 'walking' && distToPierBench < 3.0;

  // Check if player is on the Pier Boardwalk (outside island extending into sea)
  const isOnPier = playerPos[2] >= 18.2 && playerPos[2] <= 27.5 && Math.abs(playerPos[0]) <= 2.2;

  return (
    <>
      {/* Top Header Bar */}
      <div className="fixed top-4 inset-x-3 sm:inset-x-6 z-40 pointer-events-none flex flex-wrap items-center justify-between gap-2">
        {/* Left: Title pill & Treasure Radar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="glass-pill px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-md">
            <span className="text-xl animate-bounce">🎂</span>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight leading-none">
                Sore Island
              </h1>
              <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
                Pulau Cinta Dinda 💖
              </p>
            </div>
          </div>

          {/* Treasure Radar Compass */}
          <TreasureRadar shards={shards} playerPos={playerPos} />
        </div>

        {/* Right: Atmosphere Switcher, Music status, Horn, Fullscreen, Tour, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Tour Camera Button */}
          <button
            onClick={onStartTour}
            className="glass-pill px-2.5 py-1.5 rounded-2xl flex items-center gap-1 text-xs font-semibold text-gray-700 hover:bg-white transition-colors shadow-sm"
            title="Mulai Tur Sinematik Keliling Pulau"
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Tur</span>
          </button>

          {/* Atmosphere Mode Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTimeOfDay}
            className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-white transition-colors"
            title="Ubah Suasana (Siang / Senja / Malam)"
          >
            {timeOfDay === 'day' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline">Siang</span>
              </>
            ) : timeOfDay === 'sunset' ? (
              <>
                <Sunset className="w-4 h-4 text-orange-500" />
                <span className="hidden md:inline">Senja (Sore)</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Malam</span>
              </>
            )}
          </motion.button>

          {/* Graphics Quality Switcher (Tinggi / Hemat) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleGraphicsQuality}
            className="glass-pill px-2.5 sm:px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-white transition-colors"
            title="Ubah Kualitas Grafik (Tinggi / Hemat FPS)"
          >
            <Zap
              className={`w-3.5 h-3.5 ${
                graphicsQuality === 'high' ? 'text-amber-500 fill-amber-400' : 'text-emerald-500 fill-emerald-400'
              }`}
            />
            <span className="hidden sm:inline">
              {graphicsQuality === 'high' ? 'Grafik: Tinggi' : 'Grafik: Hemat'}
            </span>
            <span className="sm:hidden">
              {graphicsQuality === 'high' ? 'Tinggi' : 'Hemat'}
            </span>
          </motion.button>

          {/* Music status pill */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleAudio}
            className={`glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors ${
              isPlaying ? 'text-rose-600' : 'text-gray-500'
            }`}
          >
            <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin-slow' : ''}`} />
            <span className="hidden lg:inline">
              {isPlaying ? 'Perfect' : 'Mati'}
            </span>
          </motion.button>

          {/* Mute button */}
          <button
            onClick={handleToggleMute}
            className="w-8 h-8 rounded-2xl glass-pill flex items-center justify-center text-gray-700 hover:text-rose-600 transition-colors shadow-sm"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Horn button */}
          <button
            onClick={onHorn}
            className="px-2.5 py-1.5 rounded-2xl glass-pill flex items-center gap-1 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
            title="Klakson"
          >
            <span>📯</span>
            <span className="hidden sm:inline">Tin!</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="w-8 h-8 rounded-2xl glass-pill flex items-center justify-center text-gray-700 hover:text-rose-600 transition-colors shadow-sm"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowControlsHelp(true)}
            className="w-8 h-8 rounded-2xl glass-pill flex items-center justify-center text-gray-700 hover:text-rose-600 transition-colors shadow-sm"
            title="Petunjuk Kendali"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cinematic Tour Overlay Banner */}
      <AnimatePresence>
        {isCinematicTour && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 inset-x-4 z-50 pointer-events-auto flex justify-center"
          >
            <div className="glass-panel px-6 py-2.5 rounded-2xl border border-pink-300 shadow-2xl flex items-center gap-4">
              <span className="text-xs sm:text-sm font-bold text-rose-700 flex items-center gap-2">
                <Video className="w-4 h-4 animate-pulse" />
                <span>Menikmati Keindahan Pulau Cinta Dinda...</span>
              </span>
              <button
                onClick={onSkipTour}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
              >
                Lewati Tour ⏩
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proximity Interaction Prompt Banner for Landmarks */}
      <AnimatePresence>
        {nearbyLandmark && !isCinematicTour && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 pointer-events-auto flex justify-center"
          >
            <div
              onClick={() => onOpenLandmark(nearbyLandmark.id)}
              className="glass-panel px-5 py-3 rounded-2xl border-2 border-rose-300 shadow-xl flex items-center gap-3 cursor-pointer hover:bg-white/95 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                  <span>{nearbyLandmark.title}</span>
                  <span className="hidden sm:inline text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded font-mono">
                    Tekan [E]
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{nearbyLandmark.subtitle}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Controls Bar (Dermaga, Mas Jo Love Modal, Kendaraan, Gandengan, Kembang Api) */}
      <div className="fixed bottom-[8.5rem] sm:bottom-20 left-1/2 -translate-x-1/2 z-35 pointer-events-auto flex flex-wrap items-center justify-center gap-2 px-3 max-w-[95vw]">
        {/* 1. Romantic Pier Sitting & Fishing Actions */}
        {isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSittingPier}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce"
          >
            <span>🚶‍♀️</span>
            <span>Berdiri Kembali [E]</span>
          </motion.button>
        )}

        {!isSittingOnPier && isNearPierBench && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSittingPier}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-sky-400 bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce"
          >
            <Anchor className="w-4 h-4" />
            <span>Duduk Berdua di Dermaga 🌊 [E]</span>
          </motion.button>
        )}

        {(isOnPier || isSittingOnPier) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenFishing}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-pulse"
          >
            <Fish className="w-4 h-4" />
            <span>Mulai Memancing 🎣</span>
          </motion.button>
        )}

        {/* 2. Komponen Cinta (Interaksi dengan Mas Jo) */}
        {travelMode === 'walking' && !isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenLoveModal}
            className="glass-pill px-3.5 py-2 rounded-2xl border border-rose-300 bg-white/90 hover:bg-white shadow-md flex items-center gap-1.5 text-xs font-bold text-rose-600"
            title="Bicara atau dengarkan bisikan cinta Mas Jo"
          >
            <MessageCircleHeart className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Ajak Bicara Mas Jo ❤️</span>
          </motion.button>
        )}

        {/* 2b. Interaksi Kucing (Si Meong) */}
        {isNearCat && !isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenPetModal('cat')}
            className="glass-pill px-3.5 py-2 rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center gap-1.5 text-xs font-bold animate-bounce"
            title="Elus dan ajak main Si Meong"
          >
            <span>🐱</span>
            <span>Elus Si Meong [E]</span>
          </motion.button>
        )}

        {/* 2c. Interaksi Anjing (Si Husky Ceria) */}
        {isNearDog && !isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenPetModal('dog')}
            className="glass-pill px-3.5 py-2 rounded-2xl border-2 border-indigo-300 bg-gradient-to-r from-slate-700 to-indigo-600 text-white shadow-lg flex items-center gap-1.5 text-xs font-bold animate-bounce"
            title="Ajak main Si Husky"
          >
            <span>🐶</span>
            <span>Ajak Main Si Husky [E]</span>
          </motion.button>
        )}

        {/* 3. Dismount / Mount Actions */}
        {travelMode === 'car' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChangeTravelMode('walking');
              sfx.playChime();
            }}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-rose-300 shadow-lg flex items-center gap-2 text-xs font-bold text-rose-700 bg-white/90 hover:bg-white"
          >
            <span>🚶‍♀️</span>
            <span>Turun dari Mobil [F]</span>
          </motion.button>
        )}

        {travelMode === 'motor' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChangeTravelMode('walking');
              sfx.playChime();
            }}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-emerald-300 shadow-lg flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white/90 hover:bg-white"
          >
            <span>🚶‍♀️</span>
            <span>Turun dari Motor [F]</span>
          </motion.button>
        )}

        {travelMode === 'walking' && isNearCar && !isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChangeTravelMode('car');
              sfx.playChime();
            }}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce"
          >
            <span>🚗</span>
            <span>Naik Mobil [F]</span>
          </motion.button>
        )}

        {travelMode === 'walking' && isNearMotor && !isSittingOnPier && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChangeTravelMode('motor');
              sfx.playChime();
            }}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce"
          >
            <span>🛵</span>
            <span>Naik Motor Berboncengan [F]</span>
          </motion.button>
        )}

        {/* 4. Walking Hand-holding / Roaming controls */}
        {travelMode === 'walking' && !isSittingOnPier && partnerState === 'holding_hands' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChangePartnerState('roaming');
              sfx.playPop();
            }}
            className="glass-pill px-3.5 py-2 rounded-2xl border border-pink-200 bg-white/80 hover:bg-white shadow-md flex items-center gap-1.5 text-xs font-bold text-gray-700"
            title="Lepas gandengan agar Mas Jo bisa jalan-jalan santai"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Lepas Gandengan 🍃</span>
          </motion.button>
        )}

        {travelMode === 'walking' && !isSittingOnPier && partnerState === 'roaming' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCallMasJo}
            className="glass-pill px-4 py-2 rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold animate-pulse"
          >
            <UserCheck className="w-4 h-4" />
            <span>Panggil Mas Jo ❤️</span>
          </motion.button>
        )}

        {travelMode === 'walking' && !isSittingOnPier && partnerState === 'returning' && (
          <div className="glass-pill px-3.5 py-2 rounded-2xl border border-rose-300 bg-rose-50 text-rose-600 shadow-sm flex items-center gap-2 text-xs font-bold animate-pulse">
            <span>🏃‍♂️</span>
            <span>Mas Jo sedang berlari ke kamu...</span>
          </div>
        )}

        {/* 5. Fireworks celebration trigger */}
        {(isNearCake || fireworksActive) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTriggerFireworks}
            className={`glass-pill px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-bold transition-colors ${
              fireworksActive
                ? 'bg-amber-400 text-amber-900 border-2 border-white animate-bounce'
                : 'bg-white/90 border border-amber-300 text-amber-700 hover:bg-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{fireworksActive ? 'Kembang Api Aktif! 🎆' : 'Nyalakan Kembang Api 🎆'}</span>
          </motion.button>
        )}
      </div>

      {/* Quick Landmark Navigation Dock (Bottom Center) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
        <div className="glass-panel px-3 py-1.5 sm:py-2 rounded-2xl flex items-center gap-1 sm:gap-2 shadow-xl border border-pink-200">
          {[
            { id: 'cake' as LandmarkType, label: 'Kue', icon: Cake, color: 'text-pink-500' },
            { id: 'mailbox' as LandmarkType, label: 'Surat', icon: Mail, color: 'text-amber-500' },
            { id: 'jukebox' as LandmarkType, label: 'Musik', icon: Disc, color: 'text-sky-500' },
            { id: 'gallery' as LandmarkType, label: 'Galeri', icon: ImageIcon, color: 'text-purple-500' },
            { id: 'wishing_well' as LandmarkType, label: 'Harapan', icon: Coins, color: 'text-emerald-500' },
            { id: 'gift_box' as LandmarkType, label: 'Kado', icon: Gift, color: 'text-rose-500' },
            { id: 'scrapbook' as LandmarkType, label: 'Buku', icon: BookOpen, color: 'text-amber-700' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onOpenLandmark(item.id);
                  if (onTeleportTo) onTeleportTo(item.id);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/80 transition-all flex flex-col sm:flex-row items-center gap-1 text-[11px] font-bold text-gray-700 active:scale-95 whitespace-nowrap"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Help Modal */}
      <AnimatePresence>
        {showControlsHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowControlsHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Petunjuk Kendali</h3>
              <div className="space-y-2 text-xs text-gray-600 text-left bg-pink-50/50 p-4 rounded-2xl mb-4">
                <p><b>W / Panah Atas:</b> Maju / Jalan ke Depan</p>
                <p><b>S / Panah Bawah:</b> Mundur</p>
                <p><b>A / D / Kiri / Kanan:</b> Belok</p>
                <p><b>F:</b> Naik / Turun Kendaraan (Mobil / Motor)</p>
                <p><b>E:</b> Buka Landmark / Duduk di Dermaga</p>
                <p><b>Spasi:</b> Bunyikan Klakson 📯</p>
                <p><b>Tombol 🌅 Senja:</b> Mode default Sore romantis</p>
                <p><b>🎣 Memancing:</b> Berjalan ke ujung dermaga kayu untuk memancing</p>
                <p><b>❤️ Komponen Cinta:</b> Tekan tombol "Ajak Bicara Mas Jo" untuk mendengar bisikan manis</p>
              </div>
              <button
                onClick={() => setShowControlsHelp(false)}
                className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-semibold text-xs shadow hover:bg-rose-600 transition-colors"
              >
                Mengerti
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
