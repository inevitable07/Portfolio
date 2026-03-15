import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

/** Extract Cloudinary public_id from a secure_url */
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

    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const techStackRaw = formData.get('techStack') as string | null;
    const githubLink = formData.get('githubLink') as string | null;
    const liveLink = formData.get('liveLink') as string | null;
    const colorTheme = formData.get('colorTheme') as string | null;
    const featured = formData.get('featured') as string | null;
    const order = formData.get('order') as string | null;
    const file = formData.get('thumbnail') as File | null;

    if (title !== null) updates.title = title;
    if (description !== null) updates.description = description;
    if (githubLink !== null) updates.githubLink = githubLink;
    if (liveLink !== null) updates.liveLink = liveLink;
    if (colorTheme !== null) updates.colorTheme = colorTheme;
    if (featured !== null) updates.featured = featured === 'true';
    if (order !== null) updates.order = parseInt(order, 10);

    if (techStackRaw !== null) {
      try {
        updates.techStack = JSON.parse(techStackRaw);
      } catch {
        updates.techStack = techStackRaw.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    if (file && file.size > 0) {
      // Delete old thumbnail if it exists
      const existing = await Project.findById(id).lean();
      if (existing?.thumbnail) {
        const publicId = extractPublicId(existing.thumbnail);
        if (publicId) {
          try { await deleteImage(publicId); } catch { /* ignore */ }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer);
      updates.thumbnail = result.url;
    }

    const project = await Project.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error('[projects PUT]', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id).lean();
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete Cloudinary image if exists
    if (project.thumbnail) {
      const publicId = extractPublicId(project.thumbnail);
      if (publicId) {
        try { await deleteImage(publicId); } catch { /* ignore */ }
      }
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[projects DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
