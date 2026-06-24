'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trophy, ArrowRight } from 'lucide-react';
import { loadState, saveState, addXP, unlockAchievement, completeArkMission } from '@/lib/state';
import { getCoopScenario, getArkMission } from '@/lib/missions';

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase]                 = useState<'score' | 'badges'>('score');
  const [score, setScore]                 = useState(0);
  const [bar, setBar]                     = useState(0);
  const [animDone, setAnimDone]           = useState(false);
  const [visibleBadges, setVisibleBadges] = useState(0);
  const [saved, setSaved]                 = useState(false);
  const [missionId, setMissionId]         = useState(1);

  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    setMissionId(stored ? parseInt(stored, 10) : 1);
  }, []);

  const scenario   = getCoopScenario(missionId);
  const arkMission = getArkMission(missionId);
  const BADGES     = scenario?.badges      ?? [];
  const XP         = scenario?.xpGains     ?? [];
  const SCORE_ITEMS= scenario?.scoreItems  ?? [];
  const TOTAL      = SCORE_ITEMS.reduce((s, i) => s + i.points, 0);

  useEffect(() => {
    const start = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - start) / 1800, 1);
      const e = easeOut(t);
      setScore(Math.round(e * TOTAL));
      setBar(Math.round(e * 82));
      if (t < 1) requestAnimationFrame(raf); else setAnimDone(true);
    };
    requestAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TOTAL]);

  useEffect(() => {
    if (phase === 'badges') {
      BADGES.forEach((_, i) => setTimeout(() => setVisibleBadges(i + 1), i * 400));
    }
  }, [phase, BADGES]);

  useEffect(() => {
    if (!saved && missionId && scenario) {
      let state = loadState();
      XP.forEach(({ key, xp }) => {
        state = addXP(state, key as keyof typeof state.pillars, xp);
      });
      BADGES.forEach((b) => { state = unlockAchievement(state, b.id); });

      // Identify weak pillars (lowest XP gains = areas needing solo work)
      const sortedXP = [...XP].sort((a, b) => a.xp - b.xp);
      const weakPillars = sortedXP.slice(0, 2).map((x) => x.key);

      // Complete this Ark mission + advance to next
      state = completeArkMission(state, missionId, TOTAL, weakPillars);

      // Build recommended solo quests from weak pillar hints
      const hints = scenario.weakPillarHints.filter((h) => weakPillars.includes(h.pillar));
      if (state.coopFeedback) {
        state = {
          ...state,
          coopFeedback: {
            ...state.coopFeedback,
            recommendedQuests: hints.map((h) => h.questToTry),
          },
        };
      }

      state = {
        ...state,
        sessionsCompleted: state.sessionsCompleted + 1,
        sessionHistory: [
          ...state.sessionHistory,
          {
            id: `coop_${Date.now()}`,
            type: 'coop' as const,
            questTitle: arkMission?.title ?? 'Co-op Mission',
            date: new Date().toISOString(),
            pillarSignals: Object.fromEntries(XP.map((x) => [x.key, `Earned ${x.xp} XP in ${x.pillar}`])),
            reflectionAnswers: JSON.parse(sessionStorage.getItem('coop_reflections') || '[]'),
            badgesEarned: BADGES.map((b) => b.id),
            crewScore: TOTAL,
          },
        ],
      };
      saveState(state);
      setSaved(true);
    }
  }, [saved, missionId, scenario, BADGES, XP, TOTAL, arkMission]);

  // Bot avatars for this mission
  const bots = scenario?.botRoles ?? [
    { name: 'Jordan', color: '#1D9E75', bg: '#E1F5EE', initial: 'J' },
    { name: 'Sam',    color: '#D85A30', bg: '#FAECE7', initial: 'S' },
    { name: 'Alex',   color: '#BA7517', bg: '#FAEEDA', initial: 'A' },
  ];


  return (
    <div className="min-h-screen pb-16 bg-black/30">


      {/* ── Score phase ── */}
      {phase === 'score' && (
        <div className="max-w-lg mx-auto px-5 pt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-[#534AB7] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Trophy size={22} className="text-white" />
            </div>
            <div className="flex-1">
              {arkMission && (
                <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">{arkMission.subtitle} — {arkMission.title}</p>
              )}
              <h1 className="text-2xl font-extrabold text-white">Mission complete</h1>
            </div>
            <button onClick={() => router.push('/progress')} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex-shrink-0">Skip</button>
          </div>
          <div className="flex gap-3 mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#534AB7]/30">
                <Image src="/avatar.png" alt="You" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <span className="text-[10px] font-bold text-[#A79FFF]">You</span>
            </div>
            {bots.map((m) => (
              <div key={m.name} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm"
                  style={{ background: `${m.color}25`, color: m.color, border: `1px solid ${m.color}40` }}>
                  {m.initial}
                </div>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.name}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {SCORE_ITEMS.map((item, i) => (
              <div key={i} className={`flex justify-between items-center px-4 py-3 text-sm ${i < SCORE_ITEMS.length - 1 ? 'border-b border-white/8' : ''}`}>
                <span className="font-semibold text-white/70">{item.label}</span>
                <span className="font-extrabold text-[#2AB58A]">+{item.points}</span>
              </div>
            ))}
          </div>
          <div className="text-center mb-3">
            <span className="text-5xl font-extrabold text-white">{score.toLocaleString()}</span>
            <span className="text-lg font-bold text-white/50 ml-2">pts</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full" style={{ width: `${bar}%`, background: 'linear-gradient(90deg, #534AB7 0%, #A79FFF 100%)' }} />
          </div>
          {animDone && (
            <div className="text-center mb-7">
              <span className="inline-block text-sm font-extrabold px-4 py-1.5 rounded-full" style={{ background: '#EF9F2720', color: '#EF9F27', border: '1px solid #EF9F2740' }}>
                🥇 Gold crew — top 15% this week
              </span>
            </div>
          )}
          <button onClick={() => setPhase('badges')} disabled={!animDone}
            className="w-full bg-[#534AB7] hover:bg-[#6B61D0] disabled:opacity-40 text-white rounded-2xl py-4 font-extrabold transition-all shadow-lg shadow-purple-900/40 disabled:shadow-none flex items-center justify-center gap-2">
            See your badges <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ── Badges phase ── */}
      {phase === 'badges' && (
        <div className="max-w-lg mx-auto px-5 pt-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 bg-[#534AB7] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Trophy size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold text-white/40 uppercase tracking-widest">Your achievements</p>
              <h1 className="text-2xl font-extrabold text-white">Badges earned</h1>
            </div>
            <button onClick={() => router.push('/progress')} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex-shrink-0">Skip</button>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {BADGES.map((b, i) => (
              <div key={b.id}
                className={`rounded-2xl p-4 ${i < visibleBadges ? 'slide-up' : 'opacity-0'}`}
                style={{
                  animationDelay: `${i * 0.12}s`,
                  background: b.type === 'peer' ? 'rgba(83,74,183,0.18)' : 'rgba(42,181,138,0.12)',
                  border: b.type === 'peer' ? '1px solid rgba(167,159,255,0.35)' : '1px solid rgba(42,181,138,0.35)',
                }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{b.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-extrabold text-white">{b.name}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                        style={{ background: b.type === 'peer' ? '#534AB7' : '#2AB58A', color: '#fff' }}>
                        {b.type === 'peer' ? 'Peer nominated' : 'AI detected'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white/60 leading-snug mb-1">{b.desc}</p>
                    <p className="text-[10px] font-bold text-white/35">{b.pillar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Pillar XP earned</p>
            {XP.map((p) => (
              <div key={p.key} className="mb-2.5">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white/70">{p.pillar}</span>
                  <span style={{ color: p.color }}>+{p.xp} XP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/10">
                  <div className="h-full rounded-full" style={{ backgroundColor: p.color, width: `${p.xp}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/progress')}
            className="w-full bg-[#534AB7] hover:bg-[#6B61D0] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2">
            See my progress <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
