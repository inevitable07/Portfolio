'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CertificateDetailWindow, { CertificateData } from './CertificateDetailWindow';
import AchievementDetailWindow, { AchievementData } from './AchievementDetailWindow';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── External-link icon ─────────────────────────────────────────────────────
function ExternalLinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

// ─── Cert Card ──────────────────────────────────────────────────────────────
function CertCard({
  cert,
  onOpenModal,
}: {
  cert: CertificateData;
  onOpenModal: (cert: CertificateData) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden hover:border-amber-500/[0.25] hover:shadow-[0_0_22px_rgba(245,158,11,0.10)] transition-all duration-300"
    >
      {/* Thumbnail — click opens modal */}
      <button
        type="button"
        onClick={() => onOpenModal(cert)}
        className="relative w-full aspect-video overflow-hidden cursor-pointer bg-white/[0.03]"
      >
        {cert.thumbnail ? (
          <Image
            src={cert.thumbnail}
            alt={cert.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15 text-xs">
            No image
          </div>
        )}
      </button>

      {/* Info bar */}
      <div className="p-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white truncate">{cert.name}</p>
        {cert.certificateLink && (
          <a
            href={cert.certificateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors"
            title="View certificate"
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Achievement Card ────────────────────────────────────────────────────────
function AchievCard({
  achievement,
  onOpenModal,
}: {
  achievement: AchievementData;
  onOpenModal: (a: AchievementData) => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden hover:border-amber-500/[0.25] hover:shadow-[0_0_22px_rgba(245,158,11,0.10)] transition-all duration-300"
    >
      {/* Thumbnail — click opens modal */}
      <button
        type="button"
        onClick={() => onOpenModal(achievement)}
        className="relative w-full aspect-video overflow-hidden cursor-pointer bg-white/[0.03]"
      >
        {achievement.thumbnail ? (
          <Image
            src={achievement.thumbnail}
            alt={achievement.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15 text-xs">
            No image
          </div>
        )}
      </button>

      {/* Info bar */}
      <div className="p-5">
        <p className="text-sm font-semibold text-white truncate">{achievement.name}</p>
        {achievement.description && (
          <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{achievement.description}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-white/[0.04]" />
      <div className="p-5">
        <div className="h-4 w-32 rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────
export default function Certificates() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const achieveHeaderRef = useRef<HTMLDivElement>(null);
  const achieveHeaderInView = useInView(achieveHeaderRef, { once: true });

  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CertificateData | null>(null);

  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [achieveLoading, setAchieveLoading] = useState(true);
  const [selectedAchieve, setSelectedAchieve] = useState<AchievementData | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch('/api/certificates?featured=true');
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const res = await fetch('/api/achievements?featured=true');
      const data = await res.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch achievements');
    } finally {
      setAchieveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
    fetchAchievements();
  }, [fetchCertificates, fetchAchievements]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCertificates();
        fetchAchievements();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchCertificates, fetchAchievements]);

  return (
    <section
      id="certificates"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.07) 0%, transparent 70%)' }}
      />

      {/* ── Certificates subsection ── */}
      {/* Header */}
      <div ref={headerRef} className="mb-16 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Credentials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Certificates<span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 text-white/25">
          <p className="text-lg">No certificates yet</p>
        </div>
      ) : (
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        >
          {certificates.map((cert) => (
            <CertCard key={cert._id} cert={cert} onOpenModal={setSelected} />
          ))}
        </motion.div>
      )}

      {/* View All CTA — only when filling at least one full row (3 cols on lg) */}
      {!loading && certificates.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:text-white hover:border-white/25 transition-all duration-300"
          >
            View All Certificates
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      )}

      {/* ── Achievements subsection ── */}
      <div ref={achieveHeaderRef} className="mt-24 mb-12 text-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={achieveHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-5"
        >
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08))' }} />
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/25 font-light">Milestones</p>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.08))' }} />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={achieveHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none tracking-[-0.03em]"
        >
          Achievements<span className="text-white/15">.</span>
        </motion.h3>
      </div>

      {/* Achievements Grid */}
      {achieveLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-16 text-white/25">
          <p className="text-lg">No achievements yet</p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        >
          {achievements.map((a) => (
            <AchievCard key={a._id} achievement={a} onOpenModal={setSelectedAchieve} />
          ))}
        </motion.div>
      )}

      {/* Certificate detail modal */}
      <AnimatePresence>
        {selected && (
          <CertificateDetailWindow
            certificate={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchieve && (
          <AchievementDetailWindow
            achievement={selectedAchieve}
            onClose={() => setSelectedAchieve(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
