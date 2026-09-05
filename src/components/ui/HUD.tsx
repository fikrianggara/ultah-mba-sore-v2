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
} from 'lucide-react';
import { LandmarkType, LandmarkInfo, TimeOfDay, TreasureShard } from '../../types';
import { bgm } from '../../utils/audio';
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
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(bgm.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControlsHelp, setShowControlsHelp] = useState<boolean>(false);

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

        {/* Right: Atmosphere Switcher, Music status, Horn, Help */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
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
                <span className="hidden md:inline">Senja</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden md:inline">Malam</span>
              </>
            )}
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
            title="Klakson Mobil"
          >
            <span>📯</span>
            <span className="hidden sm:inline">Tin!</span>
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

      {/* Proximity Interaction Prompt Banner */}
      <AnimatePresence>
        {nearbyLandmark && (
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

      {/* Quick Landmark Navigation Dock (Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar">
        <div className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-1 sm:gap-2 shadow-xl border border-pink-200">
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
                <p><b>W / Panah Atas:</b> Maju</p>
                <p><b>S / Panah Bawah:</b> Mundur</p>
                <p><b>A / D / Kiri / Kanan:</b> Belok</p>
                <p><b>Spasi:</b> Bunyikan Klakson 📯</p>
                <p><b>E:</b> Buka Landmark terdekat</p>
                <p><b>Tombol ☀️/🌅/🌙:</b> Ubah suasana Siang, Senja, atau Malam</p>
                <p><b>💎 Radar:</b> Menunjukkan arah kepingan cinta terdekat</p>
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
