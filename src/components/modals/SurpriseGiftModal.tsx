import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Heart, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../../utils/audio';

interface SurpriseGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseGiftModal: React.FC<SurpriseGiftModalProps> = ({ isOpen, onClose }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsOpened(false);
    }
  }, [isOpen]);

  const handleOpenGift = () => {
    setIsOpened(true);
    sfx.playChime();

    // Trigger colorful confetti shower
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF758F', '#FFD166', '#87CEEB', '#DDA0DD'],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F3] to-[#FFE5EC] rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isOpened ? (
              /* Gift Box View (Ready to unbox) */
              <div className="py-4">
                <motion.div
                  animate={{
                    rotate: [-2, 2, -2],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-xl shadow-pink-300/60 border-2 border-white mb-6 relative cursor-pointer"
                  onClick={handleOpenGift}
                >
                  <Gift className="w-14 h-14" />
                  <div className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow">
                    <Sparkles className="w-7 h-7 fill-yellow-300" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800">
                  Kado Rahasia Buat Dinda! 🎁
                </h3>
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  Ada kiriman istimewa dari Mas Jo...
                </p>

                <p className="text-xs text-gray-600 max-w-xs mx-auto mt-4 leading-relaxed bg-white/70 p-3 rounded-2xl border border-pink-100">
                  Pita emasnya sudah siap dibuka nih! Ketuk tombol di bawah buat intip isinya yaa 🎀
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenGift}
                  className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-400/40 hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Buka Kado Sekarang! 🎉</span>
                </motion.button>
              </div>
            ) : (
              /* Gift Revealed View: Jejee the Bear & Romantic Message */
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="py-2"
              >
                {/* Mascot Jejee / Bear avatar */}
                <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center shadow-lg">
                    <span className="text-5xl animate-bounce">🧸</span>
                  </div>
                  <div className="absolute -top-1 -right-1 text-rose-500 animate-pulse">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Cilukbaaa! Jejee Hadir!</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-sans">
                  Peluk Jauh dari Mas Jo & Jejee!
                </h3>

                <div className="bg-white/90 rounded-2xl p-4 border border-pink-200 text-left text-xs sm:text-sm text-gray-700 leading-relaxed shadow-sm mt-3 space-y-2">
                  <p>
                    "Hai mba sore cayangg! Jejee ditugaskan Mas Jo buat bawain peluk super hangat dan cium jauh buat kamu! 🤗"
                  </p>
                  <p className="text-rose-600 font-medium">
                    "Walaupun kita berjarak, hati Mas Jo selalu berlabuh di kamu. Terima kasih sudah menjadi cewek paling hebat dan menggemaskan!"
                  </p>
                </div>

                {/* Interactive buttons */}
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      sfx.playChime();
                      confetti({ particleCount: 80, spread: 60 });
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-pink-200 text-rose-600 font-semibold text-xs hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>Kirim Balik Pelukan</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Lanjut Eksplorasi 🚗</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
