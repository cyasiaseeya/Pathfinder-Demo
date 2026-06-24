'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mic, MicOff, Send, X, Sparkles } from 'lucide-react';
import WaveIndicator from '@/components/WaveIndicator';

interface Message { role: 'user' | 'assistant'; content: string; }
interface Quest { title: string; desc: string; pillar: string; }

export default function QuestPage() {
  const router = useRouter();
  const [quest, setQuest]         = useState<Quest | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [step, setStep]           = useState(2);
  const [showBanner, setShowBanner]   = useState(false);
  const [readyForReflection, setReadyForReflection] = useState(false);
  const [resumed, setResumed]     = useState(false);
  const [isTyping, setIsTyping]   = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const ttsCache       = useRef<Map<string, string>>(new Map());
  const typingTimer    = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('current_quest');
    if (!raw) { router.push('/solo'); return; }
    setQuest(JSON.parse(raw));
    const existing = sessionStorage.getItem('quest_messages');
    if (existing) {
      const msgs = JSON.parse(existing) as Message[];
      setMessages(msgs);
      setResumed(true);
      setStep(2);
    }
  }, [router]);

  useEffect(() => {
    if (quest && messages.length === 0 && !resumed) sendToAI([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendToAI(msgs: Message[]) {
    if (!quest) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, questTitle: quest.title }),
      });
      const full = await res.text();
      const display = full
        .replace(/```json[\s\S]*?```/g, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\{[^{}]*"ready_for_reflection"[^{}]*\}/g, '')
        .trim();
      // Typewriter animation
      setMessages((p) => [...p, { role: 'assistant', content: '' }]);
      setIsTyping(true);
      let i = 0;
      if (typingTimer.current) clearInterval(typingTimer.current);
      typingTimer.current = setInterval(() => {
        i++;
        setMessages((p) => {
          const updated = [...p];
          updated[updated.length - 1] = { role: 'assistant', content: display.slice(0, i) };
          return updated;
        });
        if (i >= display.length) {
          clearInterval(typingTimer.current!);
          typingTimer.current = null;
          setIsTyping(false);
        }
      }, 18);
      const jsonMatch = full.match(/\{[^{}]*"ready_for_reflection"[^{}]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.ready_for_reflection && !readyForReflection) { setReadyForReflection(true); setShowBanner(true); }
          if (parsed.pillar_signal) {
            const sig = JSON.parse(sessionStorage.getItem('pillar_signals') || '{}');
            sig[parsed.pillar_signal] = parsed.signal_reason;
            sessionStorage.setItem('pillar_signals', JSON.stringify(sig));
          }
        } catch { /* ignore */ }
      }
      const cleanDisplay = full.replace(/\{[^}]*"ready_for_reflection"[^}]*\}/g, '').trim();
      const newMsgs: Message[] = [...msgs, { role: 'assistant', content: cleanDisplay }];
      sessionStorage.setItem('quest_messages', JSON.stringify(newMsgs));
      await speakText(cleanDisplay);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  async function speakText(text: string) {
    const hash = btoa(encodeURIComponent(text.slice(0, 100)));
    if (ttsCache.current.has(hash)) { playAudio(ttsCache.current.get(hash)!); return; }
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      if (!res.ok) return;
      const url = URL.createObjectURL(await res.blob());
      ttsCache.current.set(hash, url);
      playAudio(url);
    } catch { /* optional */ }
  }

  function playAudio(url: string) {
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setIsSpeaking(true);
    audio.play().catch(() => {});
    audio.onended = () => setIsSpeaking(false);
  }

  async function handleSend() {
    if (!input.trim() || isLoading || isTyping) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    sessionStorage.setItem('quest_messages', JSON.stringify(newMsgs));
    await sendToAI(newMsgs);
  }

  function handleReflect() {
    router.push('/solo/reflection?stage=closing');
  }

  const toggleRecording = useCallback(() => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) { alert('Voice input works best in Chrome.'); return; }
    const r = new API();
    r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (e: SpeechRecognitionEvent) => setInput(e.results[0][0].transcript);
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r;
    r.start(); setIsRecording(true);
  }, [isRecording]);

  if (!quest) return null;

  const steps = ['Goal set', 'Chatting', 'Reflect', 'Missions'];

  return (
    <div className="flex flex-col h-screen bg-black/30">

      {/* Header */}
      <div className="bg-[#09071F]/80 backdrop-blur-md border-b border-white/10 px-5 py-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex-1 min-w-0">
                <h1 className="font-extrabold text-white text-sm truncate">{quest.title}</h1>
                <span className="inline-block bg-white/15 text-white/80 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {quest.pillar}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button
                onClick={() => router.push('/solo/reflection?stage=closing')}
                className="text-xs font-bold text-white/35 hover:text-white/70 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-9 h-9 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>
          {/* Step rail */}
          <div className="flex items-center gap-1">
            {steps.map((label, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`flex-1 h-1 rounded-full transition-colors ${i + 1 <= step ? 'bg-[#A79FFF]' : 'bg-white/15'}`} />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-white/35 mt-1">Step {step} of 4 — {steps[step - 1]}</p>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0 mb-0.5 overflow-hidden">
                  <span className="text-sm font-extrabold text-[#534AB7]">G</span>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 mb-0.5 ring-1 ring-[#534AB7]/20">
                  <Image src="/avatar.png" alt="You" width={32} height={32} className="object-cover w-full h-full" />
                </div>
              )}
              <div className={`max-w-[76%] px-4 py-3 text-sm font-semibold leading-relaxed rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-[#534AB7] text-white rounded-br-md shadow-md shadow-purple-200'
                  : 'bg-white text-[#2D2B4E] border border-[#E8E6F8] rounded-bl-md shadow-sm'
              }`}>
                {msg.content
                  ? <>{msg.content}{isTyping && i === messages.length - 1 && <span className="inline-block w-0.5 h-4 bg-[#534AB7] ml-0.5 animate-pulse align-middle" />}</>
                  : (isLoading && i === messages.length - 1
                    ? <span className="flex gap-1 py-0.5">{[0,1,2].map(j => <span key={j} className="w-1.5 h-1.5 bg-[#C5C3E0] rounded-full animate-bounce" style={{ animationDelay: `${j * 150}ms` }} />)}</span>
                    : null)
                }
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex items-center gap-2 pl-10">
              <div className="bg-white/10 border border-white/15 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-white/50">
                <WaveIndicator />
                Guide speaking
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#09071F]/80 backdrop-blur-md border-t border-white/10 px-5 pt-2.5 pb-3 flex-shrink-0">
        {/* I'm ready — always visible, glows when AI signals readiness */}
        <div className="max-w-2xl mx-auto mb-2.5">
          <button
            onClick={handleReflect}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all ${
              readyForReflection
                ? 'bg-gradient-to-r from-[#534AB7] to-[#7C6FD4] text-white shadow-md shadow-purple-900/50 animate-pulse'
                : 'bg-white/8 text-white/40 border border-white/10 hover:border-white/25 hover:text-white/70'
            }`}
          >
            <Sparkles size={12} />
            {readyForReflection ? "I'm ready to reflect!" : "I'm ready to reflect"}
          </button>
        </div>
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <button
            onClick={toggleRecording}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
              isRecording
                ? 'bg-[#D85A30]/20 text-[#F0997B] border-[#D85A30]/40'
                : 'bg-white/8 text-white/40 border-white/10 hover:border-white/30 hover:text-white/70'
            }`}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? 'Listening…' : 'Type your answer…'}
            className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white placeholder-white/25 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isTyping}
            className="w-10 h-10 bg-[#534AB7] text-white rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-25 hover:bg-[#3C3489] transition-colors shadow-md shadow-purple-900/50"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
