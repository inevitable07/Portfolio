import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('featured') === 'true' ? { featured: true } : {};
    const achievements = await Achievement.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(achievements);
  } catch (err) {
    console.error('[achievements GET]', err);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) ?? '';
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const featured = formData.get('featured') !== 'false';
    const file = formData.get('thumbnail') as File | null;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let thumbnail = '';
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, 'portfolio/achievements');
      thumbnail = result.url;
    }

    const achievement = await Achievement.create({ name, description, thumbnail, order, featured });
    return NextResponse.json(achievement, { status: 201 });
  } catch (err) {
    console.error('[achievements POST]', err);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
