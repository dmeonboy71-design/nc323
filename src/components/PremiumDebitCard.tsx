'use client';

import React from 'react';

interface PremiumDebitCardProps {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardholderName?: string;
  isFlipped?: boolean;
}

export const PremiumDebitCard: React.FC<PremiumDebitCardProps> = ({
  cardNumber = '',
  expiry = '',
  cvv = '',
  cardholderName = 'MUHAMMAD ALI',
  isFlipped = false,
}) => {
  const maskedNumber = cardNumber
    ? cardNumber.replace(/\d(?=\d{4})/g, 'X')
    : 'XXXX XXXX XXXX XXXX';

  return (
    <div className="w-full max-w-[390px] aspect-[1.586/1] mx-auto perspective-1000 select-none">
      <div
        className={`relative w-full h-full duration-700 transform-style-3d shadow-2xl rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-gradient-to-br from-[#063b2f] via-[#032920] to-[#01140f] border border-emerald-500/40 p-6 flex flex-col justify-between text-white shadow-[0_25px_60px_rgba(2,44,34,0.45)]">
          {/* Background Wave Accents matching IMG_5046.png */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 40 C120 130, 240 10, 450 70 L450 250 L-50 250 Z" fill="url(#grad1)" />
              <path d="M-50 110 C140 190, 260 30, 450 130 L450 250 L-50 250 Z" fill="url(#grad2)" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Row: Gold EMV Chip & Premium Debit / Government Verified */}
          <div className="relative z-10 flex justify-between items-start">
            {/* Gold EMV Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-amber-300 via-amber-100 to-amber-400 border border-amber-400/60 p-1 flex flex-col justify-between shadow-md">
              <div className="w-full h-[1px] bg-amber-600/60 my-auto"></div>
              <div className="flex justify-between w-full h-full absolute inset-0 p-1.5 pointer-events-none">
                <div className="border border-amber-600/40 w-full h-full rounded-[2px]"></div>
              </div>
            </div>

            {/* Top Right Branding */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide text-amber-300">
                  Premium Debit
                </span>
                <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12.55a11 11 0 0 1 0-5.1" />
                  <path d="M8.5 10.5a7 7 0 0 1 0-3" />
                  <path d="M12 9.5a3 3 0 0 1 0-1" />
                </svg>
              </div>
              <span className="text-[10px] text-emerald-300 font-medium tracking-wider">
                Government Verified
              </span>
            </div>
          </div>

          {/* Middle Row: Card Number & Label */}
          <div className="relative z-10 my-auto">
            <div className="text-[10px] text-emerald-300/80 font-medium tracking-wider uppercase mb-1 flex items-center justify-between">
              <span>ATM CARD NUMBER</span>
              <span className="font-urdu text-[11px]">اے ٹی ایم کارڈ نمبر</span>
            </div>
            <div className="font-mono text-lg sm:text-xl tracking-[0.18em] font-bold text-white drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
              {maskedNumber}
            </div>
          </div>

          {/* Bottom Row: Card Holder & Valid / CVV */}
          <div className="relative z-10 flex justify-between items-end text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300/70 block mb-0.5">CARD HOLDER</span>
              <span className="font-mono uppercase tracking-wider text-white font-bold text-sm">
                {cardholderName || 'MUHAMMAD ALI'}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-300/70 block mb-0.5">VALID THRU</span>
                <span className="font-mono text-white font-semibold">{expiry || 'MM/YY'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-300/70 block mb-0.5">CVC / CVV</span>
                <span className="font-mono text-white font-semibold tracking-widest">{cvv ? cvv.slice(0, 3) : '•••'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gradient-to-br from-[#063b2f] via-[#032920] to-[#01140f] border border-emerald-500/40 py-6 flex flex-col justify-between text-white shadow-[0_25px_60px_rgba(2,44,34,0.45)]">
          {/* Black Magnetic Stripe */}
          <div className="w-full h-11 bg-slate-950 mt-2"></div>

          {/* Signature & CVV Strip */}
          <div className="px-6 flex items-center justify-between">
            <div className="w-3/4 h-9 bg-slate-200 text-slate-900 font-mono italic text-xs flex items-center px-3 rounded shadow-inner gap-2">
              <img
                src="/pakistan_state_emblem.jpg"
                alt="Emblem"
                className="w-5 h-5 object-contain bg-white rounded-full p-0.5 border border-emerald-300/40 shrink-0"
              />
              <span className="truncate">Authorized Signature - Government of Pakistan</span>
            </div>
            <div className="w-1/5 h-9 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-950 font-mono font-bold text-base flex items-center justify-center rounded shadow-inner tracking-widest border border-slate-400">
              {cvv ? cvv.slice(0, 3) : '•••'}
            </div>
          </div>

          <div className="px-6 text-[10px] text-emerald-300/80 text-center leading-tight">
            This debit card is issued under Ministry of Finance, Pakistan Youth Loan Program. Property of State Bank of Pakistan.
          </div>
        </div>
      </div>
    </div>
  );
};

