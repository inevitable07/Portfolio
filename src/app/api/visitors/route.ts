import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Counter from '@/models/Counter';

// GET — return current count
export async function GET() {
  await connectDB();
  const doc = await Counter.findOne({ key: 'visitors' });
  return NextResponse.json({ count: doc?.count ?? 0 });
}

// POST — increment and return new count
export async function POST() {
  await connectDB();
  const doc = await Counter.findOneAndUpdate(
    { key: 'visitors' },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  return NextResponse.json({ count: doc.count });
}
