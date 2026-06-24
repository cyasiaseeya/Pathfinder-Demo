// parent/desktop.jsx — Desktop Home (1024 wide)

function PPDesktopHome({ tod = 'evening' }) {
  return (
    <div className="pp-desk" data-tod={tod}>
      <div className="pp-desk__top">
        <div className="pp-brand" style={{ fontSize: 15 }}>
          <img src="assets/ark-mark-black.png" alt="Ark" style={{ width: 22, height: 22 }} />
          <span>Ark Academy</span>
          <span style={{ color:'var(--muted)', fontSize:12, marginLeft:6 }}>
            / <Bil kr="학부모" en="Parent" />
          </span>
        </div>
        <nav className="pp-desk__nav">
          {[
            {id:'home', kr:'오늘', en:'Today', a:true},
            {id:'child', kr:'내 아이', en:'My child'},
            {id:'projects', kr:'프로젝트', en:'Projects'},
            {id:'msg', kr:'대화', en:'Messages'},
            {id:'next', kr:'다음', en:"What's next"},
          ].map(t => (
            <button key={t.id} className={"tab" + (t.a ? " tab--active" : "")}>
              <Bil kr={t.kr} en={t.en} />
            </button>
          ))}
        </nav>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button className="pp-iconbtn"><Icon name="search" size={16} /></button>
          <button className="pp-iconbtn"><Icon name="bell" size={16} /></button>
          <div className="pp-childswitch">
            <div className="pp-childswitch__avs">
              <div className="pp-childswitch__av pp-childswitch__av--active">민</div>
              <div className="pp-childswitch__av pp-childswitch__av--alt">연</div>
            </div>
            <div className="pp-childswitch__name">
              <Bil kr="이민준" en="Minjun" />
              <span className="meta">G5 · 11</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pp-desk__main">
        <div className="pp-desk__left">
          <div className="pp-desk__greet">
            <h1>
              <Bil
                kr={<><span style={{display:'block', fontSize:'0.55em', color:'var(--muted)', fontStyle:'italic', marginBottom:4}}>오늘 하루도 수고하셨어요.</span>민준이는 오늘 <em className="s">조용히, 깊이</em> 일했어요.</>}
                en={<><span style={{display:'block', fontSize:'0.55em', color:'var(--muted)', fontStyle:'italic', marginBottom:4}}>You\u2019ve made it through the day.</span>Minjun worked <em className="s">quietly, deeply</em> today.</>}
              />
            </h1>
            <div style={{ flex:'0 0 auto' }}>
              <div className="pp-greet__time mono"><span className="dot"/><Bil kr="화요일 · 오후 7:42" en="TUE · 7:42 PM" /></div>
            </div>
          </div>

          <div className="pp-desk__hero">
            <div>
              <div className="pp-hero__kicker" style={{ marginBottom: 16 }}>
                <span className="left">
                  <span className="dot" />
                  <Bil kr="오늘의 한 순간 · 4:18 PM" en="A MOMENT FROM TODAY · 4:18 PM" />
                </span>
              </div>
              <h2 className="pp-hero__title" style={{ fontSize: 26, marginBottom: 14 }}>
                <Bil
                  kr={<>민준이가 영어로 <em className="s">30초짜리</em> 음성 메모를 남겼어요.</>}
                  en={<>Minjun left a <em className="s">30-second</em> voice memo in English.</>}
                />
              </h2>
              <AudioWave played={0.28} />
              <div className="pp-hero__quote" style={{ fontSize: 18 }}>
                <Bil
                  kr={<>"우리 할머니의 김치는 더 시어요. 시간이 들어가서요. <em className="s">시간이 맛이에요.</em>"</>}
                  en={<>"My grandma\u2019s kimchi is more sour. Time goes into it. <em className="s">Time is the taste.</em>"</>}
                />
              </div>
              <p style={{ fontSize: 13, color:'var(--muted)', lineHeight:1.5, margin:'14px 0 0' }}>
                <Bil
                  kr="튜터가 다음 세션에서 함께 다듬을 한 줄로 골랐어요."
                  en="The tutor anchored this line for the next session."
                />
              </p>
            </div>
            <div className="pp-desk__hero-art">
              <span className="pp-artifact__sketch">
                <Bil kr="[ 민준의 스케치 — 김치 항아리 ]" en="[ Minjun\u2019s sketch — kimchi jar ]" />
              </span>
            </div>
          </div>

          <div className="pp-desk__row">
            <div className="pp-desk__card">
              <div className="pp-strip__h" style={{ marginBottom: 14 }}>
                <span><Bil kr="이번 주" en="THIS WEEK" /></span>
                <span><Bil kr="화요일" en="TUE" /></span>
              </div>
              <div className="pp-strip__num">
                142<em><Bil kr="분 · 2개 프로젝트" en="min · 2 projects" /></em>
              </div>
              <p className="pp-strip__sub" style={{ fontSize: 13 }}>
                <Bil
                  kr="민준이는 이번 주 두 프로젝트에 시간을 들였어요. 무리하지 않은 속도예요."
                  en="Minjun spent time on two projects this week. A pace that\u2019s not pushed."
                />
              </p>
              <div className="pp-strip__bars" style={{ height: 56 }}>
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

            <div className="pp-desk__card">
              <div className="pp-greet__time mono" style={{ marginBottom: 12 }}>
                <span className="dot" />
                <Bil kr="진행 중" en="ACTIVE" />
              </div>
              <h3 className="pp-active__title" style={{ fontSize: 18 }}>
                <Bil kr={<>"시간이 맛이다" — 영상 만들기</>} en={<>"Time is the taste" — make a video</>} />
              </h3>
              <div className="pp-active__pos" style={{ marginTop: 14 }}>
                <span className="pp-active__steps">
                  <span className="pp-active__step pp-active__step--done" />
                  <span className="pp-active__step pp-active__step--done" />
                  <span className="pp-active__step pp-active__step--active" />
                  <span className="pp-active__step" />
                  <span className="pp-active__step" />
                </span>
                <span><Bil kr="3 / 5 단계" en="STEP 3 / 5" /></span>
              </div>
            </div>
          </div>
        </div>

        <div className="pp-desk__right">
          <div className="pp-desk__card" style={{ padding: 0, overflow:'hidden' }}>
            <div style={{ padding:'18px 22px 6px' }}>
              <div className="pp-greet__time mono" style={{ marginBottom: 6 }}>
                <Bil kr="아키타입" en="ARKETYPE" />
              </div>
              <h3 style={{ fontFamily:'"Source Serif 4", var(--serif)', fontSize: 18, fontWeight:500, margin:'0 0 4px', letterSpacing:'-0.015em' }}>
                <Bil kr={<>16개의 결</>} en={<>Sixteen grains</>} />
              </h3>
            </div>
            <div style={{ padding: '0 14px 14px' }}>
              <SoftRadar size={290} />
            </div>
            <div style={{ padding:'0 22px 18px' }}>
              <p className="pp-narr" style={{ fontSize: 14, marginTop: 0 }}>
                <Bil
                  kr={<>민준이는 시작 전에 <em className="s">질문이 많아요.</em> 보호해줄 만한 힘이에요.</>}
                  en={<>Minjun asks <em className="s">more clarifying questions</em> than most kids his age. A strength worth protecting.</>}
                />
              </p>
            </div>
          </div>

          <div className="pp-inbox" style={{ padding: 16 }}>
            <div className="pp-inbox__av">한</div>
            <div className="pp-inbox__body">
              <div className="pp-inbox__name">
                <Bil kr="한지영 진행자" en="Ms. Han Jiyoung" />
                <span className="role"><Bil kr="진행자" en="FACILITATOR" /></span>
              </div>
              <div className="pp-inbox__pre">
                <Bil
                  kr={'"오늘 민준이가 \u2018시간이 맛이다\u2019라는 표현을 직접 만들었어요…"'}
                  en={'"Minjun came up with \u2018time is the taste\u2019 himself today…"'}
                />
              </div>
            </div>
            <div className="pp-inbox__badge">1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PPDesktopHome = PPDesktopHome;
