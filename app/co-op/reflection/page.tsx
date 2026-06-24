'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff } from 'lucide-react';
import WaveIndicator from '@/components/WaveIndicator';

const QUESTIONS = [
  {
    label: 'Reflect',
    text: 'What did each person do that helped the crew?',
    pillar: 'Interpersonal EQ',
    peerResponses: [
      { name: 'Jordan', text: "Sam figured out the janitor connection — key move." },
      { name: 'Sam', text: "Alex kept us calm during the twist." },
    ],
  },
  {
    label: 'Consider',
    text: 'When the puzzle changed, how did you change your plan?',
    pillar: 'Adaptability',
    peerResponses: [
      { name: 'Jordan', text: "We dropped the tap theory and focused on the salt instead." },
      { name: 'Alex', text: "Sam's interview idea saved us when we lost Jordan." },
    ],
  },
  {
    label: 'Look ahead',
    text: 'What was something a teammate said that you liked?',
    pillar: 'Communication',
    peerResponses: [
      { name: 'Jordan', text: "When you said 'the salt and the tap are connected' — that was it." },
      { name: 'Sam', text: "Alex saying 'let's not panic' really helped." },
    ],
  },
];

const BOT_NAMES = ['Jordan', 'Sam', 'Alex'];

export default function CoopReflectionPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNomination, setShowNomination] = useState(false);
  const [nominated, setNominated] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 15;
  const progress = Math.min((wordCount / minWords) * 100, 100);
  const unlocked = wordCount >= minWords;

  function handleAnswerChange(val: string) {
    setAnswer(val);
    if (val.trim().split(/\s+/).filter(Boolean).length >= minWords && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }

  function handleNext() {
    if (!unlocked) return;
    const newAnswers = [...answers, answer];
    if (currentQ < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setAnswer('');
      setShowCelebration(false);
      setCurrentQ(currentQ + 1);
    } else {
      sessionStorage.setItem('coop_reflections', JSON.stringify(newAnswers));
      setShowNomination(true);
    }
  }

  function handleSkip() {
    const allAnswers = [...answers, answer || '—'];
    sessionStorage.setItem('coop_reflections', JSON.stringify(allAnswers));
    router.push('/co-op/results');
  }

  function handleNominate(name: string) {
    setNominated(name);
    sessionStorage.setItem('peer_nomination', name);
    setTimeout(() => router.push('/co-op/results'), 1000);
  }

  const toggleRecording = useCallback(() => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { alert('Voice input works best in Chrome.'); return; }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setAnswer((prev) => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording]);

  const q = QUESTIONS[currentQ];

  if (showNomination) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 text-center">
          <div className="text-3xl mb-3">🏆</div>
          <h2 className="text-xl font-medium text-[#444441] mb-2">Who helped the crew most?</h2>
          <p className="text-sm text-[#888780] mb-6">Your vote is private.</p>
          <div className="flex flex-col gap-2">
            {BOT_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => handleNominate(name)}
                className={`w-full py-3 rounded-lg font-medium border transition-all ${
                  nominated === name
                    ? 'bg-[#534AB7] text-white border-[#534AB7]'
                    : 'bg-white text-[#444441] border-[#B4B2A9]/30 hover:border-[#534AB7]/40'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        {/* Step dots + skip */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? 'bg-[#534AB7]' : 'bg-[#B4B2A9]/40'}`} />
            ))}
          </div>
          <button onClick={handleSkip} className="text-xs font-bold text-[#B4B2A9] hover:text-[#534AB7] transition-colors">
            Skip
          </button>
        </div>

        <p className="text-xs font-medium text-[#888780] uppercase tracking-widest text-center mb-2">{q.label}</p>
        <h2 className="text-lg font-medium text-[#444441] text-center mb-4 leading-snug">{q.text}</h2>

        {/* Peer responses */}
        <div className="bg-[#F1EFE8] rounded-lg p-3 mb-4">
          <p className="text-xs text-[#888780] mb-2">What your crew said:</p>
          <div className="flex flex-col gap-1.5">
            {q.peerResponses.map((r, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-medium text-[#534AB7]">{r.name}:</span>
                <span className="text-[#444441] leading-snug">&ldquo;{r.text}&rdquo;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice row */}
        <div className="flex items-center gap-3 mb-3 p-3 bg-[#F1EFE8] rounded-lg">
          <button
            onClick={toggleRecording}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isRecording ? 'bg-[#FAECE7] text-[#D85A30]' : 'bg-white text-[#888780] hover:text-[#534AB7]'
            }`}
          >
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
          {isRecording ? (
            <div className="flex items-center gap-2"><WaveIndicator /><span className="text-sm text-[#888780]">Listening…</span></div>
          ) : (
            <span className="text-sm text-[#888780]">Click to speak</span>
          )}
        </div>

        <textarea
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Or write it here…"
          rows={3}
          className="w-full border border-[#B4B2A9]/30 rounded-lg px-4 py-3 text-sm text-[#444441] placeholder-[#B4B2A9] focus:outline-none focus:border-[#534AB7] resize-none mb-3"
        />

        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#888780] mb-1">
            <span>{wordCount} words</span><span>15 minimum</span>
          </div>
          <div className="h-1.5 bg-[#F1EFE8] rounded-full overflow-hidden">
            <div className="h-full bg-[#534AB7] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {showCelebration && (
          <div className="mb-3 bg-[#EEEDFE] border border-[#AFA9EC]/30 rounded-lg px-4 py-2.5 text-center slide-up-fade">
            <p className="text-sm font-medium text-[#3C3489]">Great answer — that&apos;s real thinking!</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!unlocked}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            unlocked ? 'bg-[#534AB7] text-white' : 'bg-[#F1EFE8] text-[#B4B2A9] cursor-not-allowed'
          }`}
        >
          {currentQ < QUESTIONS.length - 1 ? 'Next →' : 'Done →'}
        </button>
      </div>
    </div>
  );
}
