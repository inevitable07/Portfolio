import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { uploadIcon, deleteImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match?.[1] ?? null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectDB();
    const formData = await request.formData();

    const updates: Record<string, unknown> = {};

    const name = formData.get('name') as string | null;
    const order = formData.get('order') as string | null;
    const category = formData.get('category') as string | null;
    const featuredRaw = formData.get('featured') as string | null;
    const file = formData.get('icon') as File | null;

    if (name !== null) updates.name = name;
    if (order !== null) updates.order = parseInt(order, 10);
    if (category !== null) updates.category = category;
    if (featuredRaw !== null) updates.featured = featuredRaw !== 'false';

    if (file && file.size > 0) {
      const existing = await Skill.findById(id).lean();
      if (existing?.icon) {
        const publicId = extractPublicId(existing.icon);
        if (publicId) {
          try { await deleteImage(publicId); } catch { /* ignore */ }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadIcon(buffer);
      updates.icon = result.url;
    }

    const skill = await Skill.findByIdAndUpdate(id, updates, { returnDocument: 'after' }).lean();
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (err) {
    console.error('[skills PUT]', err);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await connectDB();

    const skill = await Skill.findById(id).lean();
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    if (skill.icon) {
      const publicId = extractPublicId(skill.icon);
      if (publicId) {
        try { await deleteImage(publicId); } catch { /* ignore */ }
      }
    }

    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[skills DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
