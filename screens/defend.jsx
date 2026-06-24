// screens/defend.jsx — Defend & Reflect
// Two halves: peer/mentor feedback capture (top), 3-prompt journal (bottom).
// Closes the loop. Quiet aesthetic, no XP.

function DefendScreen() {
  return (
    <div className="frame defend">
      <Topbar tab="projects" crumb={{ kr: "발표·성찰", en: "Defend & reflect" }} />
      <div className="scroll-y">
        <div className="defend__shell">
          <div className="defend__crumb">
            <div className="eyebrow"><span className="dot" /><span className="mono"><Bil kr="단계 05 · 5단계 중" en="STEP 05 OF 05" /></span></div>
            <div className="defend__crumb-title">
              <Bil
                kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요 — <span className="muted">발표와 성찰</span></>}
                en={<>Korean food has <em className="s">stories</em> — <span className="muted">defend and reflect</span></>}
              />
            </div>
            <span className="chip chip--mint"><Icon name="check" size={12} /> <Bil kr="고리 닫기" en="Closing the loop" /></span>
          </div>

          {/* Top — Defend (peer + mentor feedback) */}
          <section className="defend__top">
            <header className="sec-head">
              <span className="no">B · 01</span>
              <h2><Bil kr={<>너의 작업을 <em className="s">지키기</em></>} en={<>Defend your <em className="s">work</em></>} /></h2>
              <span className="tag"><Bil kr="짝과 멘토에게 보여주고, 한 가지 질문에 답해보세요." en="Show a peer and your mentor. Answer one question each." /></span>
            </header>

            <div className="defend__panel">
              {/* artifact summary */}
              <aside className="artifact">
                <div className="eyebrow"><Bil kr="내 작업물" en="YOUR ARTIFACT" /></div>
                <div className="artifact__thumb">
                  <span className="artifact__dur mono">3:00</span>
                  <button className="artifact__play"><Icon name="play" size={14} /></button>
                </div>
                <h3 className="serif artifact__claim">
                  <Bil
                    kr={<><em className="s">"시간이 맛이다."</em></>}
                    en={<><em className="s">"Time is the taste."</em></>}
                  />
                </h3>
                <p className="artifact__sub">
                  <Bil
                    kr="3분 영상 · 김치, 할머니, 시간"
                    en="3-min video · kimchi, grandma, time"
                  />
                </p>
                <div className="artifact__meta mono">
                  <span><Bil kr="단어 187" en="187 WORDS" /></span>
                  <span>·</span>
                  <span><Bil kr="고친 줄 3" en="3 EDITS" /></span>
                  <span>·</span>
                  <span><Bil kr="튜터와의 질문 5" en="5 TUTOR QS" /></span>
                </div>
              </aside>

              {/* feedback intake */}
              <div className="feedback">
                <div className="feedback__col">
                  <div className="fb-head">
                    <div className="fb-av fb-av--peer">연</div>
                    <div>
                      <div className="fb-name"><Bil kr="짝꿍 · 김연수" en="Peer · Yeonsoo K." /></div>
                      <div className="fb-sub mono"><Bil kr="초5 · 서울" en="G5 · SEOUL" /></div>
                    </div>
                  </div>
                  <div className="fb-q">
                    <span className="fb-q__label mono"><Bil kr="짝의 한 가지 질문" en="ONE QUESTION FROM PEER" /></span>
                    <p className="serif fb-q__text">
                      <Bil
                        kr={<>"<em className="s">시간이 맛이다</em>"는 마지막에 와야 해, 처음에 와야 해?</>}
                        en={<>Should "<em className="s">time is the taste</em>" come at the end or the beginning?</>}
                      />
                    </p>
                  </div>
                  <div className="fb-a">
                    <span className="fb-q__label mono"><Bil kr="너의 답" en="YOUR ANSWER" /></span>
                    <textarea className="fb-textarea serif" defaultValue={"마지막. 처음엔 그냥 김치 얘기로 시작하고, 마지막에 \"시간이 맛이다\"가 들리면 더 무게가 있을 것 같아."}/>
                  </div>
                </div>

                <div className="feedback__col">
                  <div className="fb-head">
                    <div className="fb-av fb-av--mentor">박</div>
                    <div>
                      <div className="fb-name"><Bil kr="멘토 · 박서윤" en="Mentor · Seoyun P." /></div>
                      <div className="fb-sub mono"><Bil kr="Ark Academy" en="ARK ACADEMY" /></div>
                    </div>
                  </div>
                  <div className="fb-q">
                    <span className="fb-q__label mono"><Bil kr="멘토의 한 가지 질문" en="ONE QUESTION FROM MENTOR" /></span>
                    <p className="serif fb-q__text">
                      <Bil
                        kr={<>외국인 친구가 김치를 안 좋아한다면, 그래도 <em className="s">시간이 맛이다</em>가 통할까?</>}
                        en={<>If the friend dislikes kimchi — does <em className="s">"time is the taste"</em> still land?</>}
                      />
                    </p>
                  </div>
                  <div className="fb-a">
                    <span className="fb-q__label mono"><Bil kr="너의 답" en="YOUR ANSWER" /></span>
                    <textarea className="fb-textarea serif" defaultValue={"통할 것 같아요. 김치 자체보다 시간 들이는 마음이 더 중요한 이야기니까요."}/>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom — Reflect (3-prompt journal) */}
          <section className="defend__bottom">
            <header className="sec-head">
              <span className="no">B · 02</span>
              <h2><Bil kr={<>세 줄 <em className="s">성찰</em></>} en={<>Three-line <em className="s">reflection</em></>} /></h2>
              <span className="tag"><Bil kr="채점되지 않아요. 너만 보는 글이에요." en="Not graded. Only you see this." /></span>
            </header>

            <ol className="journal">
              <li className="journal__item">
                <span className="journal__no mono">01</span>
                <div className="journal__body">
                  <h3 className="journal__prompt serif">
                    <Bil
                      kr="이번에 가장 어려웠던 한 순간은?"
                      en="The one moment that was hardest this week?"
                    />
                  </h3>
                  <textarea className="journal__txt serif" defaultValue={"튜터가 답을 안 줄 때 처음엔 답답했어. 그런데 두 번째 질문 — \"무엇이 진짜라고 느꼈어요?\" — 거기서 멈춰서 한참 생각했어. 그 한 줄에서 \"시간이 맛이다\"가 나왔어."}/>
                </div>
              </li>
              <li className="journal__item">
                <span className="journal__no mono">02</span>
                <div className="journal__body">
                  <h3 className="journal__prompt serif">
                    <Bil
                      kr="튜터의 어떤 질문이 너를 가장 멀리 데려갔어?"
                      en="Which tutor question took you the furthest?"
                    />
                  </h3>
                  <textarea className="journal__txt serif" defaultValue={"\"외국인 친구가 그 한 가지를 가져갔으면 해요?\" 그 질문 덕분에 나는 \"한 가지\"가 정말 뭔지 다시 정해야 했어."}/>
                </div>
              </li>
              <li className="journal__item">
                <span className="journal__no mono">03</span>
                <div className="journal__body">
                  <h3 className="journal__prompt serif">
                    <Bil
                      kr="다음에는 무엇을 다르게 해보고 싶어?"
                      en="What do you want to do differently next time?"
                    />
                  </h3>
                  <textarea className="journal__txt serif" defaultValue={"초안을 더 빨리 끝내고 튜터한테 더 많이 보여주고 싶어. 한 번 말고 두 번. 그리고 영상에서 할머니 목소리도 진짜로 녹음하고 싶어."}/>
                </div>
              </li>
            </ol>

            <div className="defend__close">
              <p className="serif defend__close-txt">
                <Bil
                  kr={<>이 프로젝트의 고리가 닫혔어요. <em className="s">너의 글, 너의 결정, 너의 변화.</em></>}
                  en={<>The loop on this project has closed. <em className="s">Your writing. Your decisions. Your change.</em></>}
                />
              </p>
              <button className="btn btn--primary"><Bil kr="다음 프로젝트 고르기" en="Pick next project" /> <Icon name="arrow" size={14} /></button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
window.DefendScreen = DefendScreen;
