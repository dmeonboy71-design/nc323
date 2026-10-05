import { NextResponse } from 'next/server';
import { getEffectiveCredentials } from '@/src/lib/telegram';

export async function GET() {
  const { activeToken } = getEffectiveCredentials();
  return NextResponse.json({
    status: 'ok',
    telegramConfigured: !!activeToken,
    platform: 'vercel-nextjs'
  });
}
