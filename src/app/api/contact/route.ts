import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Tracks { count, windowStart } per IP. Resets after WINDOW_MS.
// For multi-instance / serverless deployments swap this for a Redis store.
const RATE_LIMIT   = 5;                  // max requests per window per IP
const WINDOW_MS    = 60 * 60 * 1000;    // 1 hour

interface RateEntry { count: number; windowStart: number }
const ipStore = new Map<string, RateEntry>();

// Purge stale entries every hour to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore) {
    if (now - entry.windowStart > WINDOW_MS) ipStore.delete(ip);
  }
}, WINDOW_MS);

function getClientIp(request: Request): string {
  // Standard proxy headers (Vercel, Nginx, Cloudflare)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now   = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    ipStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfterSec };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  // ── Rate limit check ────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = checkRateLimit(ip);

  if (!allowed) {
    const minutes = Math.ceil(retryAfterSec / 60);
    return NextResponse.json(
      { error: `Too many requests. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name: string;
      email: string;
      message: string;
    };

    // Basic server-side validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: 'Invalid fields. Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#f0f0f0;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)">
          <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.07)">
            <p style="margin:0;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:rgba(255,255,255,.3)">Portfolio Contact Form</p>
            <h2 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff">New message from ${escapeHtml(name)}</h2>
          </div>
          <div style="padding:28px 32px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:6px 0;font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:rgba(255,255,255,.3);width:80px">Name</td>
                <td style="padding:6px 0;font-size:14px;color:#fff">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:rgba(255,255,255,.3)">Email</td>
                <td style="padding:6px 0;font-size:14px;color:#fff"><a href="mailto:${email}" style="color:#f97316;text-decoration:none">${escapeHtml(email)}</a></td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:20px 0"/>
            <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:.3em;color:rgba(255,255,255,.3)">Message</p>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,.75);line-height:1.7;white-space:pre-wrap">${escapeHtml(message)}</p>
          </div>
          <div style="padding:16px 32px;background:rgba(255,255,255,0.03);font-size:11px;color:rgba(255,255,255,.2)">
            Sent from your portfolio contact form
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact route]', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
