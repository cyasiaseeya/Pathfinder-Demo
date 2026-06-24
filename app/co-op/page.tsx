'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, RefreshCw, Leaf } from 'lucide-react';
import { COOP_ROLES } from '@/lib/missions';

type Phase = 'queue' | 'countdown' | 'mission' | 'reveal';

const BOT_TEAMMATES = [
  { name: 'Jordan', color: '#1D9E75', bg: '#E1F5EE', initial: 'J', role: 'Scout' },
  { name: 'Sam',    color: '#D85A30', bg: '#FAECE7', initial: 'S', role: 'Diplomat' },
  { name: 'Alex',   color: '#BA7517', bg: '#FAEEDA', initial: 'A', role: 'Timekeeper' },
];

function Avatar({ initial, color, bg, size = 'md' }: { initial: string; color: string; bg: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-9 h-9 text-sm' : 'w-12 h-12 text-base';
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-extrabold flex-shrink-0`}
      style={{ backgroundColor: bg, color, border: `2px solid ${color}30` }}>
      {initial}
    </div>
  );
}

export default function CoopLobbyPage() {
  const router = useRouter();
  const [phase, setPhase]           = useState<Phase>('queue');
  const [filledSlots, setFilledSlots] = useState(0);
  const [countdown, setCountdown]   = useState(3);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);
  const [allFlipped, setAllFlipped] = useState(false);
  const [toast, setToast]           = useState('');
  const [showSwapPicker, setShowSwapPicker] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startQueue() {
    let slot = 0;
    const fill = () => {
      if (slot < 3) { setFilledSlots(++slot); timer.current = setTimeout(fill, 700); }
      else setTimeout(() => setPhase('countdown'), 600);
    };
    timer.current = setTimeout(fill, 700);
  }

  useEffect(() => {
    if (phase !== 'countdown') return;
    let n = 3;
    const tick = () => {
      if (n > 1) { setCountdown(--n); timer.current = setTimeout(tick, 1000); }
      else setTimeout(() => setPhase('mission'), 500);
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
    <div className="min-h-screen flex items-center justify-center px-5 py-8 bg-black/30">
      {toast && (
        <div className="fixed top-5 right-5 bg-[#2D2B4E] text-white text-sm font-bold px-5 py-3 rounded-2xl toast-slide-in z-50 shadow-xl">
          {toast}
        </div>
      )}

      <div className="w-full max-w-md">

        {/* ── Queue ── */}
        {phase === 'queue' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#534AB7] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-200">
              <Users size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Find your crew</h1>
            <p className="text-white/60 font-semibold text-sm mb-8">
              Press Start to queue. Roles are assigned once everyone is in.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-[#534AB7]/30 flex-shrink-0">
                  <Image src="/avatar.png" alt="You" width={64} height={64} className="object-cover w-full h-full" />
                </div>
                <span className="text-xs font-extrabold text-[#A79FFF]">You</span>
              </div>
              {BOT_TEAMMATES.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div                   className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl transition-all duration-500 ${filledSlots > i ? '' : 'border-2 border-dashed border-white/20'}`}
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
          <div className="text-center">
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
              {[{ initial: 'Y', color: '#534AB7', bg: '#EEEDFE', name: 'You', isPlayer: true }, ...BOT_TEAMMATES.map(b => ({ ...b, isPlayer: false }))].map((m, i) => (
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

        {/* ── Mission intro ── */}
        {phase === 'mission' && (
          <div className="text-center">
            <div className="w-14 h-14 bg-[#1D9E75] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
              <Leaf size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Your team challenge</h2>
            <p className="text-white/60 font-semibold text-sm mb-6">Read the mission before roles are dealt.</p>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mb-3 text-left">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2">The situation</p>
              <p className="text-sm font-semibold text-white leading-relaxed">
                The school garden is dying — and nobody knows why. Plants near the main tap look far worse than those on the far side of the garden. Your crew has 20 minutes to figure out what&apos;s killing them.
              </p>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mb-8 text-left">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-2">Your goal</p>
              <p className="text-sm font-semibold text-white leading-relaxed">
                Share clues, piece together what you each know, and submit one answer as a crew. Every role matters — nobody can solve this alone.
              </p>
            </div>

            <button
              onClick={() => setPhase('reveal')}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all"
            >
              Got it — deal roles →
            </button>
          </div>
        )}

        {/* ── Role reveal ── */}
        {phase === 'reveal' && (
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white mb-1">Roles are being dealt…</h2>
            <p className="text-white/60 font-semibold text-sm mb-6">Your secret role comes alive on the next screen.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {COOP_ROLES.map((role, i) => (
                <div key={role.id} className="perspective-1000 h-36">
                  <div className={`card-inner w-full h-full ${flippedCards[i] ? 'flipped' : ''}`}>
                    {/* Face down */}
                    <div className="card-face rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#2D2B4E]">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-white/40 text-xl">?</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Revealing</span>
                    </div>
                    {/* Face up */}
                    <div className={`card-face card-back-face rounded-2xl flex flex-col items-center justify-center gap-1.5 p-3 border-2 ${role.player === 'You' ? 'shadow-lg shadow-purple-200' : ''}`}
                      style={{ backgroundColor: role.bgColor, borderColor: role.player === 'You' ? '#534AB7' : `${role.color}30` }}>
                      {role.player === 'You' && (
                        <span className="text-[9px] font-extrabold text-[#534AB7] bg-white px-2 py-0.5 rounded-full uppercase tracking-wide">Your role</span>
                      )}
                      <span className="text-2xl">{role.icon}</span>
                      <span className="font-extrabold text-sm" style={{ color: role.color }}>{role.name}</span>
                      <span className="text-[10px] font-semibold text-[#6B6893]">{role.player}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => router.push('/co-op/briefing')}
                disabled={!allFlipped}
                className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-40 text-white rounded-2xl py-4 font-extrabold transition-all shadow-lg shadow-purple-200 disabled:shadow-none"
              >
                Accept role and continue →
              </button>

              {!showSwapPicker ? (
                <button
                  onClick={() => setShowSwapPicker(true)}
                  className="w-full bg-white/10 border border-white/20 text-white/70 rounded-2xl py-3 text-sm font-bold hover:bg-white/20 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Request a swap with a teammate
                </button>
              ) : (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-3 text-center">
                    Who do you want to swap with?
                  </p>
                  <div className="flex flex-col gap-2">
                    {BOT_TEAMMATES.map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setShowSwapPicker(false);
                          setToast(`Swap request sent to ${b.name}`);
                          setTimeout(() => setToast(''), 3000);
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-bold text-sm transition-all hover:scale-[1.02]"
                        style={{ backgroundColor: b.bg, color: b.color, border: `1.5px solid ${b.color}30` }}
                      >
                        <Avatar initial={b.initial} color={b.color} bg={b.bg} size="sm" />
                        <div className="text-left">
                          <span className="block font-extrabold">{b.name}</span>
                          <span className="block text-[11px] opacity-70">{b.role}</span>
                        </div>
                        <RefreshCw size={13} className="ml-auto opacity-60" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSwapPicker(false)}
                    className="w-full mt-3 text-xs text-white/40 hover:text-white/70 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
