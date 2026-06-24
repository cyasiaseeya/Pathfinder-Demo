// screens-teacher/mobile-mentor.jsx — Mobile Mentor triage
// One-handed approval on a phone. Top card: the current pending tutor turn.
// Tap action to approve / redirect / hold. Below: progress dots of the 12 kids
// and a quick-reach inbox.

const { HumanGate, StageChip, Bil, Icon, SumiMark } = window;

function MobileMentor() {
  return (
    <div className="frame mobile-mentor">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen">

          {/* Status bar */}
          <div className="m-status mono">
            <span>9:14</span>
            <span className="m-status__r">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--coral)" }} />
                <span>4</span>
              </span>
              <span style={{ marginLeft: 8 }}>92%</span>
            </span>
          </div>

          {/* Mentor identity */}
          <div className="mm-id">
            <div className="mm-id__av">박</div>
            <div className="mm-id__txt">
              <div className="mono"><Bil kr="멘토 보기 · 수요일" en="MENTOR · WED" /></div>
              <div className="serif"><Bil kr="박서윤" en="Seoyun Park" /></div>
            </div>
            <button className="mm-bell">
              <Icon name="bell" size={14} />
              <span className="mm-bell__dot" />
            </button>
          </div>

          {/* The greeting / count */}
          <div className="mm-greet">
            <h1 className="serif">
              <Bil
                kr={<><em className="s">네 명</em>이 기다려요.</>}
                en={<><em className="s">Four kids</em> are waiting.</>}
              />
            </h1>
            <p className="mono">
              <Bil
                kr="튜터 차례 2 · 발표 게이트 1 · 잠금 해제 1"
                en="2 TUTOR · 1 GATE · 1 UNLOCK"
              />
            </p>
          </div>

          {/* Pending tutor turn — the hero card */}
          <article className="mm-pending">
            <header className="mm-pending__head">
              <SumiMark size={20} tone="violet" />
              <span className="mono mm-pending__label">
                <Bil kr="튜터가 다음에 말하고 싶은 것" en="TUTOR WANTS TO ASK" />
              </span>
              <HumanGate size={13} />
            </header>

            <div className="mm-pending__who">
              <div className="mm-pending__av">민</div>
              <div className="mm-pending__who-txt">
                <span className="serif"><Bil kr="이민준" en="Minjun Lee" /></span>
                <span className="mono"><Bil kr="초5 · 한국 음식" en="G5 · KOREAN FOOD" /></span>
              </div>
              <StageChip stage="tutor" />
            </div>

            {/* Anchor in the draft */}
            <blockquote className="mm-anchor">
              <span className="mono"><Bil kr="민준의 초안 03" en="MINJUN'S LINE 03" /></span>
              <p className="serif">
                <Bil
                  kr={<>엄마는 <em className="s">빨리</em>, 할머니는 <em className="s">천천히</em>.</>}
                  en={<>Mom <em className="s">fast</em>. Grandma <em className="s">slow</em>.</>}
                />
              </p>
            </blockquote>

            {/* The draft tutor question */}
            <div className="mm-draft">
              <p className="serif">
                <Bil
                  kr={<>그 문장 — <em className="s">"시간이 맛이다"</em>. 영상에서 외국인 친구가 그 한 가지를 가져가면 좋겠어요?</>}
                  en={<>That sentence — <em className="s">"time is the taste"</em>. Should the video take that one thing to a foreign friend?</>}
                />
              </p>
              <div className="mm-draft__why">
                <span className="mono"><Bil kr="튜터 의도 · 비유 굳히기 · Voicer +1" en="INTENT · CRYSTALLIZE METAPHOR · VOICER +1" /></span>
              </div>
            </div>

            {/* Swipe row — three large taps */}
            <div className="mm-actions">
              <button className="mm-act mm-act--approve">
                <Icon name="check" size={16} />
                <span className="serif"><Bil kr="통과" en="Release" /></span>
              </button>
              <button className="mm-act mm-act--redirect">
                <Icon name="pencil" size={16} />
                <span className="serif"><Bil kr="고치기" en="Edit" /></span>
              </button>
              <button className="mm-act mm-act--hold">
                <Icon name="lock" size={16} />
                <span className="serif"><Bil kr="잡아두기" en="Hold" /></span>
              </button>
            </div>

            {/* Stack indicator */}
            <div className="mm-stack">
              <span className="mono"><Bil kr="다음 — 연수 (튜터 루프)" en="NEXT — YEONSOO · TUTOR LOOP" /></span>
              <span className="mm-stack__dots">
                <span className="mm-stack__dot mm-stack__dot--current" />
                <span className="mm-stack__dot" />
                <span className="mm-stack__dot" />
                <span className="mm-stack__dot" />
              </span>
            </div>
          </article>

          {/* Class pulse — 12 dots */}
          <section className="mm-pulse">
            <header className="mm-pulse__head">
              <span className="mono"><Bil kr="교실 호흡" en="CLASS PULSE" /></span>
              <span className="mono mm-pulse__sub"><Bil kr="12명 중 9명 진행 중" en="9 / 12 MOVING" /></span>
            </header>
            <div className="mm-pulse__grid">
              <PulseDot kr="민" stage="tutor" hand />
              <PulseDot kr="연" stage="tutor" hand />
              <PulseDot kr="도" stage="defend" hand />
              <PulseDot kr="하" stage="draft" stuck />
              <PulseDot kr="현" stage="tutor" />
              <PulseDot kr="율" stage="revise" />
              <PulseDot kr="채" stage="arketype" hand />
              <PulseDot kr="준" stage="draft" />
              <PulseDot kr="서" stage="draft" quiet />
              <PulseDot kr="안" stage="tutor" />
              <PulseDot kr="라" stage="revise" />
              <PulseDot kr="진" stage="defend" />
            </div>
          </section>

          {/* Quick links — a couple of common reach-fors */}
          <section className="mm-quick">
            <button className="mm-quick__row">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="users" size={14} />
                <span className="serif"><Bil kr="부모 답장 대기 · 2" en="Parent replies waiting · 2" /></span>
              </span>
              <Icon name="chevron" size={14} />
            </button>
            <button className="mm-quick__row">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="target" size={14} />
                <span className="serif"><Bil kr="이번 주 계획" en="This week's plan" /></span>
              </span>
              <Icon name="chevron" size={14} />
            </button>
            <button className="mm-quick__row">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="book" size={14} />
                <span className="serif"><Bil kr="멘토 원칙 · 답을 주지 않는다" en="Mentor contract — no answers" /></span>
              </span>
              <Icon name="chevron" size={14} />
            </button>
          </section>

          {/* Home indicator */}
          <div className="m-home" />
        </div>
      </div>
    </div>
  );
}

function PulseDot({ kr, stage, hand, stuck, quiet }) {
  return (
    <div className={`pulse-dot pulse-dot--${stage} ${hand ? "pulse-dot--hand" : ""} ${stuck ? "pulse-dot--stuck" : ""} ${quiet ? "pulse-dot--quiet" : ""}`}>
      <span>{kr}</span>
      {hand && <span className="pulse-dot__hand"><HumanGate size={9} /></span>}
      {stuck && <span className="pulse-dot__flag" />}
    </div>
  );
}

window.MobileMentor = MobileMentor;
