'use client';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface HeroCarouselProps {
  language: Language;
}

export default function HeroCarousel({ language }: HeroCarouselProps) {
  const dict = t[language];

  return (
    <div className="space-y-6">
      {/* 1. Prime Minister Muhammad Shehbaz Sharif Portrait Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 text-white min-h-[460px] sm:min-h-[520px] aspect-[4/5] sm:aspect-[4/4.5] flex flex-col justify-between border border-emerald-900/60 group">
        {/* Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/pm_shehbaz_sharif.jpg"
            alt="Muhammad Shehbaz Sharif"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Authentic Presidential Dark Vignette / Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 via-35% to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Top Badge: GOVERNMENT OF PAKISTAN */}
        <div className="relative z-10 p-5 sm:p-6">
          <div className="inline-flex items-center gap-1.5 bg-[#034433]/90 backdrop-blur-md text-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/30 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>GOVERNMENT OF PAKISTAN</span>
          </div>
        </div>

        {/* Bottom Leader Information */}
        <div className="relative z-10 p-6 sm:p-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Muhammad Shehbaz Sharif
          </h2>
          <p className="text-sm sm:text-base font-medium flex flex-wrap items-center gap-2 drop-shadow">
            <span className="text-white/95">Prime Minister of Pakistan</span>
            <span className="text-slate-400">·</span>
            <span className="font-urdu font-bold text-emerald-400 text-base sm:text-lg">وزیر اعظم پاکستان</span>
          </p>
        </div>
      </div>

      {/* 2. Chief Minister Maryam Nawaz Sharif Portrait Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 text-white min-h-[460px] sm:min-h-[520px] aspect-[4/5] sm:aspect-[4/4.5] flex flex-col justify-between border border-emerald-900/60 group">
        {/* Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/maryam_nawaz_sharif.jpg"
            alt="Maryam Nawaz Sharif"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Authentic Provincial Dark Vignette / Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 via-35% to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Top Badge: GOVERNMENT OF PUNJAB */}
        <div className="relative z-10 p-5 sm:p-6">
          <div className="inline-flex items-center gap-1.5 bg-[#034433]/90 backdrop-blur-md text-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/30 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>GOVERNMENT OF PUNJAB</span>
          </div>
        </div>

        {/* Bottom Leader Information */}
        <div className="relative z-10 p-6 sm:p-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            Maryam Nawaz Sharif
          </h2>
          <p className="text-sm sm:text-base font-medium flex flex-wrap items-center gap-2 drop-shadow">
            <span className="text-white/95">Chief Minister Punjab</span>
            <span className="text-slate-400">·</span>
            <span className="font-urdu font-bold text-emerald-400 text-base sm:text-lg">وزیر اعلی پنجاب</span>
          </p>
        </div>
      </div>

      {/* 3. Official Quote Card matching IMG_5236.png */}
      <div className="bg-[#054332] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/40 relative overflow-hidden space-y-4">
        {/* Top badge: ✨ امید کی کرن ہے · Umeed Ki Kiran Hai */}
        <div className="inline-flex items-center gap-2 bg-[#09523d] border border-emerald-500/30 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span className="font-urdu">امید کی کرن ہے</span>
          <span className="text-emerald-400/60">·</span>
          <span>Umeed Ki Kiran Hai</span>
        </div>

        {/* Quote text */}
        <p className="text-xl sm:text-2xl md:text-3xl font-urdu font-bold leading-loose text-white text-right" dir="rtl">
          &ldquo;امید کی کرن ہے۔&rdquo; ہر پاکستانی مالی خود مختاری اور خود انحصاری کا حقدار ہے؛ یہ پروگرام ہمارے عوام کے لیے امید کی ایک کرن ہے۔
        </p>
      </div>

      {/* 4. Loan Limit Highlight Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-1">
            {dict.loanLimit}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Up to 3 Crore
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-gray-400 block mb-1">
            ہدف اور حد
          </span>
          <span className="text-lg sm:text-2xl font-bold text-[#044e3b] font-urdu">
            3 کروڑ روپے تک
          </span>
        </div>
      </div>
    </div>
  );
}
