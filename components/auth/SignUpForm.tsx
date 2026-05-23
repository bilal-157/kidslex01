'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // clear error on input change
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const letters = ['K', 'I', 'D', 'S', 'L', '💚', 'X'];

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

      {/* Card */}
      <div className="bg-white rounded-3xl border border-green-200 p-8 w-full max-w-sm shadow-[0_4px_24px_rgba(22,163,74,0.08)]">

        <h1 className="text-xl font-black text-green-700 text-center mb-1">
          Create an account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-7">
          Join KidsLX and get started today
        </p>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-green-700 tracking-wide">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-green-700 tracking-wide">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-green-700 tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-green-700 tracking-wide">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-green-200 bg-[#f0faf4] text-sm text-gray-800 placeholder-green-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:bg-white transition disabled:opacity-60"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mt-1">
            <input
              type="checkbox"
              id="terms"
              required
              disabled={loading}
              className="mt-0.5 accent-green-600 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 font-semibold leading-relaxed">
              I agree to the{' '}
              <span className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-base font-extrabold rounded-2xl transition mt-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-green-100" />
            <span className="text-xs font-bold text-gray-400">or</span>
            <div className="flex-1 h-px bg-green-100" />
          </div>

        </form>

        {/* Sign In Link */}
        <p className="text-center text-xs text-gray-500 font-semibold mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/sign-in')}
            className="text-green-600 font-black hover:text-green-800 transition"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  );
}