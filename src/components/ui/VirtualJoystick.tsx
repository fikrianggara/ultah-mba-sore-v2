import React, { useRef, useEffect } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface VirtualJoystickProps {
  onMove: (dx: number, dy: number) => void;
  onAction?: () => void;
  actionPrompt?: string | null;
  onHorn?: () => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  onAction,
  actionPrompt,
  onHorn,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const knob = knobRef.current;
    if (!container || !knob) return;

    let startX = 0;
    let startY = 0;
    const maxRadius = 40;

    const handleTouchStart = (e: TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;

      const rect = container.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      updateKnob(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          knob.style.transform = `translate(0px, 0px)`;
          onMove(0, 0);
          break;
        }
      }
    };

    const updateKnob = (clientX: number, clientY: number) => {
      const dx = clientX - startX;
      const dy = clientY - startY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const cappedDist = Math.min(dist, maxRadius);
      const clampedX = Math.cos(angle) * cappedDist;
      const clampedY = Math.sin(angle) * cappedDist;

      knob.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      onMove(clampedX / maxRadius, clampedY / maxRadius);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [onMove]);

  return (
    <div className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-6 z-30 pointer-events-none flex items-end justify-between select-none">
      {/* Joystick base on bottom-left (above bottom navbar on mobile) */}
      <div
        ref={containerRef}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/50 backdrop-blur-md border-2 border-white/80 shadow-xl pointer-events-auto flex items-center justify-center relative touch-none"
      >
        <div
          ref={knobRef}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md border-2 border-white pointer-events-none transition-transform duration-75"
        />
        <span className="absolute bottom-1.5 sm:bottom-2 text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
          Kemudi
        </span>
      </div>

      {/* Action buttons on bottom-right */}
      <div className="flex flex-col gap-2 sm:gap-3 pointer-events-auto items-end">
        {actionPrompt && onAction && (
          <button
            onClick={onAction}
            className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-400/40 border-2 border-white flex items-center gap-2 animate-bounce"
          >
            <Sparkles className="w-4 h-4" />
            <span>{actionPrompt}</span>
          </button>
        )}

        {/* Horn Button */}
        <button
          onClick={() => (onHorn ? onHorn() : sfx.playHorn())}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/85 backdrop-blur-md border border-pink-200 shadow-xl text-rose-500 hover:bg-rose-50 flex flex-col items-center justify-center transition-transform active:scale-95 pointer-events-auto"
          title="Klakson"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">TIN TIN!</span>
        </button>
      </div>
    </div>
  );
};
