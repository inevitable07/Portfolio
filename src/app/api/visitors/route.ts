import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Counter from '@/models/Counter';

// GET — return current count
export async function GET() {
  try {
    await connectDB();
    const doc = await Counter.findOne({ key: 'visitors' });
    return NextResponse.json({ count: doc?.count ?? 0 });
  } catch (err) {
    console.error('[visitors GET]', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

// POST — increment and return new count
export async function POST() {
  try {
    await connectDB();
    const doc = await Counter.findOneAndUpdate(
      { key: 'visitors' },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' },
    );
    return NextResponse.json({ count: doc?.count ?? 1 });
  } catch (err) {
    console.error('[visitors POST]', err);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
