import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';
import { uploadIcon } from '@/lib/cloudinary';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(skills);
  } catch (err) {
    console.error('[skills GET]', err);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const category = (formData.get('category') as string) || 'technical';
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

    const skill = await Skill.create({ name, icon, order, category });
    return NextResponse.json(skill, { status: 201 });
  } catch (err) {
    console.error('[skills POST]', err);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
