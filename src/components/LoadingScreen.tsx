'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (videoSrc: string) => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const videoReadyRef = useRef(false);
  const srcRef = useRef('');

  useEffect(() => {
    const isSmall = window.innerWidth < 1024;
    const src = isSmall ? '/animation1-smallScreen.mp4' : '/animation1.mp4';
    srcRef.current = src;

    // Preload the correct video in the background
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.src = src;
    video.addEventListener('canplaythrough', () => { videoReadyRef.current = true; }, { once: true });
    video.addEventListener('error', () => { videoReadyRef.current = true; }, { once: true });
    video.load();

    // Safety: force ready after 5s max
    const maxTimer = setTimeout(() => { videoReadyRef.current = true; }, 5000);

    // Counter: 0→90 at 30ms/step, stalls at 90 until video ready, then 90→100
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 90 && !videoReadyRef.current) return;
      count = Math.min(count + 1, 100);
      setProgress(count);
      if (count >= 100) {
        clearInterval(interval);
        clearTimeout(maxTimer);
        onComplete(src);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#121212' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Load image */}
      <div className="mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/load.jpeg"
          alt=""
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
        />
      </div>

      {/* Progress bar */}
      <div className="w-40 sm:w-56 h-px bg-white/10 relative mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-white/50"
          style={{ width: `${progress}%`, transition: 'width 30ms linear' }}
        />
      </div>

      {/* Percentage */}
      <p className="text-white/25 text-[11px] tracking-[0.35em] font-light tabular-nums">
        {String(progress).padStart(3, '0')}
      </p>
    </motion.div>
  );
}
