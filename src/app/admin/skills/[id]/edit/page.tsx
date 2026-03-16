'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditSkill() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);
  const [category, setCategory] = useState<'technical' | 'soft'>('technical');
  const [featured, setFeatured] = useState(true);
  const [currentIcon, setCurrentIcon] = useState('');
  const [icon, setIcon] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/skills');
        const skills = await res.json();
        const skill = skills.find((s: { _id: string }) => s._id === id);
        if (!skill) { setError('Skill not found'); return; }

        setName(skill.name);
        setOrder(skill.order ?? 1);
        setCategory(skill.category ?? 'technical');
        setFeatured(skill.featured ?? true);
        setCurrentIcon(skill.icon ?? '');
      } catch {
        setError('Failed to load skill');
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
      formData.append('name', name);
      formData.append('order', String(order));
      formData.append('category', category);
      formData.append('featured', String(featured));
      if (icon) formData.append('icon', icon);

      const res = await fetch(`/api/skills/${id}`, { method: 'PUT', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update skill');
      }

      router.push('/admin/skills');
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
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-8">Edit Skill</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        </div>

        {/* Order */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Math.max(1, Number(e.target.value)))} min={1} className={inputCls} />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'technical' | 'soft')}
            className={inputCls}
          >
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFeatured((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${featured ? 'bg-emerald-500/70' : 'bg-white/10'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-xs text-white/50">Featured — show on homepage</span>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Icon Image</label>
          {currentIcon && (
            <div className="mb-3 w-10 h-10 rounded-lg overflow-hidden border border-white/[0.07]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentIcon} alt="Current icon" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files?.[0] ?? null)}
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
