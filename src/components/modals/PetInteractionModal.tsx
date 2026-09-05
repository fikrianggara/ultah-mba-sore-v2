import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface PetInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  petType: 'cat' | 'dog';
}

export const PetInteractionModal: React.FC<PetInteractionModalProps> = ({
  isOpen,
  onClose,
  petType,
}) => {
  const isCat = petType === 'cat';

  const [activeMessage, setActiveMessage] = useState<string>(
    isCat
      ? 'Meow~ Si Meong mengusapkan kepalanya manja ke tanganmu, meminta dielus lembut! 🥰'
      : 'Guk guk! Si Husky melompat riang dan mengibaskan ekornya super kencang! 🐶✨'
  );
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const triggerHearts = () => {
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: 35 + Math.random() * 30,
      y: 30 + Math.random() * 20,
    }));
    setHearts(newHearts);
    setTimeout(() => {
      setHearts([]);
    }, 1200);
  };

  const handlePet = () => {
    triggerHearts();
    if (isCat) {
      sfx.playCatMeow();
      setActiveMessage(
        'Purrr... Si Meong mendengkur puas sambil memejamkan mata cantiknya. Dinda memang pawrent terbaik! 🐾💖'
      );
    } else {
      sfx.playDogBark();
      setActiveMessage(
        'Woof! Si Husky berguling santai di rumput dan menjulurkan lidahnya bahagia saat dielus Mba Sore! 🐕❤️'
      );
    }
  };

  const handleFeed = () => {
    triggerHearts();
    sfx.playChime();
    if (isCat) {
      setActiveMessage(
        'Nyam nyam nyam! Ikan segar hasil pancingan di dermaga disantap Si Meong sampai bersih! Meong kenyang! 🐟✨'
      );
    } else {
      setActiveMessage(
        'Kruk kruk kruk! Biskuit tulang renyah langsung ludes dikunyah Si Husky dengan penuh semangat! 🦴🎉'
      );
    }
  };

  const handlePlay = () => {
    triggerHearts();
    sfx.playPop();
    if (isCat) {
      setActiveMessage(
        'Si Meong melompat lincah menerkam gulungan benang pink! Aksinya menggemaskan sekali seperti Mba Sore! 🧶🎀'
      );
    } else {
      setActiveMessage(
        'Mba Sore melempar bola tenis dan Si Husky melesat cepat lalu membawanya kembali dengan senyum bangga! 🎾💨'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 25 }}
          className="relative w-full max-w-md bg-gradient-to-b from-white via-[#FFF8F8] to-[#FFF0F3] rounded-3xl p-6 shadow-2xl border-2 border-pink-200 text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Floating Heart particles on action */}
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.5, y: -70 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute pointer-events-none text-rose-500 font-bold text-xl"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              💖
            </motion.div>
          ))}

          {/* Avatar Icon */}
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-400 to-pink-300 p-1 shadow-lg shadow-pink-300/40 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-white/90 rounded-[22px] flex items-center justify-center text-4xl animate-bounce">
              {isCat ? '🐱' : '🐶'}
            </div>
          </div>

          {/* Pet Title & Subtitle */}
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
            <span>{isCat ? 'Si Meong Manis' : 'Si Husky Ceria'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-semibold">
              Anabul Sore
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isCat ? 'Kucing oren manja kesayangan Mba Sore' : 'Anjing Siberian Husky bermata biru setia Mba Sore'}
          </p>

          {/* Dynamic Dialogue Box */}
          <div className="my-4 p-4 rounded-2xl bg-white/80 border border-pink-200/80 shadow-inner">
            <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed min-h-[48px] flex items-center justify-center">
              {activeMessage}
            </p>
          </div>

          {/* Interactive Action Buttons */}
          <div className="grid grid-cols-3 gap-2 my-4">
            <button
              onClick={handlePet}
              className="px-2 py-3 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white font-bold text-xs shadow-md shadow-pink-300/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              <span>{isCat ? 'Elus Bulu' : 'Elus Kepala'}</span>
            </button>

            <button
              onClick={handleFeed}
              className="px-2 py-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white font-bold text-xs shadow-md shadow-amber-300/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-1"
            >
              <span>{isCat ? '🐟' : '🦴'}</span>
              <span>{isCat ? 'Beri Ikan' : 'Beri Biskuit'}</span>
            </button>

            <button
              onClick={handlePlay}
              className="px-2 py-3 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-400 text-white font-bold text-xs shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isCat ? 'Main Benang' : 'Lempar Bola'}</span>
            </button>
          </div>

          {/* Sweet Romantic Note from Mas Jo */}
          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-left flex items-start gap-2.5">
            <span className="text-base">💌</span>
            <div className="text-[11px] leading-snug">
              <span className="font-bold text-rose-700">Bisikan Mas Jo: </span>
              <span className="text-gray-600">
                "Seneng banget liat senyuman manis Mba Sore pas lagi main sama anabul kesayangan... Bahagia selalu ya, cintaku!"
              </span>
            </div>
          </div>

          {/* Close & Continue Exploring button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-2xl bg-white border border-pink-200 text-gray-600 font-bold text-xs hover:bg-pink-50 transition-colors shadow-sm"
          >
            Lanjut Jalan-Jalan 🐾
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
