import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fish, Waves, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sfx } from '../../utils/audio';

interface FishingGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FishingState = 'idle' | 'waiting' | 'bite' | 'reeling' | 'caught';

interface CatchItem {
  name: string;
  badge: string;
  icon: string;
  description: string;
  secretNote?: string;
}

const CATCH_POOL: CatchItem[] = [
  {
    name: 'Ikan Mas Cinta 🐟',
    badge: 'IKAN SPESIAL',
    icon: '🐟',
    description: 'Ikan manis yang sisiknya berkilau keemasan. Selalu tersenyum ceria mirip senyuman Mba Sore!',
  },
  {
    name: 'Botol Surat Terapung 💌',
    badge: 'PESAN RAHASIA',
    icon: '💌',
    description: 'Sebuah botol kaca bening berisi surat rahasia beraroma melati dari Mas Jo!',
    secretNote: '"Untuk Dinda tercinta: Di antara luasnya samudra dan waktu, hatiku selalu berlabuh selamanya untukmu. Happy Birthday sayangku! ❤️"',
  },
  {
    name: 'Kerang Mutiara Berkilau 🦪',
    badge: 'HARTA KARUN LAUT',
    icon: '🦪',
    description: 'Mutiara laut yang bersinar lembut, seindah tatapan mata Dinda yang selalu menenangkan hati.',
  },
  {
    name: 'Sepatu Boots Mas Jo 👢',
    badge: 'TANGKAPAN GEMAS',
    icon: '👢',
    description: 'Sepatu boots Mas Jo yang sempat kecebur kemarin. Pas dibuka, ternyata ada kartu ucapan cinta di dalamnya!',
  },
  {
    name: 'Ikan Badut Ceria 🐠',
    badge: 'SI PALING LUCU',
    icon: '🐠',
    description: 'Ikan badut mungil yang lincah dan enerjik. Lucu dan bikin gemas persis Mba Sore kalau lagi manja!',
  },
  {
    name: 'Bintang Laut Emas 🌟',
    badge: 'BINTANG HARAPAN',
    icon: '🌟',
    description: 'Bintang laut berkilauan yang membawa doa tulus agar semua impian dan cita-cita Dinda tercapai tahun ini.',
  },
];

export const FishingGameModal: React.FC<FishingGameModalProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<FishingState>('idle');
  const [reelProgress, setReelProgress] = useState<number>(0);
  const [caughtItem, setCaughtItem] = useState<CatchItem | null>(null);

  // Handle bite timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameState === 'waiting') {
      const waitTime = 1800 + Math.random() * 2200; // 1.8 to 4.0 seconds
      timer = setTimeout(() => {
        setGameState('bite');
        sfx.playFishBite();
      }, waitTime);
    }
    return () => clearTimeout(timer);
  }, [gameState]);

  // Handle bite timeout (if player doesn't react within 2.5s, fish escapes)
  useEffect(() => {
    let escapeTimer: ReturnType<typeof setTimeout>;
    if (gameState === 'bite') {
      escapeTimer = setTimeout(() => {
        setGameState('idle');
        sfx.playPop();
      }, 2800);
    }
    return () => clearTimeout(escapeTimer);
  }, [gameState]);

  const handleCast = () => {
    sfx.playReelSound();
    setReelProgress(0);
    setGameState('waiting');
  };

  const handleBiteClick = () => {
    sfx.playFishBite();
    setReelProgress(25);
    setGameState('reeling');
  };

  const handleReelClick = () => {
    sfx.playReelSound();
    setReelProgress((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        // Successful catch!
        const randomCatch = CATCH_POOL[Math.floor(Math.random() * CATCH_POOL.length)];
        setCaughtItem(randomCatch);
        setGameState('caught');
        sfx.playChime();

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00F5D4', '#FF69B4', '#FFD700', '#80ED99'],
        });
        return 100;
      }
      return next;
    });
  };

  const handlePlayAgain = () => {
    setCaughtItem(null);
    setReelProgress(0);
    setGameState('idle');
  };

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
            className="w-full max-w-md bg-gradient-to-br from-[#F0FDF4] via-[#E8F8F5] to-[#E0F2FE] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-emerald-200 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-emerald-700 flex items-center justify-center shadow-sm transition-colors z-10"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-300/50 border-2 border-white">
              <Fish className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="font-handwritten text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Memancing di Dermaga 🎣
            </h3>
            <p className="text-xs text-emerald-700 font-medium mb-5">
              Tarik kailmu dan temukan kejutan manis di samudra cinta!
            </p>

            {/* Game Canvas Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-inner mb-6 min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
              {gameState === 'idle' && (
                <div className="space-y-3">
                  <div className="text-4xl animate-bounce">🎣</div>
                  <p className="text-xs text-gray-600">
                    Kail sudah terpasang umpan manis. Siap untuk melempar kail ke laut?
                  </p>
                </div>
              )}

              {gameState === 'waiting' && (
                <div className="space-y-3">
                  <div className="relative flex items-center justify-center w-16 h-16 mx-auto">
                    <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-md animate-bounce" />
                    <Waves className="w-16 h-16 text-sky-400 absolute opacity-40 animate-spin-slow" />
                  </div>
                  <p className="text-xs font-semibold text-teal-800 animate-pulse">
                    Menunggu ikan mendekat... 🌊
                  </p>
                </div>
              )}

              {gameState === 'bite' && (
                <div className="space-y-2 animate-bounce">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-400/60 font-black text-2xl">
                    !
                  </div>
                  <p className="text-sm font-bold text-rose-600">
                    UMPAN DISAMBAR! CEPAT TARIK!
                  </p>
                </div>
              )}

              {gameState === 'reeling' && (
                <div className="w-full space-y-3">
                  <div className="text-3xl animate-bounce">🌀</div>
                  <p className="text-xs font-bold text-emerald-800">
                    Klik tombol di bawah secepatnya untuk menarik kail!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-emerald-300">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-150 rounded-full"
                      style={{ width: `${reelProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {gameState === 'caught' && caughtItem && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-2"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    {caughtItem.badge}
                  </span>
                  <div className="text-5xl my-1 animate-bounce">{caughtItem.icon}</div>
                  <h4 className="font-bold text-base text-gray-800">
                    {caughtItem.name}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed px-2">
                    {caughtItem.description}
                  </p>
                  {caughtItem.secretNote && (
                    <div className="mt-2 p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-rose-700 font-sans italic text-left">
                      {caughtItem.secretNote}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div>
              {gameState === 'idle' && (
                <button
                  onClick={handleCast}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-400/40 hover:scale-105 active:scale-95 transition-all"
                >
                  Lempar Kail ke Laut 🎣
                </button>
              )}

              {gameState === 'waiting' && (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-gray-300 text-gray-500 font-bold text-sm cursor-not-allowed"
                >
                  Memperhatikan Pelampung... 👀
                </button>
              )}

              {gameState === 'bite' && (
                <button
                  onClick={handleBiteClick}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm shadow-xl shadow-rose-400/60 animate-bounce"
                >
                  TARIK SEKARANG! 🎣
                </button>
              )}

              {gameState === 'reeling' && (
                <button
                  onClick={handleReelClick}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-sm shadow-lg shadow-orange-300/50 active:scale-95 transition-all"
                >
                  GULUNG PANCINGAN! 🌀
                </button>
              )}

              {gameState === 'caught' && (
                <button
                  onClick={handlePlayAgain}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-400/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Mancing Lagi 🎣</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
