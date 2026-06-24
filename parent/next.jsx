// parent/next.jsx — What's next screen, with empty state, prefs, and print

function PPNext({ activeKid = 'minjun' }) {
  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} bordered />
      <div className="pp-scroll">
        <div style={{ padding: '20px 0 6px' }}>
          <div className="pp-greet__time mono" style={{ marginBottom: 8 }}>
            <span className="dot" />
            <Bil kr="다음 · 진행 중과 예정" en="NEXT · ACTIVE &amp; UPCOMING" />
          </div>
          <h1 className="pp-greet__h" style={{ fontSize: 24 }}>
            <Bil
              kr={<>지금 민준이는 <em className="s">무엇을</em> 하고 있나요.</>}
              en={<>What Minjun is <em className="s">working on</em> right now.</>}
            />
          </h1>
        </div>

        <div className="pp-active">
          <div className="pp-active__bg" />
          <div className="pp-active__kicker">
            <span className="dot" />
            <Bil kr="진행 중인 프로젝트" en="ACTIVE PROJECT" />
          </div>
          <h2 className="pp-active__title">
            <Bil
              kr={<>"시간이 맛이다" — <em className="s">30초짜리</em> 영상 만들기</>}
              en={<>"Time is the taste" — make a <em className="s">30-second</em> video</>}
            />
          </h2>
          <p className="pp-active__brief">
            <Bil
              kr="민준이는 자기가 쓴 한 문장을 영어로 말하고, 김치 항아리 그림과 함께 짧은 영상으로 만드는 중이에요."
              en="Minjun is saying his own sentence in English and making a short video with the kimchi-jar drawing."
            />
          </p>
          <div className="pp-active__pos">
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

        <div className="pp-support">
          <div className="pp-support__h">
            <Bil kr="집에서 어떻게 도울까요" en="HOW TO SUPPORT — WITHOUT TAKING OVER" />
          </div>
          <h3 className="pp-support__title">
            <Bil
              kr="짧게 묻고, 길게 들어주세요."
              en="Ask short, listen long."
            />
          </h3>
          <ul className="pp-support__lst">
            <li><span className="mark">DO</span><Bil kr="“오늘 뭐 만들고 있어?” 정도면 충분해요." en="\u201CWhat are you making today?\u201D is plenty." /></li>
            <li><span className="mark">DO</span><Bil kr="아이가 영어로 말하면, 그냥 들어주세요." en="When he speaks English, just listen." /></li>
            <li><span className="mark mark--no">DON\u2019T</span><Bil kr="단어를 번역해주지 마세요." en="Don\u2019t translate vocabulary." /></li>
            <li><span className="mark mark--no">DON\u2019T</span><Bil kr="문장을 고쳐 쓰지 마세요. 어색해도 아이의 목소리예요." en="Don\u2019t fix his sentences. Awkward is his voice." /></li>
          </ul>
        </div>

        <div className="pp-queue">
          <h3 className="pp-sec__h" style={{ marginBottom: 4 }}>
            <span><Bil kr={<>다음에 올 <em className="s">것들</em></>} en={<>Coming <em className="s">up</em></>} /></span>
          </h3>
          <p className="pp-greet__sub" style={{ fontSize: 11, marginBottom: 12 }}>
            <Bil
              kr="Reactor가 골라둔 다음 프로젝트들. 각각 어떤 결을 키우는지 한 줄로 알려드려요."
              en="Projects Reactor has queued — each tied to one Arketype grain."
            />
          </p>

          <div className="pp-queue__item">
            <span className="pp-queue__num">04</span>
            <div>
              <h5 className="pp-queue__title"><Bil kr="할머니에게 편지 쓰기" en="A letter to grandma" /></h5>
              <p className="pp-queue__why">
                <Bil
                  kr="자기 목소리 결을 키우려고요 — 받는 사람이 한 명이면 더 솔직해져요."
                  en="To grow voice — writing for one specific reader makes it honest."
                />
              </p>
            </div>
            <span className="pp-queue__chip"><Bil kr="목소리" en="VOICE" /></span>
          </div>

          <div className="pp-queue__item">
            <span className="pp-queue__num">05</span>
            <div>
              <h5 className="pp-queue__title"><Bil kr="이웃 한 분 인터뷰" en="Interview one neighbor" /></h5>
              <p className="pp-queue__why">
                <Bil
                  kr="듣는 결과 질문 만드는 결을 함께 다룹니다."
                  en="Practices listening and forming questions together."
                />
              </p>
            </div>
            <span className="pp-queue__chip"><Bil kr="질문" en="INQUIRY" /></span>
          </div>

          <div className="pp-queue__item">
            <span className="pp-queue__num">06</span>
            <div>
              <h5 className="pp-queue__title"><Bil kr="작은 라디오 코너 한 편" en="A tiny radio segment" /></h5>
              <p className="pp-queue__why">
                <Bil
                  kr="3주에 걸친 김치 시리즈의 마무리 — 자기가 만든 표현으로 말하기."
                  en="The finale of the 3-week kimchi series — speaking in his own phrase."
                />
              </p>
            </div>
            <span className="pp-queue__chip"><Bil kr="다듬기" en="CRAFT" /></span>
          </div>
        </div>
      </div>
      <PPTabBar active="next" />
    </div>
  );
}

// ─── Quiet weekend / empty state ─────────────────────────────────
function PPHomeQuiet({ activeKid = 'minjun' }) {
  return (
    <div className="pp-frame" data-tod="evening">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">
        <div className="pp-greet">
          <div className="pp-greet__time mono">
            <span className="dot" style={{ background: 'var(--muted-2)' }} />
            <Bil kr="일요일 · 오후 2:08" en="SUN · 2:08 PM" />
          </div>
          <h1 className="pp-greet__h">
            <Bil
              kr={<>오늘은 <em className="s">쉬는 날</em>이에요.</>}
              en={<>Today is a <em className="s">rest day</em>.</>}
            />
          </h1>
          <p className="pp-greet__sub">
            <Bil
              kr="주말엔 보통 프로젝트가 없어요. 가족과의 시간이 더 좋은 학습이에요."
              en="No projects on weekends. Family time is the better lesson."
            />
          </p>
        </div>

        <div className="pp-quiet">
          <h3 className="pp-quiet__h">
            <Bil
              kr={<>금요일에 만든 것을 <em className="s" style={{ fontStyle: 'italic' }}>다시 보고</em> 싶다면?</>}
              en={<>Want to <em className="s" style={{ fontStyle: 'italic' }}>re-read</em> Friday\u2019s moment?</>}
            />
          </h3>
          <p className="pp-quiet__sub">
            <Bil
              kr="민준이가 그린 산책 지도 — 8가지 색의 작은 발견들."
              en="Minjun\u2019s walk map — eight small discoveries, in eight colors."
            />
          </p>
          <button className="btn btn--ghost" style={{ marginTop: 14 }}>
            <Bil kr="작품 보러 가기" en="Open the artifact" />
            <Icon name="arrow" size={12} />
          </button>
        </div>

        <p style={{
          fontSize: 11, color: 'var(--muted)', textAlign: 'center',
          marginTop: 24, fontFamily: 'var(--serif)', fontStyle: 'italic', lineHeight: 1.5,
        }}>
          <Bil
            kr="다음 세션은 월요일 오후 4시예요."
            en="Next session: Monday, 4 PM."
          />
        </p>
      </div>
      <PPTabBar active="home" />
    </div>
  );
}

// ─── Notification preferences mini-screen ────────────────────────
function PPPrefs({ activeKid = 'minjun' }) {
  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} bordered />
      <div className="pp-scroll">
        <div style={{ padding: '20px 0 4px' }}>
          <h1 className="pp-greet__h" style={{ fontSize: 22, marginBottom: 6 }}>
            <Bil
              kr={<>알림은 <em className="s">조용하게</em>.</>}
              en={<>Notifications, <em className="s">quietly</em>.</>}
            />
          </h1>
          <p className="pp-greet__sub" style={{ fontSize: 12 }}>
            <Bil
              kr="필요한 것만 받아보세요. 게임 같은 알림은 보내지 않아요."
              en="Only what matters. We don\u2019t send game-style alerts."
            />
          </p>
        </div>

        <div className="pp-prefs">
          {[
            { titleKr:'주간 진행 노트', titleEn:'Weekly progress note',
              subKr:'화요일 저녁, 진행자가 한 주를 정리해요.', subEn:'Tue evenings, a wrap from the facilitator.', on:true },
            { titleKr:'아이가 만든 새 작품', titleEn:'When your child makes something new',
              subKr:'프로젝트가 완성될 때만.', subEn:'Only when a project is finished.', on:true },
            { titleKr:'진행자 메시지', titleEn:'Facilitator messages',
              subKr:'직접 보낸 메시지에만.', subEn:'Only direct messages.', on:true },
            { titleKr:'아키타입 변화', titleEn:'Arketype shifts',
              subKr:'결이 의미 있게 변할 때.', subEn:'When a grain meaningfully shifts.', on:false },
            { titleKr:'주말 알림', titleEn:'Weekend notifications',
              subKr:'토·일에는 모든 알림을 멈춰요.', subEn:'Pause all alerts Sat-Sun.', on:false },
            { titleKr:'카카오톡 연동', titleEn:'KakaoTalk delivery',
              subKr:'주간 노트를 카카오톡으로도.', subEn:'Send the weekly note via KakaoTalk too.', on:true },
          ].map((p,i) => (
            <div key={i} className="pp-pref">
              <div>
                <div className="pp-pref__title"><Bil kr={p.titleKr} en={p.titleEn} /></div>
                <div className="pp-pref__sub"><Bil kr={p.subKr} en={p.subEn} /></div>
              </div>
              <span className={"pp-toggle" + (p.on ? " pp-toggle--on" : "")}>
                <span className="pp-toggle__knob" />
              </span>
            </div>
          ))}
        </div>
      </div>
      <PPTabBar active="home" />
    </div>
  );
}

// ─── Print-friendly progress note ─────────────────────────────────
function PPPrint() {
  return (
    <div className="pp-print">
      <div className="pp-print__head">
        <span className="pp-print__brand">Ark Academy</span>
        <span className="pp-print__date mono"><Bil kr="2026 · 4월 · 28일 · 화" en="APR · 28 · 2026 · TUE" /></span>
      </div>
      <p style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.18em', color:'#6a6a72', margin:'0 0 8px', fontWeight:600 }}>
        <Bil kr="할아버지·할머니께 보내는 한 페이지" en="ONE-PAGE NOTE FOR THE GRANDPARENTS" />
      </p>
      <h1 className="pp-print__h">
        <Bil
          kr={<>민준이가 한 문장을 <em className="s">스스로</em> 만들었어요.</>}
          en={<>Minjun made a sentence <em className="s">on his own</em>.</>}
        />
      </h1>
      <p className="pp-print__sub">
        <Bil kr="2026년 4월 넷째 주 · 진행자 한지영" en="Week of Apr 28, 2026 · Facilitator: Han Jiyoung" />
      </p>

      <div className="pp-print__body">
        <p>
          <Bil
            kr={<>이번 주 민준이는 엄마와 할머니의 김치를 비교했어요. 글을 쓰던 중에 멈추더니 영어로 한 줄을 적었어요 — <em className="s">"Time is the taste."</em></>}
            en={<>This week Minjun compared his mother\u2019s and grandmother\u2019s kimchi. Mid-writing, he paused and added one line in English — <em className="s">"Time is the taste."</em></>}
          />
        </p>

        <div className="pp-print__quote">
          <Bil
            kr={'"엄마는 빨리, 할머니는 천천히. 시간이 들어가서 맛이 달라요."'}
            en={'"Mom fast, grandma slow. Time goes in, so the taste is different."'}
          />
        </div>

        <p>
          <Bil
            kr={<>이건 번역이 아니라 민준이가 <em className="s">스스로 만든 표현</em>이에요. 다음 두 세션 동안 이 한 문장을 30초짜리 영상으로 옮겨볼 거예요.</>}
            en={<>This wasn\u2019t a translation — it was Minjun\u2019s <em className="s">own phrase</em>. Over the next two sessions he will turn it into a 30-second video.</>}
          />
        </p>
        <p>
          <Bil
            kr="민준이의 듣는 결은 단단해졌고, 자기 목소리로 말하는 결이 천천히 자라고 있어요. 무리하지 않고요."
            en="His listening is steady. His voice is arriving slowly, on its own clock."
          />
        </p>
      </div>

      <div className="pp-print__sig">
        <span><Bil kr="ARK 아카데미 · 진행 노트" en="ARK ACADEMY · PROGRESS NOTE" /></span>
        <span><Bil kr="ARK REACTOR · #2204-MJ" en="ARK REACTOR · #2204-MJ" /></span>
      </div>
    </div>
  );
}

Object.assign(window, { PPNext, PPHomeQuiet, PPPrefs, PPPrint });
