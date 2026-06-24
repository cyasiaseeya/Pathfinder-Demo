// screens-teacher/class.jsx — Class arc: all 12 kids across the 5-step PBL flow.
// One row per kid, one column per step. Cells show: past/current/stuck/review-needed/unlocked.

const { MentorTopbar, Bil, Icon } = window;

const CLASS_KIDS = [
  { kr: "이민준", en: "Minjun Lee",     grade: "G5", project: { kr: "한국 음식", en: "Korean Food" },     state: [1,1,2.5,0,0] }, // stuck at tutor
  { kr: "김연수", en: "Yeonsoo Kim",    grade: "G5", project: { kr: "친절 버튼", en: "Kindness Button" }, state: [1,1,3,0,0] }, // tutor turn needs review
  { kr: "박도윤", en: "Doyoon Park",    grade: "G6", project: { kr: "점심 낭비", en: "Lunch Waste" },     state: [1,1,1,1,2] }, // at defend
  { kr: "최하윤", en: "Hayoon Choi",    grade: "G3", project: { kr: "동네 지도", en: "Neighborhood Map" }, state: [1,2,0,0,0] },
  { kr: "정도현", en: "Dohyun Jung",    grade: "G5", project: { kr: "친구 인터뷰", en: "Friend Interview" }, state: [1,1,2,0,0] },
  { kr: "한소율", en: "Soyul Han",      grade: "G4", project: { kr: "포드캐스트", en: "Podcast" },         state: [1,1,1,2,0] },
  { kr: "윤채원", en: "Chaewon Yoon",   grade: "G6", project: { kr: "메뉴 다시", en: "Better Menu" },     state: [1,1,1,1,4] }, // unlocked
  { kr: "강예준", en: "Yejun Kang",     grade: "G3", project: { kr: "친구 편지", en: "Letter to Friend" },state: [1,2,0,0,0] },
  { kr: "조서아", en: "Seoa Cho",       grade: "G4", project: { kr: "할머니 노래", en: "Grandma's Song" }, state: [2,0,0,0,0] }, // drafting
  { kr: "임지안", en: "Jian Lim",       grade: "G5", project: { kr: "AI 검증", en: "AI Fact-check" },    state: [1,1,2,0,0] },
  { kr: "오나라", en: "Nara Oh",        grade: "G6", project: { kr: "동네 소리", en: "Sounds of Block" }, state: [1,1,1,2,0] },
  { kr: "신유진", en: "Yujin Shin",     grade: "G4", project: { kr: "비밀 일기", en: "Secret Diary" },    state: [1,1,1,1,2] }, // at defend
];

// state code → cell class
// 0 = future, 1 = past (done), 2 = current, 2.5 = stuck, 3 = needs review, 4 = unlocked
function cellClass(v) {
  if (v === 0) return "arc__cell";
  if (v === 1) return "arc__cell arc__cell--past";
  if (v === 2) return "arc__cell arc__cell--here";
  if (v === 2.5) return "arc__cell arc__cell--here arc__cell--stuck";
  if (v === 3) return "arc__cell arc__cell--review-needed";
  if (v === 4) return "arc__cell arc__cell--unlocked";
  return "arc__cell";
}

function cellLabel(v) {
  if (v === 2.5) return { kr: "막힘", en: "STUCK" };
  if (v === 3)   return { kr: "검토", en: "REVIEW" };
  if (v === 4)   return { kr: "열림", en: "UNLOCKED" };
  if (v === 2)   return { kr: "지금", en: "NOW" };
  return null;
}

function ClassArc() {
  const stages = [
    { num: "01", kr: "프로젝트", en: "PICK" },
    { num: "02", kr: "초안", en: "DRAFT" },
    { num: "03", kr: "튜터", en: "TUTOR" },
    { num: "04", kr: "고치기", en: "REVISE" },
    { num: "05", kr: "발표·성찰", en: "DEFEND" },
  ];

  return (
    <div className="frame">
      <MentorTopbar tab="class" crumb={{ kr: "교실 · 5단계", en: "Class · 5-step arc" }} />
      <div className="scroll-y">
        <div className="class__shell">
          <div className="class__hero">
            <div>
              <div className="eyebrow"><span className="dot" /><Bil kr="이번 주 코호트" en="COHORT, THIS WEEK" /></div>
              <h1>
                <Bil
                  kr={<>12명의 <em className="s">호흡</em>을 한눈에.</>}
                  en={<>The cohort's <em className="s">breathing</em>, at a glance.</>}
                />
              </h1>
              <p>
                <Bil
                  kr="각 학생이 5단계 어디에 있는지. 막힌 학생, 검토가 필요한 차례, 잠금 해제 직전 — 모두 한 화면에."
                  en="Where each kid sits on the 5-step arc. Who's stuck, whose turn needs review, who's about to unlock — all in one read."
                />
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn--ghost"><Icon name="folder" size={14} /> <Bil kr="이번 주 내보내기" en="Export week" /></button>
              <button className="btn btn--primary"><Bil kr="모두에게 메모" en="Note to all" /></button>
            </div>
          </div>

          <div className="class__filters">
            <button className="filter-pill filter-pill--active"><Bil kr="전체 12명" en="ALL 12" /></button>
            <button className="filter-pill filter-pill--accent">
              <Bil kr="검토 필요 4" en="NEEDS REVIEW · 4" />
            </button>
            <button className="filter-pill"><Bil kr="튜터 단계" en="IN TUTOR" /></button>
            <button className="filter-pill"><Bil kr="발표 준비" en="READY TO DEFEND" /></button>
            <button className="filter-pill"><Bil kr="잠금 해제" en="UNLOCKED" /></button>
            <span style={{ marginLeft: "auto" }} className="filter-pill">
              <Bil kr="정렬 · 검토 우선" en="SORT · NEEDS-FIRST" />
            </span>
          </div>

          <div className="arc">
            <div className="arc__head">
              <div /> {/* spacer for the name column */}
              {stages.map((s, i) => (
                <div className="arc-col" key={i}>
                  <div className="arc-num">{s.num}</div>
                  <div className="arc-name"><Bil kr={s.kr} en={s.en} /></div>
                  <div className="arc-count">
                    {(() => {
                      const here = CLASS_KIDS.filter(k => Math.floor(k.state[i]) === 2).length;
                      return here ? <Bil kr={`${here}명 진행 중`} en={`${here} HERE`} /> : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {CLASS_KIDS.map((k, i) => (
              <div className="arc__row" key={i}>
                <div className="arc__who">
                  <div className="av">{k.kr.charAt(0)}</div>
                  <div className="arc__who-name">
                    <Bil kr={k.kr} en={k.en} />
                    <span className="muted">
                      {k.grade} · <Bil kr={k.project.kr} en={k.project.en} />
                    </span>
                  </div>
                </div>
                {k.state.map((v, j) => {
                  const label = cellLabel(v);
                  return (
                    <div className={cellClass(v)} key={j}>
                      {label && <Bil kr={label.kr} en={label.en} />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase" }}>
              <Bil kr="범례" en="LEGEND" />
            </span>
            <LegendItem cls="arc__cell--past" labelKr="완료" labelEn="DONE" />
            <LegendItem cls="arc__cell--here" labelKr="진행 중" labelEn="HERE" />
            <LegendItem cls="arc__cell--here arc__cell--stuck" labelKr="24시간 막힘" labelEn="STUCK > 24h" />
            <LegendItem cls="arc__cell--review-needed" labelKr="멘토 검토" labelEn="REVIEW" />
            <LegendItem cls="arc__cell--unlocked" labelKr="잠금 해제" labelEn="UNLOCKED" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ cls, labelKr, labelEn }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, color: "var(--ink-2)" }}>
      <span className={`arc__cell ${cls}`} style={{ width: 32, height: 16, fontSize: 8 }} />
      <Bil kr={labelKr} en={labelEn} />
    </span>
  );
}

window.ClassArc = ClassArc;
