import { NextResponse } from 'next/server';
import { getEffectiveCredentials, updateRuntimeCredentials } from '@/src/lib/telegram';

export async function GET() {
  try {
    const { activeToken, activeChatId, source, envConfigured } = getEffectiveCredentials();
    return NextResponse.json({
      configured: !!(activeToken && activeChatId),
      hasToken: !!activeToken,
      hasChatId: !!activeChatId,
      source,
      envConfigured: !!envConfigured,
      maskedToken: activeToken ? `${activeToken.slice(0, 6)}...${activeToken.slice(-4)}` : '',
      chatId: activeChatId || ''
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { botToken, chatId } = body;
    const creds = updateRuntimeCredentials(botToken || '', chatId || '');
    return NextResponse.json({
      success: true,
      configured: !!(creds.token && creds.chat),
      source: creds.source,
      maskedToken: creds.token ? `${creds.token.slice(0, 6)}...${creds.token.slice(-4)}` : '',
      chatId: creds.chat || ''
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
