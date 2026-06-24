// screens-teacher/copilot.jsx — Tutor Co-pilot
// The CORE human-in-the-loop screen. The AI tutor has drafted a next question;
// the mentor reviews it, can approve / redirect / hold, or pick an alternative.

const { MentorTopbar, HumanGate, StageChip, Bil, Icon, SumiMark } = window;

function TutorCopilot() {
  return (
    <div className="frame">
      <MentorTopbar tab="copilot" crumb={{ kr: "튜터 옆 · 검토", en: "Beside the tutor · review" }} />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div className="copilot__shell">

          {/* LEFT RAIL — pending sessions */}
          <aside className="copilot__rail-l">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)", margin: 0, fontWeight: 600 }}>
                <Bil kr="검토 대기" en="Awaiting review" />
              </h3>
              <span className="flag-pill"><span className="dot" />2</span>
            </div>

            <SessionCard active needsReview avatar="민" nameKr="이민준" nameEn="Minjun Lee"
              projectKr="한국 음식" projectEn="Korean Food"
              lineKr={"\"시간이 맛이다\"는 마지막에 와야 해, 처음에?"}
              lineEn={"Should \"time is the taste\" come last, or first?"}
              time="14:18" />

            <SessionCard needsReview avatar="연" nameKr="김연수" nameEn="Yeonsoo Kim"
              projectKr="친절 버튼" projectEn="Kindness Button"
              lineKr={"네가 '진짜 친절'이라고 부른 것 — 무엇이 진짜를 만들었어?"}
              lineEn={"What makes the thing you called 'real kindness' real?"}
              time="14:16" />

            <div style={{ height: 12 }} />

            <h3 style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)", margin: "12px 0 14px", fontWeight: 600 }}>
              <Bil kr="자동 통과 · 최근" en="Auto-released · recent" />
            </h3>

            <SessionCard avatar="도" nameKr="박도윤" nameEn="Doyoon Park"
              projectKr="점심 낭비" projectEn="Lunch Waste"
              lineKr={"\"가장 비싸다\"는 어떤 가격을 말해? 돈만 가격이야?"}
              lineEn={"What price are you naming as 'most expensive'? Is money the only price?"}
              time="13:52" />
            <SessionCard avatar="채" nameKr="윤채원" nameEn="Chaewon Yoon"
              projectKr="메뉴 다시" projectEn="Better Menu"
              lineKr="네가 바꾼 것이 메뉴인지, 아니면 점심시간 자체인지?"
              lineEn="Did you change the menu, or did you change lunchtime itself?"
              time="13:40" />
          </aside>

          {/* MAIN */}
          <main className="copilot__main">
            <div className="copilot-crumb">
              <div className="copilot-crumb__who">
                <div className="copilot-crumb__av">민</div>
                <div>
                  <div className="copilot-crumb__name">
                    <Bil kr="이민준" en="Minjun Lee" />
                  </div>
                  <div className="copilot-crumb__sub">
                    <Bil kr="초5 · 한국 음식 · 튜터 단계 03" en="G5 · KOREAN FOOD · STEP 03 OF 05" />
                  </div>
                </div>
              </div>
              <StageChip stage="tutor" />
              <span className="ai-chip ai-chip--unlocking" style={{ marginLeft: 8 }}>
                <span className="ai-chip__dot" />
                <Bil kr="튜터 일시정지 — 검토 대기" en="Tutor paused — awaiting review" />
              </span>
            </div>

            {/* Anchor in the draft */}
            <div className="draft-quote">
              <div className="draft-quote__eyebrow">
                <Bil kr="튜터가 가리킨 줄 · 민준의 초안 03" en="LINE TUTOR IS POINTING AT · MINJUN'S DRAFT 03" />
              </div>
              <div className="draft-quote__line">
                <span className="num">03</span>
                <span>
                  <Bil
                    kr={<>엄마는 <span className="draft-quote__line--anchor">빨리</span> 만드는데, 할머니는 <span className="draft-quote__line--anchor">천천히</span> 만든다.</>}
                    en={<>Mom makes it <span className="draft-quote__line--anchor">fast</span>. Grandma makes it <span className="draft-quote__line--anchor">slow</span>.</>}
                  />
                </span>
              </div>
            </div>

            {/* Recent convo */}
            <div className="convo">
              <ConvoMsg who="tutor"
                kr={<>잘 했어요. 한 줄만 골라봐요. 3번째 줄 — <em className="s">엄마는 빨리, 할머니는 천천히</em>. 왜 그 차이를 적었어요?</>}
                en={<>Nice. Pick one line. Line 3 — <em className="s">Mom fast, Grandma slow</em>. Why did you write that difference?</>}
              />
              <ConvoMsg who="kid"
                kr="그게 진짜 다른 점이라고 느꼈어요."
                en="Because that felt like the real difference."
                time="14:11" />
              <ConvoMsg who="tutor"
                kr={<>어떤 면에서 진짜라고 느꼈어요? 맛이 달라서? 아니면 다른 무언가?</>}
                en={<>What made it feel real? The taste? Or something else?</>}
              />
              <ConvoMsg who="kid"
                kr="음... 시간이 들어가니까요. 시간이 맛인 것 같아요."
                en="Hmm... because time goes into it. I think the time IS the taste."
                time="14:14" />
            </div>

            {/* The pending tutor turn — HITL */}
            <div className="pending">
              <div className="pending__head">
                <SumiMark size={24} tone="violet" />
                <span className="pending__label">
                  <Bil kr="튜터가 다음에 말하고 싶은 것" en="Tutor wants to say next" />
                </span>
                <HumanGate size={16} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em" }}>
                  <Bil kr="멘토 승인 필요" en="MENTOR GATE" />
                </span>
                <span className="pending__timer">
                  <Bil kr="2분 전 작성" en="DRAFTED 2 MIN AGO" />
                </span>
              </div>

              <textarea
                className="pending__draft"
                defaultValue={`그 문장 — "시간이 맛이다". 영상에서 외국인 친구가 그 한 가지를 가져가면 좋겠어요?`}
              />

              <div className="pending__why">
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--muted)", textTransform: "uppercase", alignSelf: "center" }}>
                  <Bil kr="튜터의 의도" en="TUTOR INTENT" />
                </span>
                <span className="tag"><Bil kr="민준의 비유 굳히기" en="Crystallize Minjun's metaphor" /></span>
                <span className="tag"><Bil kr="영상 핵심으로 연결" en="Link to video's core" /></span>
                <span className="tag"><Bil kr="목소리 +1" en="VOICER +1" /></span>
              </div>

              <div className="pending__actions">
                <button className="act-btn act-btn--approve">
                  <Icon name="check" size={12} />
                  <Bil kr="이대로 통과" en="Release as-is" />
                </button>
                <button className="act-btn act-btn--redirect">
                  <Icon name="pencil" size={12} />
                  <Bil kr="고쳐서 통과" en="Edit & release" />
                </button>
                <button className="act-btn act-btn--hold">
                  <Icon name="lock" size={12} />
                  <Bil kr="잡아두기" en="Hold" />
                </button>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em" }}>
                    <Bil kr="자동 통과까지" en="AUTO-RELEASE IN" />
                  </span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--coral)", fontWeight: 600, letterSpacing: ".06em" }}>04:21</span>
                </div>
              </div>

              {/* Alternatives */}
              <div style={{ marginTop: 18 }}>
                <h5 style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--muted)", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase" }}>
                  <Bil kr="다른 방향" en="Try a different angle" />
                </h5>
                <div className="pending__alts">
                  <button className="alt-row">
                    <span className="alt-key">↑</span>
                    <Bil
                      kr={<>"시간이 맛"이라는 말은 어디서 처음 떠올랐어요? 누가 한 말이에요, 아니면 너의 말이에요?</>}
                      en={<>Where did "time is the taste" first come to you? Someone else's words, or yours?</>}
                    />
                    <span className="alt-tag"><Bil kr="저자성" en="OWNERSHIP" /></span>
                  </button>
                  <button className="alt-row">
                    <span className="alt-key">↓</span>
                    <Bil
                      kr={<>만약 친구가 김치를 싫어한다면, "시간이 맛이다"는 그래도 닿을까요?</>}
                      en={<>If a friend hates kimchi — would "time is the taste" still land?</>}
                    />
                    <span className="alt-tag"><Bil kr="청중 시험" en="STRESS-TEST" /></span>
                  </button>
                  <button className="alt-row">
                    <span className="alt-key">⌥</span>
                    <Bil
                      kr={<>그 비유를 빼면, 무엇이 남아요? 같은 영상인가요?</>}
                      en={<>If you remove that metaphor — what's left? Same video?</>}
                    />
                    <span className="alt-tag"><Bil kr="제거 시험" en="SUBTRACT-TEST" /></span>
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT RAIL — signals */}
          <aside className="copilot__rail-r">
            <div className="signal-block">
              <h4><Bil kr="이 세션 신호" en="This session" /></h4>
              <div className="signal-row">
                <span className="signal-row__label"><Bil kr="단계" en="Stage" /></span>
                <span className="signal-row__val"><Bil kr="튜터 03/05" en="Tutor 03/05" /></span>
              </div>
              <div className="signal-row">
                <span className="signal-row__label"><Bil kr="튜터의 질문 수" en="Tutor Qs so far" /></span>
                <span className="signal-row__val">5</span>
              </div>
              <div className="signal-row">
                <span className="signal-row__label"><Bil kr="민준의 답변 길이" en="Avg kid reply" /></span>
                <span className="signal-row__val">14<span style={{ color: "var(--muted)" }}>w</span></span>
              </div>
              <div className="signal-row">
                <span className="signal-row__label"><Bil kr="답변 사이 침묵" en="Reply latency" /></span>
                <span className="signal-row__val">22s</span>
              </div>
              <div className="signal-row">
                <span className="signal-row__label"><Bil kr="순환 신호" en="Loop signal" /></span>
                <span className="signal-row__val signal-row__val--ok"><Bil kr="없음" en="None" /></span>
              </div>
            </div>

            <div className="signal-block">
              <h4><Bil kr="민준의 패턴" en="Pattern, Minjun" /></h4>
              <div className="read">
                <Bil
                  kr={<>은유로 빠르게 도착 → 멈춤. <em className="s">"시간이 맛이다"</em>는 의도된 문장 같음. 한 번 더 굳히고, 영상 끝에 닿게 두는 것이 적절.</>}
                  en={<>Reaches metaphor quickly → then pauses. <em className="s">"Time is the taste"</em> reads as intentional. Worth one more pass to crystallize, then let it land at video's end.</>}
                />
              </div>
            </div>

            <div className="signal-block">
              <h4><Bil kr="아키타입 영향" en="Arketype touch" /></h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <ArkBar label={{ kr: "목소리", en: "Voicer" }} val={62} delta="+1" />
                <ArkBar label={{ kr: "통합", en: "Synthesist" }} val={71} delta="+2" />
                <ArkBar label={{ kr: "표현", en: "Expresser" }} val={68} delta="0" muted />
              </div>
            </div>

            <div className="signal-block">
              <h4><Bil kr="이전 멘토 메모" en="Your last notes" /></h4>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em", marginBottom: 6 }}>
                <Bil kr="4월 22일" en="APR 22" />
              </div>
              <div className="read" style={{ fontStyle: "normal", fontFamily: "var(--serif)", fontSize: 13 }}>
                <Bil
                  kr="민준은 비유로 시작해서 거기 머문다. 세 번째 질문에서 한 번 흔들어주면, 자기 말로 다시 잡는다."
                  en="Minjun reaches for metaphor, then settles. One nudge at the third question and he re-grounds in his own words."
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ConvoMsg({ who, kr, en, time }) {
  if (who === "tutor") {
    return (
      <div className="convo-msg convo-msg--tutor">
        <SumiMark size={26} tone="ink" />
        <div className="convo-msg__bubble">
          <Bil kr={kr} en={en} />
        </div>
      </div>
    );
  }
  return (
    <div className="convo-msg convo-msg--kid">
      <div className="convo-msg__bubble">
        <Bil kr={kr} en={en} />
        {time && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginTop: 4, textAlign: "right" }}>{time}</div>}
      </div>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--paper-4)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: 11 }}>민</div>
    </div>
  );
}

function ArkBar({ label, val, delta, muted }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 32px", gap: 8, alignItems: "center", fontSize: 11 }}>
      <span style={{ fontFamily: "var(--serif)", letterSpacing: "-0.01em", color: muted ? "var(--muted)" : "var(--ink)" }}>
        <Bil kr={label.kr} en={label.en} />
      </span>
      <div style={{ height: 4, background: "var(--paper-4)", borderRadius: 4, position: "relative" }}>
        <div style={{ height: "100%", width: `${val}%`, background: muted ? "var(--muted-2)" : "var(--violet)", borderRadius: 4 }} />
      </div>
      <span className="mono" style={{ fontSize: 10, color: muted ? "var(--muted)" : (delta.startsWith("+") ? "var(--success)" : "var(--ink-2)"), textAlign: "right" }}>{delta}</span>
    </div>
  );
}

function SessionCard({ avatar, nameKr, nameEn, projectKr, projectEn, lineKr, lineEn, time, active, needsReview }) {
  const cls = "session-card" + (active ? " session-card--active" : "") + (needsReview ? " session-card--needs-review" : "");
  return (
    <div className={cls}>
      <div className="session-card__head">
        <div className="session-card__av">{avatar}</div>
        <div className="session-card__name">
          <Bil kr={nameKr} en={nameEn} />
          <span className="muted"><Bil kr={projectKr} en={projectEn} /></span>
        </div>
        <span className="session-card__time">{time}</span>
      </div>
      <div className="session-card__line">
        <Bil kr={lineKr} en={lineEn} />
      </div>
    </div>
  );
}

window.TutorCopilot = TutorCopilot;
