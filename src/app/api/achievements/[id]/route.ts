import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match?.[1] ?? null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const formData = await request.formData();

    const updates: Record<string, unknown> = {};

    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const order = formData.get('order') as string | null;
    const featuredRaw = formData.get('featured') as string | null;
    const file = formData.get('thumbnail') as File | null;

    if (name !== null) updates.name = name;
    if (description !== null) updates.description = description;
    if (order !== null) updates.order = parseInt(order, 10);
    if (featuredRaw !== null) updates.featured = featuredRaw !== 'false';

    if (file && file.size > 0) {
      const existing = await Achievement.findById(id).lean();
      if (existing?.thumbnail) {
        const publicId = extractPublicId(existing.thumbnail);
        if (publicId) {
          try { await deleteImage(publicId); } catch { /* ignore */ }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, 'portfolio/achievements');
      updates.thumbnail = result.url;
    }

    const achievement = await Achievement.findByIdAndUpdate(id, updates, { returnDocument: 'after' }).lean();
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (err) {
    console.error('[achievements PUT]', err);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const achievement = await Achievement.findById(id).lean();
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    if (achievement.thumbnail) {
      const publicId = extractPublicId(achievement.thumbnail);
      if (publicId) {
        try { await deleteImage(publicId); } catch { /* ignore */ }
      }
    }

    await Achievement.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[achievements DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
