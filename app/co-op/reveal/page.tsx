'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';

const CORRECT_ANSWER = 'The water from the main tap has dangerously high salt levels — likely from a leaking softener unit. Plants closest to it are dying because of salt toxicity, while those on the far side get cleaner water.';
const CREW_ANSWER = 'The salt levels near the main tap are toxic to the plants. The softener is leaking into the water supply.';

type Phase = 'suspense' | 'reveal';

export default function RevealPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('suspense');
  const [dotCount, setDotCount] = useState(1);
  const [correct] = useState(true); // always correct in the demo

  // Animate the dots during suspense
  useEffect(() => {
    if (phase !== 'suspense') return;
    const interval = setInterval(() => setDotCount((d) => (d % 3) + 1), 500);
    const reveal = setTimeout(() => {
      clearInterval(interval);
      setPhase('reveal');
    }, 2800);
    return () => { clearInterval(interval); clearTimeout(reveal); };
  }, [phase]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-black/30">
      <div className="w-full max-w-md">

        {/* ── Suspense ── */}
        {phase === 'suspense' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto mb-7 animate-pulse">
              <span className="text-4xl">{'⏳'.slice(0, dotCount)}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-3">Checking your answer</h1>
            <p className="text-white/50 font-semibold text-sm">
              {'.'.repeat(dotCount)}
            </p>
          </div>
        )}

        {/* ── Reveal ── */}
        {phase === 'reveal' && (
          <div className="slide-up">
            {/* Result banner */}
            <div className={`rounded-2xl px-5 py-4 mb-6 flex items-center gap-4 ${correct ? 'bg-[#EAF3DE] border-2 border-[#97C459]/50' : 'bg-[#FAECE7] border-2 border-[#F0997B]/50'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${correct ? 'bg-[#639922]' : 'bg-[#D85A30]'}`}>
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-xs font-extrabold uppercase tracking-widest mb-0.5 ${correct ? 'text-[#639922]' : 'text-[#D85A30]'}`}>
                  {correct ? 'Your crew got it!' : 'Not quite — good effort'}
                </p>
                <p className={`text-lg font-extrabold ${correct ? 'text-[#27500A]' : 'text-[#6B2710]'}`}>
                  {correct ? 'Correct answer' : 'Wrong answer'}
                </p>
              </div>
            </div>

            {/* Crew's answer */}
            <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5 mb-3">
              <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-2">Your crew submitted</p>
              <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
                &ldquo;{CREW_ANSWER}&rdquo;
              </p>
            </div>

            {/* The actual answer */}
            <div className="bg-[#EEEDFE] border border-[#AFA9EC]/40 rounded-2xl p-5 mb-8">
              <p className="text-[10px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-2">The full answer</p>
              <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
                {CORRECT_ANSWER}
              </p>
            </div>

            {/* Key insight */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 mb-7">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-1.5">What cracked the case</p>
              <p className="text-sm font-semibold text-white/80 leading-relaxed">
                Combining the soil test data with Jordan&apos;s observation about plant location — no single person had enough to solve it alone.
              </p>
            </div>

            <button
              onClick={() => router.push('/co-op/reflection')}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
            >
              Reflect on the mission
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push('/co-op/results')}
              className="w-full mt-3 text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              Skip to score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
