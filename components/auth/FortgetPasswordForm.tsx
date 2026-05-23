'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const letters = ['K', 'I', 'D', 'S', 'L', '💚', 'X'];

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setStep('otp');
      startResendTimer();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend timer ──────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      startResendTimer();
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handling ────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      setStep('reset');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setStep('success');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0faf4] flex flex-col items-center justify-center px-5 py-6 font-nunito">

      {/* Logo */}
      <div className="flex gap-1 items-center mb-7">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="text-2xl font-black text-green-600 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-green-200 p-8 w-full max-w-sm shadow-[0_4px_24px_rgba(22,163,74,0.08)]">

        {/* ── STEP 1: Email ── */}
        {step === 'email' && (
          <>
            <div className="text-center mb-7">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-xl font-black text-green-700 mb-1">Forgot Password?</h1>
              <p className="text-sm text-gray-500">Enter your email and we'll send you a 6-digit OTP</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOtp} method="post" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-700 tracking-wide">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-base font-extrabold rounded-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending OTP...
                  </>
                ) : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 'otp' && (
          <>
            <div className="text-center mb-7">
              <div className="text-4xl mb-3">📩</div>
              <h1 className="text-xl font-black text-green-700 mb-1">Check your email</h1>
              <p className="text-sm text-gray-500">
                We sent a 6-digit OTP to <span className="font-bold text-green-700">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} method="post" className="flex flex-col gap-6">

              {/* OTP Boxes */}
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={loading}
                    className="w-11 h-12 text-center text-lg font-black rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-green-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-base font-extrabold rounded-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </button>

              {/* Resend */}
              <p className="text-center text-xs text-gray-500 font-semibold">
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-green-600 font-black hover:text-green-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 'reset' && (
          <>
            <div className="text-center mb-7">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-xl font-black text-green-700 mb-1">Set New Password</h1>
              <p className="text-sm text-gray-500">Choose a strong new password</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} method="post" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-700 tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-green-700 tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-base font-extrabold rounded-2xl transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Resetting...
                  </>
                ) : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 'success' && (
          <div className="text-center flex flex-col items-center gap-4">
            <div className="text-5xl">🎉</div>
            <h1 className="text-xl font-black text-green-700">Password Reset!</h1>
            <p className="text-sm text-gray-500">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => router.push('/auth/sign-in')}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-base font-extrabold rounded-2xl transition mt-2"
            >
              Go to Sign In
            </button>
          </div>
        )}

        {/* Back to sign in */}
        {step !== 'success' && (
          <p className="text-center text-xs text-gray-500 font-semibold mt-6">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/sign-in')}
              className="text-green-600 font-black hover:text-green-800 transition"
            >
              Sign in
            </button>
          </p>
        )}

      </div>
    </div>
  );
}