'use client';

import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface HomeOverviewProps {
  language: Language;
  onApplyClick: () => void;
  onCalculatorClick: () => void;
}

export default function HomeOverview({ language, onApplyClick, onCalculatorClick }: HomeOverviewProps) {
  const dict = t[language];

  return (
    <div className="space-y-6">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onApplyClick}
          className="w-full bg-[#044e3b] hover:bg-[#033b2e] text-white font-semibold py-4 px-6 rounded-xl shadow-md transition flex items-center justify-between text-base group"
        >
          <span className="flex items-center gap-2">
            <span>APPLY FOR LOAN</span>
            <span className="text-emerald-300 font-urdu">(درخواست دیں)</span>
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onCalculatorClick}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-4 px-6 rounded-xl shadow-sm transition flex items-center justify-between text-base"
        >
          <span className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#044e3b]" />
            <span>Calculate Installment</span>
            <span className="text-xs text-gray-500 font-urdu">(قسط کیلکولیٹر)</span>
          </span>
          <span className="text-gray-400">→</span>
        </button>
      </div>

      {/* Official Government Seal Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-[#044e3b] flex items-center justify-center p-1.5 shadow-md">
          <img
            src="/logo.jpg"
            alt="State Emblem of Pakistan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h3 className="font-bold text-gray-900 tracking-wider text-base">
            {dict.govPakistan}
          </h3>
          <p className="text-xs text-gray-500 font-medium">Ministry of Finance • وزارت خزانہ</p>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#044e3b] px-4 py-2 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-[#044e3b]" />
          <span>{dict.encryptedNadra}</span>
        </div>
      </div>

      {/* Footer Banner Info */}
      <div className="bg-[#0b192c] text-white/80 rounded-2xl p-6 text-center space-y-2 border border-slate-800">
        <div className="w-14 h-14 mx-auto rounded-full bg-white border-2 border-emerald-500/40 p-1 flex items-center justify-center mb-2 shadow-lg">
          <img
            src="/logo.jpg"
            alt="State Emblem of Pakistan"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <h4 className="text-white font-bold">Pakistan Loan Portal</h4>
        <p className="text-xs text-slate-400 font-urdu">
          MINISTRY OF FINANCE • حکومت پاکستان
        </p>
        <p className="text-xs text-slate-300 pt-2 border-t border-slate-800 max-w-md mx-auto">
          Official portal for loan assistance programme. All 42 State Bank of Pakistan scheduled banks & digital wallets supported.
        </p>
      </div>
    </div>
  );
}
