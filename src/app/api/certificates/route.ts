import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('featured') === 'true' ? { featured: true } : {};
    const certificates = await Certificate.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(certificates);
  } catch (err) {
    console.error('[certificates GET]', err);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const certificateLink = (formData.get('certificateLink') as string) ?? '';
    const order = parseInt((formData.get('order') as string) || '0', 10);
    const featured = formData.get('featured') !== 'false';
    const file = formData.get('thumbnail') as File | null;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let thumbnail = '';
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadImage(buffer, 'portfolio/certificates');
      thumbnail = result.url;
    }

    const certificate = await Certificate.create({ name, thumbnail, certificateLink, order, featured });
    return NextResponse.json(certificate, { status: 201 });
  } catch (err) {
    console.error('[certificates POST]', err);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}
