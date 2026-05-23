'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/sign-in');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden bg-white">
      <div className="flex gap-1 items-center">
        {['K', 'I', 'D', 'S', 'L', '💚', 'X'].map((letter, i) => (
          <span
            key={i}
            className="text-5xl font-extrabold text-green-500 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}