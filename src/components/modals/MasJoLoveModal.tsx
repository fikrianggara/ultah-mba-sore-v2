import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../../utils/audio';

interface MasJoLoveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOVE_MESSAGES = [
  {
    title: 'Untuk Wanita Terhebatku 🌸',
    text: 'Selamat ulang tahun sayang! Kamu adalah alasan senyumku selalu merekah setiap hari. Aku bangga banget punya Mba Sore yang luar biasa hebat, mandiri, dan penyayang.',
    tag: 'SPESIAL ULTAH',
  },
  {
    title: 'Rumah Terbaikku 🏡',
    text: 'Dari jutaan kilometer jarak dan jutaan manusia di dunia, hatiku selalu tahu jalan pulang ke kamu. Terima kasih sudah selalu menjadi tempat paling teduh untuk pulang.',
    tag: 'RUMAH HATI',
  },
  {
    title: 'Genggaman Hangat 🤝',
    text: 'Tanganmu selalu jadi tempat ternyaman untuk kugenggam. Mau di jalan berbatu atau jalanan sepi, selama melangkah bersamamu, semuanya terasa indah.',
    tag: 'SEPASANG LANGKAH',
  },
  {
    title: 'Si Paling Manis ✨',
    text: 'Kamu itu andalan Tungkal Zityy paling manis! Senyumanmu ngalahin indahnya langit senja dan jutaan bintang di pulau ini.',
    tag: 'SENYUMAN INDAH',
  },
  {
    title: 'Doa & Harapan Bersamamu 🌟',
    text: 'Di usiamu yang baru ini, aku berdoa semoga kamu selalu sehat, bahagia, dan dimudahkan segala urusanmu. Dan semoga aku bisa terus mendampingimu di setiap babak hidupmu.',
    tag: 'DOA TULUS',
  },
  {
    title: 'Selamanya Untukmu ❤️',
    text: 'Terima kasih sudah memilih berjalan bersamaku melewati hari-hari. I love you to the moon, to Banda Neira, and back, Dinda sayang!',
    tag: 'CINTA ABADI',
  },
];

export const MasJoLoveModal: React.FC<MasJoLoveModalProps> = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [hasHugged, setHasHugged] = useState<boolean>(false);

  const handleNextMessage = () => {
    sfx.playPop();
    setCurrentIdx((prev) => (prev + 1) % LOVE_MESSAGES.length);
  };

  const handleHug = () => {
    sfx.playHandHold();
    setHasHugged(true);

    // Heart explosion confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1493', '#FF69B4', '#FFD700', '#FF8DA1'],
    });

    setTimeout(() => {
      setHasHugged(false);
    }, 4000);
  };

  const message = LOVE_MESSAGES[currentIdx];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-gradient-to-br from-white via-[#FFF5F7] to-[#FFE8EE] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-pink-200 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Decorative Hearts */}
            <div className="absolute -top-6 -right-6 text-pink-100 opacity-60 pointer-events-none select-none text-9xl font-bold">
              ❤️
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-rose-600 flex items-center justify-center shadow-sm transition-colors z-10"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Icon Badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-300/60 border-2 border-white animate-bounce">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-rose-100/80 text-rose-600 text-[10px] font-bold tracking-wider uppercase mb-2">
              {message.tag}
            </div>

            <h3 className="font-handwritten text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              {message.title}
            </h3>

            {/* Message Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-pink-100 shadow-sm mb-6 text-left"
              >
                <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{message.text}"
                </p>
                <div className="text-right mt-3 text-[11px] font-handwritten text-rose-500 font-bold">
                  — Dari Mas Jo untuk Dinda ❤️
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hug Feedback Banner */}
            <AnimatePresence>
              {hasHugged && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-4 py-2 px-3 rounded-xl bg-pink-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>Mas Jo memeluk erat Dinda dengan hangat... 🥰💖</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleNextMessage}
                className="flex-1 py-3 px-4 rounded-2xl bg-white border border-pink-200 text-gray-700 hover:bg-pink-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                <span>Ganti Pesan 💌</span>
              </button>

              <button
                onClick={handleHug}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-400/40 hover:scale-105 active:scale-95 transition-all border border-rose-300"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Peluk Mas Jo 🤗</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
