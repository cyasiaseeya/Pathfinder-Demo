'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { seedDemoData } from '@/lib/state';

const TAGLINES = [
  'Build real-life skills.',
  'Work through challenges.',
  'Level up who you are.',
  'Learn with your crew.',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % TAGLINES.length);
        setTaglineVisible(true);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit() {
    if (!name.trim() || submitted) return;
    setSubmitted(true);
    seedDemoData(name.trim());
    setTimeout(() => router.push('/'), 700);
  }

  const greeting = name.trim() ? `Hi, ${name.trim()}!` : 'Hi, Explorer!';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none">

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm">

        {/* Avatar with glow halo */}
        <div className={`mb-7 transition-all duration-700 ${submitted ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute w-64 h-64 rounded-full animate-pulse"
              style={{ background: 'radial-gradient(circle, rgba(83,74,183,0.5) 0%, transparent 70%)' }} />
            {/* Mid ring */}
            <div className="absolute w-56 h-56 rounded-full border border-white/10" />
            {/* Avatar */}
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl relative z-10"
              style={{ boxShadow: '0 0 60px rgba(83,74,183,0.6), 0 0 120px rgba(83,74,183,0.2)' }}>
              <Image
                src="/avatar.png"
                alt="Your explorer"
                width={192}
                height={192}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Greeting */}
        <h1 className={`text-4xl font-extrabold text-white text-center mb-2 transition-all duration-300 ${submitted ? 'scale-105 opacity-0' : ''}`}>
          {greeting}
        </h1>

        {/* Rotating tagline */}
        <div className="h-6 flex items-center mb-8">
          <p className={`text-white/50 font-semibold text-sm transition-all duration-300 ${taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
            {TAGLINES[taglineIndex]}
          </p>
        </div>

        {/* Input card */}
        <div className={`w-full transition-all duration-500 ${submitted ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl">
            <label className="block text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2.5">
              What should we call you?
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your name…"
              maxLength={24}
              autoFocus
              className="w-full bg-white/10 border border-white/15 focus:border-white/40 rounded-2xl px-4 py-3.5 text-white font-bold text-lg placeholder-white/25 focus:outline-none transition-colors mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-extrabold text-base transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: name.trim() ? 'linear-gradient(135deg, #534AB7 0%, #7B6FE0 100%)' : 'rgba(255,255,255,0.1)',
                       color: 'white',
                       boxShadow: name.trim() ? '0 8px 32px rgba(83,74,183,0.5)' : 'none' }}
            >
              {name.trim() ? (
                <><Sparkles size={16} /> Start your journey, {name.trim()} →</>
              ) : (
                <>Start my journey →</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

