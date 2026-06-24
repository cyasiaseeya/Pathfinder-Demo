'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Flame, Settings, ArrowRight, Trophy, Zap, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { loadState, PathfindersState } from '@/lib/state';
import { PILLARS, LEVEL_NAMES, XP_THRESHOLDS } from '@/lib/pillars';
import { ARK_MISSIONS, getArkMission } from '@/lib/missions';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ArkJourneyCard({ state }: { state: PathfindersState }) {
  const missionId = state.currentArkMission ?? 1;
  const mission = getArkMission(missionId);
  if (!mission) return null;

  const prepDone = (state.soloReadiness?.[missionId] ?? []).length;
  const prepNeeded = mission.unlockThreshold;
  const prepPct = Math.min((prepDone / prepNeeded) * 100, 100);
  const coopReady = prepDone >= prepNeeded;

  const completedMission = state.arkMissions?.find((m) => m.id === missionId - 1);
  const hasCoopFeedback = state.coopFeedback && state.coopFeedback.missionId === missionId - 1;

  // What to show in the "next step" smart card
  const nextSoloQuest = mission.prepQuests.find(
    (q) => !(state.soloReadiness?.[missionId] ?? []).includes(q)
  );

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10"
      style={{ background: 'linear-gradient(135deg, rgba(30,28,58,0.95) 0%, rgba(40,35,70,0.95) 100%)' }}>

      {/* Mission header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
            {mission.subtitle} · Ark Challenge Files
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: mission.bgColor, color: mission.color }}>
            {coopReady ? 'Ready' : `${prepDone}/${prepNeeded} prep`}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 mt-0.5">{mission.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-white leading-tight mb-1">{mission.title}</h2>
            <p className="text-xs text-white/45 font-semibold leading-snug line-clamp-2">{mission.tagline}</p>
          </div>
        </div>
      </div>

      {/* Loop visualization */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2">
          {/* Solo node */}
          <div className={`flex-1 rounded-xl px-3 py-2 border ${coopReady ? 'border-[#97C459]/40 bg-[#EAF3DE]/20' : 'border-white/10 bg-white/5'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen size={10} className={coopReady ? 'text-[#97C459]' : 'text-white/40'} />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/50">Solo Quest</span>
            </div>
            <p className="text-[10px] font-bold text-white/70">
              {coopReady ? '✓ Skills ready' : `${prepDone} / ${prepNeeded} quests done`}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <RefreshCw size={14} className="text-white/20" />
          </div>

          {/* Co-op node */}
          <div className={`flex-1 rounded-xl px-3 py-2 border ${coopReady ? 'border-[#AFA9EC]/40 bg-[#EEEDFE]/20' : 'border-white/10 bg-white/5 opacity-60'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Users size={10} className={coopReady ? 'text-[#AFA9EC]' : 'text-white/30'} />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/50">Co-op Mission</span>
            </div>
            <p className="text-[10px] font-bold text-white/70">
              {coopReady ? 'Unlocked →' : 'Locked'}
            </p>
          </div>
        </div>

        {/* Prep progress bar */}
        {!coopReady && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-extrabold text-white/35 uppercase tracking-wider">Co-op readiness</span>
              <span className="text-[9px] font-bold text-white/35">{Math.round(prepPct)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${prepPct}%`, backgroundColor: mission.color }} />
            </div>
          </div>
        )}
      </div>

      {/* Post-coop feedback banner (shows after completing a mission) */}
      {hasCoopFeedback && state.coopFeedback && (
        <div className="mx-5 mb-3 rounded-xl border border-[#EF9F27]/30 bg-[#FAEEDA]/20 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={10} className="text-[#EF9F27]" />
            <span className="text-[9px] font-extrabold text-[#EF9F27] uppercase tracking-wider">From your last crew mission</span>
          </div>
          <p className="text-[10px] font-semibold text-white/65 leading-snug">
            Your crew identified areas to sharpen before the next mission.
            Solo quests below are highlighted for you.
          </p>
        </div>
      )}

      {/* Smart next-step card */}
      {!coopReady && nextSoloQuest && (
        <div className="mx-5 mb-5">
          <Link href="/solo" className="block">
            <div className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3.5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: mission.bgColor }}>
                <BookOpen size={14} style={{ color: mission.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider mb-0.5">Recommended next</p>
                <p className="text-xs font-extrabold text-white truncate">{nextSoloQuest}</p>
              </div>
              <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}

      {/* Ready CTA */}
      {coopReady && (
        <div className="mx-5 mb-5">
          <Link href="/co-op" className="block">
            <div className="rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:brightness-110"
              style={{ backgroundColor: mission.color }}>
              <Users size={16} className="text-white flex-shrink-0" />
              <span className="flex-1 text-sm font-extrabold text-white">Join the crew mission</span>
              <ArrowRight size={16} className="text-white/70 flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}

      {/* Mission progress dots */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {ARK_MISSIONS.map((m) => {
            const done = state.arkMissions?.some((am) => am.id === m.id && am.completed);
            const active = m.id === missionId;
            return (
              <div key={m.id} className={`rounded-full transition-all ${
                done ? 'w-4 h-2 bg-white/50' :
                active ? 'w-4 h-2 bg-white/80' :
                'w-2 h-2 bg-white/15'
              }`} />
            );
          })}
        </div>
        <span className="text-[9px] font-bold text-white/25">
          {state.arkMissions?.filter((m) => m.completed).length ?? 0} / {ARK_MISSIONS.length} missions complete
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [state, setState] = useState<PathfindersState | null>(null);

  useEffect(() => {
    const loaded = loadState();
    if (!loaded.childName) router.replace('/onboarding');
    else setState(loaded);
  }, [router]);

  if (!state) return null;

  const totalXP   = Object.values(state.pillars).reduce((s, p) => s + p.xp, 0);
  const streak    = Math.min(state.sessionsCompleted, 7);
  const avgLevel  = Math.floor(Object.values(state.pillars).reduce((s, p) => s + p.level, 0) / PILLARS.length);
  const levelName = LEVEL_NAMES[Math.min(avgLevel, LEVEL_NAMES.length - 1)];
  const xpToNext  = XP_THRESHOLDS[Math.min(avgLevel, XP_THRESHOLDS.length - 1)];
  const xpFill    = Math.min((totalXP % xpToNext) / xpToNext * 100, 100);
  const topPillar = PILLARS.reduce((best, p) => state.pillars[p.key].xp > state.pillars[best.key].xp ? p : best, PILLARS[0]);

  // Build last-7-days activity from sessionHistory
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const active = state.sessionHistory.some((s) => s.date.slice(0, 10) === iso);
    return { label: DAY_LABELS[d.getDay()], active, isToday: i === 6 };
  });
  const weeklyCount = weekDays.filter((d) => d.active).length;

  return (
    <div className="min-h-screen pb-24 bg-black/30">
      <div className="max-w-5xl mx-auto px-8 pt-7 flex flex-col gap-5">

        {/* ── Profile + streak card (merged) ── */}
        <div className="relative rounded-3xl overflow-hidden border border-[#534AB7]/30 shadow-xl shadow-[#534AB7]/15"
          style={{ background: 'linear-gradient(135deg, #1d1a3e 0%, #2a2462 100%)' }}>
          <div className="relative z-10 p-5">

            {/* Top row — avatar + name + XP */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-lg flex-shrink-0">
                <Image src="/avatar.png" alt="avatar" width={128} height={128} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-extrabold text-white truncate">{state.childName}</h1>
                  <span className="flex-shrink-0 bg-white/15 text-white/90 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    {levelName}
                  </span>
                </div>
                <p className="text-white/45 text-xs font-semibold mb-3">Top skill: {topPillar.childName}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 rounded-full transition-all duration-700" style={{ width: `${xpFill}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-white/40 flex-shrink-0">{totalXP} / {xpToNext} XP</span>
                </div>
              </div>
              <Link href="/demo-toggle" className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5">
                <Settings size={14} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <div className="bg-white/10 rounded-2xl px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Flame size={12} className="text-[#F0997B]" />
                  <span className="text-base font-extrabold text-white">{streak}</span>
                </div>
                <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wide">Day streak</p>
              </div>
              <div className="bg-white/10 rounded-2xl px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Zap size={12} className="text-[#AFA9EC]" />
                  <span className="text-base font-extrabold text-white">{totalXP}</span>
                </div>
                <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wide">Total XP</p>
              </div>
              <div className="bg-white/10 rounded-2xl px-3 py-2.5 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Trophy size={12} className="text-[#EF9F27]" />
                  <span className="text-base font-extrabold text-white">{state.achievements.length}</span>
                </div>
                <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wide">Badges</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-4" />

            {/* Weekly streak bar */}
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">This week</p>
              <span className="text-[10px] font-bold text-white/35">{weeklyCount}/7 days active</span>
            </div>
            <div className="flex gap-1.5">
              {weekDays.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full h-8 rounded-xl flex items-center justify-center transition-all ${
                    day.active
                      ? 'bg-white/25 shadow-inner'
                      : day.isToday
                      ? 'bg-white/5 border border-dashed border-white/30'
                      : 'bg-white/5'
                  }`}>
                    {day.active && <Flame size={11} className="text-white" />}
                    {day.isToday && !day.active && <div className="w-1 h-1 rounded-full bg-white/40" />}
                  </div>
                  <span className={`text-[9px] font-bold ${
                    day.active || day.isToday ? 'text-white/70' : 'text-white/25'
                  }`}>{day.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Mode cards ── */}
        <div>
          <p className="text-xs font-extrabold text-white/50 uppercase tracking-widest mb-3">Choose your mode</p>
          <div className="grid grid-cols-2 gap-4">

            {/* Solo */}
            <Link href="/solo" className="group">
              <div className="h-80 rounded-3xl p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-300 cursor-pointer overflow-hidden relative"
                style={{ backgroundImage: 'url(/solo-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center bottom' }}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#1A1740]/90 via-[#1A1740]/20 to-transparent pointer-events-none" />
                <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-auto">
                  <BookOpen size={22} className="text-white" />
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide mb-2">
                    Always on
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">Solo Quest</h3>
                  <p className="text-sm text-white/65 font-semibold leading-snug mb-4">
                    Work through a personal goal with your AI guide.
                  </p>
                  <div className="flex items-center gap-1.5 text-white/55 group-hover:text-white transition-colors">
                    <span className="text-sm font-bold">Start</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Crew */}
            <Link href="/co-op" className="group">
              <div className="h-80 rounded-3xl p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-200 cursor-pointer overflow-hidden relative"
                style={{ backgroundImage: 'url(/crew-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#1A0E30]/90 via-[#1A0E30]/25 to-transparent pointer-events-none" />
                <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-auto">
                  <Users size={22} className="text-white" />
                </div>
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide mb-2">
                    Team up
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">Crew Mission</h3>
                  <p className="text-sm text-white/70 font-semibold leading-snug mb-4">
                    Solve a mystery with your crew using your secret role.
                  </p>
                  <div className="flex items-center gap-1.5 text-white/55 group-hover:text-white transition-colors">
                    <span className="text-sm font-bold">Start</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
