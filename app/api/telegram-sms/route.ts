import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/src/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await sendTelegramNotification({
      title: body.title,
      data: body.data,
      botToken: body.botToken,
      chatId: body.chatId
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
