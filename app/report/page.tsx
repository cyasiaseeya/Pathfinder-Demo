'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { loadState, PathfindersState } from '@/lib/state';
import { PILLARS, LEVEL_NAMES } from '@/lib/pillars';
import { getAchievementById } from '@/lib/achievements';

interface PillarObservation { pillar: string; observation: string; }

export default function ReportPage() {
  const [state, setState]             = useState<PathfindersState | null>(null);
  const [observations, setObservations] = useState<PillarObservation[]>([]);
  const [loadingObs, setLoadingObs]   = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    if (loaded.sessionHistory.length > 0) generate(loaded);
  }, []);

  async function generate(s: PathfindersState) {
    setLoadingObs(true);
    try {
      const res = await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionHistory: s.sessionHistory }) });
      setObservations(await res.json());
    } catch {
      setObservations(PILLARS.map((p) => ({ pillar: p.key, observation: 'Your child engaged thoughtfully during their sessions, showing genuine curiosity and effort.' })));
    } finally { setLoadingObs(false); }
  }

  if (!state) return null;

  const startDate = state.sessionHistory.length > 0
    ? new Date(state.sessionHistory[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const coopSessions = state.sessionHistory.filter((s) => s.type === 'coop');

  return (
    <div className="min-h-screen pb-24 bg-white">
      <div className="max-w-2xl mx-auto px-5 pt-10">

        {/* ── Header ── */}
        <div className="mb-8 pb-7 border-b border-[#E8E6F8]">
          <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-2">Progress Report</p>
          <h1 className="text-3xl font-extrabold text-[#2D2B4E] mb-1">{state.childName || 'Your child'}</h1>
          <p className="text-sm font-semibold text-[#9D9BC4] mb-5">
            {state.sessionsCompleted} session{state.sessionsCompleted !== 1 ? 's' : ''} completed
            {startDate && ` · Started ${startDate}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => {
              const ps = state.pillars[p.key];
              return (
                <span key={p.key} className="text-[10px] font-extrabold px-3 py-1.5 rounded-full border"
                  style={{ color: p.textColor, backgroundColor: p.bgColor, borderColor: `${p.color}30` }}>
                  {p.icon} {p.childName} · {LEVEL_NAMES[ps.level]}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── Skills snapshot ── */}
        <section className="mb-10">
          <p className="text-xs font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-5">Skills snapshot</p>
          <div className="flex flex-col gap-4">
            {PILLARS.map((pillar) => {
              const ps  = state.pillars[pillar.key];
              const fill = Math.round((ps.xp / ps.xpToNext) * 100);
              const obs  = observations.find((o) => o.pillar === pillar.key);
              const earned = state.achievements.map(getAchievementById).filter((a) => a && a.pillar === pillar.key);

              return (
                <div key={pillar.key} className="border border-[#E8E6F8] rounded-2xl p-5" style={{ borderLeft: `4px solid ${pillar.color}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: pillar.bgColor }}>{pillar.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-[#2D2B4E] text-sm">{pillar.name}</h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase"
                          style={{ backgroundColor: pillar.bgColor, color: pillar.textColor }}>
                          {LEVEL_NAMES[ps.level]}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-[#B4B2C9]">{ps.xp} / {ps.xpToNext} XP</p>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: pillar.bgColor }}>
                    <div className="h-full rounded-full" style={{ width: `${fill}%`, backgroundColor: pillar.color }} />
                  </div>

                  {obs && (
                    <div className="mb-3">
                      <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-1">What we observed</p>
                      <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
                        {loadingObs ? <span className="text-[#C5C3E0]">Generating…</span> : obs.observation}
                      </p>
                    </div>
                  )}

                  {earned.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {earned.map((a) => a && (
                        <span key={a.id} className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: pillar.bgColor, color: pillar.textColor }}>
                          {a.icon} {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Brave try log ── */}
        {state.braveTries.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-4">Brave try log</p>
            <div className="border border-[#E8E6F8] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F4F3FD] bg-[#FAFAFE]">
                    {['Mission', 'Pillar', 'Outcome'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.braveTries.map((bt, i) => (
                    <tr key={bt.id} className={i < state.braveTries.length - 1 ? 'border-b border-[#F4F3FD]' : ''}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-extrabold text-[#2D2B4E]">{bt.mission}</p>
                        {bt.whatGotInTheWay && <p className="text-xs text-[#9D9BC4] italic mt-0.5">{bt.whatGotInTheWay}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#9D9BC4]">{bt.pillar}</td>
                      <td className="px-4 py-3">
                        {bt.status === 'tried'
                          ? <span className="text-[10px] font-extrabold bg-[#EAF3DE] text-[#27500A] px-2.5 py-1 rounded-full">Completed</span>
                          : <span className="text-[10px] font-extrabold bg-[#FAEEDA] text-[#633806] px-2.5 py-1 rounded-full">In progress</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Co-op highlights ── */}
        {coopSessions.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-4">Co-op highlights</p>
            <div className="flex flex-col gap-3">
              {coopSessions.map((s) => (
                <div key={s.id} className="border border-[#E8E6F8] rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-[#2D2B4E] text-sm">{s.questTitle}</h3>
                    {s.crewScore && (
                      <span className="text-sm font-extrabold text-[#534AB7]">{s.crewScore.toLocaleString()} pts</span>
                    )}
                  </div>
                  {s.badgesEarned.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {s.badgesEarned.map((id) => { const a = getAchievementById(id); return a ? <span key={id} title={a.name} className="text-lg">{a.icon}</span> : null; })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── What's next ── */}
        <section className="bg-[#EEEDFE] border border-[#AFA9EC]/30 rounded-2xl p-6 mb-8">
          <h2 className="font-extrabold text-[#3C3489] mb-2">What&apos;s next</h2>
          <p className="text-sm font-semibold text-[#3C3489] leading-relaxed mb-4">
            These skills are built through practice. In ARK&apos;s live PBL courses, your child works with peers on real challenges — with a trained facilitator guiding the group.
          </p>
          <button className="bg-[#534AB7] hover:bg-[#3C3489] text-white px-5 py-2.5 rounded-xl text-sm font-extrabold transition-colors shadow-md shadow-purple-200">
            Join a course →
          </button>
        </section>
      </div>
      <BottomNav />
    </div>
  );
}
