'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff } from 'lucide-react';
import WaveIndicator from '@/components/WaveIndicator';
import { getCoopScenario } from '@/lib/missions';

const BOT_NAMES = ['Casey', 'River', 'Drew', 'Kai', 'Maya', 'Atlas', 'Morgan', 'Jamie', 'Reese', 'Nova', 'Orion', 'Lyra'];

export default function CoopReflectionPage() {
  const router = useRouter();
  const [missionId, setMissionId] = useState(1);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showNomination, setShowNomination] = useState(false);
  const [nominated, setNominated] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('coop_mission_id');
    setMissionId(stored ? parseInt(stored, 10) : 1);
  }, []);

  const scenario  = getCoopScenario(missionId);
  const QUESTIONS = scenario?.reflectionQuestions ?? [
    { label: 'Reflect',     text: 'What did each person do that helped the crew?',          pillar: 'Interpersonal EQ', peerResponses: [{ name: 'Teammate A', text: 'They shared clues early.' }, { name: 'Teammate B', text: 'They kept us on track.' }] },
    { label: 'Consider',    text: 'When the puzzle changed, how did you change your plan?', pillar: 'Adaptability',     peerResponses: [{ name: 'Teammate A', text: 'We regrouped fast.' }, { name: 'Teammate B', text: 'We focused on what we still knew.' }] },
    { label: 'Look ahead',  text: 'What was something a teammate said that you liked?',     pillar: 'Communication',    peerResponses: [{ name: 'Teammate A', text: '"Stay focused" kept us going.' }, { name: 'Teammate B', text: 'Their idea about combining clues was key.' }] },
  ];

  // Bot names for this mission
  const missionBots = scenario?.botRoles.map((b) => b.name) ?? BOT_NAMES.slice(0, 3);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const minWords  = 15;
  const progress  = Math.min((wordCount / minWords) * 100, 100);
  const unlocked  = wordCount >= minWords;

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-black/30">
        <div className="w-full max-w-md rounded-2xl p-6 text-center" style={{ background: 'rgba(13,11,43,0.85)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="text-3xl mb-3">🏆</div>
          <h2 className="text-xl font-extrabold text-white mb-2">Who helped the crew most?</h2>
          <p className="text-sm text-white/40 mb-6">Your vote is private.</p>
          <div className="flex flex-col gap-2">
            {missionBots.map((name) => (
              <button key={name} onClick={() => handleNominate(name)}
                className={`w-full py-3 rounded-xl font-bold border transition-all ${
                  nominated === name ? 'bg-[#534AB7] text-white border-[#534AB7]' : 'bg-white/5 text-white/80 border-white/10 hover:border-[#534AB7]/60 hover:bg-[#534AB7]/15'
                }`}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: 'rgba(13,11,43,0.85)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
        {/* Step dots + skip */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? 'bg-[#A79FFF]' : 'bg-white/15'}`} />
            ))}
          </div>
          <button onClick={handleSkip} className="text-xs font-bold text-white/30 hover:text-white/70 transition-colors">
            Skip
          </button>
        </div>

        <p className="text-xs font-extrabold text-[#A79FFF] uppercase tracking-widest text-center mb-2">{q.label}</p>
        <h2 className="text-lg font-extrabold text-white text-center mb-4 leading-snug">{q.text}</h2>

        {/* Peer responses */}
        <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs text-white/30 mb-2">What your crew said:</p>
          <div className="flex flex-col gap-1.5">
            {q.peerResponses.map((r, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-extrabold text-[#A79FFF] flex-shrink-0">{r.name}:</span>
                <span className="text-white/70 leading-snug">&ldquo;{r.text}&rdquo;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Voice row */}
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={toggleRecording}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isRecording ? 'bg-[#E8714A]/20 text-[#E8714A]' : 'bg-white/10 text-white/50 hover:text-[#A79FFF]'
            }`}>
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
          {isRecording
            ? <div className="flex items-center gap-2"><WaveIndicator /><span className="text-sm text-white/50">Listening…</span></div>
            : <span className="text-sm text-white/40">Click to speak</span>
          }
        </div>

        <textarea value={answer} onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Or write it here…" rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none resize-none mb-3"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />

        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/30 mb-1">
            <span>{wordCount} words</span><span>15 minimum</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#A79FFF] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {showCelebration && (
          <div className="mb-3 rounded-xl px-4 py-2.5 text-center slide-up-fade" style={{ background: 'rgba(167,159,255,0.15)', border: '1px solid rgba(167,159,255,0.3)' }}>
            <p className="text-sm font-bold text-[#A79FFF]">Great answer — that&apos;s real thinking!</p>
          </div>
        )}

        <button onClick={handleNext} disabled={!unlocked}
          className={`w-full py-3 rounded-xl font-extrabold transition-all ${
            unlocked ? 'bg-[#534AB7] hover:bg-[#6B61D0] text-white' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
          }`}>
          {currentQ < QUESTIONS.length - 1 ? 'Next →' : 'Done →'}
        </button>
      </div>
    </div>
  );
}
