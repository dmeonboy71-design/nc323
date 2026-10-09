import { NextResponse } from 'next/server';
import { getEffectiveCredentials } from '@/src/lib/telegram';

export async function GET() {
  const { activeToken, source, envConfigured } = getEffectiveCredentials();
  return NextResponse.json({
    status: 'ok',
    telegramConfigured: !!activeToken,
    source,
    envConfigured: !!envConfigured,
    platform: 'vercel-nextjs'
  });
}
