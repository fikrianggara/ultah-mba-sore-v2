import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, HelpCircle } from 'lucide-react';
import { TreasureShard } from '../../types';

interface TreasureRadarProps {
  shards: TreasureShard[];
  playerPos: [number, number, number];
}

export const TreasureRadar: React.FC<TreasureRadarProps> = ({ shards, playerPos }) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  const uncollected = shards.filter((s) => !s.isCollected);
  const collectedCount = shards.length - uncollected.length;

  // Find closest uncollected shard
  let closestShard: TreasureShard | null = null;
  let closestDist = Infinity;
  let angleDeg = 0;

  for (const s of uncollected) {
    const dx = s.position[0] - playerPos[0];
    const dz = s.position[2] - playerPos[2];
    const dist = Math.hypot(dx, dz);
    if (dist < closestDist) {
      closestDist = dist;
      closestShard = s;
      // Angle relative to world: 0 is North (-Z)
      const rad = Math.atan2(dx, -dz);
      angleDeg = (rad * 180) / Math.PI;
    }
  }

  if (collectedCount === shards.length) {
    return (
      <div className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 shadow-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span>Semua Kepingan Terkumpul! (5/5)</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={() => setShowHint(!showHint)}
        className="glass-pill px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-md cursor-pointer hover:bg-white/95 transition-all"
        title="Klik untuk melihat petunjuk lokasi"
      >
        <div className="flex items-center gap-1 text-rose-500 font-bold">
          <span>💎</span>
          <span>{collectedCount}/{shards.length}</span>
        </div>

        {closestShard && (
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-pink-200">
            {/* Rotating Compass Needle Arrow */}
            <div
              className="w-4 h-4 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${angleDeg}deg)` }}
            >
              <span className="text-[10px] text-rose-600 font-black">▲</span>
            </div>
            <span className="text-[11px] text-gray-600 font-mono">
              {Math.round(closestDist)}m
            </span>
          </div>
        )}

        <HelpCircle className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
      </div>

      {/* Popover Hint */}
      <AnimatePresence>
        {showHint && closestShard && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-10 left-0 sm:right-0 sm:left-auto w-64 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-pink-200 z-50 text-left"
          >
            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Petunjuk Kepingan #{closestShard.id}</span>
            </div>
            <h5 className="font-bold text-xs text-gray-800">{closestShard.title}</h5>
            <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
              "{closestShard.hint}"
            </p>
            <p className="text-[10px] text-rose-400 font-medium mt-2">
              Jarak: ~{Math.round(closestDist)} meter dari mobilmu
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
