'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface SkillData {
  _id: string;
  name: string;
  icon: string;
  order: number;
  category: 'technical' | 'soft';
  featured?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Skill Card ───────────────────────────────────────────────────────────────
function SkillCard({ skill }: { skill: SkillData }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center hover:border-white/[0.13] transition-colors duration-300"
    >
      {skill.featured && (
        <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded font-semibold bg-amber-500/15 text-amber-400/80">
          ★
        </span>
      )}
      <div className="w-14 h-14 mx-auto mb-3 rounded-xl overflow-hidden bg-white/[0.05] flex items-center justify-center">
        {skill.icon ? (
          <Image src={skill.icon} alt={skill.name} width={56} height={56} className="object-cover" />
        ) : (
          <span className="text-white/20 text-xs">--</span>
        )}
      </div>
      <p className="text-sm text-white/70 font-medium">{skill.name}</p>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 animate-pulse">
      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-white/[0.05]" />
      <div className="h-4 w-16 mx-auto rounded bg-white/[0.05]" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

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
          href="/#skills"
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
          All Expertise
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Skills<span className="text-white/15">.</span>
        </motion.h1>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-32 text-white/25">
          <p className="text-lg">No skills yet</p>
        </div>
      ) : (
        <div className="space-y-14">
          {(['technical', 'soft'] as const).map((cat) => {
            const group = skills.filter((s) => (s.category ?? 'technical') === cat);
            if (group.length === 0) return null;
            return (
              <div key={cat}>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6 font-light"
                >
                  {cat === 'technical' ? 'Technical Skills' : 'Soft Skills'}
                </motion.p>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {group.map((skill) => (
                    <SkillCard key={skill._id} skill={skill} />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
