import { NextResponse } from 'next/server';

// ─── Shared data shape ────────────────────────────────────────────────────────
export interface CPData {
  totalQuestions: number;
  totalSubmissions: number;
  totalActiveDays: number;
  maxStreak: number;
  currentStreak: number;
  heatmap: { date: string; count: number }[];
  awards: { title: string; platform: string; stars: number }[];
  fundamentals: { platform: string; count: number; color: string }[];
  dsaEasy: number;
  dsaMedium: number;
  dsaHard: number;
}

// ─── Platform usernames from .env.local ──────────────────────────────────────
const LC_USER = process.env.LEETCODE_USERNAME ?? '';
const HR_USER = process.env.HACKERRANK_USERNAME ?? '';

// ─── Mock / fallback data ────────────────────────────────────────────────────
function buildMockHeatmap(): { date: string; count: number }[] {
  const pattern = [0, 0, 1, 3, 0, 2, 0, 5, 1, 0, 0, 4, 2, 0, 7, 0, 1, 3, 0, 0];
  const today = new Date();
  return Array.from({ length: 183 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (182 - i));
    return { date: d.toISOString().split('T')[0], count: pattern[i % pattern.length] };
  });
}

const MOCK: CPData = {
  totalQuestions: 292,
  totalSubmissions: 468,
  totalActiveDays: 131,
  maxStreak: 27,
  currentStreak: 12,
  heatmap: buildMockHeatmap(),
  awards: [
    { title: 'Java', platform: 'HackerRank', stars: 2 },
    { title: 'Problem Solving', platform: 'HackerRank', stars: 2 },
    { title: 'BPS', platform: 'CodeChef', stars: 1 },
  ],
  fundamentals: [
    { platform: 'LeetCode', count: 259, color: '#f97316' },
    { platform: 'HackerRank', count: 33, color: '#facc15' },
  ],
  dsaEasy: 142,
  dsaMedium: 109,
  dsaHard: 7,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert LeetCode submissionCalendar (unix-ts → count) to date array */
function lcCalendarToHeatmap(
  calJson: string,
): { date: string; count: number }[] {
  let raw: Record<string, number> = {};
  try { raw = JSON.parse(calJson); } catch { return []; }

  const map = new Map<string, number>();
  for (const [ts, count] of Object.entries(raw)) {
    const date = new Date(Number(ts) * 1000).toISOString().split('T')[0];
    map.set(date, (map.get(date) ?? 0) + count);
  }

  // Build 26-week window ending today
  const today = new Date();
  return Array.from({ length: 183 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (182 - i));
    const dateStr = d.toISOString().split('T')[0];
    return { date: dateStr, count: map.get(dateStr) ?? 0 };
  });
}

/** Compute max consecutive active-day streak from a heatmap */
function computeMaxStreak(heatmap: { date: string; count: number }[]): number {
  let max = 0, current = 0;
  const sorted = [...heatmap].sort((a, b) => a.date.localeCompare(b.date));
  for (const { count } of sorted) {
    if (count > 0) { current++; max = Math.max(max, current); }
    else { current = 0; }
  }
  return max;
}

/** Walk backward from today through the heatmap to get the live current streak */
function computeCurrentStreak(heatmap: { date: string; count: number }[]): number {
  const map = new Map(heatmap.map(h => [h.date, h.count]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cur = new Date(today);

  // If no submission today yet, begin checking from yesterday
  const todayStr = cur.toISOString().split('T')[0];
  if ((map.get(todayStr) ?? 0) === 0) {
    cur.setDate(cur.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const dateStr = cur.toISOString().split('T')[0];
    if (!map.has(dateStr)) break; // outside the 26-week window
    if ((map.get(dateStr) ?? 0) === 0) break;
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

// ─── LeetCode ─────────────────────────────────────────────────────────────────
interface LCResult {
  easy: number; medium: number; hard: number;
  heatmap: { date: string; count: number }[];
  totalActiveDays: number; currentStreak: number; maxStreak: number;
}
async function fetchLeetCode(username: string): Promise<LCResult | null> {
  const year = new Date().getFullYear();
  const query = `{
    matchedUser(username: "${username}") {
      submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } }
      calCur: userCalendar(year: ${year}) { streak totalActiveDays submissionCalendar }
      calPrev: userCalendar(year: ${year - 1}) { streak totalActiveDays submissionCalendar }
    }
  }`;
  const res = await fetch('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com/' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`LC HTTP ${res.status}`);
  const json = await res.json() as { data?: { matchedUser?: {
    submitStats: { acSubmissionNum: { difficulty: string; count: number }[] };
    calCur: { streak: number; totalActiveDays: number; submissionCalendar: string };
    calPrev: { streak: number; totalActiveDays: number; submissionCalendar: string };
  } } };

  const u = json.data?.matchedUser;
  if (!u) return null;

  const stats = u.submitStats.acSubmissionNum;
  const easy   = stats.find(s => s.difficulty === 'Easy')?.count   ?? 0;
  const medium = stats.find(s => s.difficulty === 'Medium')?.count ?? 0;
  const hard   = stats.find(s => s.difficulty === 'Hard')?.count   ?? 0;

  // Merge both calendar years into one heatmap (last 26 weeks)
  const mergedCal = (u.calPrev.submissionCalendar || '') + (u.calCur.submissionCalendar || '');
  // Parse both separately and combine
  let rawMap: Record<string, number> = {};
  try { rawMap = { ...JSON.parse(u.calPrev.submissionCalendar || '{}'), ...JSON.parse(u.calCur.submissionCalendar || '{}') }; } catch { /* ignore */ }
  const heatmap = lcCalendarToHeatmap(JSON.stringify(rawMap));
  void mergedCal; // suppress unused warning

  const totalActiveDays = (u.calPrev.totalActiveDays ?? 0) + (u.calCur.totalActiveDays ?? 0);
  const maxStreak     = computeMaxStreak(heatmap);
  const currentStreak = computeCurrentStreak(heatmap);

  return { easy, medium, hard, heatmap, totalActiveDays, currentStreak, maxStreak };
}

// ─── HackerRank ──────────────────────────────────────────────────────────────
interface HRBadge { name: string; stars: number; }
interface HRResult { badges: HRBadge[]; solved: number; }
async function fetchHackerRank(username: string): Promise<HRResult | null> {
  const res = await fetch(
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/badges`,
    { headers: { Accept: 'application/json' }, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error(`HR HTTP ${res.status}`);
  const json = await res.json() as {
    models?: { name: string; stars: number; solved?: number }[];
  };
  const models = json.models ?? [];
  const badges: HRBadge[] = models.map(b => ({ name: b.name, stars: b.stars ?? 0 }));
  const solved = models.reduce((s, b) => s + (b.solved ?? 0), 0);
  return { badges, solved };
}

// ─── Combine all platforms ────────────────────────────────────────────────────
async function fetchAll(): Promise<CPData> {
  const [lcRes, hrRes] = await Promise.allSettled([
    LC_USER ? fetchLeetCode(LC_USER)   : Promise.resolve(null),
    HR_USER ? fetchHackerRank(HR_USER) : Promise.resolve(null),
  ]);

  const lc = lcRes.status === 'fulfilled' ? lcRes.value : null;
  const hr = hrRes.status === 'fulfilled' ? hrRes.value : null;

  if (lcRes.status === 'rejected') console.error('[cp-api] LeetCode:', lcRes.reason);
  if (hrRes.status === 'rejected') console.error('[cp-api] HackerRank:', hrRes.reason);

  // If nothing came back, return mock
  if (!lc && !hr) return MOCK;

  // ── Stats aggregation ──────────────────────────────────────────────────
  const lcTotal  = lc ? (lc.easy + lc.medium + lc.hard) : 0;
  const hrSolved = hr ? hr.solved : 0;
  const totalQuestions = lcTotal + hrSolved || MOCK.totalQuestions;
  const totalSubmissions = (lcTotal + hrSolved) || MOCK.totalSubmissions;

  const totalActiveDays = lc?.totalActiveDays || MOCK.totalActiveDays;
  const currentStreak   = lc?.currentStreak   ?? MOCK.currentStreak;
  const maxStreak       = lc?.maxStreak       || MOCK.maxStreak;

  // ── Heatmap: prefer LeetCode live data, else mock ─────────────────────
  const heatmap = (lc?.heatmap && lc.heatmap.some(h => h.count > 0))
    ? lc.heatmap
    : MOCK.heatmap;

  // ── Fundamentals donut ────────────────────────────────────────────────
  const fundamentals: CPData['fundamentals'] = [];
  if (hrSolved > 0) fundamentals.push({ platform: 'HackerRank', count: hrSolved, color: '#facc15' });
  if (lcTotal  > 0) fundamentals.push({ platform: 'LeetCode',   count: lcTotal,  color: '#f97316' });
  const useFundamentals = fundamentals.length > 0 ? fundamentals : MOCK.fundamentals;

  // ── Awards from HackerRank badges ────────────────────────────────────
  const awards: CPData['awards'] = hr?.badges.map(b => ({
    title: b.name,
    platform: 'HackerRank',
    stars: b.stars,
  })) ?? MOCK.awards;

  // ── DSA donut: LeetCode Easy/Medium/Hard ─────────────────────────────
  const dsaEasy   = lc?.easy   ?? MOCK.dsaEasy;
  const dsaMedium = lc?.medium ?? MOCK.dsaMedium;
  const dsaHard   = lc?.hard   ?? MOCK.dsaHard;

  return {
    totalQuestions,
    totalSubmissions,
    totalActiveDays,
    currentStreak,
    maxStreak,
    heatmap,
    fundamentals: useFundamentals,
    awards,
    dsaEasy,
    dsaMedium,
    dsaHard,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET() {
  // If no usernames configured at all, serve mock immediately
  if (!LC_USER && !HR_USER) {
    return NextResponse.json(MOCK);
  }
  try {
    const data = await fetchAll();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[cp-api]', err);
    return NextResponse.json(MOCK);
  }
}
