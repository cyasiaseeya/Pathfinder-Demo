// parent/facilitator.jsx — facilitator thread + composer

function PPFacilitator({ activeKid = 'minjun', translateOn = true }) {
  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} bordered />
      <div className="pp-scroll" style={{ paddingBottom: 200 }}>
        <div style={{ padding: '20px 0 4px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <h1 className="pp-greet__h" style={{ fontSize: 22, marginBottom: 0 }}>
              <Bil kr={<>한지영 <em className="s">진행자</em></>} en={<>Ms. <em className="s">Han Jiyoung</em></>} />
            </h1>
            <span className="pp-lang-toggle">
              <button className={translateOn?'on':''}>KR</button>
              <button className={!translateOn?'on':''}>EN</button>
            </span>
          </div>
          <p className="pp-greet__sub" style={{ fontSize: 12, marginTop: 6 }}>
            <Bil
              kr="민준이의 진행자 · 보통 30분 안에 답해요"
              en="Minjun\u2019s facilitator · usually replies within 30 min"
            />
          </p>
        </div>

        <div className="pp-thread">
          <div className="pp-thread__day"><Bil kr="화요일 · 4월 28일" en="TUE · APR 28" /></div>

          {/* Scheduled progress note — visually distinct */}
          <div className="pp-note">
            <div className="pp-note__h">
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--ink)' }} />
              <Bil kr="이번 주 진행 노트 · 화요일" en="WEEKLY PROGRESS NOTE · TUE" />
            </div>
            <h4 className="pp-note__title">
              <Bil kr={<>"시간이 맛이다" — 민준이가 직접 만든 표현이에요.</>}
                   en={<>"Time is the taste" — Minjun\u2019s own phrase.</>} />
            </h4>
            <p className="pp-note__body">
              <Bil
                kr={'오늘 김치 비교를 하다가 민준이가 갑자기 "시간이 맛이다"라고 적었어요. 영어로 옮기는 데 두 번 멈췄는데, 둘 다 자기 힘으로 다시 시작했어요. 다음 두 세션은 이 한 문장을 30초짜리 영상으로 만드는 데 쓸 거예요.'}
                en={'Today, mid-comparison of two kimchis, Minjun suddenly wrote "time is the taste." He paused twice translating it to English — both times he restarted on his own. Next two sessions: turn this sentence into a 30-second video.'}
              />
            </p>
            <p className="pp-note__sig serif">— <Bil kr="한지영" en="Han Jiyoung" /></p>
          </div>

          {/* Facilitator chat — KR translated inline below EN */}
          <div className="pp-msg">
            <div className="pp-msg__av">한</div>
            <div>
              <div className="pp-bubble">
                <p style={{ margin: 0 }}>If you have a moment tonight, ask him to say the line aloud. He doesn\u2019t need to translate — just say it.</p>
                {translateOn && (
                  <div className="pp-bubble__trans">
                    <Bil
                      kr="오늘 저녁 시간이 되시면, 민준이에게 그 문장을 소리내어 말해보라고 해주세요. 번역은 필요 없어요 — 그냥 말하기만요."
                      en="(KR translation hidden — toggle on)"
                    />
                  </div>
                )}
                <button className="pp-bubble__transbtn">
                  <Icon name="quote" size={9} />
                  <Bil kr="원문 보기" en={translateOn ? 'TRANSLATED FROM EN' : 'TRANSLATE'} />
                </button>
                <div className="pp-bubble__time">5:02 PM</div>
              </div>
            </div>
          </div>

          {/* Parent reply */}
          <div className="pp-msg pp-msg--me">
            <div>
              <div className="pp-bubble">
                <p style={{ margin: 0 }}>
                  <Bil
                    kr="네 — 저녁 식사 후에 자연스럽게 물어볼게요. 감사합니다."
                    en="Yes — I\u2019ll ask naturally after dinner. Thank you."
                  />
                </p>
                <div className="pp-bubble__time">5:18 PM</div>
              </div>
            </div>
          </div>

          <div className="pp-msg">
            <div className="pp-msg__av">한</div>
            <div>
              <div className="pp-bubble">
                <p style={{ margin: 0 }}>
                  <Bil
                    kr={'한 가지만 — 영어 단어를 고쳐주지 않으셔도 돼요. 어색해도 그게 민준이 목소리예요.'}
                    en={'One thing — please don\u2019t correct his English words. Even when awkward, that\u2019s his voice.'}
                  />
                </p>
                <div className="pp-bubble__time">5:21 PM</div>
              </div>
            </div>
          </div>

          <div className="pp-thread__day"><Bil kr="월요일 · 4월 27일" en="MON · APR 27" /></div>
          <div className="pp-msg">
            <div className="pp-msg__av">한</div>
            <div>
              <div className="pp-bubble">
                <p style={{ margin: 0 }}>
                  <Bil
                    kr="이번 주 첫 세션 잘 마쳤어요. 산책 지도를 8가지 색으로 그렸어요 — 사진 첨부할게요."
                    en="First session of the week went well. He drew the walk in 8 different colors — photo attached."
                  />
                </p>
                <div className="pp-bubble__time">7:08 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pp-composer">
        <div className="pp-composer__starters">
          <button className="pp-composer__starter">
            <Bil kr="아이가 잘 지내고 있나요?" en="Is everything okay?" />
          </button>
          <button className="pp-composer__starter">
            <Bil kr="집에서는 어떻게 도울까요?" en="What can I do at home?" />
          </button>
        </div>
        <div className="pp-composer__row">
          <input className="pp-composer__in" placeholder={'질문이나 메모를 남겨보세요 ·  Ask or leave a note...'} />
          <button className="pp-composer__send"><Icon name="arrow" size={14} /></button>
        </div>
      </div>
      <PPTabBar active="msg" />
    </div>
  );
}

window.PPFacilitator = PPFacilitator;
