'use client';

import { useState } from 'react';
import { Download, ShieldCheck, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch('/api/download-source');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pakistan-youth-loan-portal-source.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download source code. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <footer className="mt-16 bg-white border-t border-gray-200 py-8 px-4 text-center text-sm text-gray-600">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-[#044e3b] hover:bg-[#033f30] disabled:opacity-70 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {downloading
                ? (language === 'ur' ? 'ڈاؤن لوڈ ہو رہا ہے...' : 'Downloading...')
                : (language === 'ur' ? 'پروجیکٹ سورس کوڈ ڈاؤن لوڈ کریں (ZIP)' : 'Download Project Source Code (ZIP)')}
            </span>
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Portal of Government of Pakistan · 256-Bit Secure SSL Encryption</span>
        </div>
      </div>
    </footer>
  );
}
