'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProjectItem {
  _id: string;
  title: string;
  thumbnail: string;
  colorTheme: string;
  featured: boolean;
  order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {
      console.error('Failed to delete project');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
        >
          + Add Project
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg mb-2">No projects yet</p>
          <p className="text-sm">Click &ldquo;+ Add Project&rdquo; to create your first project.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-16 h-10 rounded-md overflow-hidden bg-white/[0.05] flex-shrink-0">
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40">
                    {p.colorTheme}
                  </span>
                  {p.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      Featured
                    </span>
                  )}
                  <span className="text-[10px] text-white/25">Order: {p.order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/projects/${p._id}/edit`}
                  className="px-3 py-1.5 rounded-md text-xs border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id, p.title)}
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
