// screens-teacher/desk.jsx — Mentor Desk (today's review queue)
// The first thing a mentor sees: what needs you right now.

const { MentorTopbar, HumanGate, StageChip, Bil, Icon, SumiMark } = window;

function MentorDesk() {
  return (
    <div className="frame mentor-desk">
      <MentorTopbar tab="desk" crumb={{ kr: "오늘", en: "Today" }} />
      <div className="scroll-y">
        <div className="desk__shell">
          {/* Hero */}
          <header className="desk__hero">
            <div className="eyebrow">
              <span className="dot" />
              <span><Bil kr="2026년 4월 29일 · 수요일" en="WED · APR 29, 2026" /></span>
            </div>
            <h1 className="desk__greeting">
              <Bil
                kr={<>서윤 선생님 — <em className="s">네 명</em>이 오늘 선생님을 기다려요.</>}
                en={<>Hi Seoyun — <em className="s">four kids</em> are waiting on you today.</>}
              />
            </h1>
            <p className="desk__sub">
              <Bil
                kr="AI는 항상 멈춰 있어요. 선생님이 보고 통과시키거나, 다시 돌리거나, 잠깐 잡아둘 수 있어요."
                en="The AI always pauses here. You can release a turn, redirect it, or hold it back."
              />
            </p>
          </header>

          <div className="desk__layout">
            <div>
              {/* Section A — Tutor turns awaiting approval */}
              <div className="sec-head">
                <span className="no">A · 01</span>
                <h2>
                  <Bil
                    kr={<>튜터가 <em className="s">물어볼</em> 질문 — 통과시킬까요?</>}
                    en={<>Tutor wants to ask <em className="s">these</em> — release them?</>}
                  />
                </h2>
                <span className="tag">
                  <Bil
                    kr="모든 튜터 메시지는 멘토 승인 후 학생에게 보입니다."
                    en="Every tutor message waits here until you release it."
                  />
                </span>
              </div>

              <div className="queue">
                <DeskQueueCard
                  urgent
                  avatar="민"
                  nameKr="이민준"
                  nameEn="Minjun Lee"
                  meta={{ kr: "초5 · 김치 프로젝트", en: "G5 · Kimchi Project" }}
                  stage="tutor"
                  reasonKr={<>튜터가 다음 질문을 작성했어요 — <span className="swatch">"시간이 맛이다"가 마지막에 와야 할까요, 처음에?"</span></>}
                  reasonEn={<>Tutor drafted next question — <span className="swatch">"Should 'time is the taste' come last or first?"</span></>}
                  timeKr="2분 전"
                  timeEn="2 MIN AGO"
                  ctaKr="튜터 옆으로"
                  ctaEn="Open co-pilot"
                  flagged
                />
                <DeskQueueCard
                  urgent
                  avatar="연"
                  nameKr="김연수"
                  nameEn="Yeonsoo Kim"
                  meta={{ kr: "초5 · 친절 버튼", en: "G5 · Kindness Button" }}
                  stage="tutor"
                  reasonKr={<>튜터가 동일한 질문을 두 번째 시도 — <em className="s">루프 의심.</em> 다시 방향 잡아주세요.</>}
                  reasonEn={<>Tutor is asking a near-identical question twice — <em className="s">possible loop.</em> Worth redirecting.</>}
                  timeKr="6분 전"
                  timeEn="6 MIN AGO"
                  ctaKr="다시 묻게 하기"
                  ctaEn="Redirect"
                />
              </div>

              {/* Section B — Artifact ready for Defend */}
              <div className="sec-head">
                <span className="no">A · 02</span>
                <h2>
                  <Bil
                    kr={<>발표 준비된 작업 — <em className="s">한 가지 질문</em> 남겨주세요.</>}
                    en={<>Ready to defend — leave them <em className="s">one question</em>.</>}
                  />
                </h2>
                <span className="tag">
                  <Bil kr="멘토 질문이 있어야 발표 단계가 열려요." en="The Defend step opens once your question lands." />
                </span>
              </div>

              <div className="queue">
                <DeskQueueCard
                  violet
                  avatar="도"
                  nameKr="박도윤"
                  nameEn="Doyoon Park"
                  meta={{ kr: "초6 · 점심 낭비", en: "G6 · Lunch Waste" }}
                  stage="defend"
                  reasonKr={<>2분 47초 영상 · 핵심 단언 <em className="s">"버려지는 음식이 가장 비싸다"</em></>}
                  reasonEn={<>2:47 video · central claim <em className="s">"food we waste costs the most"</em></>}
                  timeKr="어제"
                  timeEn="YESTERDAY"
                  ctaKr="작업 보기"
                  ctaEn="Open artifact"
                />
              </div>

              {/* Section C — Arketype calibration */}
              <div className="sec-head">
                <span className="no">A · 03</span>
                <h2>
                  <Bil
                    kr={<>아키타입 보정 — <em className="s">두 명</em> 변화 승인.</>}
                    en={<>Arketype calibration — <em className="s">two</em> shifts to sign off.</>}
                  />
                </h2>
                <span className="tag">
                  <Bil kr="Reactor가 제안한 변화는 멘토 검토 후 학생/부모에게 보입니다." en="Reactor's proposed shifts wait for your review before they reach families." />
                </span>
              </div>

              <div className="queue">
                <DeskQueueCard
                  mint
                  avatar="민"
                  nameKr="이민준"
                  nameEn="Minjun Lee"
                  meta={{ kr: "초5", en: "G5" }}
                  stage="arketype"
                  reasonKr={<><em className="s">목소리</em> +12 · 4주 동안 가장 큰 변화. 근거 5개.</>}
                  reasonEn={<><em className="s">Voicer</em> +12 over 4 weeks · five evidence points.</>}
                  timeKr="오늘 8:14"
                  timeEn="TODAY 8:14"
                  ctaKr="검토"
                  ctaEn="Review"
                />
                <DeskQueueCard
                  mint
                  avatar="하"
                  nameKr="최하윤"
                  nameEn="Hayoon Choi"
                  meta={{ kr: "초3", en: "G3" }}
                  stage="arketype"
                  reasonKr={<><em className="s">반성</em> -4 · 단일 세션 기반 · 보류 권장.</>}
                  reasonEn={<><em className="s">Reflector</em> -4 · based on one session · suggest hold.</>}
                  timeKr="오늘 8:14"
                  timeEn="TODAY 8:14"
                  ctaKr="검토"
                  ctaEn="Review"
                />
              </div>
            </div>

            {/* Right rail */}
            <aside className="desk__rail">
              <div className="rail-card">
                <h3><Bil kr="오늘 한눈에" en="Today at a glance" /></h3>
                <div className="rail-stat">
                  <span className="rail-stat__label"><Bil kr="대기 중인 튜터 차례" en="Tutor turns waiting" /></span>
                  <span className="rail-stat__val">2</span>
                </div>
                <div className="rail-stat rail-stat--accent">
                  <span className="rail-stat__label"><Bil kr="멈춰 있는 학생" en="Kids stuck > 24h" /></span>
                  <span className="rail-stat__val">1</span>
                </div>
                <div className="rail-stat">
                  <span className="rail-stat__label"><Bil kr="발표 준비됨" en="Ready to defend" /></span>
                  <span className="rail-stat__val">1</span>
                </div>
                <div className="rail-stat rail-stat--ok">
                  <span className="rail-stat__label"><Bil kr="잠금 해제 가능" en="Unlocks queued" /></span>
                  <span className="rail-stat__val">3</span>
                </div>
                <div className="rail-stat">
                  <span className="rail-stat__label"><Bil kr="아키타입 변화" en="Arketype shifts" /></span>
                  <span className="rail-stat__val">2</span>
                </div>
              </div>

              <div className="rail-card">
                <h3><Bil kr="이번 주 코호트" en="Cohort, this week" /></h3>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
                  <Bil
                    kr={<>12명 중 <b>8</b>명이 튜터 단계 통과. <b>2</b>명은 초안에 머무름 — <em className="s">서두를 필요 없음</em>.</>}
                    en={<><b>8 of 12</b> have passed Tutor. <b>2</b> are still drafting — <em className="s">no rush</em>.</>}
                  />
                </div>
              </div>

              <div className="rail-card" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
                <h3 style={{ color: "rgba(255,255,255,.6)" }}><Bil kr="멘토 원칙" en="Mentor contract" /></h3>
                <p style={{ fontFamily: "var(--serif)", fontSize: 14, lineHeight: 1.5, letterSpacing: "-0.015em", margin: 0, color: "var(--paper)" }}>
                  <Bil
                    kr={<><em className="s" style={{color:"var(--violet-2)"}}>"답을 주지 않는다.</em><br />질문을 다듬고, 침묵을 지킨다."</>}
                    en={<><em className="s" style={{color:"var(--violet-2)"}}>"No answers.</em><br />Sharpen the question. Hold the silence."</>}
                  />
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeskQueueCard({ avatar, nameKr, nameEn, meta, stage, reasonKr, reasonEn, timeKr, timeEn, ctaKr, ctaEn, urgent, violet, mint, flagged }) {
  const cls = "queue-card" +
    (urgent ? " queue-card--urgent" : "") +
    (violet ? " queue-card--violet" : "") +
    (mint ? " queue-card--mint" : "");
  return (
    <div className={cls}>
      <div className="qc-av">{avatar}</div>
      <div className="qc-body">
        <div className="qc-tag-row">
          <StageChip stage={stage} />
          {flagged && (
            <span className="flag-pill">
              <span className="dot" />
              <Bil kr="검토 필요" en="NEEDS REVIEW" />
            </span>
          )}
          {(stage === "tutor") && <HumanGate />}
        </div>
        <div className="qc-name">
          <Bil kr={nameKr} en={nameEn} />
          <span className="muted"><Bil kr={meta.kr} en={meta.en} /></span>
        </div>
        <p className="qc-reason"><Bil kr={reasonKr} en={reasonEn} /></p>
      </div>
      <div className="qc-meta">
        <span className="qc-stage">
          <Bil kr={`단계 ${stage === "draft" ? "02" : stage === "tutor" ? "03" : stage === "revise" ? "04" : stage === "defend" ? "05" : "—"}`}
               en={`STEP ${stage === "draft" ? "02" : stage === "tutor" ? "03" : stage === "revise" ? "04" : stage === "defend" ? "05" : "—"}`} />
        </span>
        <span className="qc-time"><Bil kr={timeKr} en={timeEn} /></span>
      </div>
      <button className="qc-cta">
        <Bil kr={ctaKr} en={ctaEn} />
        <Icon name="arrow" size={12} />
      </button>
    </div>
  );
}

window.MentorDesk = MentorDesk;
