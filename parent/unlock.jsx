// parent/unlock.jsx — Unlock Invitation
// The parent receives an invitation to the kid's Unlock ceremony.
// Parent-side counterpart of the Teacher Portal's "Unlock Approval."
// The mentor has signed off; this is the family's invite + RSVP.

function PPUnlock({ activeKid = 'minjun' }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  const kid = ppKids.find(k => k.id === activeKid) || ppKids[0];
  const [rsvp, setRsvp] = React.useState(null);

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">

        <div className="pp-letter__crumb">
          <button className="pp-letter__back" onClick={() => nav.goTo('home')}>
            <Icon name="arrowL" size={16} />
          </button>
          <div className="mono">
            <Bil kr="잠금 해제 의례 초대" en="UNLOCK CEREMONY · INVITE" />
          </div>
        </div>

        {/* Ceremonial hero card */}
        <div className="pp-unlock__hero">
          <div className="pp-unlock__seal">
            <div className="pp-unlock__seal-ring">
              <span className="serif">{kid.initial}</span>
            </div>
            <span className="pp-unlock__seal-week mono">
              <Bil kr="4주차" en="WEEK 04" />
            </span>
          </div>

          <div className="pp-unlock__kicker mono">
            <span className="dot" />
            <Bil kr="민준이가 도착했어요" en="MINJUN HAS ARRIVED" />
          </div>

          <h1 className="pp-unlock__h">
            <Bil
              kr={<>이번 주, 민준이가 <em className="s">자기 한 문장</em>에 도착했어요.</>}
              en={<>This week, Minjun arrived at a <em className="s">sentence of his own</em>.</>}
            />
          </h1>
          <p className="pp-unlock__sub">
            <Bil
              kr="잠금 해제 의례는 약 15분간 진행돼요. 민준이가 직접 작업을 보여드리고, 한 문장을 부모님께 읽어드립니다. 가족 모두 환영합니다."
              en="The unlock ceremony takes about 15 minutes. Minjun will show you his work himself and read his sentence aloud to you. The whole family is welcome."
            />
          </p>
        </div>

        {/* The when/where details */}
        <div className="pp-unlock__details">
          <div className="pp-unlock__detail">
            <span className="pp-unlock__detail-label mono">
              <Bil kr="언제" en="WHEN" />
            </span>
            <span className="serif">
              <Bil kr="5월 1일 (금) 오후 4:30" en="Fri, May 1 · 4:30 PM" />
            </span>
            <span className="mono muted">
              <Bil kr="약 15분" en="ABOUT 15 MIN" />
            </span>
          </div>
          <div className="pp-unlock__detail">
            <span className="pp-unlock__detail-label mono">
              <Bil kr="어디서" en="WHERE" />
            </span>
            <span className="serif">
              <Bil kr="학교 도서관 · 작은 방" en="Library · small room" />
            </span>
            <span className="mono muted">
              <Bil kr="3층 · 안내 있어요" en="3F · signs posted" />
            </span>
          </div>
          <div className="pp-unlock__detail">
            <span className="pp-unlock__detail-label mono">
              <Bil kr="누가" en="WHO" />
            </span>
            <span className="serif">
              <Bil kr="민준 · 가족 · 박서윤 멘토" en="Minjun · Family · Mentor Seoyun" />
            </span>
            <span className="mono muted">
              <Bil kr="짝꿍 한 명도 함께" en="ONE PEER ATTENDS TOO" />
            </span>
          </div>
        </div>

        {/* What to expect — the part parents are nervous about */}
        <section className="pp-unlock__expect">
          <h3 className="mono">
            <Bil kr="무엇을 기대하면 좋을까요" en="WHAT TO EXPECT" />
          </h3>
          <ol className="pp-unlock__expect-list">
            <li>
              <span className="pp-unlock__expect-n mono">01</span>
              <p>
                <Bil
                  kr={<>민준이가 작업 영상을 보여줍니다 — <em className="s">2분 47초</em>.</>}
                  en={<>Minjun shows his work — <em className="s">2:47</em>.</>}
                />
              </p>
            </li>
            <li>
              <span className="pp-unlock__expect-n mono">02</span>
              <p>
                <Bil
                  kr={<>멘토가 미리 준비된 <em className="s">한 가지 질문</em>을 합니다.</>}
                  en={<>The mentor asks his <em className="s">one prepared question</em>.</>}
                />
              </p>
            </li>
            <li>
              <span className="pp-unlock__expect-n mono">03</span>
              <p>
                <Bil
                  kr={<>민준이 자기 문장을 부모님께 <em className="s">직접</em> 읽어드립니다.</>}
                  en={<>Minjun reads his sentence to you <em className="s">himself</em>.</>}
                />
              </p>
            </li>
            <li>
              <span className="pp-unlock__expect-n mono">04</span>
              <p>
                <Bil
                  kr={<>가족 한 분이 종이 한 장에 <em className="s">기억할 한 문장</em>을 적어 가져갑니다.</>}
                  en={<>One family member takes home a single line — written by hand.</>}
                />
              </p>
            </li>
          </ol>
        </section>

        {/* Parent's role — the gentle "stay out of the way" advice */}
        <section className="pp-unlock__role">
          <div className="pp-unlock__role-head">
            <SumiMark size={22} tone="violet" />
            <span className="mono"><Bil kr="부모님의 역할" en="YOUR ROLE" /></span>
          </div>
          <p>
            <Bil
              kr={<>의례 동안 부모님은 <em className="s">듣는 사람</em>이에요. 질문은 의례가 끝나고, 집에 돌아온 뒤 — 차 한 잔 마시면서.</>}
              en={<>During the ceremony, you are the <em className="s">listener</em>. Questions afterwards — over tea, at home.</>}
            />
          </p>
        </section>

        {/* RSVP */}
        <section className="pp-unlock__rsvp">
          <h3 className="mono">
            <Bil kr="참석 회신" en="RSVP" />
          </h3>
          <div className="pp-unlock__rsvp-grid">
            <button
              className={"pp-unlock__rsvp-btn pp-unlock__rsvp-btn--yes" + (rsvp === 'yes' ? " is-on" : "")}
              onClick={() => setRsvp('yes')}>
              <span className="serif"><Bil kr="둘 다 갑니다" en="Both of us" /></span>
              <span className="mono muted"><Bil kr="어머니 + 아버지" en="MOM + DAD" /></span>
            </button>
            <button
              className={"pp-unlock__rsvp-btn pp-unlock__rsvp-btn--one" + (rsvp === 'one' ? " is-on" : "")}
              onClick={() => setRsvp('one')}>
              <span className="serif"><Bil kr="한 명만" en="One of us" /></span>
              <span className="mono muted"><Bil kr="회신 후 결정" en="DECIDE AFTER REPLY" /></span>
            </button>
            <button
              className={"pp-unlock__rsvp-btn pp-unlock__rsvp-btn--more" + (rsvp === 'more' ? " is-on" : "")}
              onClick={() => setRsvp('more')}>
              <span className="serif"><Bil kr="할머니도 함께" en="Grandma too" /></span>
              <span className="mono muted"><Bil kr="가족 3명+" en="3+ FAMILY" /></span>
            </button>
            <button
              className={"pp-unlock__rsvp-btn pp-unlock__rsvp-btn--no" + (rsvp === 'no' ? " is-on" : "")}
              onClick={() => setRsvp('no')}>
              <span className="serif"><Bil kr="갈 수 없어요" en="Can't make it" /></span>
              <span className="mono muted"><Bil kr="영상 부탁드려요" en="VIDEO PLEASE" /></span>
            </button>
          </div>
        </section>

        {/* Optional family note for the kid */}
        <section className="pp-unlock__note">
          <div className="pp-unlock__note-head">
            <span className="mono"><Bil kr="민준에게 한 줄 (선택)" en="A LINE FOR MINJUN · OPTIONAL" /></span>
            <span className="pp-unlock__note-hint mono">
              <Bil kr="의례 시작 전에 전달" en="DELIVERED BEFORE CEREMONY" />
            </span>
          </div>
          <textarea
            className="pp-unlock__note-text"
            placeholder={ "예: 우리 민준, 천천히 말해도 돼." }
            defaultValue={"우리 민준, 천천히 말해도 돼. 우리는 듣고 있을게."}
          />
        </section>

        {/* Send + secondary */}
        <div className="pp-unlock__cta">
          <button className="pp-unlock__send">
            <Bil kr="회신 보내기" en="Send RSVP" />
            <Icon name="arrow" size={14} />
          </button>
          <button className="pp-unlock__cal">
            <Icon name="plus" size={12} />
            <Bil kr="달력에 추가" en="Add to calendar" />
          </button>
        </div>

      </div>
      <PPTabBar active="home" />
    </div>
  );
}

window.PPUnlock = PPUnlock;
