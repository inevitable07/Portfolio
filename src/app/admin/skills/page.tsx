'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SkillItem {
  _id: string;
  name: string;
  icon: string;
  order: number;
  category?: 'technical' | 'soft';
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      console.error('Failed to delete skill');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Skills</h2>
        <Link
          href="/admin/skills/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
        >
          + Add Skill
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg mb-2">No skills yet</p>
          <p className="text-sm">Click &ldquo;+ Add Skill&rdquo; to create your first skill.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((s) => (
            <div
              key={s._id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.05] flex-shrink-0">
                {s.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.icon} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                    --
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-white truncate">{s.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${(s.category ?? 'technical') === 'technical' ? 'bg-emerald-500/10 text-emerald-400/70' : 'bg-violet-500/10 text-violet-400/70'}`}>
                    {(s.category ?? 'technical') === 'technical' ? 'Technical' : 'Soft'}
                  </span>
                </div>
                <span className="text-[10px] text-white/25">Order: {s.order}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/skills/${s._id}/edit`}
                  className="px-3 py-1.5 rounded-md text-xs border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(s._id, s.name)}
                  className="px-3 py-1.5 rounded-md text-xs border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
