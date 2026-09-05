import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, BookOpen } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface ScrapbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGES = [
  {
    title: 'The Story of Mba Sore & Mas Jo 📖',
    subtitle: 'Babak demi babak kisah yang selalu berharga di dalam hati',
    type: 'cover',
    badge: 'EDISI SPESIAL ULANG TAHUN',
    content: (
      <div className="text-center py-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-300/60 border-2 border-white">
          <BookOpen className="w-12 h-12 animate-pulse" />
        </div>
        <h2 className="font-handwritten text-3xl sm:text-4xl text-rose-800 font-bold mb-2">
          Kisah Kita Berdua ❤️
        </h2>
        <p className="font-handwritten text-xl text-rose-600/80 mb-6">
          "Untuk cewek paling hebat, manis, dan andalan tungkal zityy"
        </p>
        <div className="inline-block p-4 rounded-2xl bg-white/70 border border-pink-200 text-xs sm:text-sm text-gray-700 max-w-sm leading-relaxed text-left">
          <p>
            Buku kenangan kecil ini dipersembahkan untuk merayakan hari kelahiran Dinda tercinta. Buka lembar demi lembar untuk melihat momen-momen manis kita!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Awal Cerita & Senyum Favorit 🌸',
    subtitle: 'Momen-momen awal yang selalu bikin jatuh hati',
    type: 'spread',
    badge: 'HALAMAN 1',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-left">
        <div className="polaroid-frame p-2.5 rounded-xl bg-white shadow-md rotate-[-2deg]">
          <img
            src="assets/images/c8efffb5-dc1c-44cc-b269-d6ec395ca39f.JPG"
            alt="Momen 1"
            className="w-full aspect-square object-cover rounded"
          />
          <p className="font-handwritten text-base text-gray-700 font-bold text-center mt-2">
            Senyuman yang selalu menghangatkan ☀️
          </p>
        </div>
        <div className="space-y-3 font-sans text-xs text-gray-700 leading-relaxed bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex flex-col justify-center">
          <p className="font-handwritten text-xl text-rose-700 font-bold">
            "Satu senyumanmu ngalahin sejuta obat lelah..."
          </p>
          <p>
            Setiap kali liat kamu tersenyum lepas, rasanya dunia langsung ikutan tenang. Terima kasih sudah selalu menebarkan energi positif dan kebahagiaan di hari-hariku sayang.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-semibold pt-2">
            <Heart className="w-4 h-4 fill-rose-400" />
            <span>Forever your biggest fan</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Cerita Tungkal & Momen Bersama 🧸',
    subtitle: 'Tawa, canda, dan kebersamaan yang tak tergantikan',
    type: 'spread',
    badge: 'HALAMAN 2',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-left">
        <div className="space-y-3 font-sans text-xs text-gray-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex flex-col justify-center">
          <p className="font-handwritten text-xl text-amber-800 font-bold">
            "Si Paling Rajin dan Paling Lucu!"
          </p>
          <p>
            Dari cerita kesibukan sehari-hari, jokes receh yang cuma kita yang paham, sampai kelakuan gemas yang bikin geleng-geleng kepala. Bersyukur banget punya kamu di hidupku!
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-semibold pt-2">
            <span>✨</span>
            <span>Andalan Tungkal Zityy</span>
          </div>
        </div>
        <div className="polaroid-frame p-2.5 rounded-xl bg-white shadow-md rotate-[2deg]">
          <img
            src="assets/images/cdfea829-0b65-4401-8bd9-d956a1898cdf.JPG"
            alt="Momen 2"
            className="w-full aspect-square object-cover rounded"
          />
          <p className="font-handwritten text-base text-gray-700 font-bold text-center mt-2">
            Manisnya seindah Banda Neira 🌊
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Doa, Harapan & Masa Depan 🌟',
    subtitle: 'Untuk hari ini, esok, dan selamanya',
    type: 'spread',
    badge: 'HALAMAN 3',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-left">
        <div className="polaroid-frame p-2.5 rounded-xl bg-white shadow-md rotate-[-1deg]">
          <img
            src="assets/images/ffadd9dd-445a-453e-bfc0-64829eb9655a.JPG"
            alt="Momen 3"
            className="w-full aspect-square object-cover rounded"
          />
          <p className="font-handwritten text-base text-gray-700 font-bold text-center mt-2">
            Forever With You ❤️
          </p>
        </div>
        <div className="space-y-3 font-sans text-xs text-gray-700 leading-relaxed bg-pink-50/60 p-4 rounded-2xl border border-pink-100 flex flex-col justify-center">
          <p className="font-handwritten text-xl text-rose-700 font-bold">
            "Happy Birthday Sayangku Dinda!"
          </p>
          <p>
            Semoga di usia yang baru ini, kamu semakin bersinar, semakin bahagia, dimudahkan segala cita-citanya, dan selalu dalam lindungan-Nya.
          </p>
          <p className="font-semibold text-rose-800 pt-1">
            With all my love,<br />
            Mas Jo kamu yang selalu sayang padamu 😊
          </p>
        </div>
      </div>
    ),
  },
];

export const ScrapbookModal: React.FC<ScrapbookModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const nextPage = () => {
    if (currentPage < PAGES.length - 1) {
      sfx.playChime();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      sfx.playChime();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const activePageData = PAGES[currentPage];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F6] to-[#FFF0F4] rounded-3xl shadow-2xl border-2 border-pink-200 flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-800">
                    Buku Kenangan (Scrapbook)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Lembaran Cerita Indah Mba Sore & Mas Jo
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-rose-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrapbook Page Content with Flip Animation */}
            <div className="p-6 sm:p-8 flex-1 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full uppercase">
                    {activePageData.badge}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {currentPage + 1} / {PAGES.length}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 font-sans mb-1">
                  {activePageData.title}
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  {activePageData.subtitle}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activePageData.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Pagination & Flip Controls */}
              <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentPage === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-pink-200 hover:bg-pink-50 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Dots Indicator */}
                <div className="flex items-center gap-1.5">
                  {PAGES.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        sfx.playChime();
                        setCurrentPage(idx);
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        currentPage === idx
                          ? 'w-6 bg-rose-500'
                          : 'w-2 bg-pink-200 hover:bg-pink-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === PAGES.length - 1}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    currentPage === PAGES.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-300/40'
                  }`}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
