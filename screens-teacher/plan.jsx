// screens-teacher/plan.jsx — Project Planner
// A week-shaped forecast: where each kid is likely to be Mon–Fri, with
// mentor prep TODOs grafted onto the cells that need a hand.
// Novel pattern: a "week weather" momentum heatmap above per-kid lanes.

const { MentorTopbar, StageChip, HumanGate, Bil, Icon, SumiMark } = window;

// ── Cohort schedule data ──────────────────────────────────────────
// each row: kid + a 5-cell week (Mon..Fri) where each cell is { stage, intensity, prep? }
// stage: draft|tutor|revise|defend|arketype|gate|—
// intensity 0..3 ; 0 = no work; 3 = mentor required
const PLAN_KIDS = [
  { kr: "이민준", en: "Minjun",  grade: "G5", project: { kr: "한국 음식", en: "Korean Food" },
    week: [
      { stage: "tutor",  intensity: 3, prep: { kr: "튜터 옆에서 검토", en: "Beside the tutor" }, key: "co-pilot · Minjun" },
      { stage: "tutor",  intensity: 2 },
      { stage: "revise", intensity: 2 },
      { stage: "gate",   intensity: 3, prep: { kr: "발표 게이트 질문 작성", en: "Write Defend gate Q" }, key: "review · Minjun" },
      { stage: "defend", intensity: 3, prep: { kr: "발표 입회 — 4교시", en: "Sit in on Defend · P4" } },
    ] },
  { kr: "김연수", en: "Yeonsoo", grade: "G5", project: { kr: "친절 버튼", en: "Kindness Button" },
    week: [
      { stage: "tutor", intensity: 3, prep: { kr: "튜터 루프 — 다시 방향", en: "Tutor loop — redirect" }, key: "co-pilot · Yeonsoo" },
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 2 },
      { stage: "revise",intensity: 1 },
      { stage: "revise",intensity: 1 },
    ] },
  { kr: "박도윤", en: "Doyoon",  grade: "G6", project: { kr: "점심 낭비", en: "Lunch Waste" },
    week: [
      { stage: "defend",intensity: 3, prep: { kr: "발표 검토 · 영상 + 한 가지 질문", en: "Review + leave one Q" }, key: "review · Doyoon" },
      { stage: "defend",intensity: 2 },
      { stage: "arketype",intensity:3, prep: { kr: "아키타입 보정 승인", en: "Sign off Arketype shifts" }, key: "calibrate · Doyoon" },
      { stage: "—",     intensity: 0 },
      { stage: "—",     intensity: 0 },
    ] },
  { kr: "최하윤", en: "Hayoon",  grade: "G3", project: { kr: "동네 지도", en: "Neighborhood Map" },
    week: [
      { stage: "draft", intensity: 2 },
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 2, prep: { kr: "막힘 — 1:1 대화 (G3 단축)", en: "Stuck — 1:1 (shorter for G3)" }, key: "1:1 · Hayoon" },
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 1 },
    ] },
  { kr: "정도현", en: "Dohyun",  grade: "G5", project: { kr: "친구 인터뷰", en: "Friend Interview" },
    week: [
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 2 },
      { stage: "revise",intensity: 2 },
      { stage: "revise",intensity: 1 },
      { stage: "gate",  intensity: 3, prep: { kr: "발표 게이트 질문", en: "Defend gate Q" }, key: "review · Dohyun" },
    ] },
  { kr: "한소율", en: "Soyul",   grade: "G4", project: { kr: "포드캐스트", en: "Podcast" },
    week: [
      { stage: "revise",intensity: 2 },
      { stage: "revise",intensity: 1 },
      { stage: "gate",  intensity: 3, prep: { kr: "발표 게이트 질문", en: "Defend gate Q" }, key: "review · Soyul" },
      { stage: "defend",intensity: 2 },
      { stage: "defend",intensity: 1 },
    ] },
  { kr: "윤채원", en: "Chaewon", grade: "G6", project: { kr: "메뉴 다시", en: "Better Menu" },
    week: [
      { stage: "arketype",intensity:3, prep: { kr: "잠금 해제 의례", en: "Unlock ceremony · sign" }, key: "unlock · Chaewon" },
      { stage: "—",     intensity: 0 },
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 2 },
    ] },
  { kr: "강예준", en: "Yejun",   grade: "G3", project: { kr: "친구 편지", en: "Letter" },
    week: [
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 2 },
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 1 },
    ] },
  { kr: "조서아", en: "Seoa",    grade: "G4", project: { kr: "할머니 노래", en: "Grandma's Song" },
    week: [
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 1 },
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 2 },
    ] },
  { kr: "임지안", en: "Jian",    grade: "G5", project: { kr: "AI 검증", en: "AI Fact-check" },
    week: [
      { stage: "tutor", intensity: 2 },
      { stage: "tutor", intensity: 2 },
      { stage: "revise",intensity: 1 },
      { stage: "revise",intensity: 1 },
      { stage: "revise",intensity: 1 },
    ] },
  { kr: "오나라", en: "Nara",    grade: "G6", project: { kr: "동네 소리", en: "Sounds of Block" },
    week: [
      { stage: "revise",intensity: 1 },
      { stage: "revise",intensity: 1 },
      { stage: "revise",intensity: 2 },
      { stage: "gate",  intensity: 3, prep: { kr: "발표 게이트 질문", en: "Defend gate Q" }, key: "review · Nara" },
      { stage: "defend",intensity: 1 },
    ] },
  { kr: "신유진", en: "Yujin",   grade: "G4", project: { kr: "비밀 일기", en: "Secret Diary" },
    week: [
      { stage: "defend",intensity: 2 },
      { stage: "arketype",intensity:3, prep: { kr: "아키타입 보정 승인", en: "Sign off Arketype shifts" }, key: "calibrate · Yujin" },
      { stage: "—",     intensity: 0 },
      { stage: "draft", intensity: 1 },
      { stage: "draft", intensity: 1 },
    ] },
];

const DAYS = [
  { kr: "월", en: "MON", dateKr: "27일", dateEn: "27" },
  { kr: "화", en: "TUE", dateKr: "28일", dateEn: "28" },
  { kr: "수", en: "WED", dateKr: "29일", dateEn: "29", today: true },
  { kr: "목", en: "THU", dateKr: "30일", dateEn: "30" },
  { kr: "금", en: "FRI", dateKr: "1일",  dateEn: "1" },
];

// Aggregate "weather" — mentor-hand-needed intensity per day
function weatherForDay(dayIdx) {
  let total = 0, needsHand = 0;
  PLAN_KIDS.forEach(k => {
    const c = k.week[dayIdx];
    total += c.intensity;
    if (c.intensity >= 3) needsHand++;
  });
  return { total, needsHand };
}

function ProjectPlanner() {
  // Collect prep items across the week, in day order
  const todos = [];
  PLAN_KIDS.forEach(k => {
    k.week.forEach((cell, di) => {
      if (cell.prep) {
        todos.push({
          day: di, kid: k, cell,
        });
      }
    });
  });
  todos.sort((a,b) => a.day - b.day);

  return (
    <div className="frame">
      <MentorTopbar tab="plan" crumb={{ kr: "이번 주 계획", en: "Week plan" }} />
      <div className="scroll-y">
        <div className="plan__shell">

          {/* Hero */}
          <header className="plan__hero">
            <div>
              <div className="eyebrow"><span className="dot" /><Bil kr="이번 주 · 4월 27일 ~ 5월 1일" en="THIS WEEK · APR 27 — MAY 1" /></div>
              <h1>
                <Bil
                  kr={<>일주일을 <em className="s">한 호흡</em>으로.</>}
                  en={<>The week, in <em className="s">one breath</em>.</>}
                />
              </h1>
              <p>
                <Bil
                  kr="누가 어디에 있을지, 언제 손이 필요한지, 무엇을 미리 준비해야 하는지 — 한 화면에."
                  en="Where each kid will be, when your hand is needed, what to prep — all on one screen."
                />
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn--ghost"><Icon name="folder" size={14} /> <Bil kr="지난 주" en="Last week" /></button>
              <button className="btn btn--primary"><Icon name="plus" size={14} /> <Bil kr="새 프로젝트 시작" en="Start a project" /></button>
            </div>
          </header>

          {/* Week-weather strip — novel pattern */}
          <section className="weather">
            <div className="weather__head">
              <h3><Bil kr="멘토 손이 필요한 정도" en="Where your hand is needed" /></h3>
              <div className="weather__legend">
                <LegendDot tone="ok"  kr="평이" en="GENTLE" />
                <LegendDot tone="med" kr="보통" en="STEADY" />
                <LegendDot tone="hi"  kr="집중 필요" en="HEAVY" />
              </div>
            </div>
            <div className="weather__row">
              {DAYS.map((d, i) => {
                const w = weatherForDay(i);
                const tone = w.needsHand >= 3 ? "hi" : w.needsHand >= 1 ? "med" : "ok";
                return (
                  <div key={i} className={`weather__cell weather__cell--${tone} ${d.today ? "weather__cell--today" : ""}`}>
                    <div className="weather__day">
                      <span className="weather__day-kr serif"><Bil kr={d.kr} en={d.en} /></span>
                      <span className="weather__day-num mono"><Bil kr={d.dateKr} en={d.dateEn} /></span>
                      {d.today && <span className="weather__today mono"><Bil kr="오늘" en="TODAY" /></span>}
                    </div>
                    <div className="weather__bar">
                      {PLAN_KIDS.map((k, ki) => {
                        const ci = k.week[i];
                        return <span key={ki} className={`weather__tick weather__tick--i${ci.intensity}`} title={`${k.en} · ${ci.stage}`} />;
                      })}
                    </div>
                    <div className="weather__stat">
                      <span className="serif" style={{ fontSize: 22 }}>{w.needsHand}</span>
                      <span className="mono"><Bil kr="멘토 필요" en="MENTOR REQ" /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Per-kid lanes */}
          <section className="lanes">
            <div className="lanes__head">
              <h3><Bil kr="학생별 흐름" en="Per-kid flow" /></h3>
              <span className="lanes__hint mono">
                <Bil kr="셀을 누르면 단계 · 멘토 준비" en="TAP A CELL FOR STAGE & PREP" />
              </span>
            </div>

            <div className="lanes__grid">
              <div className="lanes__col-head" />
              {DAYS.map((d, i) => (
                <div key={i} className={`lanes__col-head ${d.today ? "lanes__col-head--today" : ""}`}>
                  <span className="serif"><Bil kr={d.kr} en={d.en} /></span>
                  <span className="mono"><Bil kr={d.dateKr} en={d.dateEn} /></span>
                </div>
              ))}

              {PLAN_KIDS.map((k, ki) => (
                <React.Fragment key={ki}>
                  <div className="lane__who">
                    <div className="lane__av">{k.kr.charAt(0)}</div>
                    <div className="lane__who-txt">
                      <Bil kr={k.kr} en={k.en} />
                      <span className="muted">{k.grade} · <Bil kr={k.project.kr} en={k.project.en} /></span>
                    </div>
                  </div>
                  {k.week.map((c, di) => (
                    <LaneCell key={di} cell={c} today={DAYS[di].today} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Mentor prep TODOs */}
          <section className="prep">
            <div className="prep__head">
              <div>
                <h3><Bil kr="이번 주 준비할 것" en="Prep this week" /></h3>
                <p className="muted" style={{ margin: "2px 0 0", fontSize: 13 }}>
                  <Bil
                    kr={<>{todos.length}개 항목 — <em className="s">초안 잡기</em>로 두면 검토 시간이 짧아져요.</>}
                    en={<>{todos.length} items — <em className="s">draft</em> them ahead and reviews go faster.</>}
                  />
                </p>
              </div>
              <span className="mono prep__filter">
                <Bil kr="요일순" en="BY DAY" />
              </span>
            </div>

            <div className="prep__list">
              {todos.map((t, i) => (
                <PrepRow key={i} t={t} />
              ))}
            </div>
          </section>

          {/* Project shape — what's on the next Friday lab */}
          <section className="shape">
            <div className="shape__hero">
              <div>
                <div className="eyebrow"><span className="dot" /><Bil kr="다음 금요 랩" en="NEXT FRIDAY LAB" /></div>
                <h2 className="serif">
                  <Bil
                    kr={<>금요일 — <em className="s">발표 4명</em>, 새 프로젝트 1명.</>}
                    en={<>Friday — <em className="s">four defends</em>, one new pick.</>}
                  />
                </h2>
              </div>
              <span className="mono shape__date">
                <Bil kr="5월 1일 · 금" en="FRI · MAY 1" />
              </span>
            </div>

            <div className="shape__grid">
              <ShapeCard
                titleKr="발표 입회"
                titleEn="Sit in on defends"
                bodyKr={<>4명. 각자 <em className="s">한 가지 질문</em>씩.</>}
                bodyEn={<>Four kids. <em className="s">One question each</em>.</>}
                listKr={["민준 · 한국 음식", "도현 · 친구 인터뷰", "소율 · 포드캐스트", "나라 · 동네 소리"]}
                listEn={["Minjun · Korean Food", "Dohyun · Friend Interview", "Soyul · Podcast", "Nara · Sounds of Block"]}
              />
              <ShapeCard
                titleKr="잠금 해제"
                titleEn="Unlock ceremony"
                bodyKr={<>채원이 — <em className="s">아키타입 4주차</em>. 부모 동석 권장.</>}
                bodyEn={<>Chaewon — <em className="s">Arketype week 4</em>. Family welcome.</>}
                listKr={["부모 메모: 자기 단언 늘었음", "Reactor 보고서 미리 보내기"]}
                listEn={["Parent note: own claims grew", "Send Reactor letter early"]}
              />
              <ShapeCard
                titleKr="새 프로젝트 시작"
                titleEn="Start a new pick"
                bodyKr={<>채원이가 시작 — <em className="s">메뉴 다시</em>의 다음 챕터?</>}
                bodyEn={<>Chaewon launches — <em className="s">next chapter</em> of Better Menu?</>}
                listKr={["주제 후보 3개 같이 쓰기", "프로젝트 도서 한 권 선택"]}
                listEn={["Co-write 3 topic seeds", "Pick one project book"]}
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function LegendDot({ tone, kr, en }) {
  return (
    <span className="weather__legend-item">
      <span className={`weather__legend-dot weather__legend-dot--${tone}`} />
      <Bil kr={kr} en={en} />
    </span>
  );
}

function LaneCell({ cell, today }) {
  if (cell.intensity === 0) {
    return <div className={`lane__cell lane__cell--empty ${today ? "lane__cell--today" : ""}`}>
      <span className="mono">—</span>
    </div>;
  }
  const stageClass = cell.stage ? `lane__cell--${cell.stage}` : "";
  const hand = cell.intensity >= 3 ? "lane__cell--hand" : "";
  return (
    <div className={`lane__cell ${stageClass} ${hand} ${today ? "lane__cell--today" : ""}`}>
      <span className="lane__cell-stage mono">
        {cell.stage === "gate" ? "GATE" :
         cell.stage === "—" ? "—" :
         cell.stage.toUpperCase()}
      </span>
      {cell.prep && (
        <span className="lane__cell-prep">
          <HumanGate size={12} />
          <span><Bil kr={cell.prep.kr} en={cell.prep.en} /></span>
        </span>
      )}
    </div>
  );
}

function PrepRow({ t }) {
  const dayLabel = DAYS[t.day];
  return (
    <div className="prep-row">
      <div className="prep-row__day">
        <span className="serif" style={{ fontSize: 13 }}><Bil kr={dayLabel.kr} en={dayLabel.en} /></span>
        <span className="mono"><Bil kr={dayLabel.dateKr} en={dayLabel.dateEn} /></span>
      </div>
      <div className="prep-row__who">
        <div className="lane__av" style={{ width: 28, height: 28, fontSize: 12 }}>{t.kid.kr.charAt(0)}</div>
        <span><Bil kr={t.kid.kr} en={t.kid.en} /></span>
      </div>
      <div className="prep-row__what">
        <StageChip stage={t.cell.stage === "gate" ? "defend" : t.cell.stage} />
        <span className="prep-row__text">
          <HumanGate size={12} />
          <Bil kr={t.cell.prep.kr} en={t.cell.prep.en} />
        </span>
      </div>
      <button className="prep-row__cta">
        <Bil kr="열기" en="Open" /> <Icon name="arrow" size={12} />
      </button>
    </div>
  );
}

function ShapeCard({ titleKr, titleEn, bodyKr, bodyEn, listKr, listEn }) {
  return (
    <div className="shape-card">
      <h4 className="mono"><Bil kr={titleKr} en={titleEn} /></h4>
      <p className="serif"><Bil kr={bodyKr} en={bodyEn} /></p>
      <ul className="shape-card__list">
        {listKr.map((_, i) => (
          <li key={i}><Bil kr={listKr[i]} en={listEn[i]} /></li>
        ))}
      </ul>
    </div>
  );
}

window.ProjectPlanner = ProjectPlanner;
