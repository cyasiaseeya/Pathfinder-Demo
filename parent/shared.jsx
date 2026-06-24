// parent/shared.jsx — Parent Portal shared components.
// Builds on the existing student-portal primitives (SumiMark, Bil, Dual,
// Icon are loaded from components/shared.jsx). Adds parent-specific UI:
// the soft Arketype radar, the child switcher, the postcard hero card.

const ppKids = [
  { id: 'minjun', kr: '이민준', en: 'Minjun', age: 'G5 · 11', initial: '민', tone: 'ink' },
  { id: 'seoyeon', kr: '이서연', en: 'Seoyeon', age: 'G3 · 9',  initial: '연', tone: 'coral' },
];

// ─────────────────────────────────────────────────────────────
// PPNav — local mini-router so each phone artboard navigates
// independently. Wraps a screen and lets nested components
// call goTo('home' | 'child' | 'projects' | 'msg' | 'next').
// ─────────────────────────────────────────────────────────────
const PPNavCtx = React.createContext({ screen: 'home', goTo: () => {}, kid: 'minjun', setKid: () => {} });

function PPRouter({ initial = 'home', initialKid = 'minjun', notif = 'calm', tod = 'evening', heroVariant = 'audio', tooltipOn = false, multiKid = true, shareOpen = false }) {
  const [screen, setScreen] = React.useState(initial);
  const [kid, setKid] = React.useState(initialKid);
  const [share, setShare] = React.useState(shareOpen);
  const [drawer, setDrawer] = React.useState(false);

  // sync external prop changes (Tweaks)
  React.useEffect(() => { setKid(initialKid); }, [initialKid]);
  React.useEffect(() => { setScreen(initial); }, [initial]);
  React.useEffect(() => { setShare(shareOpen); }, [shareOpen]);

  const goTo = React.useCallback((s, opts = {}) => {
    setScreen(s);
    if (opts.openShare) setShare(true);
    if (opts.closeShare) setShare(false);
  }, []);

  const ctx = { screen, goTo, kid, setKid, share, setShare, drawer, setDrawer };

  const screens = {
    home:     <PPHome     tod={tod} heroVariant={heroVariant} notif={notif} activeKid={kid} multiKid={multiKid} />,
    child:    <PPChild    activeKid={kid} tooltipOn={tooltipOn} />,
    projects: <PPProjects activeKid={kid} shareOpen={share} />,
    msg:      <PPFacilitator activeKid={kid} translateOn={true} />,
    next:     <PPNext     activeKid={kid} />,
    letter:   <PPLetter   activeKid={kid} />,
    unlock:   <PPUnlock   activeKid={kid} />,
    scrapbook: <PPScrapbook activeKid={kid} />,
    wall:     <PPWall     activeKid={kid} />,
    conference: <PPConference activeKid={kid} />,
  };

  return (
    <PPNavCtx.Provider value={ctx}>
      {screens[screen] || screens.home}
    </PPNavCtx.Provider>
  );
}

function usePPNav() { return React.useContext(PPNavCtx); }

// ─────────────────────────────────────────────────────────────
// Mobile parent app bar
// ─────────────────────────────────────────────────────────────
function PPAppBar({ activeKid = 'minjun', notif = 'calm', bordered = false, multi = true }) {
  const nav = usePPNav();
  const ctxKid = nav.kid || activeKid;
  const kid = ppKids.find(k => k.id === ctxKid) || ppKids[0];
  const other = ppKids.find(k => k.id !== ctxKid);
  const swap = () => nav.setKid(other.id);
  const goNotif = () => nav.goTo('msg');
  return (
    <div className={"pp-appbar" + (bordered ? " pp-appbar--bordered" : "")}>
      <div className="pp-brand clickable" onClick={() => nav.goTo('home')}>
        <img src="assets/ark-mark-black.png" alt="Ark" className="ark-mark-light" />
        <span>Ark Academy</span>
      </div>
      {multi ? (
        <div className="pp-childswitch" role="button" aria-label="Switch child" onClick={swap}>
          <div className="pp-childswitch__avs">
            <div className={"pp-childswitch__av pp-childswitch__av--active" + (kid.tone === 'coral' ? ' pp-childswitch__av--alt' : '')}>{kid.initial}</div>
            <div className={"pp-childswitch__av" + (other.tone === 'coral' ? ' pp-childswitch__av--alt' : '')}>{other.initial}</div>
          </div>
          <div className="pp-childswitch__name">
            <Bil kr={kid.kr} en={kid.en} />
            <span className="meta">{kid.age}</span>
          </div>
        </div>
      ) : (
        <div className="pp-childswitch" role="button">
          <div className={"pp-childswitch__av pp-childswitch__av--active" + (kid.tone === 'coral' ? ' pp-childswitch__av--alt' : '')}>{kid.initial}</div>
          <div className="pp-childswitch__name">
            <Bil kr={kid.kr} en={kid.en} />
            <span className="meta">{kid.age}</span>
          </div>
        </div>
      )}
      <div className="pp-appbar__icons">
        <button className="pp-iconbtn" aria-label="Settings" onClick={() => nav.goTo('child')}><Icon name="sun" size={18} /></button>
        <button className="pp-iconbtn" aria-label="Notifications" onClick={goNotif}>
          <Icon name="bell" size={18} />
          {notif !== 'calm' && <span className="pp-iconbtn__dot" />}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar (5 tabs)
// ─────────────────────────────────────────────────────────────
function PPTabBar({ active = 'home' }) {
  const nav = usePPNav();
  const current = nav.screen || active;
  const tabs = [
    { id: 'home',  kr: '오늘',     en: 'Today',       icon: 'home' },
    { id: 'child', kr: '내 아이', en: 'My child',    icon: 'sparkle' },
    { id: 'projects', kr: '프로젝트', en: 'Projects', icon: 'folder' },
    { id: 'msg',   kr: '대화',     en: 'Messages',    icon: 'chat' },
    { id: 'next',  kr: '다음',     en: "What's next", icon: 'target' },
  ];
  return (
    <div className="pp-tabbar">
      {tabs.map(t => (
        <button key={t.id}
          className={"pp-tab" + (current === t.id ? " pp-tab--active" : "")}
          onClick={() => nav.goTo(t.id)}
        >
          <Icon name={t.icon} size={18} stroke={current === t.id ? 1.8 : 1.5} />
          <span className="pp-tab__lab">
            <Bil kr={t.kr} en={t.en} />
          </span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Soft Arketype radar — gradient fill, no clinical grid
// 16 dimensions arranged on radial axes
// ─────────────────────────────────────────────────────────────
function SoftRadar({ size = 320, values, showLabels = true, showAxes = true, accent = 'gradient' }) {
  // 16 values 0..1
  const v = values || [
    0.78, 0.82, 0.66, 0.58, 0.72, 0.85, 0.74, 0.62,
    0.56, 0.68, 0.80, 0.88, 0.70, 0.64, 0.74, 0.82,
  ];
  const labels = [
    'Curiosity','Inquiry','Synthesis','Metacog.',
    'Patience','Resilience','Focus','Risk',
    'Care','Listening','Voice','Play',
    'Craft','Iteration','Grounding','Pattern',
  ];
  const cx = size/2, cy = size/2;
  const rMax = size * 0.38;
  const pts = v.map((val, i) => {
    const a = (i / v.length) * Math.PI * 2 - Math.PI / 2;
    const r = rMax * val;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const path = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + ' Z';

  // soft outline path with curves
  const blob = (() => {
    const inflate = 1.0;
    const ps = v.map((val, i) => {
      const a = (i / v.length) * Math.PI * 2 - Math.PI / 2;
      const r = rMax * val * inflate;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });
    let d = '';
    for (let i = 0; i < ps.length; i++) {
      const cur = ps[i];
      const nxt = ps[(i+1) % ps.length];
      const mid = [(cur[0]+nxt[0])/2, (cur[1]+nxt[1])/2];
      if (i === 0) d += 'M' + mid[0].toFixed(1) + ',' + mid[1].toFixed(1) + ' ';
      const next = ps[(i+1) % ps.length];
      const nextMid = [(next[0] + ps[(i+2)%ps.length][0])/2, (next[1] + ps[(i+2)%ps.length][1])/2];
      d += 'Q' + next[0].toFixed(1) + ',' + next[1].toFixed(1) + ' ' + nextMid[0].toFixed(1) + ',' + nextMid[1].toFixed(1) + ' ';
    }
    return d + 'Z';
  })();

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <defs>
        <radialGradient id="pp-radar-grad" cx="50%" cy="55%">
          <stop offset="0%"  stopColor="#FFD6B8" stopOpacity="0.85"/>
          <stop offset="55%" stopColor="#FF9079" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#FF7A6E" stopOpacity="0.22"/>
        </radialGradient>
        <radialGradient id="pp-radar-aura" cx="50%" cy="55%">
          <stop offset="0%"  stopColor="#FFE8A3" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFE8A3" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* gentle aura background */}
      <circle cx={cx} cy={cy} r={rMax * 1.05} fill="url(#pp-radar-aura)" />

      {/* concentric guide rings — barely-there */}
      {showAxes && [0.25, 0.5, 0.75, 1.0].map((f,i) => (
        <circle key={i} cx={cx} cy={cy} r={rMax * f}
          fill="none"
          stroke="rgba(11,11,15,0.06)"
          strokeWidth="1"
          strokeDasharray={f === 1.0 ? "0" : "1 4"}
        />
      ))}

      {/* axes — only at compass points */}
      {showAxes && [0,4,8,12].map(i => {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(a) * rMax}
            y2={cy + Math.sin(a) * rMax}
            stroke="rgba(11,11,15,0.05)"
            strokeWidth="1"
          />
        );
      })}

      {/* the soft profile — gradient fill, no harsh outline */}
      <path d={blob}
        fill="url(#pp-radar-grad)"
        stroke="rgba(255,122,110,0.32)"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* dim dots at each vertex */}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="1.8"
          fill="#FF7A6E"
          opacity="0.6"
        />
      ))}

      {/* compass labels */}
      {showLabels && [
        { i: 0,  txt: 'CURIOSITY',  anchor:'middle', dy: -8 },
        { i: 4,  txt: 'PATIENCE',   anchor:'start',  dx: 8 },
        { i: 8,  txt: 'CARE',       anchor:'middle', dy: 14 },
        { i: 12, txt: 'CRAFT',      anchor:'end',    dx: -8 },
      ].map(l => {
        const a = (l.i / 16) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * (rMax + 4);
        const y = cy + Math.sin(a) * (rMax + 4);
        return (
          <text key={l.i}
            x={x + (l.dx||0)} y={y + (l.dy||4)}
            textAnchor={l.anchor}
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fontSize="9"
            letterSpacing="1.6"
            fontWeight="600"
            fill="rgba(11,11,15,0.42)"
          >{l.txt}</text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Audio waveform visualization (decorative)
// ─────────────────────────────────────────────────────────────
function AudioWave({ played = 0.28, bars = 42 }) {
  const heights = React.useMemo(() => {
    // deterministic pseudo-random heights for stability across renders
    const seed = 7;
    const arr = [];
    for (let i = 0; i < bars; i++) {
      const x = Math.sin(i * 1.7 + seed) * Math.cos(i * 0.4) * 0.5 + 0.5;
      const w = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.21) * 0.7 + Math.cos(i * 0.13) * 0.3);
      arr.push(Math.max(0.2, x * w));
    }
    return arr;
  }, [bars]);
  return (
    <div className="pp-wave">
      <button className="pp-wave__btn"><Icon name="play" size={14} /></button>
      <div className="pp-wave__bars">
        {heights.map((h, i) => {
          const playedIdx = Math.floor(bars * played);
          const cls = i < playedIdx ? 'pp-wave__bar--played'
                    : i === playedIdx ? '' : 'pp-wave__bar--upcoming';
          return (
            <span key={i} className={"pp-wave__bar " + cls}
              style={{ height: (h * 100) + '%' }}
            />
          );
        })}
      </div>
      <span className="pp-wave__time num">0:08 / 0:32</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Phone wrapper — wraps an artboard child in a clean iOS frame
// at design-spec 375 width. Uses a Korean SKT carrier in the status bar.
// ─────────────────────────────────────────────────────────────
function PhoneShell({ children, dark = false, time = '오후 7:42' }) {
  const c = dark ? '#fff' : '#0B0B0F';
  return (
    <div className="pp-phone-shell">
      <div style={{
        width: 393, height: 852,
        borderRadius: 52, overflow: 'hidden',
        position: 'relative',
        background: dark ? '#0A0812' : 'var(--paper)',
        boxShadow: '0 30px 80px rgba(11,11,15,0.18), 0 0 0 10px #1a1a22, 0 0 0 11px #2a2730',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 122, height: 36, borderRadius: 22, background: '#000', zIndex: 50,
        }} />
        {/* status bar with Korean carrier */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '17px 28px 0',
        }}>
          <span style={{
            fontFamily: '-apple-system, "SF Pro", system-ui',
            fontWeight: 600, fontSize: 15,
            color: c, letterSpacing: -0.2,
          }}>{time}</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: 9, letterSpacing: '.05em',
              color: c, opacity: 0.85, marginRight: 4, fontWeight: 600,
            }}>SKT</span>
            <svg width="16" height="11" viewBox="0 0 16 11">
              <rect x="0"   y="7" width="2.6" height="4" rx="0.5" fill={c}/>
              <rect x="3.8" y="5" width="2.6" height="6" rx="0.5" fill={c}/>
              <rect x="7.6" y="3" width="2.6" height="8" rx="0.5" fill={c}/>
              <rect x="11.4" y="0" width="2.6" height="11" rx="0.5" fill={c} opacity="0.45"/>
            </svg>
            <svg width="14" height="11" viewBox="0 0 14 11">
              <path d="M7 2.5C8.9 2.5 10.6 3.2 11.8 4.4L12.7 3.5C11.2 2 9.2 1 7 1C4.8 1 2.8 2 1.3 3.5L2.2 4.4C3.4 3.2 5.1 2.5 7 2.5Z" fill={c}/>
              <path d="M7 5.5C8.1 5.5 9.1 5.9 9.8 6.6L10.7 5.7C9.7 4.8 8.4 4.1 7 4.1C5.6 4.1 4.3 4.8 3.3 5.7L4.2 6.6C4.9 5.9 5.9 5.5 7 5.5Z" fill={c}/>
              <circle cx="7" cy="9" r="1.2" fill={c}/>
            </svg>
            <svg width="24" height="11" viewBox="0 0 24 11">
              <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={c} strokeOpacity="0.4" fill="none"/>
              <rect x="2"   y="2"   width="14" height="7"  rx="1.4" fill={c}/>
              <path d="M22 4v3c.6-.2 1-.8 1-1.5S22.6 4.2 22 4z" fill={c} fillOpacity="0.4"/>
            </svg>
          </div>
        </div>
        {/* content */}
        <div style={{ height: '100%', position: 'relative' }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 100, zIndex: 60,
          background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(11,11,15,0.32)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Time-of-day greeting helper
// ─────────────────────────────────────────────────────────────
function timeContext(tod) {
  if (tod === 'morning') return {
    greetKr: '좋은 아침이에요, 민준 어머님.',
    greetEn: 'Good morning, Minjun\u2019s mother.',
    timeLabel: { kr: '오전 7:14 · 화요일', en: '7:14 AM · TUE' },
    statusTime: '오전 7:14',
    sigKr: '오늘 민준이는 평소보다 일찍 시작했어요.',
    sigEn: 'Minjun started a little earlier than usual today.',
  };
  return {
    greetKr: '오늘 하루도 수고하셨어요.',
    greetEn: 'You\u2019ve made it through the day.',
    timeLabel: { kr: '오후 7:42 · 화요일', en: '7:42 PM · TUE' },
    statusTime: '오후 7:42',
    sigKr: '민준이는 오늘 따뜻하게, 천천히 작업했어요.',
    sigEn: 'Minjun worked warmly and slowly today.',
  };
}

Object.assign(window, {
  ppKids, PPAppBar, PPTabBar, SoftRadar, AudioWave, PhoneShell, timeContext,
  PPRouter, PPNavCtx, usePPNav,
});
