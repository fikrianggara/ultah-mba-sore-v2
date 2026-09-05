import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, ZoomIn } from 'lucide-react';
import { PHOTO_ITEMS } from '../../data/photos';
import { PhotoItem } from '../../types';
import { sfx } from '../../utils/audio';

interface PolaroidGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'moment' | 'cute' | 'sweet' | 'special'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const filteredPhotos = activeFilter === 'all'
    ? PHOTO_ITEMS
    : PHOTO_ITEMS.filter((p) => p.tag === activeFilter);

  const handleSelectPhoto = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    sfx.playChime();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-[#FFF9F6] to-[#FFF0F2] rounded-3xl shadow-2xl border border-pink-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-pink-100 flex items-center justify-between bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
                  <Heart className="w-5 h-5 fill-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>Taman Foto Kenangan</span>
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Kumpulan senyuman manis dan momen terbaik Dinda ({PHOTO_ITEMS.length} Foto)
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-rose-600 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 sm:px-6 py-3 border-b border-pink-100/60 bg-pink-50/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Semua Momen ✨' },
                { id: 'special', label: 'Spesial Ultah 🎂' },
                { id: 'cute', label: 'Si Paling Gemas 🥰' },
                { id: 'sweet', label: 'Sweet Memories 💖' },
                { id: 'moment', label: 'Cerita Kita 📸' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-rose-500 text-white shadow-sm shadow-rose-300'
                      : 'bg-white/80 text-gray-600 hover:bg-white border border-pink-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Polaroid Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {filteredPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.04, rotate: (idx % 2 === 0 ? 2 : -2) }}
                    className="polaroid-frame p-2.5 sm:p-3 rounded-lg bg-white cursor-pointer group flex flex-col"
                    onClick={() => handleSelectPhoto(photo)}
                  >
                    {/* Image frame */}
                    <div className="relative aspect-square overflow-hidden rounded bg-gray-100">
                      <img
                        src={`assets/images/${photo.filename}`}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if path differs
                          (e.target as HTMLImageElement).src = `../birthday-card/assets/images/${photo.filename}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn className="w-6 h-6 text-white drop-shadow" />
                      </div>
                    </div>

                    {/* Polaroid Caption */}
                    <div className="pt-2 sm:pt-3 text-center">
                      <h4 className="font-handwritten text-lg sm:text-xl text-gray-800 font-bold truncate">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate px-1">
                        {photo.caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Photo Enlarge Inspector Modal */}
          <AnimatePresence>
            {selectedPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  className="bg-white rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-pink-100 text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="rounded-2xl overflow-hidden max-h-[60vh] bg-black/5 mb-4 flex items-center justify-center">
                    <img
                      src={`assets/images/${selectedPhoto.filename}`}
                      alt={selectedPhoto.title}
                      className="max-h-[60vh] w-auto object-contain rounded-xl"
                    />
                  </div>

                  <h3 className="text-2xl font-bold font-handwritten text-rose-600 mb-1">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-sans px-4">
                    "{selectedPhoto.caption}"
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
