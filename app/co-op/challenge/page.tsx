'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Send, Pin, AlertCircle } from 'lucide-react';
import Toast from '@/components/Toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  character?: string;
  characterColor?: string;
  content: string;
  pinned?: boolean;
}

const CHARACTER_COLORS: Record<string, string> = {
  Jordan: '#1D9E75',
  Sam: '#D85A30',
  Alex: '#BA7517',
  System: '#534AB7',
};

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
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [toast, setToast] = useState('');
  const [phase, setPhase] = useState(1);
  const [mobileTab, setMobileTab] = useState<'chat' | 'board'>('chat');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAutoPins = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

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

  // Initial bot greeting
  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        id: 'init',
        role: 'bot',
        character: 'Jordan',
        characterColor: CHARACTER_COLORS.Jordan,
        content: "Okay team, let's figure this out! The garden is dying and we need to find out why. I noticed the plants near the main tap look way worse than the ones on the far side. Anyone else notice something?",
      }]);
    }, 800);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        character: data.character,
        characterColor: CHARACTER_COLORS[data.character] || '#888780',
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

  return (
    <div className="flex flex-col h-screen bg-black/30">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

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
            <button
              onClick={() => setToast('A moderator has been notified and will join shortly.')}
              className="flex items-center gap-1.5 text-xs text-white bg-[#D85A30] rounded-lg px-3 py-1.5"
            >
              <AlertCircle size={12} />
              Get help
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
        <div className={`flex-col border-r border-[#B4B2A9]/20 md:flex md:w-[55%] w-full ${mobileTab === 'chat' ? 'flex' : 'hidden'}`}>
          <div className="px-4 py-2 border-b border-white/10 flex-shrink-0">
            <h2 className="text-sm font-bold text-white/60">Crew chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                {msg.role === 'bot' && (
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    {msg.character && (
                      <span className="text-xs font-medium ml-1" style={{ color: msg.characterColor }}>
                        {msg.character}
                      </span>
                    )}
                    <div className="relative">
                      <div
                        className="px-3 py-2 text-sm text-[#444441] bg-white border border-[#B4B2A9]/20 rounded-xl rounded-bl-sm leading-relaxed"
                      >
                        {msg.content}
                      </div>
                      <button
                        onClick={() => pinMessage(msg)}
                        className="absolute -right-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#B4B2A9] hover:text-[#534AB7]"
                        title="Pin to board"
                      >
                        <Pin size={14} />
                      </button>
                    </div>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="bg-[#534AB7] text-white px-3 py-2 text-sm rounded-xl rounded-br-sm max-w-[80%] leading-relaxed">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#B4B2A9]/20 px-3 py-2 rounded-xl rounded-bl-sm text-[#888780] text-sm">
                  …
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#B4B2A9]/20 px-3 py-2 flex-shrink-0">
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
                placeholder="Type your message… (try /lab [sample])"
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

        {/* Right — Mission board */}
        <div className={`flex-col md:flex md:w-[45%] w-full ${mobileTab === 'board' ? 'flex' : 'hidden'}`}>
          <div className="px-4 py-2 border-b border-white/10 flex-shrink-0">
            <h2 className="text-sm font-bold text-white/60">Mission board</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {pinnedClues.length === 0 ? (
              <p className="text-xs text-[#B4B2A9] text-center mt-8">
                Pin clues from the chat to build your case
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {pinnedClues.map((clue) => (
                  <div
                    key={clue.id}
                    className="bg-white border border-[#B4B2A9]/20 rounded-lg p-2.5 text-xs"
                    style={{ borderLeft: `3px solid ${clue.characterColor || '#B4B2A9'}` }}
                  >
                    <p className="text-[#444441] leading-relaxed mb-1">{clue.content}</p>
                    <span className="text-[#888780]" style={{ color: clue.characterColor }}>
                      From: {clue.character}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[#B4B2A9]/10 px-3 py-3 flex-shrink-0">
            <button
              onClick={() => router.push('/co-op/reveal')}
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
