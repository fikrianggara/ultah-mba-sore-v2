import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Compass } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onStart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-gradient-to-b from-white/95 to-pink-50/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200/80 text-center relative overflow-hidden"
          >
            {/* Decorative background blurs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />

            {/* Icon badge */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-300/50 mb-5 relative group">
              <span className="text-4xl animate-bounce">🎂</span>
              <div className="absolute -top-1 -right-1 text-yellow-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight font-sans mb-2">
              Selamat Hari Hepibesdeii!
            </h1>
            <p className="text-rose-500 font-medium text-sm sm:text-base mb-4 flex items-center justify-center gap-1">
              <span>Untuk mba sore yang paling spesial</span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 inline" />
            </p>

            {/* Description */}
            <div className="bg-white/80 rounded-2xl p-4 border border-pink-100 text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 space-y-2 text-left">
              <p className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">🚗</span>
                <span>Kemudikan mobil kecilmu menjelajahi pulau <b>Sore Island</b> yang penuh kenangan!</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">💌</span>
                <span>Temukan <b>Kotak Surat</b> cinta, <b>Jukebox Piringan Hitam</b>, <b>Taman Foto</b>, dan <b>Kue Ulang Tahun</b>!</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-pink-500 font-bold">⌨️</span>
                <span>Gunakan tombol <b>W, A, S, D / Panah</b> (atau Joystick di HP).</span>
              </p>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStart}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-semibold text-base shadow-lg shadow-pink-400/40 hover:shadow-pink-400/60 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 animate-spin-slow" />
              <span>Mulai Petualangan 🎈</span>
            </motion.button>

            <p className="text-[11px] text-gray-400 mt-3">
              Audio & musik akan otomatis diputar saat tombol ditekan
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
