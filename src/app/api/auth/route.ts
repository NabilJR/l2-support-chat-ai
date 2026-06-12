import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isTokenValid(inputToken: string, expectedToken: string) {
  const inputBuffer = Buffer.from(inputToken);
  const expectedBuffer = Buffer.from(expectedToken);

  if (inputBuffer.length !== expectedBuffer.length) {
    crypto.timingSafeEqual(inputBuffer, Buffer.alloc(inputBuffer.length));
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.APP_ACCESS_TOKEN?.trim();

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'APP_ACCESS_TOKEN belum dikonfigurasi.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const token = typeof body.token === 'string' ? body.token.trim() : '';

  if (!token) {
    return NextResponse.json(
      { error: 'Token tidak boleh kosong.' },
      { status: 400 }
    );
  }

  if (!isTokenValid(token, expectedToken)) {
    return NextResponse.json(
      { error: 'Token akses tidak valid.' },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
