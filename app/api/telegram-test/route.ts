import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/src/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sendTelegramNotification({
      title: '⚡ Fast Send Speed Test',
      data: {
        testStatus: 'Operational - Ultra Fast Send',
        speedRating: '< 250ms Instant Dispatch',
        portalSystem: 'Pakistan Youth Loan Portal',
        serverHost: 'Vercel Serverless Ready'
      },
      botToken: body.botToken,
      chatId: body.chatId
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
