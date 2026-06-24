'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mic, MicOff, Send, Pin, Zap } from 'lucide-react';
import Toast from '@/components/Toast';
import { getCoopScenario } from '@/lib/missions';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  character?: string;
  characterColor?: string;
  content: string;
  pinned?: boolean;
}

// Simple word filter
const BLOCKED_PATTERNS = [/\d{10,}/g, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g];
function filterInput(text: string): string {
  let filtered = text;
  BLOCKED_PATTERNS.forEach((p) => { filtered = filtered.replace(p, '[removed]'); });
  return filtered;
}

export default function ChallengePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pinnedClues, setPinnedClues] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [toast, setToast] = useState('');
  const [phase, setPhase] = useState(1);
  const [mobileTab, setMobileTab] = useState<'chat' | 'board'>('chat');
  const [missionId, setMissionId] = useState(1);
  const [twistTriggered, setTwistTriggered] = useState(false);
  const [twistStep, setTwistStep] = useState(0); // 0=hidden, 1=alert, 2=power-failure, 3=adapt-fast
  const [maraHintsLeft, setMaraHintsLeft] = useState(3);
  const [maraModalOpen, setMaraModalOpen] = useState(false);
  const [evidenceSlide, setEvidenceSlide] = useState(0);
  const EVIDENCE_IMAGES = ['/mission-001/15.png', '/mission-001/4.png'];
  const touchStartX = useRef<number | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [crewAnswerInput, setCrewAnswerInput] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAutoPins = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    const id = stored ? parseInt(stored, 10) : 1;
    setMissionId(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          router.push('/co-op/reveal');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [router]);

  // Initial bot greeting — driven by the current Ark mission
  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    const id = stored ? parseInt(stored, 10) : 1;
    setMissionId(id);
    const scenario = getCoopScenario(id);
    const greeting = scenario?.initialGreeting ?? { character: 'System', message: "Welcome, investigators. Share your clues and work together to solve the mission." };
    const botColors: Record<string, string> = { System: '#534AB7' };
    if (scenario) {
      scenario.botRoles.forEach((b) => { botColors[b.name] = b.color; });
    }
    setTimeout(() => {
      setMessages([{
        id: 'init',
        role: 'bot',
        character: greeting.character,
        characterColor: botColors[greeting.character] ?? '#534AB7',
        content: greeting.message,
      }]);
    }, 800);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Trigger POWER FAILURE twist at 8 messages (Mission 001 only)
  useEffect(() => {
    if (missionId !== 1 || twistTriggered || messages.length < 8) return;
    setTwistTriggered(true);
    setTwistStep(1);
    setTimeout(() => setTwistStep(2), 3500);
    setTimeout(() => setTwistStep(3), 7000);
    setTimeout(() => setTwistStep(0), 12000);
  }, [messages.length, missionId, twistTriggered]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    const filtered = filterInput(input.trim());
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: filtered,
    };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    const totalMessages = newMsgs.length;
    if (totalMessages > 2) setPhase(Math.min(Math.ceil(totalMessages / 4), 4));

    // Build dynamic color map from current mission's bot roster
    const scenario = getCoopScenario(missionId);
    const characterColors: Record<string, string> = { System: '#534AB7' };
    if (scenario) { scenario.botRoles.forEach((b) => { characterColors[b.name] = b.color; }); }

    try {
      const res = await fetch('/api/coop-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.character ? `[${m.character}]: ${m.content}` : m.content,
          })),
          messageCount: totalMessages,
          missionId,
        }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        character: data.character,
        characterColor: characterColors[data.character] ?? '#888780',
        content: data.message,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Schedule auto-pin after 60 seconds
      const autoPinTimer = setTimeout(() => {
        setPinnedClues((prev) => {
          if (!prev.find((p) => p.id === botMsg.id)) {
            return [...prev, botMsg];
          }
          return prev;
        });
        pendingAutoPins.current.delete(botMsg.id);
      }, 60000);
      pendingAutoPins.current.set(botMsg.id, autoPinTimer);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function pinMessage(msg: ChatMessage) {
    if (pendingAutoPins.current.has(msg.id)) {
      clearTimeout(pendingAutoPins.current.get(msg.id)!);
      pendingAutoPins.current.delete(msg.id);
    }
    setPinnedClues((prev) => {
      if (prev.find((p) => p.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { alert('Voice input works best in Chrome.'); return; }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e: SpeechRecognitionEvent) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timeWarning = timeLeft <= 300;

  const PHASE_LABELS = ['Investigate', 'Analyse Clues', 'Plan Strategy', 'Crack the Code'];

  return (
    <div className="flex flex-col h-screen bg-black/30">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* ── M.A.R.A. hint modal ── */}
      {maraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setMaraModalOpen(false)}>
          <div className="w-full max-w-sm bg-[#0D0B2B] border border-[#534AB7]/40 rounded-3xl p-5 shadow-2xl shadow-purple-900/60"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#EEEDFE] flex items-center justify-center font-extrabold text-[#534AB7] text-base flex-shrink-0">M</div>
              <div>
                <p className="text-white font-extrabold text-sm">Ask M.A.R.A.</p>
                <p className="text-white/40 text-[10px]">Mall Assistance &amp; Rescue Android</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <span key={i} className={`w-2.5 h-2.5 rounded-full ${i <= maraHintsLeft ? 'bg-[#A79FFF]' : 'bg-white/15'}`} />
                ))}
                <span className="text-[10px] text-white/30 ml-1">{maraHintsLeft} left</span>
              </div>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-4">
              M.A.R.A. can nudge your crew in the right direction. Use wisely — you only get 3.
            </p>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3].map((i) => {
                const used = i > maraHintsLeft;
                return (
                  <div key={i} className={`flex-1 py-2 rounded-xl border text-center text-[10px] font-extrabold
                    ${used ? 'border-white/10 bg-white/5 text-white/20 line-through' : 'border-[#534AB7]/50 bg-[#534AB7]/15 text-[#A79FFF]'}`}>
                    {used ? 'Used' : `Hint ${i}`}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMaraModalOpen(false)}
                className="flex-1 py-3 rounded-2xl border border-white/10 text-white/50 text-sm font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMaraHintsLeft((n) => Math.max(0, n - 1));
                  setMaraModalOpen(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-extrabold transition-all"
              >
                Get hint →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit crew answer modal ── */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSubmitModalOpen(false)}>
          <div className="w-full max-w-sm bg-[#0D0B2B] border border-[#534AB7]/40 rounded-3xl p-5 shadow-2xl shadow-purple-900/60"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#534AB7] flex items-center justify-center flex-shrink-0">
                <Send size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-extrabold text-sm">Submit crew answer</p>
                <p className="text-white/40 text-[10px]">This is final — make sure your crew agrees</p>
              </div>
            </div>

            <p className="text-white/50 text-xs leading-relaxed mb-3">
              What is the 4-digit escape code your crew discovered?
            </p>

            <input
              type="text"
              value={crewAnswerInput}
              onChange={(e) => setCrewAnswerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && crewAnswerInput.trim()) {
                  sessionStorage.setItem('crew_answer', crewAnswerInput.trim());
                  router.push('/co-op/reveal');
                }
              }}
              placeholder="e.g. 7482"
              maxLength={20}
              className="w-full bg-white border border-white/20 rounded-2xl px-4 py-3 text-[#2D2B4E] text-lg font-extrabold text-center tracking-[0.3em] placeholder-[#C5C3E0] focus:outline-none focus:border-[#534AB7] mb-5"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="flex-1 py-3 rounded-2xl border border-white/10 text-white/50 text-sm font-bold hover:text-white transition-colors"
              >
                Go back
              </button>
              <button
                disabled={!crewAnswerInput.trim()}
                onClick={() => {
                  sessionStorage.setItem('crew_answer', crewAnswerInput.trim());
                  router.push('/co-op/reveal');
                }}
                className="flex-1 py-3 rounded-2xl bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-extrabold transition-all disabled:opacity-30"
              >
                Submit →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POWER FAILURE TWIST OVERLAY ── */}
      {twistStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {twistStep === 1 && (
            <div className="relative w-full h-full">
              <Image src="/mission-001/21.png" alt="ALERT" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-center pb-10">
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
                  <p className="text-white font-extrabold text-lg animate-pulse">⚡ Emergency alert incoming…</p>
                </div>
              </div>
            </div>
          )}
          {twistStep === 2 && (
            <div className="relative w-full h-full">
              <Image src="/mission-001/22.png" alt="Power Failure" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-center pb-10">
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
                  <p className="text-white font-extrabold text-lg">Food Court records lost — adapt your plan!</p>
                </div>
              </div>
            </div>
          )}
          {twistStep === 3 && (
            <div className="relative w-full h-full">
              <Image src="/mission-001/23.png" alt="Adapt Fast" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-center pb-10">
                <button
                  onClick={() => setTwistStep(0)}
                  className="bg-[#534AB7] hover:bg-[#3C3489] text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-lg shadow-purple-900/60 transition-all"
                >
                  <Zap size={16} className="inline mr-2" />
                  Continue investigating →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-[#09071F]/80 backdrop-blur-md border-b border-white/10 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Phase pips */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-colors ${p <= phase ? 'bg-[#A79FFF]' : 'bg-white/15'}`}
              />
            ))}
            <span className="text-xs text-white/40 ml-1">Phase {phase}/4</span>
          </div>

          {/* Timer */}
          <div className={`font-mono text-sm font-bold ${timeWarning ? 'text-[#F0997B]' : 'text-white/70'}`}>
            {formatTime(timeLeft)}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/co-op/reveal')}
              className="text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="flex md:hidden border-b border-white/10 bg-[#09071F]/80 flex-shrink-0">
        {(['chat', 'board'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors ${mobileTab === tab ? 'text-[#A79FFF] border-b-2 border-[#A79FFF]' : 'text-white/40'}`}
          >
            {tab === 'chat' ? 'Crew chat' : `Mission board${pinnedClues.length > 0 ? ` (${pinnedClues.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Main content — split on desktop, tabbed on mobile */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Crew chat */}
        <div className={`flex-col border-r border-white/10 md:flex md:w-[55%] w-full ${mobileTab === 'chat' ? 'flex' : 'hidden'}`}>

          {/* ── Voice party presence bar ── */}
          {(() => {
            const scenario = getCoopScenario(missionId);
            const bots = scenario?.botRoles ?? [
              { name: 'Casey', role: 'Evidence Analyst', color: '#1D9E75', bg: '#E1F5EE', initial: 'C' },
              { name: 'River', role: 'Mapper',           color: '#D85A30', bg: '#FAECE7', initial: 'R' },
              { name: 'Drew',  role: 'Timekeeper',       color: '#BA7517', bg: '#FAEEDA', initial: 'D' },
            ];
            const lastSpeaker = messages.filter(m => m.role === 'bot').slice(-1)[0]?.character;
            return (
              <div className="flex-shrink-0 px-3 py-3 border-b border-white/10 bg-white/5">
                <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest mb-2">In this room</p>
                <div className="flex gap-3">
                  {/* M.A.R.A. host */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEEDFE] flex items-center justify-center font-extrabold text-lg text-[#534AB7] ring-2 ring-[#534AB7]/60">
                        M
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#09071F]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#534AB7]">M.A.R.A.</span>
                  </div>
                  {/* Player */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-[#534AB7]">
                        <Image src="/avatar.png" alt="You" width={48} height={48} className="object-cover w-full h-full" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#09071F]" />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#A79FFF]">You</span>
                  </div>
                  {/* Bots */}
                  {bots.map((b) => {
                    const isSpeaking = lastSpeaker === b.name && isLoading === false && messages.length > 0;
                    return (
                      <div key={b.name} className="flex flex-col items-center gap-1">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg flex-shrink-0"
                            style={{ backgroundColor: b.bg, color: b.color, boxShadow: isSpeaking ? `0 0 0 2px ${b.color}` : `0 0 0 2px ${b.color}40` }}>
                            {b.initial}
                          </div>
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#09071F]" />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: b.color }}>{b.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Phase label */}
          <div className="px-3 py-2 flex items-center justify-between flex-shrink-0 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1,2,3,4].map((p) => (
                  <div key={p} className={`rounded-full transition-all ${p <= phase ? 'w-4 h-1 bg-[#A79FFF]' : 'w-1 h-1 bg-white/20'}`} />
                ))}
              </div>
              <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider">Phase {phase} — {PHASE_LABELS[phase - 1]}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group items-end gap-2`}>
                {msg.role === 'bot' && (() => {
                  const scenario = getCoopScenario(missionId);
                  const bot = scenario?.botRoles.find(b => b.name === msg.character);
                  const initial = bot?.initial ?? (msg.character?.[0] ?? 'S');
                  const bg = bot?.bg ?? '#EEEDFE';
                  const color = bot?.color ?? '#534AB7';
                  const isSystem = msg.character === 'System';
                  return (
                    <>
                          <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-extrabold text-sm mb-0.5"
                        style={{ backgroundColor: isSystem ? '#EEEDFE' : bg, color: isSystem ? '#534AB7' : color }}>
                        {isSystem ? 'M' : initial}
                      </div>
                      <div className="flex flex-col gap-0.5 max-w-[75%]">
                        {msg.character && (
                          <span className="text-[10px] font-extrabold ml-1" style={{ color }}>
                            {msg.character}
                          </span>
                        )}
                        <div className="relative">
                          <div className="px-3 py-2 text-sm bg-white/10 border border-white/10 text-white rounded-2xl rounded-bl-sm leading-relaxed backdrop-blur-sm">
                            {msg.content}
                          </div>
                          <button
                            onClick={() => pinMessage(msg)}
                            className="absolute -right-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-[#534AB7]"
                            title="Pin to board"
                          >
                            <Pin size={14} />
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
                {msg.role === 'user' && (
                  <>
                    <div className="bg-[#534AB7] text-white px-3 py-2 text-sm rounded-2xl rounded-br-sm max-w-[75%] leading-relaxed">
                      {msg.content}
                    </div>
                    <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden mb-0.5">
                      <Image src="/avatar.png" alt="You" width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                  </>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex-shrink-0 animate-pulse" />
                <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ask M.A.R.A. hint strip */}
          <div className="px-3 pt-2 pb-1 flex-shrink-0">
            <div className={`rounded-2xl border px-3 py-2.5 transition-all ${maraHintsLeft > 0 ? 'bg-[#EEEDFE]/8 border-[#534AB7]/30' : 'bg-white/3 border-white/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-[#534AB7]/40 flex items-center justify-center font-extrabold text-[#A79FFF] text-[10px]">M</span>
                  <span className={`text-[11px] font-extrabold ${maraHintsLeft > 0 ? 'text-[#A79FFF]' : 'text-white/25'}`}>
                    M.A.R.A. Hints
                  </span>
                </span>
                <span className={`text-[10px] font-bold ${maraHintsLeft > 0 ? 'text-white/40' : 'text-white/20'}`}>
                  {maraHintsLeft}/3 remaining
                </span>
              </div>
              <div className="flex gap-2">
                {[3, 2, 1].map((i) => {
                  const used = i > maraHintsLeft;
                  return (
                    <button
                      key={i}
                      onClick={() => !used && maraHintsLeft > 0 && setMaraModalOpen(true)}
                      disabled={used || maraHintsLeft === 0}
                      className={`flex-1 py-1.5 rounded-xl border text-[10px] font-extrabold transition-all
                        ${used
                          ? 'border-white/10 text-white/20 bg-white/5 line-through cursor-not-allowed'
                          : 'border-[#534AB7]/50 text-[#A79FFF] bg-[#534AB7]/15 hover:bg-[#534AB7]/30'}`}
                    >
                      {used ? 'Used' : `Hint ${4 - i}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-transparent px-3 py-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleRecording}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isRecording ? 'bg-[#FAECE7] text-[#D85A30]' : 'bg-[#F1EFE8] text-[#888780] hover:text-[#534AB7]'
                }`}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={getCoopScenario(missionId)?.chatPlaceholder ?? 'Type your message…'}
                className="flex-1 border border-[#B4B2A9]/30 rounded-lg px-3 py-2 text-xs text-[#444441] placeholder-[#B4B2A9] focus:outline-none focus:border-[#534AB7]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 bg-[#534AB7] text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right — Mission board / Evidence Tracker */}
        <div className={`flex-col md:flex md:w-[45%] w-full ${mobileTab === 'board' ? 'flex' : 'hidden'}`}>

          {/* Evidence tracker — swipeable image carousel (Mission 001) */}
          {missionId === 1 ? (
            <div
              className="relative w-full flex-shrink-0 overflow-hidden bg-black/40"
              style={{ height: '350px' }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (dx > 40) setEvidenceSlide(s => (s - 1 + EVIDENCE_IMAGES.length) % EVIDENCE_IMAGES.length);
                else if (dx < -40) setEvidenceSlide(s => (s + 1) % EVIDENCE_IMAGES.length);
                touchStartX.current = null;
              }}
            >
              <Image
                key={EVIDENCE_IMAGES[evidenceSlide % EVIDENCE_IMAGES.length]}
                src={EVIDENCE_IMAGES[evidenceSlide % EVIDENCE_IMAGES.length] || EVIDENCE_IMAGES[0]}
                alt="Evidence"
                fill
                sizes="45vw"
                className="object-cover transition-opacity duration-300"
              />

              {/* Prev / Next arrows */}
              <button
                onClick={() => setEvidenceSlide(s => (s - 1 + EVIDENCE_IMAGES.length) % EVIDENCE_IMAGES.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-base hover:bg-black/80 transition-colors"
              >‹</button>
              <button
                onClick={() => setEvidenceSlide(s => (s + 1) % EVIDENCE_IMAGES.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-base hover:bg-black/80 transition-colors"
              >›</button>

              {/* Bottom bar: label + dots + clue count */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
                <span className="text-white text-[10px] font-extrabold uppercase tracking-widest">Evidence Tracker</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {EVIDENCE_IMAGES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEvidenceSlide(i)}
                        className={`rounded-full transition-all ${i === evidenceSlide ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`}
                      />
                    ))}
                  </div>
                  {pinnedClues.length > 0 && (
                    <span className="bg-[#534AB7] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">{pinnedClues.length} clue{pinnedClues.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 border-b border-white/10 flex-shrink-0">
              <h2 className="text-sm font-bold text-white/60">Mission board</h2>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {pinnedClues.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                <Pin size={20} className="text-white/20" />
                <p className="text-xs text-white/30 leading-relaxed">
                  Hover a crew message and tap the pin icon to add it to your Evidence Tracker
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pinnedClues.map((clue, idx) => (
                  <div
                    key={clue.id}
                    className="bg-white/10 border border-white/10 rounded-lg p-2.5 text-xs"
                    style={{ borderLeft: `3px solid ${clue.characterColor || '#A79FFF'}` }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded-full bg-white/10 text-white/50 text-[8px] font-extrabold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                      <span className="font-extrabold text-[10px] uppercase tracking-wide" style={{ color: clue.characterColor || '#A79FFF' }}>
                        {clue.character}
                      </span>
                    </div>
                    <p className="text-white/70 leading-relaxed">{clue.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#B4B2A9]/10 px-3 py-3 flex-shrink-0">
            <button
              onClick={() => setSubmitModalOpen(true)}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white rounded-2xl py-3 text-sm font-extrabold transition-all shadow-lg shadow-purple-900/40"
            >
              Submit crew answer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
