import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Trophy, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../../utils/audio';

interface TreasureRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScrapbook: () => void;
}

export const TreasureRewardModal: React.FC<TreasureRewardModalProps> = ({
  isOpen,
  onClose,
  onOpenScrapbook,
}) => {
  const triggerFireworks = () => {
    sfx.playChime();
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#87CEEB', '#FF1493', '#00F5D4'],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F8] to-[#FFE8EE] rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy / Gem Badge */}
            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300 opacity-60"
              />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-xl shadow-amber-300/50">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 text-yellow-300 animate-pulse">
                <Sparkles className="w-6 h-6 fill-yellow-300" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
              <span>5/5 Kepingan Cinta Lengkap!</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 font-sans">
              Master of Memories! 🏆
            </h3>

            <div className="bg-white/90 rounded-2xl p-4 border border-pink-200 text-left text-xs sm:text-sm text-gray-700 leading-relaxed shadow-sm mt-3 space-y-2">
              <p>
                "Hebat banget sayang! Kamu berhasil menemukan semua 5 kepingan cinta yang tersembunyi di seluruh penjuru pulau!"
              </p>
              <p className="text-rose-600 font-medium">
                "Setiap kepingan ini adalah saksi dari tawa, cerita, dan janji Mas Jo untuk selalu menjaga dan menyayangimu di hari ini dan seterusnya. Happy birthday my special one!" ❤️
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={triggerFireworks}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-400/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Luncurkan Kembang Api Kemenangan 🎆</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenScrapbook();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-pink-200 text-rose-600 font-semibold text-xs hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Buka Buku Kenangan (Scrapbook) 📖</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
