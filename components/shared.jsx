// shared.jsx — primitives reused across all student-portal screens.
// Sumi-e tutor mark, Hangul/Latin set glyphs, AI-state chip, the "draft
// progress meter" that drives the unlock moment, and a tiny icon set.

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Sumi-e Tutor Mark — abstract inkblot. Used everywhere the
// Cognitive Engagement Tutor speaks. NEVER a face, NEVER a mascot.
// ─────────────────────────────────────────────────────────────
function SumiMark({ size = 36, thinking = false, tone = "ink" }) {
  // organic ink shape — not perfectly symmetric. Two layered blobs.
  const fill = tone === "ink" ? "var(--ink)" : tone === "violet" ? "var(--violet)" : "var(--coral)";
  return (
    <span
      className={"sumi-mark" + (thinking ? " thinking" : "")}
      style={{
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        position: "relative"
      }}>
      
      <svg
        viewBox="0 0 60 60"
        width={size}
        height={size}
        style={{ display: "block", overflow: "visible" }}>
        
        <defs>
          <radialGradient id={`sm-grad-${size}`} cx="38%" cy="36%">
            <stop offset="0%" stopColor={fill} stopOpacity="0.95" />
            <stop offset="60%" stopColor={fill} stopOpacity="0.85" />
            <stop offset="100%" stopColor={fill} stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {/* base blob — slightly off-center, with a wet edge */}
        <path
          d="M 18 14
             C 11 18, 8 28, 11 36
             C 14 44, 22 49, 31 48
             C 41 47, 49 41, 50 32
             C 51 23, 46 16, 38 13
             C 31 11, 24 11, 18 14 Z"





          fill={`url(#sm-grad-${size})`}
          className="sumi-blob" />
        
        {/* tiny ink spatter */}
        <circle cx="52" cy="20" r="1.6" fill={fill} opacity="0.6" />
        <circle cx="9" cy="44" r="1.1" fill={fill} opacity="0.4" />
        {/* highlight — gives the wet ink feel */}
        <ellipse cx="22" cy="22" rx="5" ry="3" fill="white" opacity="0.18" />
      </svg>
    </span>);

}

// ─────────────────────────────────────────────────────────────
// Brand wordmark — re-used in topbars
// ─────────────────────────────────────────────────────────────
function ArkBrand({ slash, slashEn }) {
  return (
    <div className="ark-brand">
      <img src="assets/ark-mark-black.png" alt="Ark" className="ark-mark-light" />
      <img src="assets/ark-mark-white.png" alt="Ark" className="ark-mark-dark" />
      <span className="ark-word">Ark Academy</span>
      {slash &&
      <span className="ark-slash">
          /
          <span className="bil">
            <span className="kr"> {slash}</span>
            <span className="en"> {slashEn}</span>
          </span>
        </span>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// AI State Chip — the visual vocabulary for AI lock states.
// "locked" · "unlocking" · "active"
// ─────────────────────────────────────────────────────────────
function AIStateChip({ state }) {
  const labels = {
    locked: { kr: "잠김 · 먼저 써보기", en: "Locked · draft first" },
    unlocking: { kr: "곧 열려요", en: "Almost there" },
    active: { kr: "함께 생각 중", en: "Thinking with you" }
  };
  const l = labels[state] || labels.locked;
  return (
    <span className={`ai-chip ai-chip--${state}`}>
      <span className="ai-chip__dot" />
      <span className="bil">
        <span className="kr">{l.kr}</span>
        <span className="en">{l.en}</span>
      </span>
    </span>);

}

// ─────────────────────────────────────────────────────────────
// Threshold meter — draft word count progress toward unlock.
// minWords sets the gate. Passes through to a "ceremonial" line
// when complete.
// ─────────────────────────────────────────────────────────────
function ThresholdMeter({ words, target = 60, ceremonial = true }) {
  const pct = Math.min(100, Math.round(words / target * 100));
  const reached = words >= target;
  return (
    <div className={"threshold" + (reached ? " threshold--reached" : "")}>
      <div className="threshold__row">
        <span className="threshold__label mono">
          <span className="bil">
            <span className="kr">초안 진행</span>
            <span className="en">DRAFT PROGRESS</span>
          </span>
        </span>
        <span className="threshold__count num">
          {words}
          <span className="muted"> / {target}</span>
        </span>
      </div>
      <div className="threshold__bar">
        <div className="threshold__fill" style={{ width: pct + "%" }} />
      </div>
      {ceremonial && reached &&
      <div className="threshold__done serif">
          <span className="bil">
            <span className="kr">충분히 써봤어요. 이제 함께 생각해볼까요.</span>
            <span className="en">You've drafted enough. Now we can think together.</span>
          </span>
        </div>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Tiny stroked icon set — single source so they look unified.
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowL: <path d="M19 12H5M11 18l-6-6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    lock:
    <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </>,

    unlock:
    <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 017.5-2" />
      </>,

    pencil: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />,
    sparkle:
    <>
        <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
        <path d="M7 7l3 3M14 14l3 3M17 7l-3 3M10 14l-3 3" opacity="0.5" />
      </>,

    book:
    <>
        <path d="M4 5a2 2 0 012-2h12v17H6a2 2 0 01-2-2V5z" />
        <path d="M4 18a2 2 0 012-2h12" />
      </>,

    chat: <path d="M4 5h16v11H8l-4 4V5z" />,
    search:
    <>
        <circle cx="11" cy="11" r="6" />
        <path d="M16 16l4 4" />
      </>,

    bell:
    <>
        <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15L6 16z" />
        <path d="M10 21h4" />
      </>,

    chevron: <path d="M9 6l6 6-6 6" />,
    chevronD: <path d="M6 9l6 6 6-6" />,
    play: <path d="M7 5v14l12-7z" fill="currentColor" stroke="none" />,
    home: <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-7H10v7H5a1 1 0 01-1-1v-9z" />,
    folder: <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />,
    target:
    <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </>,

    feather:
    <>
        <path d="M20 4c-8 0-13 5-13 11v5h5c6 0 11-5 11-13l-3-3z" />
        <path d="M16 8L7 17M11 13H5" />
      </>,

    quote:
    <>
        <path d="M6 17V11a4 4 0 014-4M14 17v-6a4 4 0 014-4" />
      </>,

    mic:
    <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0014 0M12 18v3M9 21h6" />
      </>,

    users:
    <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 19c0-2 2-4 5-4s2 1 2 4" />
      </>,

    spark2: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
    moon: <path d="M20 14a8 8 0 11-9-9 6 6 0 009 9z" />,
    sun:
    <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" />
      </>

  };
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "0 0 auto", display: "inline-block", verticalAlign: "middle" }}>
      
      {paths[name] || paths.plus}
    </svg>);

};

// ─────────────────────────────────────────────────────────────
// Bilingual text helpers
// ─────────────────────────────────────────────────────────────
function Bil({ kr, en }) {
  return (
    <span className="bil">
      <span className="kr">{kr}</span>
      <span className="en" style={{ fontFamily: "Pretendard" }}>{en}</span>
    </span>);

}
function Dual({ kr, en, krSec, enSec }) {
  // primary text on top, the OTHER language smaller below
  return (
    <span className="dual">
      <span className="pri pri-kr">{kr}</span>
      <span className="pri pri-en">{en}</span>
      <span className="sec sec-en">{enSec || en}</span>
      <span className="sec sec-kr">{krSec || kr}</span>
    </span>);

}

// ─────────────────────────────────────────────────────────────
// Topbar — reused chrome on every screen
// ─────────────────────────────────────────────────────────────
function Topbar({ tab = "today", crumb }) {
  const tabs = [
  { id: "today", kr: "오늘", en: "Today" },
  { id: "projects", kr: "프로젝트", en: "Projects" },
  { id: "journal", kr: "성찰 노트", en: "Journal" },
  { id: "arketype", kr: "아키타입", en: "Arketype" }];

  return (
    <div className="topbar">
      <ArkBrand slash={crumb?.kr || "어린 창의가"} slashEn={crumb?.en || "   Young Innovators"} />
      <nav className="topbar__tabs">
        {tabs.map((t) =>
        <button key={t.id} className={"tab" + (tab === t.id ? " tab--active" : "")}>
            <Bil kr={t.kr} en={t.en} />
          </button>
        )}
      </nav>
      <div className="topbar__right">
        <button className="icon-btn"><Icon name="search" size={16} /></button>
        <button className="icon-btn"><Icon name="bell" size={16} /></button>
        <div className="kid-id">
          <div className="kid-id__av">민</div>
          <div className="kid-id__txt">
            <div className="kid-id__name">
              <Bil kr="이민준" en="Minjun Lee" />
            </div>
            <div className="kid-id__meta mono">
              <Bil kr="초5 · 11세" en="G5 · 11" />
            </div>
          </div>
        </div>
      </div>
    </div>);

}

// expose to other Babel scripts
Object.assign(window, {
  SumiMark, ArkBrand, AIStateChip, ThresholdMeter, Icon, Bil, Dual, Topbar
});