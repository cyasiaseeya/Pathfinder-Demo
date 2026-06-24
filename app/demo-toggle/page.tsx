'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Database, ToggleLeft, ToggleRight } from 'lucide-react';
import { loadState, saveState, resetState, seedDemoData, PathfindersState } from '@/lib/state';

export default function DemoTogglePage() {
  const router = useRouter();
  const [state, setState] = useState<PathfindersState | null>(null);

  useEffect(() => { setState(loadState()); }, []);

  function toggleEntitlement() {
    if (!state) return;
    const updated = { ...state, entitlement: (state.entitlement === 'free' ? 'paid' : 'free') as 'free' | 'paid' };
    saveState(updated); setState(updated);
  }

  function handleReset() { resetState(); router.push('/onboarding'); }

  function handleSeed() {
    const seeded = seedDemoData(state?.childName || 'Alex');
    setState(seeded);
  }

  if (!state) return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center">
      <p className="text-[#9D9BC4] font-semibold text-sm">
        No state. <a href="/" className="text-[#534AB7] font-bold underline">Go home</a>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black/30">
      <div className="max-w-md mx-auto px-5 pt-7 pb-12">

        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => router.push('/')}
            className="w-9 h-9 bg-white border border-[#E8E6F8] rounded-xl flex items-center justify-center text-[#9D9BC4] hover:text-[#534AB7] hover:border-[#534AB7] transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest">Hidden route</p>
            <h1 className="text-xl font-extrabold text-[#2D2B4E]">Demo controls</h1>
          </div>
        </div>

        {/* State summary */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5 mb-3 shadow-sm">
          <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-3">Current state</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {[
              ['Name',          state.childName],
              ['Entitlement',   state.entitlement],
              ['Sessions',      String(state.sessionsCompleted)],
              ['Achievements',  String(state.achievements.length)],
              ['Brave tries',   String(state.braveTries.length)],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] font-bold text-[#B4B2C9] uppercase">{k}</p>
                <p className="font-extrabold text-[#2D2B4E]">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle entitlement */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5 mb-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-1">Entitlement</p>
              <p className="text-sm font-extrabold text-[#2D2B4E]">
                {state.entitlement === 'paid' ? 'Paid — co-op unlocked' : 'Free — co-op locked'}
              </p>
            </div>
            <button onClick={toggleEntitlement} className="flex items-center gap-2 bg-[#EEEDFE] hover:bg-[#534AB7] text-[#534AB7] hover:text-white px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all">
              {state.entitlement === 'paid' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              Switch
            </button>
          </div>
        </div>

        {/* Seed */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5 mb-3 shadow-sm">
          <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-1">Demo data</p>
          <p className="text-xs font-semibold text-[#9D9BC4] mb-3">
            Populate with 2 sessions, XP, and brave tries so the progress and report screens have content.
          </p>
          <button onClick={handleSeed}
            className="w-full flex items-center justify-center gap-2 bg-[#1D9E75] hover:bg-[#085041] text-white rounded-xl py-3 text-sm font-extrabold transition-colors">
            <Database size={15} />
            Seed demo data
          </button>
        </div>

        {/* Reset */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-extrabold text-[#B4B2C9] uppercase tracking-widest mb-1">Reset</p>
          <p className="text-xs font-semibold text-[#9D9BC4] mb-3">Clears all data and returns to the name entry screen.</p>
          <button onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-[#FAECE7] hover:bg-[#F0997B] text-[#712B13] hover:text-white rounded-xl py-3 text-sm font-extrabold transition-all border border-[#F0997B]/30">
            <RefreshCw size={15} />
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
