'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, ArrowRight } from 'lucide-react';
import { loadState, saveState, addXP, unlockAchievement } from '@/lib/state';
import { getPillarByName } from '@/lib/pillars';
import type { BraveTry } from '@/lib/state';

interface Mission { title: string; description: string; pillar: string; }

const PILLAR_STYLE: Record<string, { color: string; border: string }> = {
  'Intrapersonal EQ': { color: '#A79FFF', border: '#A79FFF' },
  'Interpersonal EQ': { color: '#2AB58A', border: '#2AB58A' },
  'Communication':    { color: '#F0997B', border: '#E8714A' },
  'Adaptability':     { color: '#EF9F27', border: '#EF9F27' },
  'Growth Mindset':   { color: '#7ABF3A', border: '#7ABF3A' },
};

export default function MissionPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    async function generate() {
      const questRaw = sessionStorage.getItem('current_quest');
      const messagesRaw = sessionStorage.getItem('quest_messages');
      const reflectionsRaw = sessionStorage.getItem('reflectionAnswers');
      if (!questRaw) { router.push('/solo'); return; }
      try {
        const res = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quest: JSON.parse(questRaw),
            messages: messagesRaw ? JSON.parse(messagesRaw) : [],
            reflections: reflectionsRaw ? JSON.parse(reflectionsRaw) : [],
          }),
        });
        setMissions(await res.json());
      } catch {
        setMissions([
          { title: 'Take one small step', description: 'Pick the smallest possible version of your goal and try it once this week.', pillar: 'Growth Mindset' },
          { title: 'Notice and name', description: 'When a feeling comes up, pause and name it — out loud or in a journal.', pillar: 'Intrapersonal EQ' },
          { title: 'Ask one question', description: 'Start a conversation by asking a genuine question before sharing your view.', pillar: 'Communication' },
        ]);
      } finally { setLoading(false); }
    }
    generate();
  }, [router]);

  function handleDone() {
    if (saved) { router.push('/solo/celebrate'); return; }
    const state = loadState();
    const questRaw = sessionStorage.getItem('current_quest');
    const reflectionsRaw = sessionStorage.getItem('reflectionAnswers');
    const signalsRaw = sessionStorage.getItem('pillar_signals');
    const quest = questRaw ? JSON.parse(questRaw) : null;
    const sessionId = `session_${Date.now()}`;

    const braveTries: BraveTry[] = missions.map((m, i) => ({
      id: `bt_${Date.now()}_${i}`, mission: m.title, description: m.description,
      pillar: m.pillar, status: 'pending', sessionId, date: new Date().toISOString(),
    }));

    let newState = {
      ...state,
      sessionsCompleted: state.sessionsCompleted + 1,
      braveTries: [...state.braveTries, ...braveTries],
      sessionHistory: [...state.sessionHistory, {
        id: sessionId, type: 'solo' as const, questTitle: quest?.title || 'Solo Quest',
        date: new Date().toISOString(),
        pillarSignals: signalsRaw ? JSON.parse(signalsRaw) : {},
        reflectionAnswers: reflectionsRaw ? JSON.parse(reflectionsRaw) : [],
        badgesEarned: [],
      }],
    };

    // Track XP gains per pillar before saving
    const xpGained: Record<string, number> = {};
    missions.forEach((m) => {
      const pillar = getPillarByName(m.pillar);
      if (pillar) {
        xpGained[pillar.key] = (xpGained[pillar.key] || 0) + 30;
        newState = addXP(newState, pillar.key, 30);
      }
    });

    // Track newly unlocked achievements
    const prevAchievements = new Set(state.achievements);
    newState = unlockAchievement(newState, 'first_try');
    if (newState.sessionsCompleted === 1) {
      newState = unlockAchievement(newState, 'mirror_moment');
      newState = unlockAchievement(newState, 'first_word');
    }
    const newBadges = newState.achievements.filter((a) => !prevAchievements.has(a));

    // Track level-ups
    const levelUps: string[] = [];
    (Object.keys(xpGained) as Array<keyof typeof state.pillars>).forEach((key) => {
      if (newState.pillars[key].level > state.pillars[key].level) {
        levelUps.push(key);
      }
    });

    saveState(newState);
    sessionStorage.setItem('celebrate', JSON.stringify({
      xpGained,
      newBadges,
      levelUps,
      totalXP: Object.values(xpGained).reduce((a, b) => a + b, 0),
      questTitle: quest?.title || 'Solo Quest',
    }));
    ['quest_messages','reflectionAnswers','pillar_signals','current_quest'].forEach((k) => sessionStorage.removeItem(k));
    setSaved(true);
    router.push('/solo/celebrate');
  }

  return (
    <div className="min-h-screen pb-12 bg-black/30">
      <div className="max-w-lg mx-auto px-5 pt-8">

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-[#534AB7] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/40">
            <Rocket size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white mb-1">Your mission this week</h1>
            <p className="text-sm text-white/60 font-semibold leading-snug">
              Three brave tries based on what you shared.
            </p>
          </div>
          <button onClick={() => router.push('/progress')} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex-shrink-0 mt-1">
            Skip
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="h-4 bg-white/10 rounded-full w-1/2 mb-3" />
                <div className="h-3 bg-white/10 rounded-full mb-1.5" />
                <div className="h-3 bg-white/10 rounded-full w-3/4" />
              </div>
            ))}
            <p className="text-center text-sm font-semibold text-white/50 animate-pulse mt-1">
              Creating your missions…
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {missions.map((m, i) => {
              const s = PILLAR_STYLE[m.pillar] || PILLAR_STYLE['Growth Mindset'];
              return (
                <div key={i} className="rounded-2xl p-5 slide-up"
                  style={{ animationDelay: `${i * 0.12}s`, background: 'rgba(255,255,255,0.06)', border: `1px solid ${s.border}30`, borderLeft: `3px solid ${s.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0"
                      style={{ background: `${s.color}20`, color: s.color }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-white mb-1">{m.title}</h3>
                      <p className="text-sm text-white/55 font-semibold leading-relaxed mb-2">{m.description}</p>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                        style={{ background: `${s.color}20`, color: s.color }}>
                        {m.pillar}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && (
          <>
            <p className="text-center text-xs font-semibold text-white/35 mb-5">
              Saved to your progress report for your parent.
            </p>
            <button
              onClick={handleDone}
              className="w-full bg-[#534AB7] hover:bg-[#6B61D0] text-white rounded-2xl py-4 font-extrabold text-base transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
            >
              See my progress
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
