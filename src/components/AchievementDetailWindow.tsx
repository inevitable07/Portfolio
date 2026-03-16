'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface AchievementData {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  order: number;
  featured?: boolean;
}

export default function AchievementDetailWindow({
  achievement,
  onClose,
}: {
  achievement: AchievementData;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Centering wrapper */}
      <div className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-[92vw] max-w-3xl max-h-[85vh] overflow-hidden rounded-xl border border-white/[0.1] shadow-2xl shadow-black/50"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          {/* macOS title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition flex-shrink-0" aria-label="Close" />
            <span className="ml-3 text-xs text-white/30 font-medium truncate select-none">{achievement.name}</span>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 48px)' }}>
            {achievement.thumbnail && (
              <div className="relative w-full aspect-video">
                <Image
                  src={achievement.thumbnail}
                  alt={achievement.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 92vw, 768px"
                />
              </div>
            )}

            <div className="px-8 pb-8 pt-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">{achievement.name}</h2>
              {achievement.description && (
                <p className="text-sm text-white/60 leading-relaxed">{achievement.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>,
    document.body,
  );
}
