// screens/tutor.jsx — Tutor interaction (Socratic chat with draft alongside)
// Three-pane: kid's draft (left, lighter), conversation (center, primary),
// session ledger (right, mono). The tutor's sumi mark appears beside every
// tutor message. Tutor voice mode (gentle/playful/formal) shifts copy.

const TUTOR_VOICES = {
  gentle: {
    label: { kr: "차분한 말투", en: "Gentle voice" },
    msgs: [
      { who: "tutor", txt: { kr: "잘 했어요. 한 줄만 골라봐요. 3번째 줄 — 엄마는 빨리, 할머니는 천천히. 왜 그 차이를 적었어요?", en: "Nice. Pick one line. Line 3 — Mom fast, Grandma slow. Why did you write that difference?" } },
      { who: "kid",   txt: { kr: "그게 진짜 다른 점이라고 느꼈어요.", en: "Because that felt like the real difference." } },
      { who: "tutor", txt: { kr: "어떤 면에서 진짜라고 느꼈어요? 맛이 달라서? 아니면 다른 무언가?", en: "What made it feel real? The taste? Or something else?" } },
      { who: "kid",   txt: { kr: "음... 시간이 들어가니까요. 시간이 맛인 것 같아요.", en: "Hmm... because time goes into it. I think the time IS the taste." } },
      { who: "tutor", txt: { kr: "그 문장 — \"시간이 맛이다\". 영상에서 외국인 친구가 그 한 가지를 가져가면 좋겠어요?", en: "That sentence — \"time is the taste\". Is that the one thing you want the foreign friend to take away?" } },
    ]
  },
  playful: {
    label: { kr: "장난스런 말투", en: "Playful voice" },
    msgs: [
      { who: "tutor", txt: { kr: "오, 3번째 줄에 비밀이 있는 것 같은데요. 엄마는 빨리, 할머니는 천천히 — 왜 거기에 줄 친 거예요?", en: "Hmm, line 3 looks like it's hiding something. Mom fast, Grandma slow — why'd you underline that one?" } },
      { who: "kid",   txt: { kr: "그게 진짜 다른 점이라고 느꼈어요.", en: "Because that felt like the real difference." } },
      { who: "tutor", txt: { kr: "\"진짜 다른 점\". 좋아요 — 만약 그게 시간이 아니었으면, 뭐였을까요?", en: "\"The real difference.\" Cool — if it weren't time, what would it have been?" } },
      { who: "kid",   txt: { kr: "음... 시간이 들어가니까요. 시간이 맛인 것 같아요.", en: "Hmm... because time goes into it. I think the time IS the taste." } },
      { who: "tutor", txt: { kr: "오. \"시간이 맛이다\". 그 문장 가져갈래요? 영상 끝에 한 번 더 들리면 어떻겠어요?", en: "Oh. \"Time is the taste.\" Want to keep that one? Imagine it landing again at the end of the video." } },
    ]
  },
  formal: {
    label: { kr: "또렷한 말투", en: "Formal voice" },
    msgs: [
      { who: "tutor", txt: { kr: "3번째 문장에 주목해 봅시다. 엄마와 할머니의 차이를 시간으로 표현했군요. 의도한 비교인가요?", en: "Let's focus on sentence 3. You expressed the difference between Mom and Grandma in terms of time. Was the comparison intentional?" } },
      { who: "kid",   txt: { kr: "그게 진짜 다른 점이라고 느꼈어요.", en: "Because that felt like the real difference." } },
      { who: "tutor", txt: { kr: "그 \"진짜\"의 근거는 무엇입니까? 관찰입니까, 짐작입니까?", en: "What grounds the word \"real\" here? Observation, or inference?" } },
      { who: "kid",   txt: { kr: "음... 시간이 들어가니까요. 시간이 맛인 것 같아요.", en: "Hmm... because time goes into it. I think the time IS the taste." } },
      { who: "tutor", txt: { kr: "\"시간이 맛이다.\" 이 단언을 영상의 핵심 진술로 삼을 의향이 있습니까?", en: "\"Time is the taste.\" Are you prepared to position that as the central claim of your video?" } },
    ]
  },
};

function TutorScreen({ voice = "gentle", thinking = false }) {
  const v = TUTOR_VOICES[voice] || TUTOR_VOICES.gentle;

  return (
    <div className="frame tutor">
      <Topbar tab="projects" crumb={{ kr: "튜터와 대화", en: "Talk to tutor" }} />
      <div className="scroll-y">
        <div className="tutor__shell">
          <div className="tutor__crumb">
            <div className="eyebrow"><span className="dot" /><span className="mono"><Bil kr="단계 03 · 5단계 중" en="STEP 03 OF 05" /></span></div>
            <div className="tutor__crumb-title">
              <Bil
                kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요 — <span className="muted">튜터와 대화</span></>}
                en={<>Korean food has <em className="s">stories</em> — <span className="muted">talk to tutor</span></>}
              />
            </div>
            <AIStateChip state="active" />
          </div>

          <div className="tutor__panes">
            {/* LEFT — kid's draft, lightly held */}
            <aside className="tutor-draft">
              <header className="tutor-draft__head">
                <div className="eyebrow"><Bil kr="내 초안" en="MY DRAFT" /></div>
                <button className="tab-mini"><Bil kr="고치기" en="Edit" /></button>
              </header>
              <div className="tutor-draft__paper">
                <p className="tutor-draft__line"><span className="mono">01</span><Bil kr="할머니의 김치는 다른 김치와 맛이 다르다." en="Grandma's kimchi tastes different from any other kimchi." /></p>
                <p className="tutor-draft__line"><span className="mono">02</span><Bil kr="왜냐하면 시간을 들이기 때문이다." en="Because she gives it time." /></p>
                <p className="tutor-draft__line tutor-draft__line--anchor">
                  <span className="mono">03</span>
                  <Bil kr="엄마는 빨리 만드는데, 할머니는 천천히 만든다." en="Mom makes it fast. Grandma makes it slow." />
                  <span className="anchor-pin"><Icon name="quote" size={12} /></span>
                </p>
                <p className="tutor-draft__line"><span className="mono">04</span><Bil kr="한국 음식은 시간이 들어간 음식이다." en="Korean food is food with time in it." /></p>
                <p className="tutor-draft__line tutor-draft__line--mute"><span className="mono">05</span><Bil kr="..." en="..." /></p>
              </div>
              <footer className="tutor-draft__foot">
                <span className="mono"><Bil kr="단어 142 · 자동 저장" en="142 WORDS · AUTOSAVED" /></span>
              </footer>
            </aside>

            {/* CENTER — conversation */}
            <section className="tutor-chat">
              <header className="tutor-chat__head">
                <div className="tutor-chat__id">
                  <SumiMark size={32} thinking={thinking} tone="ink" />
                  <div>
                    <div className="tutor-chat__name serif">
                      <Bil kr="인지 참여 튜터" en="Cognitive Engagement Tutor" />
                    </div>
                    <div className="tutor-chat__sub mono">
                      <Bil kr={"질문만 합니다 · " + v.label.kr} en={"Asks only · " + v.label.en} />
                    </div>
                  </div>
                </div>
                <div className="tutor-chat__contract">
                  <span className="mono"><Bil kr="원칙" en="CONTRACT" /></span>
                  <p>
                    <Bil
                      kr={<><em className="s">"답을 주지 않는다. 질문만 한다."</em></>}
                      en={<><em className="s">"No answers. Only questions."</em></>}
                    />
                  </p>
                </div>
              </header>

              <div className="tutor-chat__stream">
                {v.msgs.map((m, i) => (
                  <div key={i} className={`msg msg--${m.who}`}>
                    {m.who === "tutor" && <div className="msg__mark"><SumiMark size={28} tone="ink" /></div>}
                    <div className="msg__bubble">
                      <p><Bil kr={m.txt.kr} en={m.txt.en} /></p>
                    </div>
                    {m.who === "kid" && <div className="msg__time mono">14:1{i}</div>}
                  </div>
                ))}
                {thinking && (
                  <div className="msg msg--tutor msg--thinking">
                    <div className="msg__mark"><SumiMark size={28} tone="ink" thinking /></div>
                    <div className="msg__bubble msg__bubble--ghost">
                      <span className="dotdot"><span /><span /><span /></span>
                    </div>
                  </div>
                )}
              </div>

              <footer className="tutor-chat__compose">
                <div className="compose">
                  <span className="compose__prompt mono"><Bil kr="너의 답" en="YOUR REPLY" /></span>
                  <input className="compose__input" placeholder={'"시간이 맛이다"를 영상 처음에 넣을지, 끝에 넣을지 고민 중이에요.'} />
                  <button className="btn btn--primary"><Icon name="arrow" size={14} /></button>
                </div>
                <div className="compose__hint">
                  <Icon name="lock" size={12} />
                  <span>
                    <Bil
                      kr={<>튜터는 <em className="s">너 대신 쓰지 않아요</em>. "써줘" 같은 부탁은 받지 않아요.</>}
                      en={<>The tutor will not <em className="s">write for you</em>. Requests to "write it for me" are declined.</>}
                    />
                  </span>
                </div>
              </footer>
            </section>

            {/* RIGHT — session ledger */}
            <aside className="tutor-ledger">
              <header className="ledger__head">
                <div className="eyebrow"><Bil kr="이 대화에서" en="FROM THIS TALK" /></div>
              </header>

              <div className="ledger__group">
                <span className="mono ledger__k"><Bil kr="튜터의 질문" en="TUTOR'S QUESTIONS" /></span>
                <ol className="ledger__list">
                  <li><Bil kr={"왜 그 차이를 적었어요?"} en={"Why did you write that difference?"} /></li>
                  <li><Bil kr={"어떤 면에서 진짜라고 느꼈어요?"} en={"What made it feel real?"} /></li>
                  <li><Bil kr={"외국인 친구가 그 한 가지를 가져갔으면 해요?"} en={"Should the friend take that one thing?"} /></li>
                </ol>
              </div>

              <div className="ledger__group">
                <span className="mono ledger__k"><Bil kr="네가 발견한 것" en="WHAT YOU FOUND" /></span>
                <p className="ledger__find serif">
                  <Bil
                    kr={<><em className="s">"시간이 맛이다."</em></>}
                    en={<><em className="s">"Time is the taste."</em></>}
                  />
                </p>
                <span className="ledger__caption mono">
                  <Bil kr="너의 말 · 14:14" en="YOUR WORDS · 14:14" />
                </span>
              </div>

              <div className="ledger__group">
                <span className="mono ledger__k"><Bil kr="다음 단계" en="NEXT" /></span>
                <p className="ledger__next">
                  <Bil
                    kr="이 대화를 닫고 혼자 고쳐 써보기. 튜터는 잠시 자리를 비킬 거예요."
                    en="Close this and revise alone. The tutor will step aside."
                  />
                </p>
                <button className="btn btn--ghost ledger__cta">
                  <Bil kr="혼자 고치러 가기" en="Go revise alone" /> <Icon name="arrow" size={13} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
window.TutorScreen = TutorScreen;
