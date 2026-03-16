import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Verify the admin_token cookie matches ADMIN_SECRET.
 * Returns null if authorised, or a 401 NextResponse to return early.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // authorised
}
