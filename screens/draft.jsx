// screens/draft.jsx — Draft mode
// THIS IS THE EMOTIONAL CENTERPIECE. Two-pane layout: kid's draft on left,
// the "locked AI chamber" on right. Per draft progress, three states:
//   locked     — chamber is faint, ceremonial line shows
//   unlocking  — threshold met; soft glow + invitation
//   active     — chamber opened (renders compact tutor handoff card)
//
// driven by the `state` prop so the Tweaks panel can scrub between them.

function DraftScreen({ state = "locked", animationStyle = "glow" }) {
  // word counts per state — drives the threshold meter
  const wordsByState = { locked: 23, unlocking: 60, active: 142 };
  const w = wordsByState[state];

  // sample draft text — the Korean-food project
  const draftLines = [
    { kr: "할머니의 김치는 다른 김치와 맛이 다르다.", en: "Grandma's kimchi tastes different from any other kimchi." },
    { kr: "왜냐하면 시간을 들이기 때문이다.", en: "Because she gives it time." },
    { kr: "엄마는 빨리 만드는데, 할머니는 천천히 만든다.", en: "Mom makes it fast. Grandma makes it slow." },
  ];
  const visibleLines = state === "locked" ? draftLines.slice(0, 1) : draftLines;

  return (
    <div className="frame draft">
      <Topbar tab="projects" crumb={{ kr: "초안 쓰기", en: "Draft mode" }} />
      <div className="scroll-y">
        <div className="draft__shell">
          {/* Sub-nav: project context bar */}
          <div className="draft__crumb">
            <div className="eyebrow">
              <span className="dot" />
              <span className="mono">
                <Bil kr="단계 02 · 5단계 중" en="STEP 02 OF 05" />
              </span>
            </div>
            <div className="draft__crumb-title">
              <Bil
                kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요 — <span className="muted">초안 쓰기</span></>}
                en={<>Korean food has <em className="s">stories</em> — <span className="muted">drafting</span></>}
              />
            </div>
            <div className="draft__crumb-time mono">
              <Bil kr="자동 저장 · 14:08" en="AUTOSAVED · 14:08" />
            </div>
          </div>

          {/* Two-pane layout */}
          <div className={`draft__panes draft__panes--${state} draft__panes--${animationStyle}`}>
            {/* LEFT — kid's writing space */}
            <section className="draftpad">
              <header className="draftpad__head">
                <div>
                  <div className="eyebrow">
                    <Bil kr="내 초안" en="MY DRAFT" />
                  </div>
                  <h2 className="draftpad__prompt serif">
                    <Bil
                      kr={<>한 명의 외국인 친구에게, <em className="s">한 가지</em>만 기억하게 만들고 싶다면 — 그건 무엇인가요?</>}
                      en={<>If a foreign friend remembered <em className="s">one thing</em> from your video — what would it be?</>}
                    />
                  </h2>
                </div>
                <div className="draftpad__tools">
                  <button className="icon-btn"><Icon name="mic" size={14} /></button>
                  <button className="icon-btn"><Icon name="pencil" size={14} /></button>
                </div>
              </header>

              <div className="draftpad__paper">
                {visibleLines.map((line, i) => (
                  <div key={i} className="draftpad__line">
                    <span className="draftpad__lineno mono">{String(i + 1).padStart(2, "0")}</span>
                    <p className="draftpad__lineText">
                      <Bil kr={line.kr} en={line.en} />
                    </p>
                  </div>
                ))}
                {/* the cursor / next line */}
                <div className="draftpad__line draftpad__line--empty">
                  <span className="draftpad__lineno mono">{String(visibleLines.length + 1).padStart(2, "0")}</span>
                  <p className="draftpad__lineText">
                    <span className="draftpad__cursor">|</span>
                  </p>
                </div>
              </div>

              <footer className="draftpad__foot">
                <ThresholdMeter words={w} target={60} />
                <p className="draftpad__hint">
                  <Bil
                    kr={<>먼저 떠오르는 대로 적어요. <em className="s">맞춤법은 신경 쓰지 않아도 돼요.</em> 60단어쯤 쓰면 튜터와 이야기할 수 있어요.</>}
                    en={<>Just write what comes to mind first. <em className="s">Don't worry about spelling.</em> Around 60 words and you can talk to the tutor.</>}
                  />
                </p>
              </footer>
            </section>

            {/* RIGHT — the AI chamber */}
            <aside className={`chamber chamber--${state} chamber--${animationStyle}`}>
              {/* The chamber has THREE visual treatments depending on state */}

              {state === "locked" && (
                <div className="chamber__locked">
                  <div className="chamber__topline">
                    <AIStateChip state="locked" />
                    <span className="chamber__name mono">
                      <Bil kr="인지 참여 튜터" en="COGNITIVE ENGAGEMENT TUTOR" />
                    </span>
                  </div>
                  <div className="chamber__center">
                    <div className="chamber__sumi">
                      <SumiMark size={56} tone="ink" />
                      <div className="chamber__sumi-veil" />
                    </div>
                    <div className="chamber__phrase serif">
                      <Bil
                        kr={<>먼저 써보세요.<br/><em className="s">그 다음에 이야기해요.</em></>}
                        en={<>Try first.<br/><em className="s">Then we'll talk.</em></>}
                      />
                    </div>
                    <p className="chamber__sub">
                      <Bil
                        kr="튜터는 답을 주지 않아요. 질문을 줄 거예요. 그래서 먼저 내 생각을 적어보는 게 중요해요."
                        en="The tutor will not give you answers. It will ask questions. That's why drafting first matters."
                      />
                    </p>
                  </div>
                  <div className="chamber__foot">
                    <div className="chamber__contract">
                      <span className="chamber__contract-num mono">계약 · §1</span>
                      <p>
                        <Bil
                          kr={<><em className="s">"튜터는 너 대신 쓰지 않는다."</em></>}
                          en={<><em className="s">"The tutor will not write for you."</em></>}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {state === "unlocking" && (
                <div className="chamber__unlocking">
                  <div className="chamber__topline">
                    <AIStateChip state="unlocking" />
                    <span className="chamber__name mono">
                      <Bil kr="인지 참여 튜터" en="COGNITIVE ENGAGEMENT TUTOR" />
                    </span>
                  </div>
                  <div className="chamber__center">
                    <div className="chamber__sumi chamber__sumi--lit">
                      <SumiMark size={64} thinking={true} tone="ink" />
                      <div className="chamber__halo" />
                    </div>
                    <div className="chamber__phrase serif">
                      <Bil
                        kr={<>충분히 써봤어요.<br/><em className="s">이제 함께 생각해볼까요?</em></>}
                        en={<>You've drafted enough.<br/><em className="s">Now — shall we think together?</em></>}
                      />
                    </div>
                    <button className="btn btn--primary chamber__open">
                      <Bil kr="튜터에게 보여주기" en="Show the tutor" /> <Icon name="arrow" size={14} />
                    </button>
                  </div>
                  <div className="chamber__foot">
                    <p className="chamber__assurance">
                      <Bil
                        kr={<>튜터는 <em className="s">질문</em>만 해요. 답은 너 안에 있어요.</>}
                        en={<>The tutor only asks <em className="s">questions</em>. The answers stay in you.</>}
                      />
                    </p>
                  </div>
                </div>
              )}

              {state === "active" && (
                <div className="chamber__active">
                  <div className="chamber__topline">
                    <AIStateChip state="active" />
                    <span className="chamber__name mono">
                      <Bil kr="인지 참여 튜터" en="COGNITIVE ENGAGEMENT TUTOR" />
                    </span>
                  </div>
                  <div className="chamber__active-body">
                    <div className="active-msg active-msg--tutor">
                      <SumiMark size={28} tone="ink" thinking />
                      <div className="active-msg__bubble">
                        <p className="serif">
                          <Bil
                            kr={<>잘 했어요. 한 줄만 골라봐요. <em className="s">3번째 줄 — 엄마는 빨리, 할머니는 천천히.</em> 왜 그 차이를 적었어요?</>}
                            en={<>Nice. Pick one line. <em className="s">Line 3 — Mom fast, Grandma slow.</em> Why did you write that difference?</>}
                          />
                        </p>
                      </div>
                    </div>
                    <button className="btn btn--primary chamber__continue">
                      <Bil kr="대화 이어서" en="Continue talking" /> <Icon name="arrow" size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ambient: faint grid texture inside the chamber */}
              <div className="chamber__grid-tex" aria-hidden="true" />
            </aside>
          </div>

          {/* Footer rule — protocol reminder */}
          <div className="draft__protocol">
            <div className="draft__protocol-item">
              <span className="mono"><Bil kr="원칙 · 01" en="PROTOCOL · 01" /></span>
              <p><Bil kr="먼저 쓰기. 그 다음에 도움 받기." en="Draft first. Get help second." /></p>
            </div>
            <div className="draft__protocol-item">
              <span className="mono"><Bil kr="원칙 · 02" en="PROTOCOL · 02" /></span>
              <p><Bil kr="튜터는 질문만. 답은 안 줌." en="Tutor asks. It does not answer." /></p>
            </div>
            <div className="draft__protocol-item">
              <span className="mono"><Bil kr="원칙 · 03" en="PROTOCOL · 03" /></span>
              <p><Bil kr="고치는 건 너." en="You revise. Not it." /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.DraftScreen = DraftScreen;
