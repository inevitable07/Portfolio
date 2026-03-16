'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { COLOR_THEMES } from '@/lib/colorThemes';
import ProjectDetailWindow, { type ProjectData } from '@/components/ProjectDetailWindow';

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return <div className="aspect-[16/10] rounded-2xl bg-white/[0.03] animate-pulse" />;
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectData;
  onClick: () => void;
}) {
  const accent = COLOR_THEMES[project.colorTheme] ?? COLOR_THEMES.sky;
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.015 }}
      onClick={onClick}
      className="group relative aspect-[16/10] rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500"
      style={{ willChange: 'transform, opacity', borderColor: accent.ring }}
      onHoverStart={() => {
        if (cardRef.current) {
          cardRef.current.style.boxShadow = `0 8px 40px ${accent.ring}, 0 0 0 1px ${accent.ring}`;
        }
      }}
      onHoverEnd={() => {
        if (cardRef.current) {
          cardRef.current.style.boxShadow = 'none';
        }
      }}
    >
      {/* Thumbnail background */}
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.from} to-transparent`} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-4">
        <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
          {project.title}
        </h3>

        <div
          className="flex items-center gap-3 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="View source code"
            >
              <GitHubIcon />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="View live demo"
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] ${accent.line} opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
      />
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?featured=true');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Projects]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Re-fetch when tab becomes visible (e.g. switching back from admin)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchProjects();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchProjects]);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
      />

      {/* Section header */}
      <div id="work" className="mb-16 md:mb-20 text-center mx-auto scroll-mt-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Selected Work
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Projects
          <span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-white/25 text-lg">No projects yet</p>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>
      )}

      {/* View All CTA — only when filling at least one full row (2 cols on md) */}
      {!loading && projects.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/[0.12] text-white/60 text-sm font-medium hover:text-white hover:border-white/25 transition-all duration-300"
          >
            View All Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      )}

      {/* macOS Detail Window */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailWindow
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
