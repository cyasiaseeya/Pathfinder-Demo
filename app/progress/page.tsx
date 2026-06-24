'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Lock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import { loadState, saveState, PathfindersState } from '@/lib/state';
import { PILLARS, LEVEL_NAMES, Pillar } from '@/lib/pillars';
import { ACHIEVEMENTS } from '@/lib/achievements';

export default function ProgressPage() {
  const [state, setState]           = useState<PathfindersState | null>(null);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [toast, setToast]           = useState('');
  const [tryingId, setTryingId]     = useState<string | null>(null);
  const [gotInTheWay, setGotInTheWay] = useState('');

  useEffect(() => { setState(loadState()); }, []);

  function handleBraveTry(id: string, status: 'tried' | 'not_yet') {
    if (!state) return;
    const updated = { ...state, braveTries: state.braveTries.map((bt) => bt.id === id ? { ...bt, status } : bt) };
    saveState(updated); setState(updated);
    if (status === 'tried') setToast('Logged! Great work.');
  }

  function handleGotInTheWay(id: string) {
    if (!state) return;
    const updated = { ...state, braveTries: state.braveTries.map((bt) => bt.id === id ? { ...bt, status: 'not_yet' as const, whatGotInTheWay: gotInTheWay } : bt) };
    saveState(updated); setState(updated); setTryingId(null); setGotInTheWay('');
  }

  if (!state) return null;

  const totalXP = Object.values(state.pillars).reduce((s, p) => s + p.xp, 0);

  return (
    <div className="min-h-screen pb-24 bg-black/30">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="max-w-lg mx-auto px-5 pt-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-0.5">Your journey</p>
            <h1 className="text-2xl font-extrabold text-white">Progress</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-white/50">{state.sessionsCompleted} session{state.sessionsCompleted !== 1 ? 's' : ''}</p>
            <p className="text-sm font-extrabold text-[#A79FFF]">{totalXP} XP total</p>
          </div>
        </div>

        {/* Pillar cards */}
        <div className="flex flex-col gap-2.5 mb-8">
          {PILLARS.map((pillar: Pillar) => {
            const ps = state.pillars[pillar.key];
            const fill = Math.round((ps.xp / ps.xpToNext) * 100);
            const isOpen = expanded === pillar.key;
            const ach = ACHIEVEMENTS[pillar.key] || [];
            const earnedCount = ach.filter((a) => state.achievements.includes(a.id)).length;

            return (
              <div key={pillar.key} className="bg-white border border-[#E8E6F8] rounded-2xl overflow-hidden shadow-sm">
                <button className="w-full text-left px-4 py-4" onClick={() => setExpanded(isOpen ? null : pillar.key)}>
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: pillar.bgColor }}>
                      {pillar.icon}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-extrabold text-[#2D2B4E] text-sm">{pillar.childName}</h3>
                        <div className="flex items-center gap-2">
                          {/* pips */}
                          <div className="flex gap-0.5">
                            {[0,1,2,3].map((i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: i < earnedCount ? pillar.color : '#E8E6F8' }} />
                            ))}
                          </div>
                          {isOpen ? <ChevronUp size={14} className="text-[#C5C3E0]" /> : <ChevronDown size={14} className="text-[#C5C3E0]" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide"
                          style={{ backgroundColor: pillar.bgColor, color: pillar.textColor }}>
                          {LEVEL_NAMES[ps.level]} · Lv {ps.level}
                        </span>
                        <span className="text-[10px] font-semibold text-[#B4B2C9]">{ps.xp}/{ps.xpToNext} XP</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: pillar.bgColor }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${fill}%`, backgroundColor: pillar.color }} />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Achievements */}
                {isOpen && (
                  <div className="border-t border-[#F4F3FD] px-4 pb-4 pt-3">
                    <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-3">Achievements</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ach.map((a) => {
                        const earned = state.achievements.includes(a.id);
                        return (
                          <div key={a.id} className={`border rounded-xl p-3 transition-all ${earned ? 'border-[#E8E6F8] bg-white' : 'border-[#F4F3FD] bg-[#FAFAFE] opacity-55'}`}>
                            <div className={`text-xl mb-1.5 ${!earned ? 'grayscale' : ''}`}>{a.icon}</div>
                            <p className="text-xs font-extrabold text-[#2D2B4E] mb-0.5">{a.name}</p>
                            <p className="text-[10px] text-[#9D9BC4] font-semibold leading-snug mb-1">{a.desc}</p>
                            {earned
                              ? <span className="flex items-center gap-1 text-[10px] font-bold text-[#639922]"><Check size={10} /> Earned</span>
                              : <span className="flex items-center gap-1 text-[10px] font-medium text-[#C5C3E0] italic"><Lock size={9} /> {a.hint}</span>
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Brave tries */}
        {state.braveTries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-3">Brave tries</p>
            <div className="flex flex-col gap-2.5">
              {state.braveTries.map((bt) => (
                <div key={bt.id} className="bg-white border border-[#E8E6F8] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-2 mb-1">
                    <div className="flex-1">
                      <h3 className="font-extrabold text-[#2D2B4E] text-sm">{bt.mission}</h3>
                    </div>
                    {bt.status === 'tried' && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-[#EAF3DE] text-[#27500A] px-2.5 py-1 rounded-full flex-shrink-0">
                        <Check size={10} /> Done
                      </span>
                    )}
                    {bt.status === 'not_yet' && (
                      <span className="text-[10px] font-extrabold bg-[#FAEEDA] text-[#633806] px-2.5 py-1 rounded-full flex-shrink-0">In progress</span>
                    )}
                  </div>
                  <p className="text-xs text-[#9D9BC4] font-semibold mb-3 leading-snug">{bt.description}</p>

                  {bt.whatGotInTheWay && (
                    <p className="text-xs text-[#9D9BC4] italic mb-2 bg-black/20 rounded-xl px-3 py-2">{bt.whatGotInTheWay}</p>
                  )}

                  {bt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleBraveTry(bt.id, 'tried')}
                        className="flex-1 bg-[#EAF3DE] text-[#27500A] text-xs py-2.5 rounded-xl font-extrabold hover:bg-[#D4EBB9] transition-colors">
                        I tried it
                      </button>
                      <button onClick={() => setTryingId(bt.id)}
                        className="flex-1 bg-[#FAEEDA] text-[#633806] text-xs py-2.5 rounded-xl font-extrabold hover:bg-[#F5E2B8] transition-colors">
                        Still working on it
                      </button>
                    </div>
                  )}

                  {tryingId === bt.id && bt.status === 'pending' && (
                    <div className="mt-3">
                      <textarea value={gotInTheWay} onChange={(e) => setGotInTheWay(e.target.value)}
                        placeholder="What got in the way? That's okay to share."
                        rows={2}
                        className="w-full border border-[#E8E6F8] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D2B4E] placeholder-[#C5C3E0] focus:outline-none focus:border-[#534AB7] resize-none bg-black/20 mb-2"
                      />
                      <button onClick={() => handleGotInTheWay(bt.id)}
                        className="text-xs font-extrabold bg-[#EEEDFE] text-[#3C3489] px-4 py-2 rounded-xl">
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
