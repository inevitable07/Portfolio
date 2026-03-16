'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { THEME_KEYS } from '@/lib/colorThemes';

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [colorTheme, setColorTheme] = useState('sky');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        const project = projects.find((p: { _id: string }) => p._id === id);
        if (!project) { setError('Project not found'); return; }

        setTitle(project.title);
        setDescription(project.description);
        setTechStack((project.techStack ?? []).join(', '));
        setGithubLink(project.githubLink ?? '');
        setLiveLink(project.liveLink ?? '');
        setColorTheme(project.colorTheme ?? 'sky');
        setFeatured(project.featured ?? false);
        setOrder(project.order ?? 0);
        setCurrentThumbnail(project.thumbnail ?? '');
      } catch {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('techStack', JSON.stringify(techStack.split(',').map((s) => s.trim()).filter(Boolean)));
      formData.append('githubLink', githubLink);
      formData.append('liveLink', liveLink);
      formData.append('colorTheme', colorTheme);
      formData.append('featured', String(featured));
      formData.append('order', String(order));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const res = await fetch(`/api/projects/${id}`, { method: 'PUT', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }

      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200';

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-8 w-40 rounded bg-white/[0.03] animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-8">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputCls} />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Tech Stack (comma-separated)</label>
          <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} className={inputCls} />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">GitHub Link</label>
            <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Live Demo Link <span className="text-white/20">(optional)</span></label>
            <input type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} className={inputCls} placeholder="Leave empty to hide the live link icon" />
          </div>
        </div>

        {/* Color Theme + Order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Color Theme</label>
            <select value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} className={inputCls}>
              {THEME_KEYS.map((key) => (
                <option key={key} value={key} className="bg-[#1a1a1a] text-white">{key}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Order</label>
            <input type="number" value={order} onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))} min={1} className={inputCls} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/[0.04]" />
              <span className="text-sm text-white/60">Featured</span>
            </label>
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Thumbnail Image</label>
          {currentThumbnail && (
            <div className="mb-3 w-48 h-28 rounded-lg overflow-hidden border border-white/[0.07]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentThumbnail} alt="Current thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/[0.08] file:text-sm file:font-medium file:bg-white/[0.04] file:text-white/60 hover:file:bg-white/[0.08] file:cursor-pointer file:transition-all"
          />
          <p className="text-[11px] text-white/25 mt-1">Leave empty to keep existing image</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-40 transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-white/[0.08] text-white/60 text-sm hover:text-white hover:border-white/20 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
