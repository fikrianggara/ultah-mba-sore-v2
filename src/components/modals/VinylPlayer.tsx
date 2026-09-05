import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { bgm } from '../../utils/audio';

interface VinylPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(bgm.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(263); // ~4m 23s for Perfect

  useEffect(() => {
    const unsub = bgm.subscribe((playing) => {
      setIsPlaying(playing);
    });

    const audioElement = bgm.getAudioElement();
    if (audioElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);
        if (audioElement.duration) {
          setDuration(audioElement.duration);
        }
      };
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        unsub();
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
    return unsub;
  }, []);

  const handleTogglePlay = () => {
    const nextState = bgm.toggle();
    setIsPlaying(nextState);
  };

  const handleToggleMute = () => {
    const nextMuted = bgm.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    bgm.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    const audio = bgm.getAudioElement();
    if (audio) {
      audio.currentTime = val;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-lg bg-gradient-to-b from-[#2D2A32] to-[#1E1C22] rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-500/20 text-white relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
                <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-rose-100">Pemutar Piringan Hitam</h3>
                <p className="text-xs text-rose-300/70">Lagu Nostalgia Spesial Ultah Dinda</p>
              </div>
            </div>

            {/* Turntable Platter & Vinyl Record */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-[#1A1820] rounded-2xl p-4 shadow-inner border border-white/5 flex items-center justify-center mb-6">
              {/* Spinning Vinyl */}
              <div
                className={`relative w-full h-full rounded-full vinyl-grooves flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                {/* Center Label */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 p-1 flex flex-col items-center justify-center text-center shadow-lg border-2 border-white/30">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">PERFECT</span>
                  <span className="text-[8px] text-pink-100 font-medium">Ed Sheeran</span>
                  <div className="w-3 h-3 rounded-full bg-[#1A1820] mt-1 border border-white/40" />
                </div>
              </div>

              {/* Tonearm graphic */}
              <div
                className="absolute top-2 right-4 w-20 h-28 pointer-events-none transition-transform duration-700 origin-top-right"
                style={{
                  transform: isPlaying ? 'rotate(24deg)' : 'rotate(0deg)',
                }}
              >
                {/* Tonearm base pivot */}
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-neutral-600 border border-neutral-400 shadow-md" />
                {/* Arm rod */}
                <div className="absolute top-3 right-3 w-1 h-20 bg-gradient-to-b from-neutral-300 to-neutral-400 origin-top rotate-[-12deg] rounded-full shadow" />
                {/* Needle cartridge */}
                <div className="absolute bottom-6 left-6 w-3 h-5 bg-rose-500 rounded-sm shadow-sm rotate-[-12deg]" />
              </div>

              {/* Musical notes animation when playing */}
              {isPlaying && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <span className="absolute bottom-6 left-6 text-xl text-pink-400 animate-bounce">🎵</span>
                  <span className="absolute top-8 left-10 text-lg text-rose-300 animate-pulse">🎶</span>
                  <span className="absolute top-10 right-14 text-xl text-yellow-300 animate-bounce delay-150">✨</span>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white tracking-wide">Perfect</h4>
              <p className="text-xs text-rose-400 font-medium mt-0.5">Ed Sheeran &bull; Dedicated to Mba Sore</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1 mb-6">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between px-4">
              {/* Mute Button */}
              <button
                onClick={handleToggleMute}
                className="text-neutral-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 w-24">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* Play / Pause Primary Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 hover:shadow-rose-500/60 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </motion.button>

              {/* Cute lyric / mood button */}
              <div className="w-20 text-right">
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 font-medium bg-rose-500/20 px-2 py-1 rounded-full border border-rose-500/30">
                  <Music className="w-3 h-3" />
                  <span>Romantic</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
