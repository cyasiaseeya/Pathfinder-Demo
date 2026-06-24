'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, RefreshCw, X } from 'lucide-react';
import { getArkMission, getCoopScenario } from '@/lib/missions';
import { loadState } from '@/lib/state';
import SpaceBackground from '@/components/SpaceBackground';

type Phase = 'queue' | 'intro' | 'countdown' | 'mission' | 'reveal';

function Avatar({ initial, color, bg, size = 'md' }: { initial: string; color: string; bg: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-base';
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-extrabold flex-shrink-0`}
      style={{ backgroundColor: bg, color, border: `2px solid ${color}30` }}>
      {initial}
    </div>
  );
}

const PLAYER_ROLE = { icon: '🔬', id: 'scientist', color: '#534AB7', bgColor: '#EEEDFE', player: 'You' };

export default function CoopLobbyPage() {
  const router = useRouter();
  const [phase, setPhase]             = useState<Phase>('queue');
  const [filledSlots, setFilledSlots] = useState(0);
  const [countdown, setCountdown]     = useState(3);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);
  const [allFlipped, setAllFlipped]   = useState(false);
  const [toast, setToast]             = useState('');
  const [showSwapPicker, setShowSwapPicker] = useState(false);
  const [missionId, setMissionId]     = useState(1);
  const [introFading, setIntroFading] = useState(false);
  const [typedText, setTypedText]     = useState('');
  const [typingDone, setTypingDone]   = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MARA_SCRIPT = "Greetings Investigators.\nI am M.A.R.A.\nMall Assistance and Rescue Android.\nA severe storm has damaged our systems.\nAll exits have been sealed.\nPower reserves are rapidly decreasing.\nYou have been selected as emergency problem-solvers.\nFind the escape code before total shutdown.";

  useEffect(() => {
    // Demo: always Mission 001
    setMissionId(1);
    sessionStorage.setItem('coop_mission_id', '1');
  }, []);

  const arkMission = getArkMission(missionId);
  const scenario   = getCoopScenario(missionId);
  const bots       = scenario?.botRoles ?? [
    { name: 'Jordan', role: 'Scout',      color: '#1D9E75', bg: '#E1F5EE', initial: 'J' },
    { name: 'Sam',    role: 'Diplomat',   color: '#D85A30', bg: '#FAECE7', initial: 'S' },
    { name: 'Alex',   role: 'Timekeeper', color: '#BA7517', bg: '#FAEEDA', initial: 'A' },
  ];

  const BOT_ABILITIES: Record<string, string> = {
    'Evidence Analyst': 'Examine store clues and flag inconsistencies for the crew.',
    'Mapper':           'Track which locations have been searched and mark dead ends.',
    'Timekeeper':       'Monitor power levels and warn the crew when time is critical.',
    'Scout':            'Explore new areas first and report findings back to the crew.',
    'Diplomat':         'Mediate disagreements and keep crew communication on track.',
  };

  // Build the 4 role cards: 3 bots + player
  const roleCards = [
    ...bots.map((b) => ({ id: b.name.toLowerCase(), icon: '🔍', name: b.role, player: b.name, color: b.color, bgColor: b.bg, ability: BOT_ABILITIES[b.role] ?? 'Support the crew with your unique expertise.' })),
    { id: 'player', icon: PLAYER_ROLE.icon, name: scenario?.playerRole.name ?? 'Scientist', player: 'You', color: PLAYER_ROLE.color, bgColor: PLAYER_ROLE.bgColor, ability: scenario?.playerAction?.description ?? 'Use your special skill to unlock hidden information.' },
  ];

  function startQueue() {
    let slot = 0;
    const fill = () => {
      if (slot < 3) { setFilledSlots(++slot); timer.current = setTimeout(fill, 700); }
      else setTimeout(() => setPhase('countdown'), 600);
    };
    timer.current = setTimeout(fill, 700);
  }

  useEffect(() => {
    if (phase !== 'intro') return;
    setIntroFading(false);
    setTypedText('');
    setTypingDone(false);
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTypedText(MARA_SCRIPT.slice(0, i));
      if (i >= MARA_SCRIPT.length) { clearInterval(typeInterval); setTypingDone(true); }
    }, 28);
    return () => { clearInterval(typeInterval); };
  }, [phase, MARA_SCRIPT]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    let n = 3;
    const tick = () => {
      if (n > 1) { setCountdown(--n); timer.current = setTimeout(tick, 1000); }
      else setTimeout(() => setPhase('intro'), 500);
    };
    timer.current = setTimeout(tick, 1000);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    [0,1,2,3].forEach((i) => setTimeout(() => {
      setFlippedCards((p) => { const n = [...p]; n[i] = true; return n; });
      if (i === 3) setTimeout(() => setAllFlipped(true), 600);
    }, (i + 1) * 500));
  }, [phase]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className={`${(phase === 'intro' || phase === 'mission') && missionId === 1 ? 'fixed inset-0' : 'min-h-screen flex items-center justify-center px-5 py-8'} bg-black/30`}>
      {toast && (
        <div className="fixed top-5 right-5 bg-[#2D2B4E] text-white text-sm font-bold px-5 py-3 rounded-2xl z-50 shadow-xl slide-up">
          {toast}
        </div>
      )}

      {/* ── Queue — mission 001 ── */}
      {phase === 'queue' && missionId === 1 && (
        <div className="relative w-full flex flex-col items-center justify-center px-6">
          <SpaceBackground />
          <h1 className="text-3xl font-extrabold text-white mb-2 text-center">Find your crew</h1>
          <p className="text-white/50 font-semibold text-base mb-12 text-center">Press Start to queue for Mission 001.</p>
          <div className="flex justify-center gap-8 mb-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-3xl overflow-hidden ring-2 ring-[#534AB7]/60 shadow-xl">
                <Image src="/avatar.png" alt="You" width={112} height={112} className="object-cover w-full h-full" />
              </div>
              <span className="text-base font-extrabold text-[#A79FFF]">You</span>
            </div>
            {bots.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center font-extrabold text-3xl transition-all duration-500 shadow-xl ${filledSlots > i ? '' : 'border-2 border-dashed border-white/20'}`}
                  style={filledSlots > i ? { backgroundColor: b.bg, color: b.color } : {}}>
                  {filledSlots > i ? b.initial : <span className="text-white/20 text-2xl">?</span>}
                </div>
                <span className="text-base font-bold" style={{ color: filledSlots > i ? b.color : '#C5C3E0' }}>
                  {filledSlots > i ? b.name : '···'}
                </span>
              </div>
            ))}
          </div>
          {filledSlots === 0
            ? <button onClick={startQueue} className="bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl px-12 py-5 font-extrabold text-xl shadow-2xl shadow-purple-900/60 transition-all min-w-[260px]">
                Start queue →
              </button>
            : filledSlots < 3 && <p className="text-center text-base font-bold text-white/60 animate-pulse">Finding teammates…</p>
          }
        </div>
      )}

      {/* ── Scenario intro — M.A.R.A. bot + typewriter text ── */}
      {phase === 'intro' && missionId === 1 && (
        <div className="fixed inset-0 flex items-center transition-opacity duration-600" style={{ opacity: introFading ? 0 : 1 }}>
          <SpaceBackground />
          {/* Bot */}
          <div className="relative w-3/5 h-full flex-shrink-0" style={{ mixBlendMode: 'screen' }}>
            <Image src="/mission-001/mara-bot.png" alt="M.A.R.A." fill className="object-contain" style={{ objectPosition: 'right center', transform: 'scale(1.3)', transformOrigin: 'right center' }} priority />
          </div>
          {/* Typewriter text + button */}
          <div className="w-2/5 pr-6 pl-0 flex flex-col gap-6 -ml-16">
            <div className="font-mono text-sm leading-relaxed" style={{ color: '#00E5FF' }}>
              {typedText.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
              {!typingDone && <span className="inline-block w-2 h-4 ml-0.5 align-middle animate-pulse" style={{ background: '#00E5FF' }} />}
            </div>
            {typingDone && (
              <button
                onClick={() => { setIntroFading(true); setTimeout(() => { setPhase('reveal'); setIntroFading(false); }, 600); }}
                className="bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl px-8 py-3 font-extrabold text-base shadow-2xl shadow-purple-900/60 transition-all self-start">
                Let's go →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Queue — other missions ── */}
      {phase === 'queue' && missionId !== 1 && (
        <div className="w-full max-w-md text-center">
          {arkMission && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
              style={{ backgroundColor: arkMission.bgColor, borderColor: arkMission.borderColor }}>
              <span className="text-base">{arkMission.icon}</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: arkMission.color }}>
                {arkMission.subtitle}
              </span>
            </div>
          )}
          <div className="w-16 h-16 bg-[#534AB7] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-200">
            <Users size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">{arkMission?.title ?? 'Find your crew'}</h1>
          <p className="text-white/60 font-semibold text-sm mb-8">Press Start to queue.</p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#534AB7]/30">
                <Image src="/avatar.png" alt="You" width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <span className="text-xs font-extrabold text-[#A79FFF]">You</span>
            </div>
            {bots.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl transition-all duration-500 ${filledSlots > i ? '' : 'border-2 border-dashed border-white/20'}`}
                  style={filledSlots > i ? { backgroundColor: b.bg, color: b.color, border: `2px solid ${b.color}30` } : {}}>
                  {filledSlots > i ? b.initial : <span className="text-white/20 text-lg">?</span>}
                </div>
                <span className="text-xs font-bold" style={{ color: filledSlots > i ? b.color : '#C5C3E0' }}>
                  {filledSlots > i ? b.name : '···'}
                </span>
              </div>
            ))}
          </div>
          {filledSlots === 0
            ? <button onClick={startQueue} className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all">
                Start queue →
              </button>
            : filledSlots < 3 && <p className="text-sm font-bold text-white/50 animate-pulse">Finding teammates…</p>
          }
        </div>
      )}

      {/* ── Countdown ── */}
      {phase === 'countdown' && (
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-extrabold text-white mb-1">Crew found!</h2>
          <p className="text-white/60 font-semibold text-sm mb-7">Mission starting in…</p>
          <div className="flex justify-center mb-7">
            <div className="relative w-52 h-52">
              <svg className="w-52 h-52 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#534AB7" strokeWidth="4"
                  strokeDasharray="214" strokeDashoffset={(countdown / 3) * 214}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-extrabold text-white">{countdown}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-5">
            {[{ initial: 'Y', color: '#534AB7', bg: '#EEEDFE', name: 'You', isPlayer: true }, ...bots.map(b => ({ ...b, isPlayer: false }))].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {m.isPlayer
                  ? <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#534AB7]/30"><Image src="/avatar.png" alt="You" width={64} height={64} className="object-cover w-full h-full" /></div>
                  : <Avatar initial={m.initial} color={m.color} bg={m.bg} size="lg" />
                }
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mission intro — M.A.R.A. for mission 001 ── */}
      {phase === 'mission' && scenario && arkMission && missionId === 1 && (
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <SpaceBackground />
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ background: '#0e0c1e' }}>
              {/* Image — aspect ratio capped so it never overflows the screen */}
              <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '8/5', maxHeight: '77vh' }}>
                <Image src="/mission-001/2.png" alt="M.A.R.A. Introduction" fill className="object-cover" priority />
              </div>
              {/* Pills + button inside the card */}
              <div className="px-5 pt-4 pb-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {arkMission.coreValues.map((v) => (
                    <span key={v} className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide bg-white/10 text-white/70 border border-white/15">
                      {v}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center">
                  <button onClick={() => setPhase('reveal')}
                    className="bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl px-10 py-4 font-extrabold text-lg shadow-2xl shadow-purple-900/80 transition-all min-w-[220px]">
                    Let's go →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ── Mission intro — other missions ── */}
      {phase === 'mission' && scenario && arkMission && missionId !== 1 && (
          <div className="w-full max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg text-3xl"
              style={{ backgroundColor: arkMission.bgColor }}>
              {arkMission.icon}
            </div>
            <div className="mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: arkMission.color }}>
                {arkMission.subtitle}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">{arkMission.title}</h2>
            <p className="text-white/60 font-semibold text-sm mb-6">Read the mission before roles are dealt.</p>
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mb-3 text-left">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2">The situation</p>
              <p className="text-sm font-semibold text-white leading-relaxed">{scenario.situation}</p>
            </div>
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mb-5 text-left">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2">Your goal</p>
              <p className="text-sm font-semibold text-white leading-relaxed">{scenario.goal}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {arkMission.coreValues.map((v) => (
                <span key={v} className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: arkMission.bgColor, color: arkMission.color }}>
                  {v}
                </span>
              ))}
            </div>
            <button onClick={() => setPhase('reveal')}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all">
              Got it — deal roles →
            </button>
          </div>
        )}

      {/* ── Role reveal ── */}
      {phase === 'reveal' && (
        <div className="w-full max-w-md text-center">
            <h2 className="text-2xl font-extrabold text-white mb-1">Roles are being dealt…</h2>
            <p className="text-white/60 font-semibold text-sm mb-6">Your secret role comes alive on the next screen.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roleCards.map((role, i) => (
                <div key={role.id} className="perspective-1000" style={{ height: '260px' }}>
                  <div className={`card-inner w-full h-full ${flippedCards[i] ? 'flipped' : ''}`}>
                    {/* Card back — face-down */}
                    <div className="card-face rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#2D2B4E] border border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-white/40 text-xl">?</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Revealing</span>
                    </div>
                    {/* Card front — Pandemic-style role card */}
                    <div className={`card-face card-back-face rounded-2xl overflow-hidden flex flex-col border-2 ${role.player === 'You' ? 'shadow-xl' : ''}`}
                      style={{ backgroundColor: role.bgColor, borderColor: role.player === 'You' ? '#534AB7' : `${role.color}40` }}>
                      {/* Colored header band */}
                      <div className="px-3 py-2 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: role.color }}>
                        <span className="text-white font-extrabold text-xs uppercase tracking-wide leading-tight">{role.name}</span>
                        {role.player === 'You' && <span className="text-[9px] font-extrabold bg-white/30 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">You</span>}
                      </div>
                      {/* Icon area */}
                      <div className="flex items-center justify-center flex-1 py-2">
                        <span className="text-4xl drop-shadow-sm">{role.icon}</span>
                      </div>
                      {/* Footer — player name + ability, fixed height so all cards align */}
                      <div className="px-3 pb-4 flex-shrink-0" style={{ height: '90px' }}>
                        <p className="font-extrabold text-sm mb-1" style={{ color: role.color }}>{role.player}</p>
                        <p className="text-xs leading-snug" style={{ color: `${role.color}99` }}>{role.ability}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => router.push('/co-op/briefing')} disabled={!allFlipped}
                className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-40 text-white rounded-2xl py-4 font-extrabold transition-all disabled:shadow-none">
                Accept role and continue →
              </button>

              {!showSwapPicker ? (
                <button onClick={() => setShowSwapPicker(true)}
                  className="w-full bg-white/10 border border-white/20 text-white/70 rounded-2xl py-3 text-sm font-bold hover:bg-white/20 hover:text-white transition-colors flex items-center justify-center gap-2">
                  <RefreshCw size={14} />
                  Request a swap with a teammate
                </button>
              ) : (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-3 text-center">
                    Who do you want to swap with?
                  </p>
                  <div className="flex flex-col gap-2">
                    {bots.map((b) => (
                      <button key={b.name}
                        onClick={() => {
                          setShowSwapPicker(false);
                          setToast(`Swap request sent to ${b.name}`);
                          setTimeout(() => setToast(''), 3000);
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-bold text-sm transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: b.bg, color: b.color, border: `1.5px solid ${b.color}30` }}>
                        <Avatar initial={b.initial} color={b.color} bg={b.bg} size="sm" />
                        <div className="text-left">
                          <span className="block font-extrabold">{b.name}</span>
                          <span className="block text-[11px] opacity-70">{b.role}</span>
                        </div>
                        <RefreshCw size={13} className="ml-auto opacity-60" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowSwapPicker(false)}
                    className="w-full mt-3 text-xs text-white/40 hover:text-white/70 transition-colors font-semibold">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
