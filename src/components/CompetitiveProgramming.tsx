'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import type { CPData } from '@/app/api/codolio/route';

// ─── Constants ────────────────────────────────────────────────────────────────
const NUM_WEEKS = 26;
const CELL = 10;     // px
const GAP = 2;       // px
const COL = CELL + GAP;
const DAY_LABEL_W = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cellColor(count: number): string {
  if (count === 0) return 'rgba(255,255,255,0.04)';
  if (count <= 2)  return 'rgba(16,185,129,0.22)';
  if (count <= 5)  return 'rgba(16,185,129,0.50)';
  if (count <= 9)  return 'rgba(16,185,129,0.75)';
  return '#10b981';
}

function buildGrid(heatmap: { date: string; count: number }[]) {
  const map = new Map(heatmap.map(h => [h.date, h.count]));
  const today = new Date();

  // Align to the Monday of the current week
  const dow = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);

  const weeks: { date: string; count: number; future: boolean }[][] = [];

  for (let w = NUM_WEEKS - 1; w >= 0; w--) {
    const week: { date: string; count: number; future: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() - w * 7 + d);
      const dateStr = date.toISOString().split('T')[0];
      week.push({
        date: dateStr,
        count: map.get(dateStr) ?? 0,
        future: date > today,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

type WeekGrid = ReturnType<typeof buildGrid>;

function getMonthLabels(weeks: WeekGrid) {
  const labels: { idx: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const m = new Date(week[0].date).getMonth();
    if (m !== lastMonth) {
      labels.push({
        idx: i,
        label: new Date(week[0].date).toLocaleDateString('en-US', { month: 'short' }),
      });
      lastMonth = m;
    }
  });
  return labels;
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
// Each segment uses strokeDasharray="len gapLen" + strokeDashoffset=C-cumAcc
// so segments appear back-to-back starting from the top (-90° rotation).
function DonutChart({
  segments,
  total,
}: {
  segments: { color: string; value: number }[];
  total: number;
}) {
  const r = 40;
  const C = 2 * Math.PI * r; // ≈ 251.3
  let cumAcc = 0;

  return (
    <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="11"
        />
        <g transform="rotate(-90, 50, 50)">
          {segments.map((seg, i) => {
            if (seg.value === 0 || total === 0) return null;
            const len = (seg.value / total) * C;
            const offset = C - cumAcc;
            cumAcc += len;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="11"
                strokeLinecap="butt"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xl font-black text-white tabular-nums">{total}</span>
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as number[] } },
};

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 flex flex-col gap-1 text-center"
    >
      <span className={`text-4xl sm:text-5xl font-black tracking-tight ${accent} tabular-nums`}>
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.28em] text-white/30 font-medium mt-1">
        {label}
      </span>
    </motion.div>
  );
}

// ─── AnimatedStatCard ─────────────────────────────────────────────────────────
function AnimatedStatCard({
  label,
  value,
  accent,
  shouldAnimate,
  isSuffix = false,
}: {
  label: string;
  value: number;
  accent: string;
  shouldAnimate: boolean;
  isSuffix?: boolean; // if true, value has suffix like 'd'
}) {
  const animatedValue = useCounterAnimation({
    target: value,
    duration: 1200,
    shouldAnimate,
  });

  // Show animated value if animating, otherwise show actual final value
  const displayValue = isSuffix
    ? `${shouldAnimate ? animatedValue : value}d`
    : shouldAnimate ? animatedValue : value;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 flex flex-col gap-1 text-center"
    >
      <span className={`text-4xl sm:text-5xl font-black tracking-tight ${accent} tabular-nums`}>
        {displayValue}
      </span>
      <span className="text-[11px] uppercase tracking-[0.28em] text-white/30 font-medium mt-1">
        {label}
      </span>
    </motion.div>
  );
}

// ─── AwardBadge ───────────────────────────────────────────────────────────────
const PLATFORM_GRADIENT: Record<string, string> = {
  HackerRank: 'linear-gradient(135deg, #1aba9a, #15896f)',
  CodeChef:   'linear-gradient(135deg, #f97316, #c2410c)',
  LeetCode:   'linear-gradient(135deg, #fbbf24, #d97706)',
  GFG:        'linear-gradient(135deg, #22c55e, #15803d)',
};

function AwardBadge({ award }: { award: { title: string; platform: string; stars: number } }) {
  const bg = PLATFORM_GRADIENT[award.platform] ?? 'linear-gradient(135deg, #6366f1, #4338ca)';
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-16 flex flex-col items-center justify-center gap-0.5 opacity-85"
        style={{
          background: bg,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        <span className="text-[8px] font-bold text-white/90 text-center leading-tight px-1">
          {award.title}
        </span>
        {award.stars > 0 && (
          <span className="text-[9px] text-yellow-200 leading-none">{'★'.repeat(award.stars)}</span>
        )}
      </div>
      <span className="text-[9px] text-white/30 text-center leading-tight">{award.platform}</span>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/[0.03] animate-pulse ${className}`} />;
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CompetitiveProgramming() {
  const [data, setData] = useState<CPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [shouldAnimateStats, setShouldAnimateStats] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const observerSetRef = useRef(false);

  // Intersection Observer to trigger animation when stats section becomes visible
  // Re-run this when data loads so the ref is available
  useEffect(() => {
    if (!data || !statsRef.current || observerSetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !observerSetRef.current) {
            setShouldAnimateStats(true);
            observerSetRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-60px' }
    );

    observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, [data]);

  const loadData = async (manual = false) => {
    if (manual) {
      setRefreshing(true);
      // Reset animation flags so it can run again after refresh
      setShouldAnimateStats(false);
      observerSetRef.current = false;
    } else {
      setLoading(true);
    }
    setFetchError(null);

    try {
      const suffix = manual ? `?ts=${Date.now()}` : '';
      const res = await fetch(`/api/codolio${suffix}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const d: CPData = await res.json();
      setData(d);
      
      // Trigger animation again after refresh data loads
      if (manual) {
        setShouldAnimateStats(true);
      }
    } catch {
      setFetchError('Unable to refresh data right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData(false);
  }, []);

  const weeks = data ? buildGrid(data.heatmap) : [];
  const monthLabels = data ? getMonthLabels(weeks) : [];

  const fundTotal = data ? data.fundamentals.reduce((s, f) => s + f.count, 0) : 0;
  const dsaTotal  = data ? data.dsaEasy + data.dsaMedium + data.dsaHard : 0;

  return (
    <section
      id="competitive"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section transition glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.18), transparent)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div ref={headerRef} className="mb-16 text-center mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/25 mb-5 font-light"
        >
          DSA & Problem Solving
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white leading-none tracking-[-0.03em] mb-4"
        >
          Competitive Programming<span className="text-white/15">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-white/35 text-sm font-light leading-relaxed max-w-lg mx-auto"
        >
          Sharpening problem-solving skills one commit at a time — across LeetCode, GFG, HackerRank and more.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : data && (
          <div ref={statsRef}>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <AnimatedStatCard
                label="Questions Solved"
                value={data.totalQuestions}
                accent="text-indigo-400"
                shouldAnimate={shouldAnimateStats}
              />
              <AnimatedStatCard
                label="Active Days"
                value={data.totalActiveDays}
                accent="text-sky-400"
                shouldAnimate={shouldAnimateStats}
              />
              <AnimatedStatCard
                label="Max Streak"
                value={data.maxStreak}
                accent="text-emerald-400"
                shouldAnimate={shouldAnimateStats}
                isSuffix
              />
              <AnimatedStatCard
                label="Current Streak"
                value={data.currentStreak}
                accent="text-violet-400"
                shouldAnimate={shouldAnimateStats}
                isSuffix
              />
            </motion.div>
          </div>
        )}

        {/* ── Heatmap ────────────────────────────────────────────────────── */}
        {loading ? (
          <Skeleton className="h-40" />
        ) : data && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 md:p-7"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-medium">
                Submission Activity
              </p>
              <button
                type="button"
                onClick={() => void loadData(true)}
                disabled={refreshing}
                className="w-6 h-6 text-white/50 hover:text-white/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Refresh activity"
                aria-label="Refresh submission activity"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15.55-6.36L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15.55 6.36L3 16" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <div style={{ minWidth: DAY_LABEL_W + NUM_WEEKS * COL }}>
                {/* Month labels */}
                <div className="relative h-5 mb-1" style={{ paddingLeft: DAY_LABEL_W }}>
                  {monthLabels.map(({ idx, label }) => (
                    <span
                      key={`${label}-${idx}`}
                      className="absolute text-[9px] text-white/25 leading-none select-none"
                      style={{ left: DAY_LABEL_W + idx * COL }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                {/* Grid */}
                <div className="flex">
                  {/* Day-of-week labels */}
                  <div className="flex flex-col shrink-0" style={{ width: DAY_LABEL_W, gap: GAP }}>
                    {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-end pr-1"
                        style={{ height: CELL }}
                      >
                        <span className="text-[8px] text-white/20 select-none">{d}</span>
                      </div>
                    ))}
                  </div>
                  {/* Week columns */}
                  <div className="flex" style={{ gap: GAP }}>
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                        {week.map((day, di) => (
                          <div
                            key={di}
                            title={`${day.date}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                            style={{
                              width: CELL,
                              height: CELL,
                              borderRadius: 2,
                              background: day.future
                                ? 'transparent'
                                : cellColor(day.count),
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 justify-end">
                  <span className="text-[9px] text-white/20 select-none">Less</span>
                  {[0, 2, 4, 7, 10].map(c => (
                    <div
                      key={c}
                      style={{ width: CELL, height: CELL, borderRadius: 2, background: cellColor(c) }}
                    />
                  ))}
                  <span className="text-[9px] text-white/20 select-none">More</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-white/[0.05]">
              <span className="text-[11px] text-white/30 whitespace-nowrap">
                Total submissions across platforms:{' '}
                <span className="text-emerald-400/80 font-semibold tabular-nums">{data.totalSubmissions}</span>
              </span>
              <span className="text-[11px] text-white/25 min-h-[16px] text-right">
                {fetchError ?? ''}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Problems Solved + Awards ────────────────────────────────────── */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
          </div>
        ) : data && (
          <div className="grid md:grid-cols-3 gap-5">

            {/* Fundamentals card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-medium mb-5">
                Fundamentals
              </p>
              <div className="flex items-center gap-5">
                <DonutChart
                  total={fundTotal}
                  segments={data.fundamentals.map(f => ({ color: f.color, value: f.count }))}
                />
                <div className="flex flex-col gap-3 min-w-0">
                  {data.fundamentals.map(f => (
                    <div key={f.platform} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ background: f.color }}
                      />
                      <span className="text-xs text-white/50 truncate">{f.platform}</span>
                      <span className="ml-auto text-xs font-semibold text-white/70 tabular-nums">{f.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* DSA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-medium mb-5">
                DSA Problems
              </p>
              <div className="flex items-center gap-5">
                <DonutChart
                  total={dsaTotal}
                  segments={[
                    { color: '#00b8a3', value: data.dsaEasy },
                    { color: '#ffc01e', value: data.dsaMedium },
                    { color: '#ff375f', value: data.dsaHard },
                  ]}
                />
                <div className="flex flex-col gap-3 min-w-0">
                  {[
                    { label: 'Easy',   val: data.dsaEasy,   color: '#00b8a3' },
                    { label: 'Medium', val: data.dsaMedium, color: '#ffc01e' },
                    { label: 'Hard',   val: data.dsaHard,   color: '#ff375f' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ background: row.color }}
                      />
                      <span className="text-xs text-white/50">{row.label}</span>
                      <span className="ml-auto text-xs font-semibold text-white/70 tabular-nums">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Awards card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-medium mb-5">
                Awards
              </p>
              <div className="flex flex-wrap gap-4 items-start">
                {data.awards.map((a, i) => (
                  <AwardBadge key={i} award={a} />
                ))}
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </section>
  );
}
