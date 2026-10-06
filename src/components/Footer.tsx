'use client';

import { ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  return (
    <footer className="mt-16 bg-white border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-600">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'ur'
              ? 'حکومت پاکستان کا سرکاری پورٹل · 256 بٹ محفوظ SSL انکرپشن'
              : 'Official Portal of Government of Pakistan · 256-Bit Secure SSL Encryption'}
          </span>
        </div>
      </div>
    </footer>
  );
}
