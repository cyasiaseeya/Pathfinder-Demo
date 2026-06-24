// screens/revise.jsx — Revise mode
// Kid edits alone. Prior tutor questions visible as anchored margin notes.
// AI is dimmed during this phase per the contract: "kid revises, not it."

function ReviseScreen() {
  const lines = [
    { kr: "할머니의 김치는 다른 김치와 맛이 다르다.", en: "Grandma's kimchi tastes different from any other kimchi.", changed: false },
    { kr: "왜냐하면 시간을 들이기 때문이다.", en: "Because she gives it time.", changed: false },
    { kr: "엄마는 빨리 만든다. 할머니는 천천히 만든다.", en: "Mom makes it fast. Grandma makes it slow.", changed: true, note: 1 },
    { kr: "그 시간이 곧 맛이다 — 빨리 익으면 진짜 맛이 안 난다.", en: "That time IS the taste — when it ferments fast, the real taste doesn't come.", changed: true, note: 2, isNew: true },
    { kr: "그래서 한국 음식은 시간을 먹는 음식이다.", en: "So Korean food is food where you eat the time.", changed: true, isNew: true, note: 3 },
  ];

  const anchors = [
    { line: 3, kr: "왜 그 차이를 적었어요?", en: "Why did you write that difference?", time: "14:11" },
    { line: 4, kr: "그 \"진짜\"의 근거는?", en: "What grounds \"real\"?", time: "14:13" },
    { line: 5, kr: "그 한 가지를 가져갔으면 해요?", en: "Want them to take that one thing?", time: "14:14" },
  ];

  return (
    <div className="frame revise">
      <Topbar tab="projects" crumb={{ kr: "혼자 고치기", en: "Revise alone" }} />
      <div className="scroll-y">
        <div className="revise__shell">
          <div className="revise__crumb">
            <div className="eyebrow"><span className="dot" /><span className="mono"><Bil kr="단계 04 · 5단계 중" en="STEP 04 OF 05" /></span></div>
            <div className="revise__crumb-title">
              <Bil
                kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요 — <span className="muted">혼자 고쳐 쓰기</span></>}
                en={<>Korean food has <em className="s">stories</em> — <span className="muted">revising alone</span></>}
              />
            </div>
            <span className="ai-chip ai-chip--locked">
              <span className="ai-chip__dot" />
              <Bil kr="튜터 잠시 자리 비움" en="Tutor stepped aside" />
            </span>
          </div>

          <div className="revise__panes">
            {/* center stage: editor with anchors in margin */}
            <section className="editor">
              <header className="editor__head">
                <div>
                  <div className="eyebrow"><Bil kr="2차 초안" en="REVISION DRAFT" /></div>
                  <h2 className="serif editor__title">
                    <Bil
                      kr={<>네 머리로 다시 짜요. <em className="s">튜터의 질문은 옆에 두고.</em></>}
                      en={<>Rebuild it in your own head. <em className="s">Keep the questions to the side.</em></>}
                    />
                  </h2>
                </div>
                <div className="editor__diff mono">
                  <span className="chip chip--mint">+2 <Bil kr="새 줄" en="new" /></span>
                  <span className="chip">~1 <Bil kr="고친 줄" en="edited" /></span>
                </div>
              </header>

              <div className="editor__body">
                <div className="editor__lines">
                  {lines.map((line, i) => (
                    <div key={i} className={"line" + (line.changed ? " line--changed" : "") + (line.isNew ? " line--new" : "")}>
                      <span className="line__no mono">{String(i + 1).padStart(2, "0")}</span>
                      <p className="line__txt">
                        <Bil kr={line.kr} en={line.en} />
                      </p>
                      {line.note && (
                        <span className="line__pin mono">Q{line.note}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* margin: tutor's questions as anchors */}
                <aside className="editor__margin">
                  <div className="eyebrow"><Bil kr="튜터의 질문 · 닻" en="TUTOR QUESTIONS · ANCHORS" /></div>
                  {anchors.map((a, i) => (
                    <div key={i} className="anchor">
                      <span className="anchor__id mono">Q{i + 1}</span>
                      <div>
                        <p className="anchor__txt"><Bil kr={a.kr} en={a.en} /></p>
                        <span className="mono anchor__time">
                          <Bil kr={`${a.time} · 줄 ${a.line}`} en={`${a.time} · LINE ${a.line}`} />
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="hairline" style={{ margin: '14px 0' }} />
                  <div className="margin-rule">
                    <Icon name="lock" size={12} />
                    <p>
                      <Bil
                        kr={<>이 단계에선 튜터가 답하지 않아요. <em className="s">고치는 건 너의 일이에요.</em></>}
                        en={<>The tutor stays quiet here. <em className="s">Revising is your work.</em></>}
                      />
                    </p>
                  </div>
                </aside>
              </div>

              <footer className="editor__foot">
                <div className="editor__counts">
                  <span className="mono"><Bil kr="단어" en="WORDS" /> · <b className="num">187</b> <span className="muted">(+45)</span></span>
                  <span className="mono"><Bil kr="고친 줄" en="EDITS" /> · <b className="num">3</b></span>
                  <span className="mono"><Bil kr="저장됨 · 14:38" en="SAVED · 14:38" /></span>
                </div>
                <div className="editor__cta">
                  <button className="btn btn--ghost"><Bil kr="튜터에게 다시 보여주기" en="Show tutor the revision" /> <Icon name="arrow" size={13} /></button>
                  <button className="btn btn--primary"><Bil kr="발표 준비하기" en="Prepare to defend" /> <Icon name="arrow" size={13} /></button>
                </div>
              </footer>
            </section>
          </div>

          {/* assurance footer */}
          <div className="revise__protocol">
            <div className="eyebrow"><Bil kr="이번 단계의 약속" en="THIS STEP'S CONTRACT" /></div>
            <p className="serif revise__pledge">
              <Bil
                kr={<>"이 글의 모든 변화는 <em className="s">너의 변화</em>다. 튜터의 제안이 아니라, 너의 결정."</>}
                en={<>"Every change in this draft is <em className="s">yours</em>. Not the tutor's suggestion — your decision."</>}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ReviseScreen = ReviseScreen;
