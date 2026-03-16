import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
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
    const certificateLink = formData.get('certificateLink') as string | null;
    const order = formData.get('order') as string | null;
    const featuredRaw = formData.get('featured') as string | null;
    const file = formData.get('thumbnail') as File | null;

    if (name !== null) updates.name = name;
    if (certificateLink !== null) updates.certificateLink = certificateLink;
    if (order !== null) updates.order = parseInt(order, 10);
    if (featuredRaw !== null) updates.featured = featuredRaw !== 'false';

    if (file && file.size > 0) {
      const existing = await Certificate.findById(id).lean();
      if (existing?.thumbnail) {
        const publicId = extractPublicId(existing.thumbnail);
        if (publicId) {
          try { await deleteImage(publicId); } catch { /* ignore */ }
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, 'portfolio/certificates');
      updates.thumbnail = result.url;
    }

    const certificate = await Certificate.findByIdAndUpdate(id, updates, { returnDocument: 'after' }).lean();
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (err) {
    console.error('[certificates PUT]', err);
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const certificate = await Certificate.findById(id).lean();
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (certificate.thumbnail) {
      const publicId = extractPublicId(certificate.thumbnail);
      if (publicId) {
        try { await deleteImage(publicId); } catch { /* ignore */ }
      }
    }

    await Certificate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[certificates DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
