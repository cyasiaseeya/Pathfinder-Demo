// parent/letter.jsx — Friday Letter
// The parent receives the weekly letter from their child's mentor.
// This is the *parent-side counterpart* of the Parent Bridge on the
// Teacher Portal. Reads like a real letter, with the mentor's
// hand-added line called out, and a one-tap reply.

function PPLetter({ activeKid = 'minjun' }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  const kid = ppKids.find(k => k.id === activeKid) || ppKids[0];

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">

        <div className="pp-letter__crumb">
          <button className="pp-letter__back" onClick={() => nav.goTo('home')}>
            <Icon name="arrowL" size={16} />
          </button>
          <div className="mono">
            <Bil kr="이번 주 편지 · 4월 24일 (금)" en="THIS WEEK · FRI APR 24" />
          </div>
          <span className="pp-letter__seal mono">
            <Bil kr="멘토 직접" en="MENTOR'S HAND" />
          </span>
        </div>

        <article className="pp-letter">

          {/* Envelope flap */}
          <header className="pp-letter__head">
            <div className="pp-letter__from">
              <div className="pp-letter__from-av">박</div>
              <div>
                <div className="pp-letter__from-name">
                  <Bil kr="박서윤 멘토에게서" en="From Mentor Seoyun Park" />
                </div>
                <div className="pp-letter__from-meta mono">
                  <Bil kr="박지윤 어머님 · 박도원 아버님께" en="To Jiyoon Park · Dowon Lee" />
                </div>
              </div>
            </div>
            <div className="pp-letter__week mono">
              <span><Bil kr="4주차" en="WEEK 04" /></span>
            </div>
          </header>

          {/* Letter body */}
          <div className="pp-letter__body">
            <p className="pp-letter__opener">
              <Bil
                kr={<>안녕하세요, 어머님.</>}
                en={<>Hello,</>}
              />
            </p>

            <p>
              <Bil
                kr={<>이번 주에 민준이는 자기가 만든 한 문장에 도착했어요. <em className="s">"시간이 맛이다."</em> 처음에 튜터가 제안한 비유가 아니라 — 민준이 본인이 만든 말이에요.</>}
                en={<>This week Minjun arrived at a sentence of his own. <em className="s">"Time is the taste."</em> Not a metaphor the tutor offered — words he made himself.</>}
              />
            </p>

            <p>
              <Bil
                kr={<>김치를 만드는 엄마와 할머니의 차이를 영상에서 짚으면서 — '빠르다 / 천천히'를 거쳐 '시간'으로 도약했어요. 4주 동안 처음 보는 도약이에요.</>}
                en={<>Tracing how mom and grandma each make kimchi, he passed through fast/slow and leapt to time itself. The first leap of its kind in four weeks.</>}
              />
            </p>

            {/* The mentor's hand-added paragraph — the personal line */}
            <aside className="pp-letter__hand">
              <span className="pp-letter__hand-label mono">
                <Bil kr="이번 주 특별히 한 줄" en="A LINE JUST FOR YOU" />
              </span>
              <p>
                <Bil
                  kr={<>지난번에 어머님께서 <em className="s">"민준이가 자기 의견을 잘 안 말한다"</em>고 하셨던 게 떠올라요. 이번 주에 그 의견이 — <em className="s">한 줄</em>로 — 나왔어요.</>}
                  en={<>I keep thinking of what you told me last time — <em className="s">"Minjun doesn't say what he thinks."</em> This week, what he thinks came out — <em className="s">in one sentence</em>.</>}
                />
              </p>
            </aside>

            <p>
              <Bil
                kr={<>금요일 의례에서 본인이 직접 영상을 보여드릴 거예요. 약 15분, 도서관 작은 방, 오후 4시 30분. 두 분 다 환영합니다.</>}
                en={<>He'll show you the video himself at Friday's ceremony. About 15 min, small library room, 4:30 PM. Both of you very welcome.</>}
              />
            </p>

            <p className="pp-letter__signoff">
              <Bil kr="박서윤 드림" en="With care, Seoyun" />
            </p>
          </div>

          {/* Embedded artifact — the one-line claim */}
          <div className="pp-letter__claim">
            <span className="mono"><Bil kr="민준이 영상 마지막 줄" en="MINJUN'S FINAL LINE" /></span>
            <h3>
              <Bil
                kr={<>"시간이 맛이다."</>}
                en={<>"Time is the taste."</>}
              />
            </h3>
            <button className="pp-letter__play">
              <Icon name="play" size={12} />
              <Bil kr="2분 47초 영상 보기" en="Watch · 2:47" />
            </button>
          </div>

          {/* Arketype line — the shift this week */}
          <div className="pp-letter__shift">
            <div className="pp-letter__shift-head mono">
              <Bil kr="Ark Reactor가 본 변화" en="WHAT REACTOR SAW" />
            </div>
            <div className="pp-letter__shift-row">
              <span className="serif"><Bil kr="목소리" en="Voicer" /></span>
              <span className="pp-letter__shift-bar">
                <span className="pp-letter__shift-fill" style={{ left: '60%', width: '12%' }} />
                <span className="pp-letter__shift-was" style={{ left: '60%' }} />
                <span className="pp-letter__shift-now" style={{ left: '72%' }} />
              </span>
              <span className="pp-letter__shift-delta">+12</span>
            </div>
            <p className="muted">
              <Bil
                kr={<>4주 중 가장 큰 변화. 멘토가 함께 검토 후 반영됨.</>}
                en={<>Largest shift in four weeks. Released after mentor review.</>}
              />
            </p>
          </div>

          {/* Reply affordance */}
          <div className="pp-letter__reply">
            <div className="pp-letter__reply-head mono">
              <Bil kr="짧게 답장 — 멘토에게" en="A SHORT REPLY · TO MENTOR" />
            </div>
            <div className="pp-letter__reply-choices">
              <button className="pp-letter__reply-choice">
                <Bil kr="💛 고맙습니다" en="💛 Thank you" />
              </button>
              <button className="pp-letter__reply-choice">
                <Bil kr="금요일에 뵐게요" en="See you Friday" />
              </button>
              <button className="pp-letter__reply-choice">
                <Bil kr="질문이 있어요" en="I have a question" />
              </button>
            </div>
            <button className="pp-letter__reply-open" onClick={() => nav.goTo('msg')}>
              <Bil kr="대화 열기" en="Open conversation" />
              <Icon name="arrow" size={12} />
            </button>
          </div>

          {/* Footer */}
          <footer className="pp-letter__foot mono">
            <Bil kr="Ark Academy · 5학년 · 박서윤 멘토" en="Ark Academy · G5 · Mentor Seoyun" />
          </footer>
        </article>

        {/* Past letters peek */}
        <section className="pp-letter__past">
          <h4 className="mono">
            <Bil kr="지난 편지" en="PAST LETTERS" />
          </h4>
          <div className="pp-letter__past-row">
            <PastLetter weekKr="3주차" weekEn="WEEK 03" dateKr="4월 17일" dateEn="APR 17"
              snipKr="튜터의 질문에 처음으로 되물었어요…"
              snipEn="First time he asked back at the tutor…" />
            <PastLetter weekKr="2주차" weekEn="WEEK 02" dateKr="4월 10일" dateEn="APR 10"
              snipKr="조용했지만 매일 두 줄씩 썼어요…"
              snipEn="Quiet, but two lines every day…" />
            <PastLetter weekKr="1주차" weekEn="WEEK 01" dateKr="4월 3일" dateEn="APR 3"
              snipKr="프로젝트를 고르는 데 시간이 걸렸어요…"
              snipEn="Took his time choosing a project…" />
          </div>
        </section>

      </div>
      <PPTabBar active="home" />
    </div>
  );
}

function PastLetter({ weekKr, weekEn, dateKr, dateEn, snipKr, snipEn }) {
  return (
    <button className="pp-letter__past-card">
      <div className="pp-letter__past-week mono">
        <span><Bil kr={weekKr} en={weekEn} /></span>
        <span style={{ opacity: 0.5 }}><Bil kr={dateKr} en={dateEn} /></span>
      </div>
      <p className="serif">
        <Bil kr={snipKr} en={snipEn} />
      </p>
    </button>
  );
}

window.PPLetter = PPLetter;
