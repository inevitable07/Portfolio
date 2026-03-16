import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true });
}
