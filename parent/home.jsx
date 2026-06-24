// parent/home.jsx — Parent Portal Home (the 10-second reassurance screen)

function PPHome({ tod = 'evening', heroVariant = 'audio', notif = 'calm', activeKid = 'minjun', multiKid = true }) {
  const ctx = timeContext(tod);
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  return (
    <div className="pp-frame" data-tod={tod}>
      <PPAppBar activeKid={activeKid} notif={notif} multi={multiKid} />
      <div className="pp-scroll">
        <div className="pp-greet">
          <div className="pp-greet__time mono">
            <span className="dot" />
            <Bil kr={ctx.timeLabel.kr} en={ctx.timeLabel.en} />
          </div>
          <h1 className="pp-greet__h">
            <Bil
              kr={<><span style={{display:'block', fontSize: '0.78em', color: 'var(--muted)', fontStyle:'italic'}}>오늘 하루도 수고하셨어요.</span>민준이는 오늘 <em className="s">조용히, 깊이</em> 일했어요.</>}
              en={<><span style={{display:'block', fontSize: '0.78em', color: 'var(--muted)', fontStyle:'italic'}}>You\u2019ve made it through the day.</span>Minjun worked <em className="s">quietly, deeply</em> today.</>}
            />
          </h1>
          <p className="pp-greet__sub">
            <Bil
              kr="Ark Reactor가 본 오늘의 신호 — 평온하고 집중된 하루."
              en="What Ark Reactor saw today — calm, focused, unhurried." />
          </p>
        </div>

        {/* Notification banner if there's a question for parent */}
        {notif === 'question' && (
          <div style={{
            margin: '0 0 14px',
            padding: '10px 14px',
            borderRadius: 999,
            background: 'rgba(255,122,110,0.10)',
            border: '1px solid rgba(255,122,110,0.28)',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12, color: 'var(--coral)',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--coral)' }} />
            <Bil kr="진행 노트가 도착했어요 · 읽지 않음" en="A new progress note has arrived · unread" />
          </div>
        )}

        {/* Hero moment */}
        <div className="pp-hero" onClick={() => nav.goTo('projects', { openShare: true })}>
          <div className="pp-hero__kicker">
            <span className="left">
              <span className="dot" />
              <Bil kr="오늘의 한 순간" en="A MOMENT FROM TODAY" />
            </span>
            <span><Bil kr="오후 4:18" en="4:18 PM" /></span>
          </div>

          {heroVariant === 'audio' && (
            <>
              <h2 className="pp-hero__title">
                <Bil
                  kr={<>민준이가 영어로 <em className="s">30초짜리</em> 음성 메모를 남겼어요.</>}
                  en={<>Minjun left a <em className="s">30-second</em> voice memo in English.</>}
                />
              </h2>
              <AudioWave played={0.28} />
              <div className="pp-hero__quote">
                <Bil
                  kr={<>"우리 할머니의 김치는 더 시어요. 시간이 들어가서요. 시간이 맛이에요."</>}
                  en={<>"My grandma\u2019s kimchi is more sour. Time goes into it. Time is the taste."</>}
                />
              </div>
            </>
          )}

          {heroVariant === 'drawing' && (
            <>
              <h2 className="pp-hero__title">
                <Bil
                  kr={<>민준이가 <em className="s">"시간이 맛이다"</em> 프로젝트의 첫 스케치를 마쳤어요.</>}
                  en={<>Minjun finished the first sketch for his <em className="s">"Time is the taste"</em> project.</>}
                />
              </h2>
              <div className="pp-artifact pp-artifact--drawing">
                <span className="pp-artifact__sketch">
                  <Bil kr="[ 아이의 스케치 — 김치 항아리와 시간선 ]" en="[ child\u2019s sketch — kimchi jar &amp; timeline ]" />
                </span>
                <div className="pp-artifact__overlay">
                  <Bil kr="민준 · 색연필 · 4:18 PM" en="MINJUN · COLOR PENCIL · 4:18 PM" />
                </div>
              </div>
            </>
          )}

          {heroVariant === 'quote' && (
            <>
              <h2 className="pp-hero__title">
                <Bil
                  kr={<>오늘 글에서 한 줄이 <em className="s">눈에 띄었어요</em>.</>}
                  en={<>One line in today\u2019s writing <em className="s">stood out</em>.</>}
                />
              </h2>
              <div className="pp-hero__quote" style={{ fontSize: 18, padding: '14px 16px', borderLeftWidth: 3 }}>
                <Bil
                  kr={<>"엄마는 빨리, <em className="s">할머니는 천천히</em>. 그래서 맛이 달라요."</>}
                  en={<>"Mom fast, <em className="s">Grandma slow</em>. That\u2019s why the taste is different."</>}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                <Bil
                  kr="튜터는 이 줄을 짚어두었어요 — 다음 세션에서 함께 다듬을 거예요."
                  en="The tutor anchored this line — they\u2019ll work it together next session."
                />
              </p>
            </>
          )}

          <div className="pp-hero__foot">
            <span className="mono">
              <Bil kr="프로젝트 · 시간이 맛이다" en="PROJECT · TIME IS THE TASTE" />
            </span>
            <button className="pp-hero__expand" onClick={(e) => { e.stopPropagation(); nav.goTo('projects', { openShare: true }); }}>
              <Bil kr="자세히" en="EXPAND" />
              <Icon name="arrow" size={11} />
            </button>
          </div>
        </div>

        {/* Progress strip — no streaks, just minutes & projects */}
        <div className="pp-strip">
          <div className="pp-strip__h">
            <span><Bil kr="이번 주" en="THIS WEEK" /></span>
            <span><Bil kr="화요일" en="TUE" /></span>
          </div>
          <div className="pp-strip__num">
            142<em><Bil kr="분 · 2개 프로젝트" en="min · 2 projects" /></em>
          </div>
          <p className="pp-strip__sub">
            <Bil
              kr="민준이는 이번 주 두 프로젝트에 시간을 들였어요. 무리하지 않은 속도예요."
              en="Minjun spent time on two projects this week. A pace that\u2019s not pushed."
            />
          </p>
          <div className="pp-strip__bars">
            <span className="pp-strip__bar pp-strip__bar--empty" style={{ height: '20%' }} />
            <span className="pp-strip__bar" style={{ height: '60%' }} />
            <span className="pp-strip__bar pp-strip__bar--today" style={{ height: '85%' }} />
            <span className="pp-strip__bar pp-strip__bar--empty" style={{ height: '20%' }} />
            <span className="pp-strip__bar pp-strip__bar--empty" style={{ height: '20%' }} />
            <span className="pp-strip__bar pp-strip__bar--empty" style={{ height: '20%' }} />
            <span className="pp-strip__bar pp-strip__bar--empty" style={{ height: '20%' }} />
          </div>
          <div className="pp-strip__days">
            <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
          </div>
        </div>

        {/* Facilitator inbox preview */}
        <div className="pp-sec">
          <h3 className="pp-sec__h">
            <span><Bil kr="진행자에게서" en={<>From <em className="s">facilitator</em></>} /></span>
            <span className="more clickable" onClick={() => nav.goTo('msg')}><Bil kr="모두 보기" en="ALL" /></span>
          </h3>
          <div className="pp-inbox" onClick={() => nav.goTo('msg')} style={{ cursor: 'pointer' }}>
            <div className="pp-inbox__av">한</div>
            <div className="pp-inbox__body">
              <div className="pp-inbox__name">
                <Bil kr="한지영 진행자" en="Ms. Han Jiyoung" />
                <span className="role"><Bil kr="진행자" en="FACILITATOR" /></span>
              </div>
              <div className="pp-inbox__pre">
                <Bil
                  kr={'"오늘 민준이가 ‘시간이 맛이다’라는 표현을 직접 만들었어요. 함께…"'}
                  en={'"Minjun came up with \u2018time is the taste\u2019 himself today. We worked it…"'}
                />
              </div>
            </div>
            {notif !== 'calm' && <div className="pp-inbox__badge">1</div>}
          </div>
        </div>

        {/* Quiet state hint at the bottom */}
        <p style={{
          fontSize: 11, color: 'var(--muted)', textAlign: 'center',
          marginTop: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', lineHeight: 1.5,
        }}>
          <Bil
            kr="오늘은 여기까지예요. 내일 또 한 순간을 가져올게요."
            en="That\u2019s all for today. We\u2019ll bring you another moment tomorrow."
          />
        </p>
      </div>
      <PPTabBar active="home" />
    </div>
  );
}

window.PPHome = PPHome;
