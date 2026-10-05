'use client';

import { Globe, User } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onApplyClick: () => void;
  onStatusClick: () => void;
}

export default function Header({
  language,
  onToggleLanguage,
  onApplyClick,
  onStatusClick
}: HeaderProps) {
  const dict = t[language];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top green utility bar matching official portal screenshot */}
      <div className="bg-[#034433] text-white px-4 py-2 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Government of Pakistan · Ministry of Finance</span>
        </div>
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 bg-[#0a523e] hover:bg-[#0d644c] text-emerald-100 px-3 py-1 rounded-full border border-emerald-600/40 transition text-xs font-medium"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <span>Urdu / English (اردو / پورٹل)</span>
        </button>
      </div>

      {/* Main header navbar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border border-emerald-600/40 bg-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
            <img
              src="/pakistan_state_emblem.jpg"
              alt="State Emblem of Pakistan"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1">
              <span>MINISTRY OF FINANCE</span>
              <span className="text-[#044e3b] font-urdu font-semibold">وزارت خزانہ</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
              Pakistan Youth Loan Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStatusClick}
            title="Check Application Status"
            className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center gap-1 px-3 text-sm font-medium"
          >
            <User className="w-4 h-4 text-[#044e3b]" />
            <span className="hidden sm:inline">Status</span>
          </button>

          <button
            onClick={onApplyClick}
            className="bg-[#044e3b] hover:bg-[#033f30] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
          >
            <span>APPLY</span>
            <span className="text-sm font-bold">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}
