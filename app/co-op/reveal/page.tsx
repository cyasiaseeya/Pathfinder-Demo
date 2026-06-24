'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { getCoopScenario } from '@/lib/missions';

type Phase = 'suspense' | 'reveal';

export default function RevealPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('suspense');
  const [dotCount, setDotCount] = useState(1);
  const [missionId, setMissionId] = useState(1);
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const correct = true; // always correct in the demo

  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    setMissionId(stored ? parseInt(stored, 10) : 1);
    setSubmittedAnswer(sessionStorage.getItem('crew_answer') ?? '');
  }, []);

  useEffect(() => {
    if (phase !== 'suspense') return;
    const interval = setInterval(() => setDotCount((d) => (d % 3) + 1), 500);
    const reveal = setTimeout(() => {
      clearInterval(interval);
      setPhase('reveal');
    }, 2800);
    return () => { clearInterval(interval); clearTimeout(reveal); };
  }, [phase]);

  const scenario = getCoopScenario(missionId);
  const crewAnswer    = scenario?.crewAnswer    ?? 'Your crew submitted a combined answer.';
  const correctAnswer = scenario?.correctAnswer ?? 'The full answer is revealed here.';
  const whatCracked   = scenario?.whatCrackedTheCase ?? 'Sharing all clues and working together.';

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-black/30">
      <div className="w-full max-w-md">

        {/* ── Suspense ── */}
        {phase === 'suspense' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/15 flex items-center justify-center mx-auto mb-7 animate-pulse">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-3">Checking your answer</h1>
            <p className="text-white/40 font-semibold text-sm tracking-widest">
              {'.'.repeat(dotCount)}
            </p>
          </div>
        )}

        {/* ── Reveal ── */}
        {phase === 'reveal' && (
          <div className="slide-up flex flex-col gap-3">

            {/* Result banner */}
            <div className={`rounded-2xl px-5 py-4 flex items-center gap-4 ${
              correct
                ? 'bg-[#2AB58A]/15 border border-[#2AB58A]/40'
                : 'bg-[#E8714A]/15 border border-[#E8714A]/40'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${correct ? 'bg-[#2AB58A]' : 'bg-[#E8714A]'}`}>
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-xs font-extrabold uppercase tracking-widest mb-0.5 ${correct ? 'text-[#2AB58A]' : 'text-[#E8714A]'}`}>
                  {correct ? 'Your crew got it!' : 'Not quite — good effort'}
                </p>
                <p className="text-lg font-extrabold text-white">
                  {correct ? 'Correct answer' : 'Wrong answer'}
                </p>
              </div>
            </div>

            {/* Crew's answer */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-2">Your crew submitted</p>
              <p className="text-sm font-semibold text-white/80 leading-relaxed">
                &ldquo;{submittedAnswer || crewAnswer}&rdquo;
              </p>
            </div>

            {/* The actual answer */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(83,74,183,0.2)', border: '1px solid rgba(167,159,255,0.3)' }}>
              <p className="text-[10px] font-extrabold text-[#A79FFF] uppercase tracking-widest mb-2">The full answer</p>
              <p className="text-sm font-semibold text-white/85 leading-relaxed">
                {correctAnswer}
              </p>
            </div>

            {/* Key insight */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-1.5">What cracked the case</p>
              <p className="text-sm font-semibold text-white/70 leading-relaxed">
                {whatCracked}
              </p>
            </div>

            <button onClick={() => router.push('/co-op/reflection')}
              className="w-full bg-[#534AB7] hover:bg-[#6B61D0] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2">
              Reflect on the mission
              <ArrowRight size={18} />
            </button>

            <button onClick={() => router.push('/co-op/results')}
              className="w-full text-xs font-bold text-white/30 hover:text-white/70 transition-colors">
              Skip to score
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
