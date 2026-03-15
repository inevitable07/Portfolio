import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(projects);
  } catch (err) {
    console.error('[projects GET]', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const techStackRaw = formData.get('techStack') as string;
    const githubLink = (formData.get('githubLink') as string) ?? '';
    const liveLink = (formData.get('liveLink') as string) ?? '';
    const colorTheme = (formData.get('colorTheme') as string) ?? 'sky';
    const featured = formData.get('featured') === 'true';
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const file = formData.get('thumbnail') as File | null;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    let techStack: string[] = [];
    try {
      techStack = techStackRaw ? JSON.parse(techStackRaw) : [];
    } catch {
      techStack = techStackRaw ? techStackRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];
    }

    let thumbnail = '';
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer);
      thumbnail = result.url;
    }

    const project = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      liveLink,
      thumbnail,
      colorTheme,
      featured,
      order,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('[projects POST]', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
