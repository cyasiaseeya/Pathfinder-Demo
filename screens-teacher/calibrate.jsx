// screens-teacher/calibrate.jsx — Arketype Calibration
// Reactor proposes shifts to a kid's 16-d Arketype profile based on a session.
// Mentor reviews, approves/holds each shift before it commits to the child's
// profile (and before it surfaces to the family).

const { MentorTopbar, Bil, Icon, SumiMark } = window;

// ── radar (compact, reads same data shape as student-portal Arketype) ──
function MiniRadar({ values, deltas, size = 220 }) {
  const dims = [
    "Voicer","Synthesist","Expresser","Reflector","Persister","Questioner",
    "Analyst","Translator","Imaginer","Builder","Explorer","Decider",
    "Listener","Collaborator","Regulator","Wonderer"
  ];
  const cx = size / 2, cy = size / 2, r = size * 0.42;
  const N = dims.length;
  const angle = (i) => (-Math.PI / 2) + (i / N) * Math.PI * 2;
  const point = (i, v) => {
    const a = angle(i);
    const radius = (v / 100) * r;
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  };
  const polyOld = values.map((v, i) => {
    const [x, y] = point(i, v);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
  const polyNew = values.map((v, i) => {
    const [x, y] = point(i, v + (deltas[i] || 0));
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
  const ringValues = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <defs>
        <radialGradient id="ark-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.10" />
        </radialGradient>
      </defs>
      {ringValues.map((rv, k) => {
        const path = dims.map((_, i) => {
          const [x, y] = point(i, rv);
          return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(" ") + " Z";
        return <path key={k} d={path} fill="none" stroke="var(--line-2)" strokeWidth="0.5" strokeDasharray={k === ringValues.length - 1 ? "none" : "2 3"} opacity="0.6" />;
      })}
      {dims.map((d, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-2)" strokeWidth="0.4" opacity="0.4" />;
      })}
      {/* old (faded) */}
      <path d={polyOld} fill="none" stroke="var(--muted-2)" strokeWidth="1" strokeDasharray="2 3" />
      {/* new (filled) */}
      <path d={polyNew} fill="url(#ark-grad)" stroke="var(--violet)" strokeWidth="1.3" strokeLinejoin="round" />
      {/* deltas */}
      {deltas.map((dv, i) => {
        if (!dv) return null;
        const [x, y] = point(i, values[i] + dv);
        return <circle key={i} cx={x} cy={y} r={3.4} fill={dv > 0 ? "var(--success)" : "var(--coral)"} stroke="var(--paper)" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

function ArketypeCalibrate() {
  const values = [60, 64, 71, 58, 52, 66, 73, 47, 70, 55, 49, 60, 62, 68, 54, 71];
  const deltas = [12, 4, 2, -1, 0, 5, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];

  const shifts = [
    {
      idx: 0,
      kind: "up",
      kr: "목소리", en: "Voicer",
      glossKr: "혼자 다른 의견을 낼 때의 자신감",
      glossEn: "Confidence speaking up with a different opinion",
      was: 60, now: 72, delta: "+12",
      whyKr: <>4주 동안 — 두 번의 영상에서 자기 단언을 마지막에 두는 패턴. <em className="s">"시간이 맛이다"</em>는 튜터가 제안한 비유가 아니라, 민준이 만들어낸 문장.</>,
      whyEn: <>Over 4 weeks — twice now landing his own claim at the end of the video. <em className="s">"Time is the taste"</em> wasn't a tutor metaphor — it was his sentence.</>,
    },
    {
      idx: 1,
      kind: "up",
      kr: "통합", en: "Synthesist",
      glossKr: "서로 다른 조각을 하나로 묶는 힘",
      glossEn: "Tying separate pieces into one",
      was: 64, now: 68, delta: "+4",
      whyKr: "엄마/할머니의 시간 차이를 '맛'으로 묶는 도약 — 한 세션에서 분명히 보임.",
      whyEn: "The leap from time-difference to 'taste' — visible in one session.",
    },
    {
      idx: 5,
      kind: "up",
      kr: "질문하는 사람", en: "Questioner",
      glossKr: "튜터에게 되묻는 빈도와 깊이",
      glossEn: "How often and how deep he asks back",
      was: 66, now: 71, delta: "+5",
      whyKr: "이번 세션에서 처음으로 튜터의 질문에 \"왜 그게 진짜야?\"로 되물음.",
      whyEn: "First time he answered a tutor question with \"why is that real?\" instead of with a story.",
    },
    {
      idx: 3,
      kind: "hold",
      kr: "반성", en: "Reflector",
      glossKr: "자기 작업을 되돌아보는 능력",
      glossEn: "Ability to look back at his own work",
      was: 58, now: 57, delta: "-1",
      whyKr: "단일 세션의 침묵 한 번 — 노이즈일 수 있음. 보류 권장.",
      whyEn: "One pause in one session — likely noise. Suggest hold.",
    },
  ];

  return (
    <div className="frame">
      <MentorTopbar tab="arketype" crumb={{ kr: "아키타입 보정 · 이민준", en: "Arketype calibration · Minjun" }} />
      <div className="scroll-y">
        <div className="calib__shell">
          <div className="calib__head">
            <div>
              <div className="eyebrow"><span className="dot" /><Bil kr="REACTOR 제안 · 4월 29일 오전 8시 14분" en="REACTOR PROPOSAL · APR 29, 8:14 AM" /></div>
              <h1>
                <Bil
                  kr={<>네 가지 <em className="s">변화</em> 제안 — 통과시킬까요, 잡아둘까요?</>}
                  en={<>Four <em className="s">shifts</em> proposed — release or hold?</>}
                />
              </h1>
              <p>
                <Bil
                  kr="Reactor는 데이터에서 변화를 본다. 멘토는 데이터가 의미하는 바를 본다. 둘 다 통과한 변화만 민준이의 아키타입에 반영됩니다."
                  en="Reactor sees the change in the data. You see what the change means. Only shifts cleared by both reach Minjun's profile."
                />
              </p>
            </div>
            <button className="btn btn--ghost"><Icon name="book" size={14} /> <Bil kr="이전 변화 보기" en="Past shifts" /></button>
          </div>

          <div className="calib__grid">
            {/* Radar overview */}
            <div className="radar-panel">
              <h3><Bil kr="민준의 아키타입" en="Minjun's Arketype" /></h3>
              <MiniRadar values={values} deltas={deltas} />
              <div className="radar-panel__kid"><Bil kr="이민준" en="Minjun Lee" /></div>
              <div className="radar-panel__sub"><Bil kr="초5 · 11세 · 4주차" en="G5 · AGE 11 · WEEK 4" /></div>
              <div style={{ display: "flex", gap: 10, fontSize: 11, marginTop: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--muted)" }}>
                  <span style={{ width: 12, height: 1, borderTop: "1px dashed var(--muted-2)" }} />
                  <Bil kr="이전" en="Before" />
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--violet)" }}>
                  <span style={{ width: 12, height: 2, background: "var(--violet)" }} />
                  <Bil kr="제안" en="Proposed" />
                </span>
              </div>
            </div>

            {/* Shifts list */}
            <div className="shifts">
              {shifts.map((s, i) => (
                <Shift key={i} {...s} />
              ))}
            </div>
          </div>

          <div className="calib__footer">
            <SumiMark size={28} tone="ink" />
            <p>
              <span className="muted"><Bil kr="멘토 메모 · 부모에게 함께 전달" en="MENTOR NOTE · WILL ACCOMPANY THE SHIFTS" /></span>
              <Bil
                kr={<>"이번 주 민준은 자기 단언을 영상 끝에 두는 패턴이 분명해졌어요. '시간이 맛이다' — 본인이 만든 문장입니다."</>}
                en={<>"This week Minjun became clearer about landing his own claim at the end of the video. 'Time is the taste' — those are his words."</>}
              />
            </p>
            <button className="btn btn--primary" style={{ background: "var(--paper)", color: "var(--ink)", border: 0 }}>
              <Bil kr="3가지 변화 통과" en="Release 3 shifts" />
              <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shift({ kind, kr, en, glossKr, glossEn, was, now, delta, whyKr, whyEn }) {
  const cls = `shift shift--${kind}`;
  const deltaCls = kind === "up" ? "shift__delta--up" : kind === "down" ? "shift__delta--down" : "";

  // bar fill
  const lo = Math.min(was, now);
  const hi = Math.max(was, now);

  return (
    <div className={cls}>
      <div className="shift__name">
        <Bil kr={kr} en={en} />
        <span className="muted"><Bil kr={glossKr} en={glossEn} /></span>
      </div>
      <div className="shift__bar">
        <div
          className="shift__bar-fill"
          style={{
            left: `${lo}%`, width: `${hi - lo}%`,
            background: kind === "up" ? "rgba(74,122,46,.3)" : kind === "down" ? "rgba(255,122,110,.3)" : "rgba(201,122,31,.3)",
          }}
        />
        <span className="shift__bar-was" style={{ left: `${was}%` }} />
        <span className="shift__bar-now" style={{ left: `${now}%` }} />
      </div>
      <div className={`shift__delta ${deltaCls}`}>{delta}</div>
      <p className="shift__why">
        <Bil kr={whyKr} en={whyEn} />
      </p>
      <div className="shift__actions" style={{ gridColumn: "3 / 4" }}>
        {kind === "hold" ? (
          <button className="act-btn act-btn--hold" style={{ padding: "5px 12px", fontSize: 11 }}>
            <Bil kr="보류" en="Hold" />
          </button>
        ) : (
          <button className="act-btn act-btn--approve" style={{ padding: "5px 12px", fontSize: 11 }}>
            <Bil kr="통과" en="Release" />
          </button>
        )}
      </div>
    </div>
  );
}

window.ArketypeCalibrate = ArketypeCalibrate;
