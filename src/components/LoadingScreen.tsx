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

    if (isSmall) {
      // Mobile: no video — run counter quickly and finish
      let count = 0;
      const interval = setInterval(() => {
        count = Math.min(count + 1, 100);
        setProgress(count);
        if (count >= 100) {
          clearInterval(interval);
          onComplete('');
        }
      }, 25);
      return () => clearInterval(interval);
    }

    // Desktop: preload the video before completing
    const src = '/animation1.mp4';
    srcRef.current = src;

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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#121212' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Load image — same responsive width as progress bar */}
      <div className="mb-8 sm:mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/load.jpeg"
          alt=""
          className="w-[52vw] sm:w-[32vw] md:w-[26vw] lg:w-[16vw] max-w-[240px] h-auto"
        />
      </div>

      {/* Progress bar — matches image width */}
      <div className="w-[52vw] sm:w-[32vw] md:w-[26vw] lg:w-[16vw] max-w-[240px] h-px bg-white/10 relative mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-white/50"
          style={{ width: `${progress}%`, transition: 'width 30ms linear' }}
        />
      </div>

      {/* Percentage */}
      <p className="text-white/25 text-[10px] sm:text-[11px] tracking-[0.35em] font-light tabular-nums">
        {String(progress).padStart(3, '0')}
      </p>
    </motion.div>
  );
}
