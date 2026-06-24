'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ArrowRight, Trophy, Zap } from 'lucide-react';
import { PILLARS, LEVEL_NAMES } from '@/lib/pillars';
import { getAchievementById } from '@/lib/achievements';
import { loadState } from '@/lib/state';

interface CelebrateData {
  xpGained: Record<string, number>;
  newBadges: string[];
  levelUps: string[];
  totalXP: number;
  questTitle: string;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  shape: 'square' | 'circle';
}

const COLORS = ['#F5C842', '#534AB7', '#7C6FD4', '#1D9E75', '#D85A30', '#EF9F27', '#ff6b9d', '#ffffff'];

function useCountUp(target: number, duration = 1200, delay = 400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

export default function CelebratePage() {
  const router = useRouter();
  const [data, setData] = useState<CelebrateData | null>(null);
  const [state, setState] = useState(loadState());
  const [particles, setParticles] = useState<Particle[]>([]);
  const [barsVisible, setBarsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [trophyPop, setTrophyPop] = useState(false);
  const initialized = useRef(false);

  const xpCount = useCountUp(data?.totalXP ?? 0, 1000, 600);

  useEffect(() => {
    const raw = sessionStorage.getItem('celebrate');
    if (!raw) { router.push('/progress'); return; }
    if (initialized.current) return;
    initialized.current = true;

    setData(JSON.parse(raw));
    setState(loadState());

    // Generate confetti
    const ps: Particle[] = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      duration: 1.8 + Math.random() * 1.4,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    }));
    setParticles(ps);

    setTimeout(() => setTrophyPop(true), 100);
    setTimeout(() => setSectionsVisible(true), 400);
    setTimeout(() => setBarsVisible(true), 900);
  }, [router]);

  function handleContinue() {
    sessionStorage.removeItem('celebrate');
    router.push('/progress');
  }

  if (!data) return null;

  const pillarXPEntries = Object.entries(data.xpGained).filter(([, xp]) => xp > 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">

      {/* Confetti */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
            opacity: 0,
          }}
        />
      ))}

      <div className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10">

        {/* Skip */}
        <div className="w-full flex justify-end">
          <button onClick={handleContinue} className="text-xs font-bold text-white/35 hover:text-white/70 transition-colors">
            Skip
          </button>
        </div>

        {/* Trophy */}
        <div
          className="relative transition-all duration-500"
          style={{
            transform: trophyPop ? 'scale(1)' : 'scale(0)',
            opacity: trophyPop ? 1 : 0,
            transitionTimingFunction: trophyPop ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease',
          }}
        >
          <div
            className="w-28 h-28 bg-gradient-to-br from-[#F5C842] to-[#EF9F27] rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-500/40"
            style={{ animation: trophyPop ? 'trophyFloat 3s ease-in-out 1s infinite' : 'none' }}
          >
            <Trophy size={52} className="text-white drop-shadow-lg" />
          </div>
          <div
            className="absolute -top-2 -right-2 w-9 h-9 bg-[#534AB7] rounded-full flex items-center justify-center border-2 border-[#2D2B4E]"
            style={{ animation: trophyPop ? 'starSpin 4s linear 1.2s infinite' : 'none' }}
          >
            <Star size={15} className="text-white fill-white" />
          </div>
        </div>

        {/* Headline */}
        <div
          className="text-center transition-all duration-500"
          style={{ opacity: sectionsVisible ? 1 : 0, transform: sectionsVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <h1 className="text-3xl font-extrabold text-white mb-1">Quest complete!</h1>
          <p className="text-[#9D9BC4] text-sm font-semibold">{data.questTitle}</p>
        </div>

        {/* Total XP burst */}
        <div
          className="bg-gradient-to-r from-[#534AB7] to-[#7C6FD4] rounded-2xl px-8 py-4 flex items-center gap-3 shadow-lg shadow-purple-900/40 w-full justify-center transition-all duration-500"
          style={{
            opacity: sectionsVisible ? 1 : 0,
            transform: sectionsVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
            transitionDelay: '100ms',
          }}
        >
          <Zap size={22} className="text-yellow-300 fill-yellow-300" />
          <span className="text-white font-extrabold text-2xl tabular-nums">+{xpCount} XP</span>
          <span className="text-[#C5C3E0] text-sm font-semibold">earned</span>
        </div>

        {/* Per-pillar XP bars */}
        {pillarXPEntries.length > 0 && (
          <div
            className="w-full bg-white/5 rounded-2xl p-4 flex flex-col gap-3 transition-all duration-500"
            style={{
              opacity: sectionsVisible ? 1 : 0,
              transform: sectionsVisible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '200ms',
            }}
          >
            <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-1">Skills levelled up</p>
            {pillarXPEntries.map(([key, xp], idx) => {
              const pillar = PILLARS.find((p) => p.key === key);
              if (!pillar) return null;
              const ps = state.pillars[key as keyof typeof state.pillars];
              const isLevelUp = data.levelUps.includes(key);
              const fill = Math.min(Math.round((ps.xp / ps.xpToNext) * 100), 100);
              return (
                <div key={key} style={{ transitionDelay: `${idx * 120}ms` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{pillar.icon}</span>
                      <span className="text-sm font-extrabold text-white">{pillar.childName}</span>
                      {isLevelUp && (
                        <span
                          className="text-[10px] font-extrabold bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full"
                          style={{ animation: 'levelUpPulse 1s ease-in-out infinite' }}
                        >
                          Level up!
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#9D9BC4]">+{xp} XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: barsVisible ? `${fill}%` : '0%',
                        backgroundColor: pillar.color,
                        transition: `width 1s cubic-bezier(0.34,1.1,0.64,1) ${idx * 150 + 100}ms`,
                        boxShadow: barsVisible ? `0 0 8px ${pillar.color}80` : 'none',
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 font-semibold">
                    {LEVEL_NAMES[ps.level]} · Lv {ps.level} · {ps.xp}/{ps.xpToNext} XP
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* New badges */}
        {data.newBadges.length > 0 && (
          <div
            className="w-full bg-white/5 rounded-2xl p-4 transition-all duration-500"
            style={{
              opacity: sectionsVisible ? 1 : 0,
              transform: sectionsVisible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '350ms',
            }}
          >
            <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-3">Badges unlocked</p>
            <div className="flex flex-col gap-2.5">
              {data.newBadges.map((id, idx) => {
                const ach = getAchievementById(id);
                if (!ach) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 transition-all duration-500"
                    style={{
                      opacity: sectionsVisible ? 1 : 0,
                      transform: sectionsVisible ? 'translateX(0)' : 'translateX(-16px)',
                      transitionDelay: `${400 + idx * 100}ms`,
                    }}
                  >
                    <span className="text-2xl" style={{ animation: 'badgeBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: `${800 + idx * 150}ms` }}>
                      {ach.icon}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-white">{ach.name}</p>
                      <p className="text-xs text-[#9D9BC4] font-semibold">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full bg-white text-[#2D2B4E] font-extrabold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-[#F4F3FD] transition-all duration-500 hover:scale-[1.02] active:scale-95"
          style={{
            opacity: sectionsVisible ? 1 : 0,
            transform: sectionsVisible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '500ms',
          }}
        >
          See my progress
          <ArrowRight size={18} />
        </button>
      </div>

      <style jsx>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(-20px) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes trophyFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes starSpin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes levelUpPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes badgeBounce {
          0%   { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
