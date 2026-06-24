'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mic, MicOff, Send, X, Sparkles, Pin, BookOpen, Trash2, GitFork, Plus, PenLine, Eraser } from 'lucide-react';
import WaveIndicator from '@/components/WaveIndicator';

interface Message { role: 'user' | 'assistant'; content: string; id: string; }
interface Quest { title: string; desc: string; pillar: string; }
interface PinnedHint { id: string; content: string; }
interface MapNode { id: string; label: string; x: number; y: number; }
interface MapEdge { id: string; from: string; to: string; }
interface TextItem { id: string; xPct: number; yPct: number; value: string; color: string; fontSize: number; editing: boolean; }

const MAP_COLORS = ['#7B6FD4','#2AB58A','#E8714A','#D4952A','#7ABF3A','#5AB4D4','#C47AE8','#E87A9F'];
const MAP_SIZE   = 360;
const MAP_CX     = 180;
const MAP_CY     = 180;
const MAP_NR     = 34;   // branch node radius
const MAP_CR     = 46;   // center node radius
const MAP_RING   = 116;  // initial ring radius

function wrapText(text: string, maxLen = 11): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (next.length <= maxLen) { cur = next; }
    else { if (cur) lines.push(cur); cur = w.slice(0, maxLen); }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

// Raw SVG-space coords (ignores pan/zoom transform)
function svgRaw(e: React.PointerEvent, svg: SVGSVGElement) {
  const r = svg.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * MAP_SIZE, y: ((e.clientY - r.top) / r.height) * MAP_SIZE };
}
// Convert SVG-space coords → content coords (inside the pan/zoom group)
function toContent(p: {x:number;y:number}, zoom: number, pan: {x:number;y:number}) {
  return { x: (p.x - pan.x) / zoom, y: (p.y - pan.y) / zoom };
}

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
  const [pinnedHints, setPinnedHints] = useState<PinnedHint[]>([]);
  const [mobileTab, setMobileTab]     = useState<'chat' | 'notes'>('chat');
  const [notesView, setNotesView]     = useState<'hints' | 'mindmap' | 'board'>('hints');
  const [boardColor, setBoardColor]   = useState('#ffffff');
  const [boardSize, setBoardSize]     = useState(4);
  const [boardTool, setBoardTool]     = useState<'pen' | 'eraser' | 'text'>('pen');
  const [textItems, setTextItems]     = useState<TextItem[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textFontSize, setTextFontSize]     = useState(22);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef     = useRef(false);
  const lastPosRef       = useRef<{ x: number; y: number } | null>(null);
  const textDragRef      = useRef<{ id: string; startX: number; startY: number; startXPct: number; startYPct: number } | null>(null);
  const [mapNodes, setMapNodes]       = useState<MapNode[]>([]);
  const [mapEdges, setMapEdges]       = useState<MapEdge[]>([]);
  const [mapInput, setMapInput]       = useState('');
  const [activeDrag, setActiveDrag]   = useState<{ mode: 'move' | 'connect'; id: string } | null>(null);
  const [connectCursor, setConnectCursor] = useState({ x: 0, y: 0 });
  const [zoom, setZoom]               = useState(1);
  const [pan, setPan]                 = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning]     = useState(false);
  const svgMapRef  = useRef<SVGSVGElement>(null);
  const panStart   = useRef({ mx: 0, my: 0, px: 0, py: 0 });
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
    const savedPins = sessionStorage.getItem('quest_pinned_hints');
    if (savedPins) setPinnedHints(JSON.parse(savedPins));
    const savedMap = sessionStorage.getItem('quest_mindmap');
    if (savedMap) {
      const raw = JSON.parse(savedMap) as MapNode[];
      const positioned = raw.map((n, i) => {
        const x = Number.isFinite(n.x) ? n.x : MAP_CX + MAP_RING * Math.cos((2 * Math.PI * i) / Math.max(raw.length, 1) - Math.PI / 2);
        const y = Number.isFinite(n.y) ? n.y : MAP_CY + MAP_RING * Math.sin((2 * Math.PI * i) / Math.max(raw.length, 1) - Math.PI / 2);
        return { ...n, x, y };
      });
      // Re-save with positions so stale data is gone
      sessionStorage.setItem('quest_mindmap', JSON.stringify(positioned));
      setMapNodes(positioned);
    }
    const savedEdges = sessionStorage.getItem('quest_mindmap_edges');
    if (savedEdges) setMapEdges(JSON.parse(savedEdges));
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
      const newId = `ai_${Date.now()}`;
      // Typewriter animation
      setMessages((p) => [...p, { role: 'assistant', content: '', id: newId }]);
      setIsTyping(true);
      let i = 0;
      if (typingTimer.current) clearInterval(typingTimer.current);
      typingTimer.current = setInterval(() => {
        i++;
        setMessages((p) => {
          const updated = [...p];
          updated[updated.length - 1] = { role: 'assistant', content: display.slice(0, i), id: newId };
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
      const newMsgs: Message[] = [...msgs, { role: 'assistant', content: cleanDisplay, id: newId }];
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
    const userMsg: Message = { role: 'user', content: input.trim(), id: `user_${Date.now()}` };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    sessionStorage.setItem('quest_messages', JSON.stringify(newMsgs));
    await sendToAI(newMsgs);
  }

  function pinHint(msg: Message) {
    if (pinnedHints.find((h) => h.id === msg.id)) return;
    const updated = [...pinnedHints, { id: msg.id, content: msg.content }];
    setPinnedHints(updated);
    sessionStorage.setItem('quest_pinned_hints', JSON.stringify(updated));
  }

  function unpinHint(id: string) {
    const updated = pinnedHints.filter((h) => h.id !== id);
    setPinnedHints(updated);
    sessionStorage.setItem('quest_pinned_hints', JSON.stringify(updated));
  }

  function addMapNode() {
    if (!mapInput.trim() || mapNodes.length >= 8) return;
    const idx   = mapNodes.length;
    const angle = (2 * Math.PI * idx) / Math.max(idx + 1, 1) - Math.PI / 2;
    const x     = MAP_CX + MAP_RING * Math.cos(angle);
    const y     = MAP_CY + MAP_RING * Math.sin(angle);
    const updated = [...mapNodes, { id: `map_${Date.now()}`, label: mapInput.trim(), x, y }];
    setMapNodes(updated);
    sessionStorage.setItem('quest_mindmap', JSON.stringify(updated));
    setMapInput('');
  }

  function removeMapNode(id: string) {
    const updatedNodes = mapNodes.filter((n) => n.id !== id);
    const updatedEdges = mapEdges.filter((e) => e.from !== id && e.to !== id);
    setMapNodes(updatedNodes);
    setMapEdges(updatedEdges);
    sessionStorage.setItem('quest_mindmap', JSON.stringify(updatedNodes));
    sessionStorage.setItem('quest_mindmap_edges', JSON.stringify(updatedEdges));
  }

  function removeMapEdge(id: string) {
    const updated = mapEdges.filter((e) => e.id !== id);
    setMapEdges(updated);
    sessionStorage.setItem('quest_mindmap_edges', JSON.stringify(updated));
  }

  // Load board drawing + text items when switching to the board tab
  useEffect(() => {
    if (notesView !== 'board') return;
    const saved = sessionStorage.getItem('quest_board');
    if (saved && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const img = new window.Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = saved;
      }
    }
    const savedText = sessionStorage.getItem('quest_board_text');
    if (savedText) {
      try { setTextItems(JSON.parse(savedText)); } catch {}
    }
  }, [notesView]);

  function getBoardPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  }

  function saveTextItems(items: TextItem[]) {
    // Strip editing flag before persisting
    sessionStorage.setItem('quest_board_text', JSON.stringify(items.map(t => ({ ...t, editing: false }))));
  }

  function handleTextClick(e: React.MouseEvent<HTMLDivElement>) {
    if (boardTool !== 'text' || textDragRef.current) return;
    // Only create if click was directly on the container/canvas (not on an existing text item)
    if ((e.target as HTMLElement).dataset.textitem) return;
    const r = boardContainerRef.current!.getBoundingClientRect();
    const xPct = ((e.clientX - r.left) / r.width) * 100;
    const yPct = ((e.clientY - r.top) / r.height) * 100;
    const newItem: TextItem = { id: `txt_${Date.now()}`, xPct, yPct, value: '', color: boardColor, fontSize: textFontSize, editing: true };
    const updated = [...textItems.map(t => ({ ...t, editing: false })), newItem];
    setTextItems(updated);
    setSelectedTextId(newItem.id);
  }

  function commitTextItem(id: string) {
    setTextItems(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, editing: false } : t).filter(t => t.value.trim() !== '' || t.editing);
      saveTextItems(updated);
      return updated;
    });
  }

  function deleteTextItem(id: string) {
    setTextItems(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTextItems(updated);
      return updated;
    });
    if (selectedTextId === id) setSelectedTextId(null);
  }

  function onTextPointerDown(e: React.PointerEvent<HTMLDivElement>, id: string) {
    const item = textItems.find(t => t.id === id);
    if (!item || item.editing) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedTextId(id);
    textDragRef.current = { id, startX: e.clientX, startY: e.clientY, startXPct: item.xPct, startYPct: item.yPct };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onTextPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = textDragRef.current;
    if (!drag || !boardContainerRef.current) return;
    e.preventDefault();
    const r = boardContainerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / r.width) * 100;
    const dy = ((e.clientY - drag.startY) / r.height) * 100;
    setTextItems(prev => prev.map(t => t.id === drag.id ? { ...t, xPct: drag.startXPct + dx, yPct: drag.startYPct + dy } : t));
  }

  function onTextPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const drag = textDragRef.current;
    if (!drag) return;
    const moved = Math.abs(e.clientX - drag.startX) > 4 || Math.abs(e.clientY - drag.startY) > 4;
    textDragRef.current = null;
    setTextItems(prev => {
      const updated = moved
        ? prev
        : prev.map(t => t.id === drag.id ? { ...t, editing: true } : { ...t, editing: false });
      saveTextItems(updated);
      return updated;
    });
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (boardTool === 'text') return;
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getBoardPos(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (boardTool === 'eraser' ? boardSize * 5 : boardSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = boardTool === 'eraser' ? '#0C0A1E' : boardColor;
    ctx.fill();
  }

  function drawStroke(e: React.PointerEvent<HTMLCanvasElement>) {
    if (boardTool === 'text' || !isDrawingRef.current || !canvasRef.current || !lastPosRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getBoardPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = boardTool === 'eraser' ? '#0C0A1E' : boardColor;
    ctx.lineWidth   = boardTool === 'eraser' ? boardSize * 10 : boardSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPosRef.current = pos;
  }

  function endDraw() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    const data = canvasRef.current?.toDataURL('image/png');
    if (data) sessionStorage.setItem('quest_board', data);
  }

  function clearBoard() {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    sessionStorage.removeItem('quest_board');
    setTextItems([]);
    setSelectedTextId(null);
    sessionStorage.removeItem('quest_board_text');
  }

  function onNodePointerDown(e: React.PointerEvent, nodeId: string, mode: 'move' | 'connect') {
    e.preventDefault();
    e.stopPropagation();
    if (svgMapRef.current) {
      const pos = toContent(svgRaw(e, svgMapRef.current), zoom, pan);
      setConnectCursor(pos);
    }
    setActiveDrag({ mode, id: nodeId });
  }

  function onBgPointerDown(e: React.PointerEvent) {
    if (activeDrag) return;
    e.preventDefault();
    panStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    setIsPanning(true);
  }

  function onSvgPointerMove(e: React.PointerEvent) {
    if (!svgMapRef.current) return;
    if (isPanning && !activeDrag) {
      const dx = e.clientX - panStart.current.mx;
      const dy = e.clientY - panStart.current.my;
      setPan({ x: panStart.current.px + dx, y: panStart.current.py + dy });
      return;
    }
    if (!activeDrag) return;
    const pos = toContent(svgRaw(e, svgMapRef.current), zoom, pan);
    if (activeDrag.mode === 'move') {
      setMapNodes((prev) => {
        const updated = prev.map((n) => n.id === activeDrag.id ? { ...n, x: pos.x, y: pos.y } : n);
        sessionStorage.setItem('quest_mindmap', JSON.stringify(updated));
        return updated;
      });
    } else {
      setConnectCursor(pos);
    }
  }

  function onSvgPointerUp(e: React.PointerEvent) {
    if (isPanning) { setIsPanning(false); return; }
    if (activeDrag?.mode === 'connect' && svgMapRef.current) {
      const pos = toContent(svgRaw(e, svgMapRef.current), zoom, pan);
      const target = mapNodes.find((n) => {
        const dx = n.x - pos.x, dy = n.y - pos.y;
        return Math.sqrt(dx * dx + dy * dy) < MAP_NR && n.id !== activeDrag.id;
      });
      if (target) {
        const alreadyExists = mapEdges.some(
          (ed) => (ed.from === activeDrag.id && ed.to === target.id) || (ed.from === target.id && ed.to === activeDrag.id)
        );
        if (!alreadyExists) {
          const updated = [...mapEdges, { id: `edge_${Date.now()}`, from: activeDrag.id, to: target.id }];
          setMapEdges(updated);
          sessionStorage.setItem('quest_mindmap_edges', JSON.stringify(updated));
        }
      }
    }
    setActiveDrag(null);
  }

  function onSvgWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (!svgMapRef.current) return;
    const raw = { x: ((e.clientX - svgMapRef.current.getBoundingClientRect().left) / svgMapRef.current.getBoundingClientRect().width) * MAP_SIZE,
                  y: ((e.clientY - svgMapRef.current.getBoundingClientRect().top) / svgMapRef.current.getBoundingClientRect().height) * MAP_SIZE };
    const newZoom = Math.min(4, Math.max(0.2, zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
    // Keep the point under the cursor fixed in content space
    setPan(p => ({ x: raw.x - (raw.x - p.x) * (newZoom / zoom), y: raw.y - (raw.y - p.y) * (newZoom / zoom) }));
    setZoom(newZoom);
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
        <div className="max-w-none">
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

      {/* Mobile tab bar */}
      <div className="flex md:hidden border-b border-white/10 bg-[#09071F]/80 flex-shrink-0">
        {(['chat', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors ${
              mobileTab === tab ? 'text-[#A79FFF] border-b-2 border-[#A79FFF]' : 'text-white/40'
            }`}
          >
            {tab === 'chat' ? 'Chat' : pinnedHints.length > 0 ? 'Quest Notes (' + pinnedHints.length + ')' : 'Quest Notes'}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Chat column */}
        <div className={`flex-col md:w-[58%] border-r border-white/10 w-full ${mobileTab === 'notes' ? 'hidden md:flex' : 'flex'}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="max-w-2xl mx-auto flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group`}>
                  {msg.role === 'assistant' && (
                    <div className="w-11 h-11 rounded-xl flex-shrink-0 mb-0.5 overflow-hidden ring-1 ring-[#534AB7]/30">
                      <Image src="/system-avatar.png" alt="Guide" width={44} height={44} className="object-cover w-full h-full" />
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 mb-0.5 ring-1 ring-[#534AB7]/20">
                      <Image src="/avatar.png" alt="You" width={44} height={44} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="relative">
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
                    {/* Pin button — only on guide messages with content */}
                    {msg.role === 'assistant' && msg.content && !pinnedHints.find((h) => h.id === msg.id) && (
                      <button
                        onClick={() => pinHint(msg)}
                        title="Pin to Quest Notes"
                        className="absolute -right-7 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-[#A79FFF]"
                      >
                        <Pin size={14} />
                      </button>
                    )}
                    {msg.role === 'assistant' && pinnedHints.find((h) => h.id === msg.id) && (
                      <span className="absolute -right-7 top-2 text-[#A79FFF]" title="Pinned">
                        <Pin size={14} fill="currentColor" />
                      </span>
                    )}
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
                className="flex-1 bg-white/90 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2D2B4E] placeholder-[#9D9BC4] focus:outline-none focus:border-[#534AB7] focus:bg-white transition-colors"
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

        {/* Quest Notes panel — always visible */}
        <div className={`flex-col bg-[#09071F]/60 md:w-[42%] w-full ${mobileTab === 'notes' ? 'flex' : 'hidden md:flex'}`}>

          {/* Panel header with tabs */}
          <div className="px-4 pt-3 pb-0 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setNotesView('hints')}
                className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition-all ${notesView === 'hints' ? 'border-[#A79FFF] text-[#A79FFF]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                <Pin size={11} />
                Hints {pinnedHints.length > 0 && <span className="bg-[#534AB7] text-white text-[9px] px-1.5 py-0.5 rounded-full">{pinnedHints.length}</span>}
              </button>
              <button onClick={() => setNotesView('mindmap')}
                className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition-all ${notesView === 'mindmap' ? 'border-[#A79FFF] text-[#A79FFF]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                <GitFork size={11} />
                Mind Map {mapNodes.length > 0 && <span className="bg-[#534AB7] text-white text-[9px] px-1.5 py-0.5 rounded-full">{mapNodes.length}</span>}
              </button>
              <button onClick={() => setNotesView('board')}
                className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition-all ${notesView === 'board' ? 'border-[#A79FFF] text-[#A79FFF]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                <PenLine size={11} />
                Board
              </button>
            </div>
          </div>

          {/* Hints view */}
          {notesView === 'hints' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {pinnedHints.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                    <Pin size={16} className="text-white/25" />
                  </div>
                  <p className="text-xs text-white/30 leading-relaxed">Hover a guide message and tap the pin icon to save a hint here.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pinnedHints.map((hint, idx) => (
                    <div key={hint.id} className="bg-white/5 border border-white/10 rounded-xl p-3 group/hint relative">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-[#534AB7]/30 text-[#A79FFF] rounded-full text-[9px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed flex-1">{hint.content}</p>
                      </div>
                      <button onClick={() => unpinHint(hint.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover/hint:opacity-100 transition-opacity text-white/20 hover:text-[#F0997B]">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mind Map view */}
          {notesView === 'mindmap' && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* SVG canvas */}
              {/* Zoom controls */}
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                <button onClick={() => setZoom(z => Math.min(4, z * 1.25))}
                  className="w-7 h-7 bg-white/10 border border-white/15 rounded-lg text-white/60 hover:bg-white/20 hover:text-white transition-all text-sm font-bold flex items-center justify-center">+</button>
                <button onClick={() => setZoom(z => Math.max(0.2, z * 0.8))}
                  className="w-7 h-7 bg-white/10 border border-white/15 rounded-lg text-white/60 hover:bg-white/20 hover:text-white transition-all text-sm font-bold flex items-center justify-center">−</button>
                <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  className="w-7 h-7 bg-white/10 border border-white/15 rounded-lg text-white/40 hover:bg-white/20 hover:text-white/70 transition-all text-[9px] font-bold flex items-center justify-center">fit</button>
              </div>

              <svg
                ref={svgMapRef}
                viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
                className="flex-1 w-full"
                style={{ cursor: isPanning ? 'grabbing' : activeDrag?.mode === 'connect' ? 'crosshair' : 'grab', touchAction: 'none', overflow: 'hidden' }}
                onPointerMove={onSvgPointerMove}
                onPointerUp={onSvgPointerUp}
                onPointerLeave={onSvgPointerUp}
                onWheel={onSvgWheel}
              >
                <defs>
                  {/* Dot grid pattern */}
                  <pattern id="mmgrid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <circle cx="11" cy="11" r="1" fill="rgba(255,255,255,0.07)" />
                  </pattern>
                  {/* Center glow */}
                  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  {/* Branch node glow */}
                  <filter id="nodeglow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  {MAP_COLORS.map((col, i) => (
                    <radialGradient key={i} id={'ng' + i} cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor={col} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={col} stopOpacity="0.12" />
                    </radialGradient>
                  ))}
                  <radialGradient id="cg" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#7B6FD4" />
                    <stop offset="100%" stopColor="#3C3489" />
                  </radialGradient>
                </defs>

                <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                {/* Canvas background — drag to pan */}
                <rect width={MAP_SIZE} height={MAP_SIZE} fill="url(#mmgrid)" rx="0"
                  style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
                  onPointerDown={onBgPointerDown} />

                {/* Auto spokes: center → branch nodes */}
                {mapNodes.map((node, i) => {
                  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return null;
                  const col = MAP_COLORS[i % MAP_COLORS.length];
                  const dx = node.x - MAP_CX, dy = node.y - MAP_CY;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const x1 = MAP_CX + (dx / len) * MAP_CR;
                  const y1 = MAP_CY + (dy / len) * MAP_CR;
                  const x2 = node.x - (dx / len) * MAP_NR;
                  const y2 = node.y - (dy / len) * MAP_NR;
                  return (
                    <line key={node.id + '-sp'} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={col} strokeWidth="1.5" strokeOpacity="0.5"
                      style={{ pointerEvents: 'none' }} />
                  );
                })}

                {/* Custom edges between branch nodes (curved) */}
                {mapEdges.map((edge) => {
                  const src = mapNodes.find((n) => n.id === edge.from);
                  const tgt = mapNodes.find((n) => n.id === edge.to);
                  if (!src || !tgt) return null;
                  const mx = (src.x + tgt.x) / 2 + (tgt.y - src.y) * 0.25;
                  const my = (src.y + tgt.y) / 2 - (tgt.x - src.x) * 0.25;
                  const pmx = (src.x + tgt.x) / 2, pmy = (src.y + tgt.y) / 2;
                  return (
                    <g key={edge.id}>
                      <path d={`M ${src.x} ${src.y} Q ${mx} ${my} ${tgt.x} ${tgt.y}`}
                        fill="none" stroke="#A79FFF" strokeWidth="10" strokeOpacity="0"
                        style={{ cursor: 'pointer' }} onClick={() => removeMapEdge(edge.id)} />
                      <path d={`M ${src.x} ${src.y} Q ${mx} ${my} ${tgt.x} ${tgt.y}`}
                        fill="none" stroke="#A79FFF" strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="5 3" />
                      <circle cx={pmx} cy={pmy} r={7} fill="#16133a" stroke="#A79FFF" strokeWidth="1.5"
                        style={{ cursor: 'pointer' }} onClick={() => removeMapEdge(edge.id)} />
                      <text x={pmx} y={pmy} textAnchor="middle" dominantBaseline="middle"
                        fill="#A79FFF" fontSize="9" style={{ pointerEvents: 'none', userSelect: 'none' }}>✕</text>
                    </g>
                  );
                })}

                {/* Center node */}
                <circle cx={MAP_CX} cy={MAP_CY} r={MAP_CR + 4} fill="#534AB7" fillOpacity="0.15" />
                <circle cx={MAP_CX} cy={MAP_CY} r={MAP_CR} fill="url(#cg)" filter="url(#glow)" />
                <circle cx={MAP_CX} cy={MAP_CY} r={MAP_CR} fill="none" stroke="#7B6FD4" strokeWidth="1.5" strokeOpacity="0.7" />
                {quest && (() => {
                  const lines = wrapText(quest.title, 11);
                  return lines.map((line, li) => (
                    <text key={li} x={MAP_CX} y={MAP_CY + (li - (lines.length - 1) / 2) * 11}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="white" fontSize="9" fontWeight="800"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}>{line}</text>
                  ));
                })()}

                {/* Branch nodes */}
                {mapNodes.map((node, i) => {
                  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return null;
                  const col = MAP_COLORS[i % MAP_COLORS.length];
                  const lines = wrapText(node.label, 9);
                  const isMoving = activeDrag?.mode === 'move' && activeDrag.id === node.id;
                  return (
                    <g key={node.id}>
                      {/* Halo ring */}
                      <circle cx={node.x} cy={node.y} r={MAP_NR + 5}
                        fill={col} fillOpacity="0.08" style={{ pointerEvents: 'none' }} />
                      {/* Node fill */}
                      <circle cx={node.x} cy={node.y} r={MAP_NR}
                        fill={'url(#ng' + (i % MAP_COLORS.length) + ')'}
                        stroke={col} strokeWidth={isMoving ? 2.5 : 1.5}
                        strokeOpacity={isMoving ? 1 : 0.8}
                        filter={isMoving ? 'url(#nodeglow)' : undefined}
                        style={{ cursor: isMoving ? 'grabbing' : 'grab' }}
                        onPointerDown={(e) => onNodePointerDown(e, node.id, 'move')} />
                      {/* Label */}
                      {lines.map((ln, li) => (
                        <text key={li} x={node.x} y={node.y + (li - (lines.length - 1) / 2) * 10}
                          textAnchor="middle" dominantBaseline="middle"
                          fill="white" fontSize="8" fontWeight="700"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}>{ln}</text>
                      ))}
                      {/* Connect handle */}
                      <circle cx={node.x + MAP_NR - 3} cy={node.y - MAP_NR + 3} r={10}
                        fill="#16133a" stroke={col} strokeWidth="1.5"
                        style={{ cursor: 'crosshair' }}
                        onPointerDown={(e) => onNodePointerDown(e, node.id, 'connect')} />
                      <text x={node.x + MAP_NR - 3} y={node.y - MAP_NR + 3}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={col} fontSize="13" fontWeight="bold"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}>+</text>
                      {/* Delete handle */}
                      <circle cx={node.x - MAP_NR + 3} cy={node.y - MAP_NR + 3} r={10}
                        fill="#16133a" stroke="rgba(240,153,123,0.6)" strokeWidth="1"
                        style={{ cursor: 'pointer' }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeMapNode(node.id)} />
                      <text x={node.x - MAP_NR + 3} y={node.y - MAP_NR + 3}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#F0997B" fontSize="9" fontWeight="bold"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}>✕</text>
                    </g>
                  );
                })}

                {/* Live connect preview line */}
                {activeDrag?.mode === 'connect' && (() => {
                  const src = mapNodes.find((n) => n.id === activeDrag.id);
                  if (!src) return null;
                  const mx = (src.x + connectCursor.x) / 2 + (connectCursor.y - src.y) * 0.25;
                  const my = (src.y + connectCursor.y) / 2 - (connectCursor.x - src.x) * 0.25;
                  return (
                    <path d={`M ${src.x} ${src.y} Q ${mx} ${my} ${connectCursor.x} ${connectCursor.y}`}
                      fill="none" stroke="#A79FFF" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8"
                      style={{ pointerEvents: 'none' }} />
                  );
                })()}

                {/* Empty state */}
                {mapNodes.length === 0 && (
                  <text x={MAP_CX} y={MAP_CY + MAP_CR + 22} textAnchor="middle"
                    fill="rgba(255,255,255,0.2)" fontSize="10" style={{ userSelect: 'none' }}>
                    Add ideas below ↓
                  </text>
                )}
                </g>{/* end pan/zoom group */}
              </svg>

              {/* Instructions + input */}
              <div className="px-4 pb-3 flex-shrink-0 border-t border-white/10 pt-2.5">
                <p className="text-[10px] text-white/25 text-center mb-2">
                  Drag node to move · Drag <span className="text-[#A79FFF]">+</span> to connect · Click <span className="text-[#F0997B]">✕</span> to remove
                </p>
                <div className="flex gap-2">
                  <input value={mapInput} onChange={(e) => setMapInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMapNode()}
                    placeholder={mapNodes.length >= 8 ? 'Max 8 nodes reached' : 'Add an idea…'}
                    disabled={mapNodes.length >= 8}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-white/25 focus:outline-none focus:border-white/30 disabled:opacity-30" />
                  <button onClick={addMapNode} disabled={!mapInput.trim() || mapNodes.length >= 8}
                    className="w-8 h-8 bg-[#534AB7] text-white rounded-xl flex items-center justify-center disabled:opacity-25 hover:bg-[#3C3489] transition-colors flex-shrink-0">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Whiteboard view */}
          {notesView === 'board' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 flex-shrink-0 flex-wrap">
                {/* Tool buttons */}
                <button onClick={() => { setBoardTool('pen'); setSelectedTextId(null); }}
                  title="Pen"
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${boardTool === 'pen' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}>
                  <PenLine size={11} />
                </button>
                <button onClick={() => { setBoardTool('text'); setSelectedTextId(null); }}
                  title="Add text"
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${boardTool === 'text' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}>
                  <span style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: 13, lineHeight: 1 }}>T</span>
                </button>
                <button onClick={() => { setBoardTool('eraser'); setSelectedTextId(null); }}
                  title="Eraser"
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex-shrink-0 ${boardTool === 'eraser' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}>
                  <Eraser size={11} />
                </button>
                <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                {/* Colour swatches — also updates selected text item */}
                {['#ffffff','#A79FFF','#5AB4D4','#7ABF3A','#EF9F27','#F0997B','#E8714A','#E87A9F'].map((c) => (
                  <button key={c} onClick={() => {
                    setBoardColor(c);
                    if (selectedTextId) {
                      setTextItems(prev => { const u = prev.map(t => t.id === selectedTextId ? { ...t, color: c } : t); saveTextItems(u); return u; });
                    }
                  }}
                    className={`w-4 h-4 rounded-full border-2 transition-all flex-shrink-0 ${boardColor === c ? 'border-white scale-125' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: c }} />
                ))}
                {/* Brush sizes for pen tool */}
                {boardTool !== 'text' && (<>
                  <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                  {[2, 5, 12].map((s) => (
                    <button key={s} onClick={() => setBoardSize(s)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${boardSize === s ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                      <div className="rounded-full" style={{ width: Math.min(s + 2, 12), height: Math.min(s + 2, 12), backgroundColor: boardColor }} />
                    </button>
                  ))}
                </>)}
                {/* Font size for text tool */}
                {boardTool === 'text' && (<>
                  <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                  {([['S', 14], ['M', 22], ['L', 36], ['XL', 54]] as [string, number][]).map(([label, size]) => (
                    <button key={size} onClick={() => {
                      setTextFontSize(size);
                      if (selectedTextId) {
                        setTextItems(prev => { const u = prev.map(t => t.id === selectedTextId ? { ...t, fontSize: size } : t); saveTextItems(u); return u; });
                      }
                    }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all flex-shrink-0 ${textFontSize === size && !selectedTextId || (selectedTextId && textItems.find(t=>t.id===selectedTextId)?.fontSize === size) ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}>
                      {label}
                    </button>
                  ))}
                </>)}
                <div className="flex-1" />
                <button onClick={clearBoard}
                  className="text-[10px] font-bold text-white/25 hover:text-[#F0997B] transition-colors flex-shrink-0">
                  Clear
                </button>
              </div>
              {/* Canvas + text item layer */}
              <div
                ref={boardContainerRef}
                className="flex-1 overflow-hidden relative"
                style={{ cursor: boardTool === 'text' ? 'text' : 'default' }}
                onClick={handleTextClick as React.MouseEventHandler<HTMLDivElement>}
              >
                <canvas
                  ref={canvasRef}
                  width={900} height={700}
                  className="w-full h-full block"
                  style={{
                    cursor: boardTool === 'eraser' ? 'cell' : boardTool === 'text' ? 'text' : 'crosshair',
                    touchAction: 'none',
                    background: '#0C0A1E',
                  }}
                  onPointerDown={startDraw}
                  onPointerMove={drawStroke}
                  onPointerUp={endDraw}
                  onPointerLeave={endDraw}
                />
                {/* Moveable text items */}
                {textItems.map(item => (
                  <div
                    key={item.id}
                    data-textitem="1"
                    style={{
                      position: 'absolute',
                      left: `${item.xPct}%`,
                      top: `${item.yPct}%`,
                      zIndex: selectedTextId === item.id ? 20 : 10,
                      cursor: item.editing ? 'text' : 'move',
                      outline: selectedTextId === item.id && !item.editing ? '1.5px dashed rgba(167,159,255,0.55)' : 'none',
                      borderRadius: 3,
                      padding: '1px 4px',
                      userSelect: item.editing ? 'text' : 'none',
                    }}
                    onPointerDown={e => onTextPointerDown(e, item.id)}
                    onPointerMove={onTextPointerMove}
                    onPointerUp={onTextPointerUp}
                    onClick={e => { e.stopPropagation(); setSelectedTextId(item.id); }}
                  >
                    {item.editing ? (
                      <input
                        autoFocus
                        data-textitem="1"
                        value={item.value}
                        placeholder="Type here…"
                        onChange={e => setTextItems(prev => prev.map(t => t.id === item.id ? { ...t, value: e.target.value } : t))}
                        onKeyDown={e => { if (e.key === 'Enter') commitTextItem(item.id); if (e.key === 'Escape') { if (!item.value.trim()) deleteTextItem(item.id); else commitTextItem(item.id); } }}
                        onBlur={() => commitTextItem(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          outline: '1.5px dashed rgba(167,159,255,0.6)',
                          borderRadius: 3,
                          color: item.color,
                          fontSize: item.fontSize,
                          fontFamily: 'Inter, ui-sans-serif, sans-serif',
                          fontWeight: 600,
                          minWidth: 90,
                          padding: '1px 4px',
                          caretColor: item.color,
                          display: 'block',
                        }}
                      />
                    ) : (
                      <span style={{ color: item.color, fontSize: item.fontSize, fontFamily: 'Inter, ui-sans-serif, sans-serif', fontWeight: 600, whiteSpace: 'nowrap', display: 'block' }}>
                        {item.value}
                      </span>
                    )}
                    {/* Delete button shown when selected */}
                    {selectedTextId === item.id && !item.editing && (
                      <button
                        data-textitem="1"
                        onClick={e => { e.stopPropagation(); deleteTextItem(item.id); }}
                        style={{
                          position: 'absolute', top: -8, right: -8,
                          width: 16, height: 16,
                          borderRadius: '50%',
                          background: 'rgba(240,100,70,0.85)',
                          border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 9, fontWeight: 'bold', lineHeight: 1,
                        }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {/* Deselect on canvas click */}
                {selectedTextId && boardTool !== 'text' && (
                  <div
                    style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                    onClick={() => setSelectedTextId(null)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Reflect shortcut */}
          <div className="border-t border-white/10 px-4 py-3 flex-shrink-0">
            <button onClick={handleReflect}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                readyForReflection ? 'bg-[#534AB7] text-white' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/25 hover:text-white/70'
              }`}>
              <Sparkles size={12} />
              I'm ready to reflect
            </button>
          </div>
        </div>
        </div>
      </div>
  );
}
