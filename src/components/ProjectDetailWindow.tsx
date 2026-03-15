'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { COLOR_THEMES } from '@/lib/colorThemes';

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  thumbnail: string;
  colorTheme: string;
  featured: boolean;
  order: number;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ProjectDetailWindow({
  project,
  onClose,
}: {
  project: ProjectData;
  onClose: () => void;
}) {
  const accent = COLOR_THEMES[project.colorTheme] ?? COLOR_THEMES.sky;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
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

      {/* Centering wrapper — keeps a clean transform context for the window */}
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
          <span className="ml-3 text-xs text-white/30 font-medium truncate select-none">{project.title}</span>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 48px)' }}>
          {/* Thumbnail hero */}
          {project.thumbnail && (
            <div className="relative w-full aspect-video">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 92vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className={`px-8 pb-8 ${project.thumbnail ? '-mt-10 relative z-10' : 'pt-6'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">{project.title}</h2>

            <p className="text-white/50 text-sm leading-relaxed mb-6">{project.description}</p>

            {/* Tech stack tags */}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[11px] px-2.5 py-1 rounded-md border border-white/[0.08] font-medium tracking-wide ${accent.tag} bg-white/[0.03]`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.1] text-white/70 hover:text-white hover:border-white/20 text-sm font-medium transition-all duration-300"
                >
                  <GitHubIcon size={16} /> Source Code
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-300"
                >
                  <ExternalLinkIcon size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </>,
    document.body,
  );
}
