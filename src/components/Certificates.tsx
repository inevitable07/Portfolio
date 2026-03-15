'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import CertificateDetailWindow, { CertificateData } from './CertificateDetailWindow';

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
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden hover:border-white/[0.13] transition-colors duration-300"
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

  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CertificateData | null>(null);

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  // Re-fetch when returning from admin panel
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchCertificates();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchCertificates]);

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

      {/* Grid */}
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

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <CertificateDetailWindow
            certificate={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
