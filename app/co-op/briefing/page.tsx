'use client';

import { useRouter } from 'next/navigation';
import { Eye, Zap, ArrowRight } from 'lucide-react';

export default function BriefingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8 bg-black/30">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-7 relative">
          <button
            onClick={() => router.push('/co-op/challenge')}
            className="absolute right-0 top-0 text-xs font-bold text-white/40 hover:text-white transition-colors"
          >
            Skip
          </button>
          <div className="w-14 h-14 bg-[#534AB7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
            <Eye size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Only you can see this</h1>
          <p className="text-white/60 font-semibold text-sm">
            Share what&apos;s useful with your crew — but how you share it is up to you.
          </p>
        </div>

        {/* Clues */}
        <div className="bg-white border-2 border-[#E8E6F8] rounded-2xl p-5 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-[#EEEDFE] rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye size={14} className="text-[#534AB7]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#534AB7] uppercase tracking-widest">Your clues</span>
          </div>
          <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
            The soil test shows salt levels are dangerously high. Plants near the main tap look much worse than those on the far side of the garden.
          </p>
        </div>

        {/* Action */}
        <div className="bg-white border-2 border-[#EAF3DE] rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-[#EAF3DE] rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-[#639922]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#639922] uppercase tracking-widest">Your action — use it once</span>
          </div>
          <p className="text-sm font-semibold text-[#2D2B4E] leading-relaxed">
            Run a lab test on any sample the crew collects. Type{' '}
            <code className="bg-[#EAF3DE] text-[#639922] px-2 py-0.5 rounded-lg text-xs font-extrabold">/lab [sample]</code>
            {' '}in the chat to use it.
          </p>
        </div>

        <button
          onClick={() => router.push('/co-op/challenge')}
          className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-4 font-extrabold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
        >
          Ready — start the mission
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
