import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Send } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, onClose }) => {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsEnvelopeOpened(false);
      sfx.playChime();
    }
  }, [isOpen]);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    sfx.playChime();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-lg my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-50 w-10 h-10 rounded-full bg-white text-gray-700 shadow-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors border border-rose-100"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {!isEnvelopeOpened ? (
              /* Envelope View */
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-gradient-to-br from-[#FFE4E1] via-[#FFF0F5] to-[#FFD1DC] rounded-3xl p-8 shadow-2xl border-2 border-rose-200 text-center relative overflow-hidden cursor-pointer"
                onClick={handleOpenEnvelope}
              >
                {/* Envelope Flap graphic */}
                <div className="w-0 h-0 mx-auto border-l-[140px] sm:border-l-[180px] border-l-transparent border-r-[140px] sm:border-r-[180px] border-r-transparent border-t-[90px] border-t-rose-300/40 drop-shadow-sm mb-4" />

                {/* Wax Seal */}
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="mx-auto w-20 h-20 rounded-full wax-seal flex flex-col items-center justify-center text-white shadow-xl border border-rose-900 cursor-pointer relative"
                >
                  <Heart className="w-8 h-8 fill-white/90 text-white drop-shadow" />
                  <span className="text-[10px] font-bold tracking-widest uppercase mt-0.5">D & J</span>
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-bold text-rose-950 mt-6 font-sans">
                  Surat Spesial Buat Dinda
                </h3>
                <p className="text-rose-700/80 text-sm mt-1 font-medium">
                  Ada pesan rahasia dari Mas Jo di dalam amplop ini...
                </p>

                <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white font-medium text-sm shadow-md hover:bg-rose-600 transition-all">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>Ketuk untuk Membuka Amplop</span>
                </div>
              </motion.div>
            ) : (
              /* Letter Parchment View */
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="bg-[#FFFDF9] rounded-2xl shadow-2xl border border-amber-200/70 p-6 sm:p-9 relative overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#E8D5C4 0.75px, transparent 0.75px)',
                  backgroundSize: '16px 16px',
                }}
              >
                {/* Stamp corner */}
                <div className="absolute top-5 right-5 border-2 border-dashed border-rose-300 rounded p-1.5 bg-rose-50/50 flex flex-col items-center rotate-3 pointer-events-none">
                  <span className="text-xs">📮</span>
                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">SPECIAL</span>
                </div>

                <div className="font-handwritten text-gray-800 text-xl sm:text-2xl leading-relaxed space-y-4">
                  <div className="text-2xl sm:text-3xl font-bold text-rose-700 border-b border-rose-200 pb-2">
                    Teruntuk mba sore cayangkuwh, 🌸
                  </div>

                  <p>
                    Selamat hari hepibesdei ya sayangg! ✨
                  </p>

                  <p>
                    Maaci dah lahir ke dunia ini dan jadi <i>one of the best things in my life</i>.. Di hari spesial ini, aku berdoa semoga kamu selalu diberi kesehatan, kebahagiaan, dan kelancaran dalam segala urusan sayang.
                  </p>

                  <p>
                    Semoga di umurmu yang baru ini, kamu makinn <b>shining shimmering splendid</b>, makin sayang dengan ibu, uda dan aku, semua mimpi kamu bisa terwujud! 🎈
                  </p>

                  <p>
                    Aku bersyukur bat bisa ngerayain ultah kamu bareng kamu, walaupun kita sedang berjarak. Tetep jadi mba sore cantik yang pinter, rajin, penyayang keluarga dan aku, sabar dan andalan <i>tungkal zityy</i>.
                  </p>

                  <p className="text-rose-600 font-bold text-2xl sm:text-3xl pt-2">
                    I love you Dinda mba sore ❤️
                  </p>

                  <div className="pt-4 text-right border-t border-rose-200/60 font-sans text-sm text-gray-600">
                    <p className="italic font-handwritten text-xl text-gray-700">With full of love,</p>
                    <p className="font-semibold text-rose-800">Mas Jo kamu yang ganteng (kayanya :v) 😊</p>
                  </div>
                </div>

                {/* Bottom interactive action */}
                <div className="mt-6 pt-4 flex items-center justify-between border-t border-rose-100">
                  <button
                    onClick={() => setIsEnvelopeOpened(false)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    ← Lipat Amplop Kembali
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold shadow hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tutup Surat</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
