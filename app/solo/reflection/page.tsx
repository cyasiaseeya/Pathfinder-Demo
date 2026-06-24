'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Check } from 'lucide-react';
import WaveIndicator from '@/components/WaveIndicator';

const CLOSING_QUESTIONS = [
  { label: 'Reflect',    text: 'What did you figure out today?' },
  { label: 'Consider',   text: 'When it got tricky, what did you do?' },
  { label: 'Look ahead', text: 'How are you feeling about your goal now compared to when you started?' },
];

function ReflectionContent() {
  const router = useRouter();
  const questions = CLOSING_QUESTIONS;

  const [currentQ, setCurrentQ]         = useState(0);
  const [answer, setAnswer]             = useState('');
  const [answers, setAnswers]           = useState<string[]>([]);
  const [isRecording, setIsRecording]   = useState(false);
  const [celebrated, setCelebrated]     = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const progress  = Math.min((wordCount / 15) * 100, 100);
  const unlocked  = wordCount >= 15;

  function handleAnswerChange(val: string) {
    setAnswer(val);
    if (val.trim().split(/\s+/).filter(Boolean).length >= 15 && !celebrated) setCelebrated(true);
  }

  function handleNext() {
    if (!unlocked) return;
    const newAnswers = [...answers, answer];
    if (currentQ < questions.length - 1) {
      setAnswers(newAnswers); setAnswer(''); setCelebrated(false); setCurrentQ(currentQ + 1);
    } else {
      const existing = JSON.parse(sessionStorage.getItem('reflectionAnswers') || '[]') as string[];
      sessionStorage.setItem('reflectionAnswers', JSON.stringify([...existing, ...newAnswers]));
      router.push('/solo/mission');
    }
  }

  const toggleRecording = useCallback(() => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) { alert('Voice input works best in Chrome.'); return; }
    const r = new API();
    r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (e: SpeechRecognitionEvent) => setAnswer((p) => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  }, [isRecording]);

  function handleSkip() {
    const existing = JSON.parse(sessionStorage.getItem('reflectionAnswers') || '[]') as string[];
    sessionStorage.setItem('reflectionAnswers', JSON.stringify([...existing, ...answers, answer || '—']));
    router.push('/solo/mission');
  }

  const q = questions[currentQ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Colour top bar */}
        <div className="h-1.5 w-full bg-[#E8E6F8]">
          <div className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
            style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-extrabold text-[#9D9BC4] uppercase tracking-widest">{q.label}</p>
            <div className="flex items-center gap-3">
              <button onClick={handleSkip} className="text-xs font-bold text-[#B4B2C9] hover:text-[#534AB7] transition-colors">
                Skip
              </button>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all ${
                    i < currentQ  ? 'w-5 h-2 bg-[#534AB7]' :
                    i === currentQ ? 'w-5 h-2 bg-[#534AB7]' :
                                     'w-2 h-2 bg-[#E8E6F8]'
                  }`} />
                ))}
              </div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-extrabold text-[#2D2B4E] mb-5 leading-snug">{q.text}</h2>

          {/* Voice row */}
          <button
            onClick={toggleRecording}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 mb-3 transition-all text-left ${
              isRecording
                ? 'border-[#F0997B] bg-[#FAECE7]'
                : 'border-[#E8E6F8] bg-[#F4F3FD] hover:border-[#534AB7]'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isRecording ? 'bg-[#D85A30]' : 'bg-white'}`}>
              {isRecording ? <MicOff size={16} className="text-white" /> : <Mic size={16} className="text-[#534AB7]" />}
            </div>
            {isRecording
              ? <div className="flex items-center gap-2"><WaveIndicator /><span className="text-sm font-bold text-[#D85A30]">Listening…</span></div>
              : <span className="text-sm font-semibold text-[#6B6893]">Click to speak your answer</span>
            }
          </button>

          {/* Textarea */}
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Or type it here… (15 words minimum)"
            rows={4}
            className="w-full bg-[#F4F3FD] border-2 border-[#E8E6F8] focus:border-[#534AB7] rounded-2xl px-4 py-3 text-sm font-semibold text-[#2D2B4E] placeholder-[#C5C3E0] focus:outline-none resize-none mb-3"
          />

          {/* Word count bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className={unlocked ? 'text-[#639922]' : 'text-[#9D9BC4]'}>{wordCount} words</span>
              <span className="text-[#C5C3E0]">15 minimum</span>
            </div>
            <div className="h-1.5 bg-[#E8E6F8] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: unlocked ? '#639922' : '#534AB7' }} />
            </div>
          </div>

          {/* Celebration */}
          {celebrated && unlocked && (
            <div className="mb-4 bg-[#EAF3DE] border border-[#97C459]/40 rounded-2xl px-4 py-3 flex items-center gap-3 slide-up">
              <div className="w-7 h-7 bg-[#639922] rounded-lg flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-white" />
              </div>
              <p className="text-sm font-extrabold text-[#27500A]">Great answer — that&apos;s real thinking!</p>
            </div>
          )}

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!unlocked}
            className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:bg-[#E8E6F8] disabled:text-[#C5C3E0] disabled:cursor-not-allowed text-white rounded-2xl py-3.5 font-extrabold text-sm transition-all shadow-lg shadow-purple-200 disabled:shadow-none"
          >
            {currentQ < questions.length - 1 ? 'Next →' : 'Done →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReflectionPage() {
  return <Suspense><ReflectionContent /></Suspense>;
}
