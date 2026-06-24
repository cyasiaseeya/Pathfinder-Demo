'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Users, Home, BookOpen, Heart, Check } from 'lucide-react';
import Link from 'next/link';
import { GOALS, LIFE_AREAS } from '@/lib/missions';

const PILLAR_STYLE = {
  'Intrapersonal EQ': { bg: '#EEEDFE', text: '#534AB7' },
  'Interpersonal EQ': { bg: '#E1F5EE', text: '#1D9E75' },
  'Communication':    { bg: '#FAECE7', text: '#D85A30' },
  'Adaptability':     { bg: '#FAEEDA', text: '#BA7517' },
  'Growth Mindset':   { bg: '#EAF3DE', text: '#639922' },
};

const AREA_COLORS = {
  friends: { color: '#1D9E75', bg: '#E1F5EE', border: '#5DCAA5', grad: 'linear-gradient(135deg,#1D9E75,#0D7A5A)', desc: 'Friendships, social situations, fitting in' },
  family:  { color: '#D85A30', bg: '#FAECE7', border: '#F0997B', grad: 'linear-gradient(135deg,#D85A30,#A83E1C)', desc: 'Parents, siblings, home life' },
  school:  { color: '#534AB7', bg: '#EEEDFE', border: '#AFA9EC', grad: 'linear-gradient(135deg,#534AB7,#3C3489)', desc: 'Class, teachers, group work, grades' },
  myself:  { color: '#BA7517', bg: '#FAEEDA', border: '#EF9F27', grad: 'linear-gradient(135deg,#BA7517,#8A5310)', desc: 'Emotions, courage, big changes' },
};

export default function SoloPage() {
  const router = useRouter();
  const [area, setArea] = useState('');
  const [goalIdx, setGoalIdx] = useState(-1);

  function AreaIcon({ id, size }) {
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
  const ac = area ? AREA_COLORS[area] : null;

  return (
    <div className="min-h-screen bg-black/30">
      <div className="max-w-5xl mx-auto px-8 pt-7 pb-16">

        <div className="flex items-center gap-4 mb-10">
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
                    background: active ? c.grad : 'white',
                    border: `2px solid ${active ? 'transparent' : c.border + '50'}`,
                    boxShadow: active ? `0 12px 32px ${c.color}30` : '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : c.bg, color: active ? 'white' : c.color }}>
                    <AreaIcon id={key} size={26} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-1" style={{ color: active ? 'white' : '#2D2B4E' }}>{label}</h3>
                  <p className="text-xs font-semibold leading-snug" style={{ color: active ? 'rgba(255,255,255,0.65)' : '#9D9BC4' }}>{c.desc}</p>
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
              {goals.map((goal, i) => {
                const ps = PILLAR_STYLE[goal.pillar] || { bg: '#EAF3DE', text: '#639922' };
                const active = goalIdx === i;
                return (
                  <button key={i} onClick={() => setGoalIdx(i)}
                    className="text-left rounded-3xl p-5 border-2 bg-white transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: active ? ac.color : '#E8E6F8',
                      boxShadow: active ? `0 8px 24px ${ac.color}20` : '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{ backgroundColor: ps.bg, color: ps.text }}>{goal.pillar}</span>
                      {active && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: ac.grad }}>
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-[#2D2B4E] text-base mb-2 leading-tight">{goal.title}</h3>
                    <p className="text-sm text-[#9D9BC4] font-semibold leading-snug">{goal.desc}</p>
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
                background: selectedGoal ? ac.grad : '#C5C3E0',
                boxShadow: selectedGoal ? `0 8px 24px ${ac.color}40` : 'none',
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
