'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { COLOR_THEMES } from '@/lib/colorThemes';
import ProjectDetailWindow, { type ProjectData } from '@/components/ProjectDetailWindow';

// ─── Variants ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      transition={{ duration: 0.55 }}
      whileHover={{ y: -5, scale: 1.012 }}
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
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/20 backdrop-blur-sm">
          Featured
        </div>
      )}

      {/* Thumbnail */}
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.from} to-transparent`} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
        <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug">
          {project.title}
        </h3>

        <div
          className="flex items-center gap-2.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[ProjectsPage]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </Link>
      </motion.div>

      {/* Header */}
      <div className="mb-16 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          All Work
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Projects
          <span className="text-white/15">.</span>
        </motion.h1>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
          <p className="text-white/25 text-lg">No projects yet</p>
        </motion.div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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

      {/* Detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailWindow
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
