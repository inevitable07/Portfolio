'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{ projects: number | null; skills: number | null; certificates: number | null }>({
    projects: null,
    skills: null,
    certificates: null,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [projRes, skillRes, certRes] = await Promise.allSettled([
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/certificates').then((r) => r.json()),
      ]);

      setCounts({
        projects: projRes.status === 'fulfilled' && Array.isArray(projRes.value) ? projRes.value.length : 0,
        skills: skillRes.status === 'fulfilled' && Array.isArray(skillRes.value) ? skillRes.value.length : 0,
        certificates: certRes.status === 'fulfilled' && Array.isArray(certRes.value) ? certRes.value.length : 0,
      });
    };
    fetchCounts();
  }, []);

  const sections = [
    { title: 'Projects', description: 'Manage portfolio projects', href: '/admin/projects', count: counts.projects },
    { title: 'Skills', description: 'Manage skill icons', href: '/admin/skills', count: counts.skills },
    { title: 'Certificates', description: 'Manage certificates', href: '/admin/certificates', count: counts.certificates },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6 hover:bg-white/[0.04] transition-colors"
          >
            <p className="text-lg font-semibold text-white mb-1">{s.title}</p>
            <p className="text-xs text-white/40 mb-4">{s.description}</p>
            <p className="text-3xl font-black text-white/80">
              {s.count === null ? (
                <span className="inline-block w-8 h-8 rounded bg-white/[0.05] animate-pulse" />
              ) : (
                s.count
              )}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
