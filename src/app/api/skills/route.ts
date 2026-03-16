import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { uploadIcon } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('featured') === 'true' ? { featured: true } : {};
    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(skills);
  } catch (err) {
    console.error('[skills GET]', err);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const category = (formData.get('category') as string) || 'technical';
    const featured = formData.get('featured') !== 'false';
    const file = formData.get('icon') as File | null;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let icon = '';
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadIcon(buffer);
      icon = result.url;
    }

    const skill = await Skill.create({ name, icon, order, category, featured });
    return NextResponse.json(skill, { status: 201 });
  } catch (err) {
    console.error('[skills POST]', err);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
