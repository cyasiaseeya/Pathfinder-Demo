// screens/arketype.jsx — Progress / Arketype dashboard
// 16 archetypes (Ark's universal skillset profile). NO XP, NO LEADERBOARD.
// A snapshot of where the kid leans this term. "What you're building this
// week" summary. Quiet, substantive.

// Each archetype carries a small, hand-tuned line icon — designed thematically
// to its meaning. All drawn on a 24-grid, currentColor stroke, 1.6 weight.
function ArketypeIcon({ id, size = 28, stroke = 1.6 }) {
  const paths = {
    // — Empathy —
    weaver: ( // a story unfurling — a quill-line drawing a wave
      <>
        <path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
        <path d="M19 7l-2 2-1-1 2-2zM17 9l-7 7-2 .5.5-2 7-7" />
      </>
    ),
    listener: ( // an ear with sound waves arriving from the left
      <>
        <path d="M14 4a5 5 0 015 5c0 3-2 4-2 7s-1 4-3 4-3-2-3-4M14 9a2 2 0 00-2 2" />
        <path d="M3 8c1 1 1 5 0 6M6 6c2 2 2 8 0 10" opacity=".55" />
      </>
    ),
    bridge: ( // arched bridge with two pylons
      <>
        <path d="M3 16c4-7 14-7 18 0" />
        <path d="M3 19h18M7 19v-3M17 19v-3M12 19v-4" />
      </>
    ),
    ally: ( // two figures, hand to hand
      <>
        <circle cx="8" cy="7" r="2.2" />
        <circle cx="16" cy="7" r="2.2" />
        <path d="M4 19v-2a4 4 0 014-4M20 19v-2a4 4 0 00-4-4" />
        <path d="M10 13l2-1 2 1" />
      </>
    ),

    // — Making —
    builder: ( // stacked blocks
      <>
        <rect x="4" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
        <rect x="8" y="5" width="8" height="7" />
      </>
    ),
    tinker: ( // a wrench at an angle
      <>
        <path d="M14.5 4a4 4 0 014.5 5l-2-1-2 2 1 2a4 4 0 01-5-1l-7 7-2-2 7-7a4 4 0 015-5z" />
      </>
    ),
    drafter: ( // pencil writing an underline — first attempt energy
      <>
        <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
        <path d="M14 6l3 3M11 21h9" />
      </>
    ),
    shaper: ( // hands at a potter's wheel — cup forming
      <>
        <path d="M5 13a7 4 0 0014 0" />
        <path d="M8 13c0-3 1-7 4-7s4 4 4 7" />
        <path d="M3 19h18" />
      </>
    ),

    // — Thinking —
    asker: ( // question mark inside a soft frame
      <>
        <path d="M9 9a3 3 0 116 0c0 2-3 2-3 5" />
        <circle cx="12" cy="18" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    doubter: ( // magnifying glass with a small interrogation tilt
      <>
        <circle cx="10" cy="10" r="5" />
        <path d="M14 14l6 6" />
        <path d="M10 8v2M10 12v.5" opacity=".7" />
      </>
    ),
    framer: ( // a window/frame with a horizon line through it
      <>
        <rect x="4" y="5" width="16" height="14" rx="1" />
        <path d="M4 13h16M12 5v14" opacity=".6" />
      </>
    ),
    patter: ( // a 3x3 of dots, with one connecting line drawn through
      <>
        <circle cx="6" cy="6" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="6" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="6" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="6" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="6" cy="18" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="18" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="18" r="1.1" fill="currentColor" stroke="none" />
        <path d="M6 6l6 12 6-12" />
      </>
    ),

    // — Resilience —
    stayer: ( // mountain with a small flag at the peak
      <>
        <path d="M3 19l6-10 4 6 3-4 5 8H3z" />
        <path d="M9 9V4l3 1.5L9 7" />
      </>
    ),
    reset: ( // a circular arrow — redo
      <>
        <path d="M20 12a8 8 0 11-3-6.2" />
        <path d="M20 4v5h-5" />
      </>
    ),
    alone: ( // a single figure on a horizon
      <>
        <circle cx="12" cy="7" r="2.2" />
        <path d="M12 9v6M9 15l3 5 3-5" />
        <path d="M3 19h18" opacity=".5" />
      </>
    ),
    open: ( // a door, ajar, with light leaking out
      <>
        <path d="M5 4h7v16H5z" />
        <path d="M12 4l7 2v12l-7 2" />
        <circle cx="15" cy="12" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
         fill="none" stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round"
         style={{ display: "block" }}>
      {paths[id] || paths.asker}
    </svg>
  );
}

const ARKETYPES = [
  // Empathy — storytelling, listening, connecting, befriending
  { id: "weaver",   kr: "이야기꾼",   en: "Weaver",     fam: "empathy",    level: 4 },
  { id: "listener", kr: "듣는이",     en: "Listener",   fam: "empathy",    level: 3 },
  { id: "bridge",   kr: "다리",       en: "Bridge",     fam: "empathy",    level: 2 },
  { id: "ally",     kr: "동무",       en: "Ally",       fam: "empathy",    level: 3 },

  // Making — building, fixing, drafting, shaping
  { id: "builder",  kr: "짓는이",     en: "Builder",    fam: "make",       level: 4 },
  { id: "tinker",   kr: "고치는이",   en: "Tinker",     fam: "make",       level: 3 },
  { id: "drafter",  kr: "초안가",     en: "Drafter",    fam: "make",       level: 4, current: true },
  { id: "shaper",   kr: "다듬이",     en: "Shaper",     fam: "make",       level: 2 },

  // Thinking — questioning, doubting, framing, finding patterns
  { id: "asker",    kr: "묻는이",     en: "Asker",      fam: "think",      level: 5, current: true },
  { id: "doubter",  kr: "의심가",     en: "Doubter",    fam: "think",      level: 3 },
  { id: "framer",   kr: "틀짜기",     en: "Framer",     fam: "think",      level: 2 },
  { id: "patter",   kr: "패턴찾기",   en: "Patternist", fam: "think",      level: 3 },

  // Resilience — enduring, restarting, going alone, staying open
  { id: "stayer",   kr: "버티는이",   en: "Stayer",     fam: "resilience", level: 4, current: true },
  { id: "reset",    kr: "다시하기",   en: "Resetter",   fam: "resilience", level: 3 },
  { id: "alone",    kr: "홀로가는이", en: "Soloist",    fam: "resilience", level: 2 },
  { id: "open",     kr: "열린이",     en: "Opener",     fam: "resilience", level: 3 },
];

const FAM_META = {
  empathy:    { kr: "공감",       en: "Empathy",       color: "var(--mist-peach)" },
  make:       { kr: "만들기",     en: "Making",        color: "var(--mist-blue)" },
  think:      { kr: "생각하기",   en: "Thinking",      color: "var(--mist-lilac)" },
  resilience: { kr: "회복",       en: "Resilience",    color: "var(--mist-mint)" },
};

function ArketypeCell({ a, large = false }) {
  const fam = FAM_META[a.fam];
  // 5 dots — filled up to the kid's level
  const dots = [0,1,2,3,4].map(i => (
    <span key={i} className={"arketype__pip" + (i < a.level ? " arketype__pip--on" : "")} />
  ));
  return (
    <div className={"arketype" + (a.current ? " arketype--current" : "") + (large ? " arketype--lg" : "")}>
      <div className="arketype__crest" style={{ "--fam": fam.color }}>
        <span className="arketype__ring" />
        <span className="arketype__disc">
          <span className="arketype__icon">
            <ArketypeIcon id={a.id} size={large ? 36 : 26} />
          </span>
        </span>
        {a.current && <span className="arketype__pulse" />}
      </div>
      <div className="arketype__meta">
        <span className="arketype__name serif"><Bil kr={a.kr} en={a.en} /></span>
        <span className="arketype__pips">{dots}</span>
        <span className="arketype__lvl mono">LVL {a.level} · 5</span>
      </div>
    </div>
  );
}

function ArketypeScreen() {
  return (
    <div className="frame arketype">
      <Topbar tab="arketype" crumb={{ kr: "아키타입", en: "Arketype" }} />
      <div className="scroll-y">
        <div className="ark__shell">
          <header className="ark__hero">
            <div className="eyebrow"><span className="dot" /><span className="mono"><Bil kr="이번 학기 스냅샷" en="THIS TERM · SNAPSHOT" /></span></div>
            <h1 className="ark__title">
              <Bil
                kr={<>너는 지금 <em className="s">묻는이</em>로 자라고 있어요.</>}
                en={<>You're growing as an <em className="s">Asker</em> right now.</>}
              />
            </h1>
            <p className="ark__sub">
              <Bil
                kr={<>아키타입은 점수가 아니에요. <b>지금 너의 모양</b>이고, 다음 학기에 다시 바뀌어요.</>}
                en={<>Arketypes aren't scores. They're <b>your shape right now</b>, and they shift next term.</>}
              />
            </p>
          </header>

          {/* This week's focus */}
          <section className="ark__week">
            <div className="sec-head">
              <span className="no">C · 01</span>
              <h2><Bil kr={<>이번 주 <em className="s">짓고 있는 것</em></>} en={<>What you're <em className="s">building this week</em></>} /></h2>
              <span className="tag"><Bil kr="현재 프로젝트가 키우는 세 가지." en="What the current project is exercising." /></span>
            </div>
            <div className="ark__week-grid">
              {ARKETYPES.filter(a => a.current).map(a => (
                <ArketypeCell key={a.id} a={a} large={true} />
              ))}
            </div>
          </section>

          {/* Full grid */}
          <section className="ark__all">
            <div className="sec-head">
              <span className="no">C · 02</span>
              <h2><Bil kr={<>16 <em className="s">아키타입</em></>} en={<>16 <em className="s">Arketypes</em></>} /></h2>
              <span className="tag"><Bil kr="네 가지 가족 · 각 네 명." en="Four families · four each." /></span>
            </div>

            {Object.keys(FAM_META).map(famKey => (
              <div key={famKey} className="ark__family">
                <div className="ark__fam-label">
                  <span className="ark__fam-swatch" style={{ background: FAM_META[famKey].color }} />
                  <span className="serif"><Bil kr={FAM_META[famKey].kr} en={FAM_META[famKey].en} /></span>
                </div>
                <div className="ark__fam-row">
                  {ARKETYPES.filter(a => a.fam === famKey).map(a => <ArketypeCell key={a.id} a={a} />)}
                </div>
              </div>
            ))}
          </section>

          {/* Trajectory */}
          <section className="ark__journey">
            <div className="sec-head">
              <span className="no">C · 03</span>
              <h2><Bil kr={<>이번 학기의 <em className="s">움직임</em></>} en={<>This term's <em className="s">movement</em></>} /></h2>
              <span className="tag"><Bil kr="너의 모양이 어떻게 바뀌었는지." en="How your shape has shifted." /></span>
            </div>
            <ul className="movements">
              <li className="move">
                <span className="move__date mono">02 → 04</span>
                <p>
                  <Bil
                    kr={<><b className="serif">묻는이</b> Lv2 → <b className="serif">Lv5</b> · 튜터에게 더 좋은 질문을 되돌려주기 시작했어요.</>}
                    en={<><b className="serif">Asker</b> L2 → <b className="serif">L5</b> · You've started returning sharper questions to the tutor.</>}
                  />
                </p>
              </li>
              <li className="move">
                <span className="move__date mono">03 → 04</span>
                <p>
                  <Bil
                    kr={<><b className="serif">버티는이</b> Lv3 → <b className="serif">Lv4</b> · "튜터가 답을 안 줘서 답답"하던 게 더 길게 견딜 수 있게 되었어요.</>}
                    en={<><b className="serif">Stayer</b> L3 → <b className="serif">L4</b> · You can sit longer with the discomfort of unanswered questions.</>}
                  />
                </p>
              </li>
              <li className="move">
                <span className="move__date mono">04</span>
                <p>
                  <Bil
                    kr={<><b className="serif">초안가</b> Lv3 → <b className="serif">Lv4</b> · 첫 시도를 더 일찍, 덜 완벽하게 시작해요.</>}
                    en={<><b className="serif">Drafter</b> L3 → <b className="serif">L4</b> · You start first attempts earlier and less perfectly.</>}
                  />
                </p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
window.ArketypeScreen = ArketypeScreen;
