'use client';

import React, { useRef, useEffect } from 'react';

interface OtpBoxSetProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  idPrefix?: string;
  autoFocus?: boolean;
  isPassword?: boolean;
}

export const OtpBoxSet: React.FC<OtpBoxSetProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  idPrefix = 'otp-box',
  autoFocus = false,
  isPassword = false
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value.replace(/\D/g, '');
    const char = raw.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    const newVal = newDigits.join('').slice(0, length);
    onChange(newVal);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newVal.length === length) {
      onComplete?.(newVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = '';
        onChange(newDigits.join('').slice(0, length));
      } else if (index > 0) {
        newDigits[index - 1] = '';
        onChange(newDigits.join('').slice(0, length));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 my-3">
      {digits.map((digit, index) => (
        <input
          key={`${idPrefix}-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          id={`${idPrefix}-${index}`}
          type={isPassword ? "password" : "text"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold rounded-xl transition-all outline-none border-2 bg-white shadow-xs ${
            hasError
              ? 'border-rose-500 text-rose-950 bg-rose-50/30'
              : digit
              ? 'border-[#059669] text-[#044e3b] bg-emerald-50/20 ring-2 ring-emerald-500/20'
              : 'border-gray-200 text-gray-800 focus:border-[#059669] focus:ring-2 focus:ring-emerald-500/20'
          } disabled:opacity-50`}
        />
      ))}
    </div>
  );
};
