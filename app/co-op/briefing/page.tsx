'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, Zap, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { getCoopScenario, getArkMission } from '@/lib/missions';
import SpaceBackground from '@/components/SpaceBackground';

const OBJECTIVES = [
  { icon: '🔍', label: 'Investigate Clues',          color: '#00BCD4', glow: 'rgba(0,188,212,0.3)' },
  { icon: '💬', label: 'Communicate Effectively',    color: '#4CAF50', glow: 'rgba(76,175,80,0.3)'  },
  { icon: '🔄', label: 'Adapt When Plans Fail',      color: '#FFC107', glow: 'rgba(255,193,7,0.3)'  },
  { icon: '🔒', label: 'Unlock The Main Exit',       color: '#9C27B0', glow: 'rgba(156,39,176,0.3)' },
  { icon: '🏃', label: 'Escape Before Power Loss',   color: '#F44336', glow: 'rgba(244,67,54,0.3)'  },
];

export default function BriefingPage() {
  const router = useRouter();
  const [missionId, setMissionId] = useState(1);
  const [briefSlide, setBriefSlide] = useState(0); // 0=objectives, 1=map, 2=secret clues

  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    setMissionId(stored ? parseInt(stored, 10) : 1);
  }, []);

  const scenario   = getCoopScenario(missionId);
  const arkMission = getArkMission(missionId);

  const playerClues  = scenario?.playerClues  ?? 'Your secret clues will appear here.';
  const playerAction = scenario?.playerAction ?? { command: '/action', description: 'Your special action.' };
  const playerRole   = scenario?.playerRole   ?? { icon: '🔬', name: 'Scientist' };

  // For Mission 001, show a 3-step briefing with visuals
  const isMission1 = missionId === 1;

  if (isMission1 && briefSlide < 2) {
    return (
      <div className="fixed inset-0 bg-black">
        {/* Progress dots + skip — floating top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-6 pb-4">
          <div />
          <button onClick={() => router.push('/co-op/challenge')}
            className="text-xs font-bold text-white/50 hover:text-white transition-colors bg-black/30 px-3 py-1.5 rounded-full">
            Skip
          </button>
        </div>

        {/* Slide 0 — Mission Objectives */}
        {briefSlide === 0 && (
          <div className="relative w-full h-full flex flex-col items-center justify-center px-6 slide-up">
            <SpaceBackground />
            {/* Title */}
            <div className="text-center mb-6">
              <p className="text-[10px] font-extrabold tracking-[0.3em] text-white/40 uppercase mb-1">Mission 001</p>
              <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-1" style={{ textShadow: '0 0 30px rgba(83,74,183,0.8)' }}>
                Mission Objectives
              </h1>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Your Mission. Your Team. Your Escape.</p>
            </div>

            {/* Objectives list */}
            <div className="w-full max-w-sm flex flex-col gap-2 mb-8">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest mb-1 text-center">Students must:</p>
              {OBJECTIVES.map((obj) => (
                <div key={obj.label} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${obj.color}40`, boxShadow: `inset 0 0 20px ${obj.glow}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: `${obj.color}20`, border: `2px solid ${obj.color}`, boxShadow: `0 0 10px ${obj.glow}` }}>
                    {obj.icon}
                  </div>
                  <span className="flex-1 font-extrabold text-sm uppercase tracking-wide text-white">{obj.label}</span>
                  <Check size={16} style={{ color: obj.color }} strokeWidth={3} />
                </div>
              ))}
            </div>

            <button onClick={() => setBriefSlide(2)}
              className="bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl px-10 py-4 font-extrabold text-lg transition-all flex items-center gap-2 min-w-[240px] justify-center">
              Read your secret clues <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8 bg-black/30">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-3 relative">
          <button onClick={() => router.push('/co-op/challenge')}
            className="absolute right-0 top-0 text-xs font-bold text-white/40 hover:text-white transition-colors">
            Skip
          </button>

          {/* Mission tag */}
          {arkMission && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
              style={{ backgroundColor: arkMission.bgColor, borderColor: arkMission.borderColor }}>
              <span className="text-sm">{arkMission.icon}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: arkMission.color }}>
                {arkMission.subtitle} — {arkMission.title}
              </span>
            </div>
          )}


          <h1 className="text-2xl font-extrabold text-white mb-1">Only you can see this</h1>
          <p className="text-white/60 font-semibold text-sm">
            Share what&apos;s useful with your crew — but how you share it is up to you.
          </p>
        </div>

        {/* Clues */}
        {isMission1 ? (
          <div className="relative w-full mb-3" style={{ aspectRatio: '4/3', mixBlendMode: 'screen' }}>
            <Image src="/mission-001/first-clue.png" alt="First Clue" fill className="object-contain" />
          </div>
        ) : (
          <div className="bg-white border-2 border-[#E8E6F8] rounded-2xl p-5 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#EEEDFE] rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye size={14} className="text-[#534AB7]" />
              </div>
              <span className="text-[10px] font-extrabold text-[#534AB7] uppercase tracking-widest">Your clues</span>
            </div>
            <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed whitespace-pre-line">
              {playerClues}
            </p>
          </div>
        )}

        {/* Action */}
        <div className="bg-white border-2 border-[#EAF3DE] rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-[#EAF3DE] rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-[#639922]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#639922] uppercase tracking-widest">Your action — use it once</span>
          </div>
          <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
            {playerAction.description}{' '}
            <code className="bg-[#EAF3DE] text-[#639922] px-2 py-0.5 rounded-lg text-xs font-extrabold">
              {playerAction.command}
            </code>
          </p>
        </div>

        <button onClick={() => router.push('/co-op/challenge')}
          className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2">
          Ready — start the mission
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
