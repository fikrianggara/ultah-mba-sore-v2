import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wind, RotateCcw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../../utils/audio';

interface CandleBlowGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandleBlowGame: React.FC<CandleBlowGameProps> = ({ isOpen, onClose }) => {
  const [candles, setCandles] = useState<boolean[]>([true, true, true]);

  const activeCandlesCount = candles.filter(Boolean).length;

  const triggerConfetti = () => {
    sfx.playChime();

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FF69B4', '#FFD700', '#FF1493'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#87CEEB', '#FFE4E1', '#FFF3B0'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const blowCandle = (index: number) => {
    if (!candles[index]) return;
    sfx.playBlow();

    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);

    if (nextCandles.every((c) => !c)) {
      setTimeout(() => {
        triggerConfetti();
      }, 300);
    }
  };

  const blowAllCandles = () => {
    sfx.playBlow();
    setCandles([false, false, false]);
    setTimeout(() => {
      triggerConfetti();
    }, 300);
  };

  const resetCandles = () => {
    setCandles([true, true, true]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-gradient-to-b from-[#FFFDF9] to-[#FFF0F4] rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-100/80 px-3 py-1 rounded-full">
                Make A Wish 🎂
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2 font-sans">
                Tiup Lilin Ulang Tahun
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {activeCandlesCount > 0
                  ? `Sisa ${activeCandlesCount} lilin menyala. Ketuk api lilin atau tekan tombol tiup!`
                  : 'Semua lilin telah ditiup! Harapanmu akan terkabul ✨'}
              </p>
            </div>

            {/* Illustrated Interactive Birthday Cake with 3 Candles */}
            <div className="relative w-64 h-56 mx-auto my-2 flex flex-col items-center justify-end">
              {/* Candles Row */}
              <div className="flex justify-center gap-10 absolute top-2 z-10">
                {candles.map((isLit, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => blowCandle(idx)}
                  >
                    {/* Flame */}
                    <div className="h-10 flex items-center justify-center">
                      <AnimatePresence>
                        {isLit ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [1, 1.15, 0.95, 1.1],
                              rotate: [-2, 3, -1, 2],
                            }}
                            exit={{ scale: 0, opacity: 0, y: -10 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6 + idx * 0.15,
                            }}
                            className="w-5 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full shadow-[0_0_15px_rgba(255,165,0,0.8)] cursor-pointer"
                          />
                        ) : (
                          /* Extinguished Smoke puff */
                          <motion.div
                            initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -20, scale: 1.5 }}
                            transition={{ duration: 0.8 }}
                            className="text-xs text-gray-400 select-none"
                          >
                            💨
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Candle stick */}
                    <div
                      className={`w-3.5 h-12 rounded-t-sm shadow-sm transition-transform ${
                        idx === 0
                          ? 'bg-gradient-to-b from-pink-400 to-rose-400'
                          : idx === 1
                          ? 'bg-gradient-to-b from-sky-400 to-blue-400'
                          : 'bg-gradient-to-b from-amber-300 to-yellow-400'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Cake Top Tier */}
              <div className="w-36 h-14 bg-gradient-to-r from-pink-100 via-white to-pink-100 rounded-t-2xl border-2 border-pink-200 shadow-md relative z-0 flex items-center justify-center">
                <div className="flex gap-2">
                  <span className="text-xs">🍓</span>
                  <span className="text-xs">🍒</span>
                  <span className="text-xs">🍓</span>
                </div>
              </div>

              {/* Cake Bottom Tier */}
              <div className="w-52 h-20 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-t-3xl border-2 border-pink-300 shadow-lg relative flex items-center justify-center">
                <span className="text-rose-600 font-handwritten text-2xl font-bold">
                  HBD Dinda 💖
                </span>
              </div>

              {/* Cake Plate */}
              <div className="w-60 h-4 bg-gray-100 rounded-full border border-gray-300 shadow-md" />
            </div>

            {/* Controls / Celebration message */}
            <div className="mt-6">
              {activeCandlesCount > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={blowAllCandles}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-400/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2"
                >
                  <Wind className="w-4 h-4 animate-pulse" />
                  <span>Tiup Semua Lilin Sekaligus! 🌬️</span>
                </motion.button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/90 border border-pink-200 shadow-sm">
                    <p className="text-rose-600 font-bold text-base flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
                      <span>Happy Birthday, Mba Sore Tercinta!</span>
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Semoga semua harapan, mimpi, dan kebahagiaan selalu menyertaimu di setiap langkah.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={resetCandles}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-pink-200 text-gray-700 text-xs font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Nyalakan Lilin Lagi</span>
                    </button>
                    <button
                      onClick={triggerConfetti}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sebar Confetti 🎉</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
