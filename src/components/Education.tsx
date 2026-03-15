'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const milestones = [
  {
    year: '2019 - 2020',
    title: 'Secondary Education',
    institution: 'Rose Bud Academy, Khagaria, Bihar',
    description:
      'Completed schooling with a focus on Science and Mathematics. Developed a strong analytical foundation and first exposure to programming through computer science electives.',
    grade: '88.40%',
    side: 'right' as const,
    icon: '/education/rose-bud.png',
    initials: 'RB',
    accent: {
      border: 'rgba(96,165,250,0.14)',
      grad: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(255,255,255,0.015) 100%)',
      dot: '#60a5fa',
      dotGlow: 'rgba(96,165,250,0.22)',
      connector: 'rgba(96,165,250,0.35)',
      badge: 'rgba(96,165,250,0.12)',
      badgeText: 'rgba(147,197,253,0.9)',
      iconBg: 'rgba(96,165,250,0.08)',
      iconBorder: 'rgba(96,165,250,0.2)',
      iconText: 'rgba(147,197,253,0.8)',
    },
  },
  {
    year: '2020 - 2022',
    title: 'Higher Secondary Education',
    institution: 'R.B College, Dalsingh Sarai, Bihar',
    description:
      'Graduated with honours in Computer Science. Specialised in cloud infrastructure and distributed systems. Led the university DevOps club, organising workshops on CI/CD pipelines, containerisation, and infrastructure-as-code.',
    grade: '83.00%',
    side: 'left' as const,
    icon: '/education/rb-college.png',
    initials: 'RBC',
    accent: {
      border: 'rgba(52,211,153,0.14)',
      grad: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(255,255,255,0.015) 100%)',
      dot: '#34d399',
      dotGlow: 'rgba(52,211,153,0.22)',
      connector: 'rgba(52,211,153,0.35)',
      badge: 'rgba(52,211,153,0.1)',
      badgeText: 'rgba(110,231,183,0.9)',
      iconBg: 'rgba(52,211,153,0.08)',
      iconBorder: 'rgba(52,211,153,0.2)',
      iconText: 'rgba(110,231,183,0.8)',
    },
  },
  {
    year: '2023 - Present',
    title: 'B.Tech - Computer Science & Engineering',
    institution: 'Lovely Professional University, Phagwara, Punjab',
    description:
      'Earned AWS Solutions Architect Associate, Terraform Associate, and Certified Kubernetes Administrator (CKA) certifications. Continuously upskilling through hands-on projects and open-source contributions.',
    grade: 'CGPA 8.29',
    side: 'right' as const,
    icon: '/education/lpu.jpg',
    initials: 'LPU',
    accent: {
      border: 'rgba(167,139,250,0.14)',
      grad: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(255,255,255,0.015) 100%)',
      dot: '#a78bfa',
      dotGlow: 'rgba(167,139,250,0.22)',
      connector: 'rgba(167,139,250,0.35)',
      badge: 'rgba(167,139,250,0.1)',
      badgeText: 'rgba(196,181,253,0.9)',
      iconBg: 'rgba(167,139,250,0.08)',
      iconBorder: 'rgba(167,139,250,0.2)',
      iconText: 'rgba(196,181,253,0.8)',
    },
  },
];

type Milestone = (typeof milestones)[0];

const spineGradient =
  'linear-gradient(to bottom, rgba(96,165,250,0.3) 0%, rgba(52,211,153,0.18) 45%, rgba(167,139,250,0.15) 75%, transparent 100%)';

// ─── Institution Icon ─────────────────────────────────────────────────────────
function InstitutionIcon({ src, initials, accent }: { src: string; initials: string; accent: Milestone['accent'] }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
        style={{ backgroundColor: accent.iconBg, borderColor: accent.iconBorder }}
      >
        <span className="text-[10px] font-bold tracking-wide" style={{ color: accent.iconText }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={initials}
      onError={() => setFailed(true)}
      className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border"
      style={{ backgroundColor: accent.iconBg, borderColor: accent.iconBorder }}
    />
  );
}

// ─── Card Content ─────────────────────────────────────────────────────────────
function CardContent({ milestone }: { milestone: Milestone }) {
  const { accent } = milestone;
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <InstitutionIcon src={milestone.icon} initials={milestone.initials} accent={accent} />
        <div className="flex-1 min-w-0">
          <span className="block text-[11px] uppercase tracking-[0.35em] text-white/30 font-light leading-none mb-1.5">
            {milestone.year}
          </span>
          <span
            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide border"
            style={{ backgroundColor: accent.badge, color: accent.badgeText, borderColor: accent.border }}
          >
            {milestone.grade}
          </span>
        </div>
      </div>
      <h3 className="text-base md:text-xl font-bold text-white tracking-tight leading-snug mb-1">
        {milestone.title}
      </h3>
      <p className="text-sm text-white/40 font-medium mb-3 tracking-wide">{milestone.institution}</p>
      <p className="text-sm text-white/50 font-light leading-relaxed">{milestone.description}</p>
    </>
  );
}

// ─── Timeline Row ─────────────────────────────────────────────────────────────
function TimelineRow({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = milestone.side === 'left';
  const { accent } = milestone;

  return (
    <div ref={ref} className="relative grid grid-cols-2 items-center">

      {/* ── Connector line – ROW-level absolute so top-1/2 = same reference as the dot ── */}
      {/*   z-0 so the dot (z-10) sits ON TOP of the line, giving "line through dot" look   */}
      <div
        className="absolute top-1/2 h-px w-12 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          // Left card: line goes from card-right-edge (50%-3rem) → spine (50%)
          // Right card: line goes from spine (50%) → card-left-edge (50%+3rem)
          left: isLeft ? 'calc(50% - 3rem)' : '50%',
          backgroundImage: isLeft
            ? `linear-gradient(to right, transparent 0%, ${accent.connector} 100%)`
            : `linear-gradient(to left, transparent 0%, ${accent.connector} 100%)`,
        }}
      />

      {/* ── Left column ── */}
      <div className="flex items-center justify-end pr-12">
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className="w-full"
          >
            <div className="rounded-xl border p-6" style={{ backgroundImage: accent.grad, borderColor: accent.border }}>
              <CardContent milestone={milestone} />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Right column ── */}
      <div className="flex items-center justify-start pl-12">
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            className="w-full"
          >
            <div className="rounded-xl border p-6" style={{ backgroundImage: accent.grad, borderColor: accent.border }}>
              <CardContent milestone={milestone} />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Spine dot – z-10 so it renders on top of the connector line ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div
          className="w-5 h-5 rounded-full bg-[#0a0a0a] flex items-center justify-center border"
          style={{ borderColor: accent.dot + '66', boxShadow: `0 0 10px ${accent.dotGlow}` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent.dot }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Comet Trailing Effect (burning fire) ────────────────────────────────────

// Wisp flame configuration
const wispCfg = [
  // { xOff (px from center), height, dur, startDelay, opacityKeys, scaleXKeys }
  { x: 0,   h: 68, dur: 1.5, del: 0.0, op: [0.5, 1.0, 0.3, 0.9, 0.5], sx: [1, 2.2, 0.5, 1.8, 1] },
  { x: -5,  h: 52, dur: 1.9, del: 0.3, op: [0.3, 0.8, 0.6, 0.2, 0.3], sx: [1, 1.5, 0.6, 1.2, 1] },
  { x:  5,  h: 50, dur: 2.0, del: 0.5, op: [0.6, 0.2, 0.9, 0.4, 0.6], sx: [1, 1.4, 0.7, 1.6, 1] },
  { x: -11, h: 36, dur: 1.4, del: 0.1, op: [0.2, 0.7, 0.1, 0.6, 0.2], sx: [1, 1.8, 0.4, 1.1, 1] },
  { x:  11, h: 34, dur: 1.7, del: 0.6, op: [0.4, 0.1, 0.8, 0.3, 0.4], sx: [1, 1.3, 0.8, 1.5, 1] },
  { x: -17, h: 22, dur: 1.2, del: 0.4, op: [0.1, 0.5, 0.1, 0.4, 0.1], sx: [1, 2.0, 0.3, 1.0, 1] },
  { x:  17, h: 20, dur: 1.3, del: 0.8, op: [0.2, 0.4, 0.1, 0.5, 0.2], sx: [1, 1.6, 0.5, 1.2, 1] },
];

function CometTrail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center pt-4 pb-10"
    >
      {/* Fixed-size container so wisps can be pixel-positioned */}
      <div className="relative" style={{ width: 56, height: 130 }}>

        {/* ── Fire wisps – each independently animated ── */}
        {wispCfg.map((w, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              width: 1,
              height: w.h,
              // bottom: distance from comet head
              bottom: 26,
              // horizontal position relative to center (left: 50% + offset)
              left: `calc(50% + ${w.x}px)`,
              // flames grow from bottom (head) up
              transformOrigin: 'bottom center',
            }}
          >
            <motion.div
              animate={{
                opacity: w.op,
                scaleX: w.sx,
                // subtle horizontal turbulence (each wisp drifts slightly)
                x: [0, w.x > 0 ? 1.2 : -1.2, w.x > 0 ? -0.6 : 0.6, w.x > 0 ? 0.8 : -0.8, 0],
              }}
              transition={{ duration: w.dur, repeat: Infinity, delay: w.del, ease: 'easeInOut' }}
              className="w-full h-full"
              style={{ originX: 0.5, originY: 1 }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'linear-gradient(to top, rgba(192,132,252,0.85) 0%, rgba(147,51,234,0.45) 45%, rgba(88,28,135,0.2) 75%, transparent 100%)',
                }}
              />
            </motion.div>
          </div>
        ))}

        {/* ── Outer wide glow halo (blurred, barely moves) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 40,
            height: 70,
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundImage:
              'linear-gradient(to top, rgba(88,28,135,0.06) 0%, rgba(147,51,234,0.14) 60%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />

        {/* ── Comet head: layered glowing orb ── */}
        <div
          className="absolute pointer-events-none"
          style={{ width: 22, height: 22, bottom: 4, left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 0.9, 1.1, 1], opacity: [0.85, 1, 0.75, 1, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full"
          >
          {/* Outermost halo */}
          <div
            className="absolute rounded-full"
            style={{
              width: 52,
              height: 52,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
              filter: 'blur(6px)',
            }}
          />
          {/* Middle glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 32,
              height: 32,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundImage: 'radial-gradient(circle, rgba(192,132,252,0.45) 0%, transparent 65%)',
              filter: 'blur(3px)',
            }}
          />
          {/* Core orb */}
          <div
            className="w-full h-full rounded-full"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(233,213,255,0.85) 35%, rgba(192,132,252,0.5) 70%, transparent 100%)',
              boxShadow:
                '0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(192,132,252,0.85), 0 0 32px rgba(147,51,234,0.65), 0 0 56px rgba(88,28,135,0.35)',
            }}
          />
        </motion.div>

        </div>{/* end comet head wrapper */}

      </div>{/* end 56×130 container */}
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Education() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="education"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(56,189,248,0.07) 0%, transparent 70%)' }}
      />

      {/* Section header */}
      <div ref={headerRef} className="mb-20 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          Background
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em]"
        >
          Education<span className="text-white/15">.</span>
        </motion.h2>
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto">

        {/* Vertical spine */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ originY: 0 }}
          className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-px pointer-events-none"
        >
          <div className="w-full h-full" style={{ backgroundImage: spineGradient }} />
        </motion.div>

        {/* Down chevron */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1l5 5 5-5"
              stroke="rgba(96,165,250,0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Cards + comet trail */}
        <div className="flex flex-col gap-20">
          {milestones.map((m, i) => (
            <TimelineRow key={i} milestone={m} index={i} />
          ))}
          <CometTrail />
        </div>

      </div>
    </section>
  );
}
