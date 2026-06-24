'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { loadState, PathfindersState } from '@/lib/state';
import { PILLARS, LEVEL_NAMES } from '@/lib/pillars';
import { getAchievementById } from '@/lib/achievements';

interface PillarObservation { pillar: string; observation: string; }

/* ── Radar chart ── */
function RadarChart({ state }: { state: PathfindersState }) {
  const cx = 140; const cy = 140; const r = 100;
  const n = PILLARS.length;
  const pts = PILLARS.map((_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  const rings = [0.25, 0.5, 0.75, 1];

  const dataPoints = PILLARS.map((p, i) => {
    const ps = state.pillars[p.key];
    const v = Math.min((ps.xp / Math.max(ps.xpToNext, 1)), 1);
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * v * Math.cos(a), y: cy + r * v * Math.sin(a), color: p.color };
  });

  const polyData = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 280 280" className="w-full max-w-[280px] mx-auto">
      {/* Ring grid */}
      {rings.map(rv => (
        <polygon key={rv} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          points={pts.map((_, i) => {
            const a = (i / n) * 2 * Math.PI - Math.PI / 2;
            return `${cx + r * rv * Math.cos(a)},${cy + r * rv * Math.sin(a)}`;
          }).join(' ')} />
      ))}
      {/* Spokes */}
      {pts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {/* Data fill */}
      <polygon points={polyData} fill="rgba(167,159,255,0.15)" stroke="rgba(167,159,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.color} stroke="rgba(13,11,43,0.8)" strokeWidth="1.5" />
      ))}
      {/* Labels */}
      {PILLARS.map((p, i) => {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        const lx = cx + (r + 22) * Math.cos(a);
        const ly = cy + (r + 22) * Math.sin(a);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.55)" fontFamily="Inter, sans-serif">
            {p.icon}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Mini bar chart for session activity ── */
function ActivityChart({ history }: { history: PathfindersState['sessionHistory'] }) {
  if (history.length === 0) return null;
  const barW = 24; const gap = 6; const maxH = 60;
  const maxXP = Math.max(...history.map(s => Object.values(s.pillarSignals ?? {}).length * 30), 30);
  return (
    <svg viewBox={`0 0 ${history.length * (barW + gap)} ${maxH + 24}`} className="w-full overflow-visible">
      {history.map((s, i) => {
        const h = Math.max(6, ((Object.values(s.pillarSignals ?? {}).length * 30) / maxXP) * maxH);
        const x = i * (barW + gap);
        const color = s.type === 'coop' ? '#7B6FD4' : '#2AB58A';
        return (
          <g key={`${s.id}-${i}`}>
            <rect x={x} y={maxH - h} width={barW} height={h} rx="4" fill={color} opacity="0.8" />
            <text x={x + barW / 2} y={maxH + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontFamily="Inter, sans-serif">
              {new Date(s.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Donut chart for brave tries ── */
function BraveTrieDonut({ tries }: { state: PathfindersState; tries: PathfindersState['braveTries'] }) {
  const done = tries.filter(t => t.status === 'tried').length;
  const prog = tries.filter(t => t.status === 'not_yet').length;
  const pend = tries.filter(t => t.status === 'pending').length;
  const total = tries.length || 1;
  const pct = (v: number) => (v / total) * 100;

  const R = 36; const cx = 50; const cy = 50;
  const circ = 2 * Math.PI * R;
  function arc(from: number, len: number) {
    const offset = circ * (1 - from / 100);
    return { strokeDasharray: `${circ * len / 100} ${circ}`, strokeDashoffset: offset };
  }

  let cursor = 0;
  const segments = [
    { val: pct(done), color: '#2AB58A', label: 'Completed' },
    { val: pct(prog), color: '#EF9F27', label: 'In progress' },
    { val: pct(pend), color: 'rgba(255,255,255,0.12)', label: 'Pending' },
  ];

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="w-20 h-20 flex-shrink-0 -rotate-90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        {segments.map((s) => {
          const from = cursor;
          cursor += s.val;
          if (s.val <= 0) return null;
          const style = arc(from, s.val);
          return <circle key={s.label} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="12" strokeDasharray={style.strokeDasharray} strokeDashoffset={style.strokeDashoffset} strokeLinecap="butt" />;
        })}
      </svg>
      <div className="flex flex-col gap-1.5">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs font-semibold text-white/55">{s.label}</span>
            <span className="text-xs font-extrabold text-white ml-auto pl-3">{tries.filter(t => s.label === 'Completed' ? t.status === 'tried' : s.label === 'In progress' ? t.status === 'not_yet' : t.status === 'pending').length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [state, setState]               = useState<PathfindersState | null>(null);
  const [observations, setObservations] = useState<PillarObservation[]>([]);
  const [loadingObs, setLoadingObs]     = useState(false);
  const [printMode, setPrintMode]       = useState(false);

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

  const totalXP       = Object.values(state.pillars).reduce((s, p) => s + p.xp, 0);
  const totalBadges   = state.achievements.length;
  const triesComplete = state.braveTries.filter(t => t.status === 'tried').length;
  const coopSessions  = state.sessionHistory.filter(s => s.type === 'coop');
  const soloSessions  = state.sessionHistory.filter(s => s.type === 'solo');
  const startDate     = state.sessionHistory.length > 0
    ? new Date(state.sessionHistory[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'No sessions yet';
  const topPillar = PILLARS.reduce((best, p) => state.pillars[p.key].xp > state.pillars[best.key].xp ? p : best, PILLARS[0]);

  const STATS = [
    { label: 'Sessions',      value: state.sessionsCompleted,  unit: '',     color: '#A79FFF' },
    { label: 'Total XP',      value: totalXP,                  unit: ' XP',  color: '#2AB58A' },
    { label: 'Badges earned', value: totalBadges,              unit: '',     color: '#EF9F27' },
    { label: 'Brave tries ✓', value: triesComplete,            unit: `/${state.braveTries.length}`, color: '#E8714A' },
  ];

  return (
    <div className={`min-h-screen pb-24 ${printMode ? 'bg-white' : 'bg-black/30'}`}>
      <div className="max-w-2xl mx-auto px-5 pt-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-1">Parent Progress Report</p>
            <h1 className="text-3xl font-extrabold text-white mb-1">{state.childName || 'Your child'}</h1>
            <p className="text-sm text-white/40 font-semibold">Started {startDate}</p>
          </div>
          <button onClick={() => window.print()}
            className="text-xs font-bold text-white/40 hover:text-white border border-white/15 rounded-xl px-3 py-2 transition-colors flex-shrink-0">
            Print / PDF
          </button>
        </div>

        {/* ── Key stats row ── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-2xl font-extrabold text-white">{s.value}<span className="text-sm font-bold text-white/40">{s.unit}</span></p>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Two-col: Radar + top skill ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Radar */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Skill Balance</p>
            <RadarChart state={state} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {PILLARS.map(p => (
                <div key={p.key} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <span className="text-[9px] font-semibold text-white/40 truncate">{p.childName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right col: top skill + mode breakdown */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl p-4 flex-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Strongest Skill</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${topPillar.color}20` }}>
                  {topPillar.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">{topPillar.childName}</p>
                  <p className="text-[10px] font-bold" style={{ color: topPillar.color }}>{LEVEL_NAMES[state.pillars[topPillar.key].level]}</p>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.round((state.pillars[topPillar.key].xp / state.pillars[topPillar.key].xpToNext) * 100)}%`, background: topPillar.color }} />
              </div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Session Mix</p>
              <div className="flex flex-col gap-2">
                {[{ label: 'Solo quests', count: soloSessions.length, color: '#2AB58A' }, { label: 'Co-op missions', count: coopSessions.length, color: '#7B6FD4' }].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-[10px] font-bold text-white/50 mb-1">
                      <span>{r.label}</span><span style={{ color: r.color }}>{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${state.sessionsCompleted ? (r.count / state.sessionsCompleted) * 100 : 0}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Activity bar chart ── */}
        {state.sessionHistory.length > 0 && (
          <div className="rounded-2xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest">Session Activity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2AB58A]" /><span className="text-[9px] font-bold text-white/30">Solo</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#7B6FD4]" /><span className="text-[9px] font-bold text-white/30">Co-op</span></div>
              </div>
            </div>
            <ActivityChart history={state.sessionHistory} />
          </div>
        )}

        {/* ── Skills deep-dive ── */}
        <div className="mb-6">
          <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-4">Skills Deep-Dive</p>
          <div className="flex flex-col gap-3">
            {PILLARS.map((pillar) => {
              const ps   = state.pillars[pillar.key];
              const fill = Math.round((ps.xp / Math.max(ps.xpToNext, 1)) * 100);
              const obs  = observations.find(o => o.pillar === pillar.key);
              const earned = state.achievements.map(getAchievementById).filter(a => a && a.pillar === pillar.key);

              return (
                <div key={pillar.key} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${pillar.color}30`, borderLeft: `3px solid ${pillar.color}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${pillar.color}20` }}>{pillar.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-extrabold text-white text-sm">{pillar.name}</h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: `${pillar.color}20`, color: pillar.color }}>
                          {LEVEL_NAMES[ps.level]} · Lv {ps.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${fill}%`, background: pillar.color }} />
                        </div>
                        <span className="text-[10px] font-bold text-white/30 flex-shrink-0">{ps.xp}/{ps.xpToNext} XP</span>
                      </div>
                    </div>
                  </div>

                  {obs && (
                    <p className="text-xs text-white/55 font-semibold leading-relaxed mb-2 pl-12">
                      {loadingObs ? <span className="text-white/20 animate-pulse">Generating observations…</span> : obs.observation}
                    </p>
                  )}

                  {earned.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-12">
                      {earned.map(a => a && (
                        <span key={a.id} className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${pillar.color}18`, color: pillar.color }}>
                          {a.icon} {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Brave tries ── */}
        {state.braveTries.length > 0 && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest">Brave Try Log</p>
              <span className="text-xs font-extrabold text-[#2AB58A]">{triesComplete}/{state.braveTries.length} done</span>
            </div>
            <div className="mb-4">
              <BraveTrieDonut state={state} tries={state.braveTries} />
            </div>
            <div className="border-t border-white/8 pt-3 flex flex-col gap-2">
              {state.braveTries.map((bt, idx) => (
                <div key={bt.id} className="flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center font-extrabold flex-shrink-0 mt-0.5 text-[9px]"
                    style={{ background: bt.status === 'tried' ? '#2AB58A20' : bt.status === 'not_yet' ? '#EF9F2720' : 'rgba(255,255,255,0.08)', color: bt.status === 'tried' ? '#2AB58A' : bt.status === 'not_yet' ? '#EF9F27' : 'rgba(255,255,255,0.3)' }}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white/80 leading-tight">{bt.mission}</p>
                    {bt.pillar && <p className="text-white/35 mt-0.5">{bt.pillar}</p>}
                    {bt.whatGotInTheWay && <p className="text-white/30 italic mt-0.5">&ldquo;{bt.whatGotInTheWay}&rdquo;</p>}
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: bt.status === 'tried' ? '#2AB58A20' : bt.status === 'not_yet' ? '#EF9F2720' : 'rgba(255,255,255,0.06)', color: bt.status === 'tried' ? '#2AB58A' : bt.status === 'not_yet' ? '#EF9F27' : 'rgba(255,255,255,0.3)' }}>
                    {bt.status === 'tried' ? '✓ Done' : bt.status === 'not_yet' ? 'In progress' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Co-op highlights ── */}
        {coopSessions.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Co-op Mission Highlights</p>
            <div className="flex flex-col gap-2.5">
              {coopSessions.map(s => (
                <div key={s.id} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(83,74,183,0.12)', border: '1px solid rgba(167,159,255,0.2)' }}>
                  <div className="w-8 h-8 rounded-xl bg-[#534AB7]/30 flex items-center justify-center flex-shrink-0 text-base">🎯</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white text-sm truncate">{s.questTitle}</p>
                    <p className="text-[10px] text-white/35 font-semibold">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {s.crewScore && <p className="font-extrabold text-[#A79FFF] text-sm">{s.crewScore.toLocaleString()} pts</p>}
                    {s.badgesEarned.length > 0 && (
                      <div className="flex gap-0.5 justify-end mt-0.5">
                        {s.badgesEarned.map(id => { const a = getAchievementById(id); return a ? <span key={id} className="text-sm">{a.icon}</span> : null; })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── What's next CTA ── */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(83,74,183,0.2)', border: '1px solid rgba(167,159,255,0.3)' }}>
          <p className="text-[10px] font-extrabold text-[#A79FFF] uppercase tracking-widest mb-2">What&apos;s next</p>
          <h2 className="font-extrabold text-white text-lg mb-2">Take it further with ARK</h2>
          <p className="text-sm font-semibold text-white/55 leading-relaxed mb-4">
            These skills grow through practice with peers. In ARK&apos;s live PBL courses, your child works with a group on real challenges — guided by a trained facilitator.
          </p>
          <button className="bg-[#534AB7] hover:bg-[#6B61D0] text-white px-5 py-2.5 rounded-xl text-sm font-extrabold transition-colors shadow-lg shadow-purple-900/40">
            Join a course →
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
