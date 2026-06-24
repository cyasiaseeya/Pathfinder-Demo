'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trophy, ArrowRight } from 'lucide-react';
import { loadState, saveState, addXP, unlockAchievement } from '@/lib/state';

const SCORE_ITEMS = [
  { label: 'Correct answer',            points: 500 },
  { label: 'Time remaining (6:12 left)', points: 120 },
  { label: 'All clues shared',           points: 100 },
  { label: 'Twist adapted',              points: 150 },
  { label: 'No extension used',          points: 50  },
  { label: 'Reflection quality',         points: 85  },
];
const TOTAL = 1005;

const BADGES = [
  { id: 'connector',    icon: '🔗', name: 'Connector',    desc: "You were first to link Jordan's sighting with your salt data — that cracked the case.", pillar: 'Communication',    type: 'ai' },
  { id: 'crew_captain', icon: '👑', name: 'Crew captain', desc: 'Sam and Alex both named you as most helpful.',                                          pillar: 'Interpersonal EQ', type: 'peer' },
  { id: 'clutch_player',icon: '⚡', name: 'Clutch player',desc: 'After Jordan left, you ran /lab unprompted. That kept the crew moving.',               pillar: 'Adaptability',     type: 'ai' },
];

const XP = [
  { pillar: 'Communication',   key: 'communication', xp: 40, color: '#D85A30', bg: '#FAECE7' },
  { pillar: 'Interpersonal EQ',key: 'interpersonal',  xp: 60, color: '#1D9E75', bg: '#E1F5EE' },
  { pillar: 'Adaptability',    key: 'adaptability',   xp: 50, color: '#BA7517', bg: '#FAEEDA' },
];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function ResultsPage() {
  const router = useRouter();
  const [phase, setPhase]               = useState<'score' | 'badges'>('score');
  const [score, setScore]               = useState(0);
  const [bar, setBar]                   = useState(0);
  const [animDone, setAnimDone]         = useState(false);
  const [visibleBadges, setVisibleBadges] = useState(0);
  const [saved, setSaved]               = useState(false);

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
  }, []);

  useEffect(() => {
    if (phase === 'badges') {
      [0,1,2].forEach((i) => setTimeout(() => setVisibleBadges(i + 1), i * 400));
    }
  }, [phase]);

  useEffect(() => {
    if (!saved) {
      let state = loadState();
      XP.forEach(({ key, xp }) => { state = addXP(state, key as 'communication'|'interpersonal'|'adaptability', xp); });
      state = unlockAchievement(state, 'reads_the_room');
      state = unlockAchievement(state, 'plan_b');
      state = unlockAchievement(state, 'puzzle_solver');
      state = { ...state, sessionsCompleted: state.sessionsCompleted + 1,
        sessionHistory: [...state.sessionHistory, {
          id: `coop_${Date.now()}`, type: 'coop' as const, questTitle: 'The Garden Mystery',
          date: new Date().toISOString(),
          pillarSignals: { communication: "Connected the salt data with Jordan's observation.", interpersonal: 'Named as most helpful by two teammates.', adaptability: 'Used /lab unprompted after crew member left.' },
          reflectionAnswers: JSON.parse(sessionStorage.getItem('coop_reflections') || '[]'),
          badgesEarned: BADGES.map((b) => b.id), crewScore: TOTAL,
        }],
      };
      saveState(state); setSaved(true);
    }
  }, [saved]);

  return (
    <div className="min-h-screen pb-12 bg-black/30">
      <div className="max-w-lg mx-auto px-5 pt-8">

        {phase === 'score' && (
          <>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-[#534AB7] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Trophy size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest">Mission complete</p>
                <h1 className="text-2xl font-extrabold text-white">Crew score</h1>
              </div>
              <button onClick={() => router.push('/progress')} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex-shrink-0">
                Skip
              </button>
            </div>

            {/* Crew row */}
            <div className="flex gap-3 mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#534AB7]/30">
                  <Image src="/avatar.png" alt="You" width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <span className="text-[10px] font-bold text-[#A79FFF]">You</span>
              </div>
              {[{n:'Jordan',color:'#1D9E75',bg:'#E1F5EE',i:'J'},{n:'Sam',color:'#D85A30',bg:'#FAECE7',i:'S'},{n:'Alex',color:'#BA7517',bg:'#FAEEDA',i:'A'}].map((m) => (
                <div key={m.n} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm border"
                    style={{ backgroundColor: m.bg, color: m.color, borderColor: `${m.color}30` }}>{m.i}</div>
                  <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.n}</span>
                </div>
              ))}
            </div>

            {/* Score table */}
            <div className="bg-white border border-[#E8E6F8] rounded-2xl overflow-hidden mb-5 shadow-sm">
              {SCORE_ITEMS.map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-4 py-3 text-sm ${i < SCORE_ITEMS.length - 1 ? 'border-b border-[#F4F3FD]' : ''}`}>
                  <span className="font-semibold text-[#2D2B4E]">{item.label}</span>
                  <span className="font-extrabold text-[#639922]">+{item.points}</span>
                </div>
              ))}
            </div>

            {/* Total score */}
            <div className="text-center mb-3">
              <span className="text-5xl font-extrabold text-white">{score.toLocaleString()}</span>
              <span className="text-lg font-bold text-white/50 ml-2">pts</span>
            </div>
            <div className="h-3 bg-white/15 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full" style={{ width: `${bar}%`, background: 'linear-gradient(90deg, #534AB7 0%, #7B6FE0 100%)' }} />
            </div>
            {animDone && (
              <div className="text-center mb-7">
                <span className="inline-block bg-[#FAEEDA] text-[#633806] text-sm font-extrabold px-4 py-1.5 rounded-full border border-[#EF9F27]/30">
                  Gold crew — top 15% this week
                </span>
              </div>
            )}

            <button onClick={() => setPhase('badges')} disabled={!animDone}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-40 text-white rounded-2xl py-4 font-extrabold transition-all shadow-lg shadow-purple-200 disabled:shadow-none flex items-center justify-center gap-2">
              See your badges <ArrowRight size={18} />
            </button>
          </>
        )}

        {phase === 'badges' && (
          <>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 bg-[#534AB7] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Trophy size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest">Your achievements</p>
                <h1 className="text-2xl font-extrabold text-white">Badges earned</h1>
              </div>
              <button onClick={() => router.push('/progress')} className="text-xs font-bold text-white/40 hover:text-white transition-colors flex-shrink-0">
                Skip
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {BADGES.map((b, i) => (
                <div key={b.id}
                  className={`border-2 rounded-2xl p-4 ${i < visibleBadges ? 'slide-up' : 'opacity-0'} ${b.type === 'peer' ? 'border-[#AFA9EC]/50 bg-[#EEEDFE]' : 'border-[#97C459]/50 bg-[#EAF3DE]'}`}
                  style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{b.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-extrabold text-[#2D2B4E]">{b.name}</h3>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${b.type === 'peer' ? 'bg-[#534AB7] text-white' : 'bg-[#639922] text-white'}`}>
                          {b.type === 'peer' ? 'Peer nominated' : 'AI detected'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#6B6893] leading-snug mb-1">{b.desc}</p>
                      <p className="text-[10px] font-bold text-[#9D9BC4]">{b.pillar}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#E8E6F8] rounded-2xl p-4 mb-6 shadow-sm">
              <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-3">Pillar XP earned</p>
              {XP.map((p) => (
                <div key={p.key} className="mb-2.5">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#2D2B4E]">{p.pillar}</span>
                    <span style={{ color: p.color }}>+{p.xp} XP</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: p.bg }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: p.color, width: `${p.xp}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => router.push('/progress')}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2">
              See my progress <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
