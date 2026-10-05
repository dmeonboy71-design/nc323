'use client';

import { useState } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface LoanCalculatorModalProps {
  language: Language;
  onClose: () => void;
  onStartApplication: (amount: string) => void;
}

export default function LoanCalculatorModal({ language, onClose, onStartApplication }: LoanCalculatorModalProps) {
  const [amount, setAmount] = useState<number>(1000000); // 1 Million PKR default
  const [tenureYears, setTenureYears] = useState<number>(3); // 3 Years default
  const dict = t[language];

  // Simple subsidized calculation (0% to low markup government scheme)
  // E.g., 0% tier 1 for small loans or 3% subsidized markup for business
  const markupRate = 0.03; 
  const totalWithMarkup = amount * (1 + markupRate * tenureYears);
  const monthlyInstallment = Math.round(totalWithMarkup / (tenureYears * 12));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#044e3b] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Loan Installment Calculator</h3>
              <p className="text-xs text-gray-500 font-urdu">قسط کیلکولیٹر اور تخمینہ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                {dict.amountLabel}
              </label>
              <span className="text-lg font-bold text-[#044e3b]">
                PKR {amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={30000000}
              step={100000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#044e3b] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1 Lakh (1,00,000)</span>
              <span>3 Crore (3,00,00,000)</span>
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                {dict.tenureLabel}
              </label>
              <span className="text-lg font-bold text-gray-900">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 5, 7].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 rounded-lg text-sm font-medium transition ${
                    tenureYears === yr
                      ? 'bg-[#044e3b] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {yr} {yr === 1 ? 'Year' : 'Years'}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              {dict.monthlyInstallment}
            </span>
            <div className="text-3xl font-extrabold text-[#044e3b]">
              PKR {monthlyInstallment.toLocaleString()} <span className="text-sm font-medium text-emerald-700">/ mo</span>
            </div>
            <p className="text-xs text-emerald-700 pt-2 font-urdu">
              سرکاری سبسڈی کے ساتھ آسان ماہانہ اقساط • 0% to 3% Tiered Markup
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-sm"
          >
            {dict.close}
          </button>
          <button
            onClick={() => {
              onClose();
              onStartApplication(amount.toString());
            }}
            className="flex-1 bg-[#044e3b] hover:bg-[#033b2e] text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{dict.apply}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
