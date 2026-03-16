'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CertificateDetailWindow, { CertificateData } from '@/components/CertificateDetailWindow';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── External-link icon ───────────────────────────────────────────────────────
function ExternalLinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

// ─── Cert Card ────────────────────────────────────────────────────────────────
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
      className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden hover:border-white/[0.13] transition-colors duration-300"
    >
      {cert.featured && (
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/20 backdrop-blur-sm">
          Featured
        </div>
      )}
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
          <div className="w-full h-full flex items-center justify-center text-white/15 text-xs">No image</div>
        )}
      </button>
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

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-white/[0.04]" />
      <div className="p-5"><div className="h-4 w-32 rounded bg-white/[0.05]" /></div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

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

  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="px-6 md:px-12 lg:px-20 py-20">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <Link
          href="/#certificates"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </Link>
      </motion.div>

      {/* Header */}
      <div ref={headerRef} className="mb-16 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          All Credentials
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Certificates<span className="text-white/15">.</span>
        </motion.h1>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-32 text-white/25">
          <p className="text-lg">No certificates yet</p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
    </main>
  );
}
