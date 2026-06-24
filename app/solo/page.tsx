'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Users, Home, BookOpen, Heart, Check, Zap } from 'lucide-react';
import Link from 'next/link';
import { GOALS, LIFE_AREAS, getArkMission, type LifeArea } from '@/lib/missions';
import { loadState, type PathfindersState } from '@/lib/state';

const PILLAR_STYLE = {
  'Intrapersonal EQ': { bg: 'rgba(83,74,183,0.25)', text: '#A79FFF' },
  'Interpersonal EQ': { bg: 'rgba(29,158,117,0.25)', text: '#5DCAA5' },
  'Communication':    { bg: 'rgba(216,90,48,0.25)',  text: '#F0997B' },
  'Adaptability':     { bg: 'rgba(186,117,23,0.25)', text: '#EF9F27' },
  'Growth Mindset':   { bg: 'rgba(99,153,34,0.25)',  text: '#97C459' },
};

const AREA_COLORS = {
  friends: { color: '#1D9E75', bg: '#E1F5EE', border: '#5DCAA5', grad: 'linear-gradient(135deg,#1D9E75,#0D7A5A)', desc: 'Friendships, social situations, fitting in' },
  family:  { color: '#D85A30', bg: '#FAECE7', border: '#F0997B', grad: 'linear-gradient(135deg,#D85A30,#A83E1C)', desc: 'Parents, siblings, home life' },
  school:  { color: '#534AB7', bg: '#EEEDFE', border: '#AFA9EC', grad: 'linear-gradient(135deg,#534AB7,#3C3489)', desc: 'Class, teachers, group work, grades' },
  myself:  { color: '#BA7517', bg: '#FAEEDA', border: '#EF9F27', grad: 'linear-gradient(135deg,#BA7517,#8A5310)', desc: 'Emotions, courage, big changes' },
};

export default function SoloPage() {
  const router = useRouter();
  const [area, setArea] = useState<LifeArea | ''>('');
  const [goalIdx, setGoalIdx] = useState(-1);
  const [appState, setAppState] = useState<PathfindersState | null>(null);

  useEffect(() => { setAppState(loadState()); }, []);

  const currentMission = appState ? getArkMission(appState.currentArkMission ?? 1) : null;
  const prepDone = appState && currentMission ? (appState.soloReadiness?.[currentMission.id] ?? []) : [];
  const prepPct = currentMission ? Math.min((prepDone.length / currentMission.unlockThreshold) * 100, 100) : 0;

  function AreaIcon({ id, size }: { id: string; size: number }) {
    if (id === 'friends') return <Users size={size} />;
    if (id === 'family')  return <Home size={size} />;
    if (id === 'school')  return <BookOpen size={size} />;
    return <Heart size={size} />;
  }

  function handleStart() {
    if (!area || goalIdx < 0) return;
    sessionStorage.setItem('current_quest', JSON.stringify(GOALS[area][goalIdx]));
    router.push('/solo/quest');
  }

  function handleSkip() {
    const defaultGoal = GOALS['friends'][0];
    sessionStorage.setItem('current_quest', JSON.stringify(defaultGoal));
    router.push('/solo/quest');
  }

  const goals = area ? GOALS[area] : [];
  const selectedGoal = area && goalIdx >= 0 ? GOALS[area][goalIdx] : null;
  const ac = area ? AREA_COLORS[area as LifeArea] : null;

  return (
    <div className="min-h-screen bg-black/30">
      <div className="max-w-5xl mx-auto px-8 pt-7 pb-16">

        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="w-10 h-10 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white">Solo Quest</h1>
            <p className="text-sm text-white/60 font-semibold">Choose what you want to work on</p>
          </div>
          <button onClick={handleSkip} className="text-xs font-bold text-white/40 hover:text-white transition-colors">
            Skip
          </button>
        </div>


        {/* Step 1 — area */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-6 h-6 bg-[#534AB7] rounded-full flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0">1</div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">What area of life?</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {LIFE_AREAS.map(({ key, label }) => {
              const c = AREA_COLORS[key];
              const active = area === key;
              return (
                <button
                  key={key}
                  onClick={() => { setArea(key); setGoalIdx(-1); }}
                  className="relative rounded-3xl p-6 text-left transition-all hover:-translate-y-1 overflow-hidden"
                  style={{
                    background: active ? c.grad : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${active ? 'transparent' : c.border + '35'}`,
                    boxShadow: active ? `0 12px 32px ${c.color}30` : 'none',
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : c.bg + '25', color: active ? 'white' : c.color }}>
                    <AreaIcon id={key} size={26} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-1" style={{ color: active ? 'white' : 'rgba(255,255,255,0.85)' }}>{label}</h3>
                  <p className="text-xs font-semibold leading-snug" style={{ color: active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.40)' }}>{c.desc}</p>
                  {active && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — goal */}
        {area && (
          <div className="mb-8 slide-up">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-6 bg-[#534AB7] rounded-full flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0">2</div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-widest">Pick your goal</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {goals.map((goal: { title: string; desc: string; pillar: string }, i: number) => {
                const ps = PILLAR_STYLE[goal.pillar as keyof typeof PILLAR_STYLE] || { bg: '#EAF3DE', text: '#639922' };
                const active = goalIdx === i;
                const isPrep = currentMission?.prepQuests.includes(goal.title) ?? false;
                const alreadyPrepped = prepDone.includes(goal.title);
                return (
                  <button key={i} onClick={() => setGoalIdx(i)}
                    className="text-left rounded-3xl p-5 border-2 transition-all hover:-translate-y-0.5 relative"
                    style={{
                      background: active ? `${ac!.color}18` : 'rgba(255,255,255,0.05)',
                      borderColor: active ? ac!.color : isPrep && !alreadyPrepped ? `${currentMission!.color}50` : 'rgba(255,255,255,0.10)',
                      boxShadow: active ? `0 8px 24px ${ac!.color}25` : 'none',
                    }}
                  >
                    {/* Prep indicator */}
                    {isPrep && !alreadyPrepped && currentMission && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${currentMission.color}20` }}>
                        <Zap size={9} style={{ color: currentMission.color }} />
                        <span className="text-[8px] font-extrabold uppercase" style={{ color: currentMission.color }}>Prep</span>
                      </div>
                    )}
                    {alreadyPrepped && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#EAF3DE] flex items-center justify-center">
                        <Check size={10} className="text-[#639922]" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{ backgroundColor: ps.bg, color: ps.text }}>{goal.pillar}</span>
                      {active && !isPrep && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: ac!.grad }}>
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-white/90 text-base mb-2 leading-tight">{goal.title}</h3>
                    <p className="text-sm text-white/45 font-semibold leading-snug">{goal.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {area && (
          <div className="flex justify-end">
            <button onClick={handleStart} disabled={!selectedGoal}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-base text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: selectedGoal ? ac!.grad : '#C5C3E0',
                boxShadow: selectedGoal ? `0 8px 24px ${ac!.color}40` : 'none',
              }}
            >
              {selectedGoal ? `Start — ${selectedGoal.title}` : 'Select a goal above'}
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
