import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Coins, CheckCircle2 } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface WishingWellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WISHES = [
  {
    num: 1,
    title: 'Kesehatan & Perlindungan 🌿',
    text: 'Semoga mba sore selalu diberikan kesehatan raga dan ketenangan jiwa, selalu dilindungi Allah kemanapun melangkah.',
  },
  {
    num: 2,
    title: 'Kelancaran Segala Impian 🌟',
    text: 'Semoga semua cita-cita besar dan target yang kamu susun tercapai dengan mulus dan membanggakan!',
  },
  {
    num: 3,
    title: 'Cinta yang Selalu Menguatkan 💕',
    text: 'Semoga hubungan kita selalu hangat, saling menguatkan di kala capek, dan dipenuhi canda tawa tanpa henti.',
  },
  {
    num: 4,
    title: 'Senyuman Favoritku ☀️',
    text: 'Tetap jadi Dinda yang selalu ceria, rendah hati, penyayang keluarga, dan andalan tungkal zityy!',
  },
  {
    num: 5,
    title: 'Janji Tulus Mas Jo ❤️',
    text: 'Mas Jo berjanji akan selalu ada mendengarkan ceritamu, mendukung langkahmu, dan mencintaimu di setiap musim hidup.',
  },
];

export const WishingWellModal: React.FC<WishingWellModalProps> = ({ isOpen, onClose }) => {
  const [unlockedCount, setUnlockedCount] = useState<number>(1);
  const [isTossing, setIsTossing] = useState<boolean>(false);

  const tossCoin = () => {
    if (isTossing || unlockedCount >= WISHES.length) return;
    setIsTossing(true);
    sfx.playChime();

    setTimeout(() => {
      setUnlockedCount((prev) => Math.min(WISHES.length, prev + 1));
      setIsTossing(false);
    }, 700);
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
            className="w-full max-w-lg bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE] rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-200 text-gray-800 relative overflow-hidden"
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
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Coins className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Air Mancur Harapan</h3>
              <p className="text-xs text-sky-700 font-medium mt-0.5">
                Lempar koin emas untuk membuka doa & janji spesial ({unlockedCount}/{WISHES.length})
              </p>
            </div>

            {/* Wishing Well Coin Throw Area */}
            <div className="bg-white/80 rounded-2xl p-4 border border-sky-100 shadow-sm mb-5 text-center relative overflow-hidden">
              <AnimatePresence>
                {isTossing && (
                  <motion.div
                    initial={{ y: -40, opacity: 1, scale: 1.5, rotate: 0 }}
                    animate={{ y: 20, opacity: 0, scale: 0.5, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-x-0 top-6 mx-auto text-4xl pointer-events-none"
                  >
                    🪙
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-gray-600 mb-3">
                {unlockedCount < WISHES.length
                  ? 'Ketuk tombol di bawah untuk melempar koin ke dalam air mancur:'
                  : '✨ Semua doa dan harapan telah tercurah di air mancur ini! ✨'}
              </p>

              {unlockedCount < WISHES.length ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={tossCoin}
                  disabled={isTossing}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold text-xs shadow-md shadow-amber-300/40 hover:shadow-amber-300/60 transition-all inline-flex items-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>{isTossing ? 'Koin Terlempar...' : 'Lempar Koin Emas 🪙'}</span>
                </motion.button>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semua Harapan Terbuka Sempurna</span>
                </div>
              )}
            </div>

            {/* List of Unlocked Wishes */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {WISHES.slice(0, unlockedCount).map((wish) => (
                <motion.div
                  key={wish.num}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-white shadow-sm border border-sky-100 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {wish.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <span>{wish.title}</span>
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                    </h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                      {wish.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs text-sky-700">
              <span className="flex items-center gap-1 font-medium">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Terukir abadi di Pulau Hati</span>
              </span>
              <button
                onClick={onClose}
                className="font-semibold text-gray-600 hover:text-gray-900"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
