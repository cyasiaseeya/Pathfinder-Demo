// screens/mobile.jsx — Mobile tutor view
// 393x820 phone frame. Single-pane stack: collapsed draft "ribbon" up top
// (tap to expand), conversation below, sticky composer.

function MobileTutorScreen() {
  return (
    <div className="frame mobile-tutor">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen">
          {/* Status bar */}
          <div className="m-status mono">
            <span>9:41</span>
            <span className="m-status__r">
              <Icon name="bell" size={11} />
              <span style={{ marginLeft: 6 }}>87%</span>
            </span>
          </div>

          {/* Top nav */}
          <div className="m-nav">
            <button className="m-back"><Icon name="arrowL" size={16} /></button>
            <div className="m-nav__title">
              <div className="serif"><Bil kr="튜터와 대화" en="Talk to tutor" /></div>
              <div className="mono"><Bil kr="단계 03 / 05" en="STEP 03 / 05" /></div>
            </div>
            <button className="m-back"><Icon name="search" size={14} /></button>
          </div>

          {/* Draft ribbon (collapsed) */}
          <div className="m-draft-ribbon">
            <div className="m-ribbon__head">
              <span className="mono"><Bil kr="내 초안 · 142단어" en="MY DRAFT · 142 W" /></span>
              <span className="mono m-ribbon__chev"><Icon name="chevronD" size={12} /></span>
            </div>
            <p className="serif m-ribbon__highlight">
              <Bil
                kr={<>"엄마는 빨리, <em className="s">할머니는 천천히</em>."</>}
                en={<>"Mom fast, <em className="s">Grandma slow</em>."</>}
              />
            </p>
            <span className="mono m-ribbon__pin"><Icon name="quote" size={10} /> <Bil kr="튜터가 짚은 줄" en="TUTOR'S ANCHOR" /></span>
          </div>

          {/* Tutor identity */}
          <div className="m-tutor-id">
            <SumiMark size={26} tone="ink" />
            <div>
              <div className="serif m-tutor-id__n"><Bil kr="인지 참여 튜터" en="Cog. Engagement Tutor" /></div>
              <div className="mono m-tutor-id__s">
                <span className="ai-chip ai-chip--active" style={{ padding: "3px 8px", fontSize: 9 }}>
                  <span className="ai-chip__dot" />
                  <Bil kr="질문만" en="Asks only" />
                </span>
              </div>
            </div>
          </div>

          {/* Stream */}
          <div className="m-stream">
            <div className="m-msg m-msg--tutor">
              <SumiMark size={22} tone="ink" />
              <div className="m-bubble">
                <p className="serif">
                  <Bil
                    kr={<>한 줄만 골라봐요. 3번째 줄. <em className="s">왜 그 차이를 적었어요?</em></>}
                    en={<>Pick one line. Line 3. <em className="s">Why did you write that difference?</em></>}
                  />
                </p>
              </div>
            </div>
            <div className="m-msg m-msg--kid">
              <div className="m-bubble m-bubble--kid">
                <p><Bil kr="진짜 다른 점 같아서요." en="Felt like the real difference." /></p>
              </div>
            </div>
            <div className="m-msg m-msg--tutor">
              <SumiMark size={22} tone="ink" />
              <div className="m-bubble">
                <p className="serif">
                  <Bil
                    kr={<>어떤 면에서 <em className="s">진짜</em>라고 느꼈어요?</>}
                    en={<>What made it feel <em className="s">real</em>?</>}
                  />
                </p>
              </div>
            </div>
            <div className="m-msg m-msg--kid">
              <div className="m-bubble m-bubble--kid">
                <p><Bil kr="시간이 들어가니까. 시간이 맛인 것 같아요." en="Time goes into it. Time IS the taste." /></p>
              </div>
            </div>
            <div className="m-msg m-msg--tutor">
              <SumiMark size={22} tone="ink" thinking />
              <div className="m-bubble">
                <p className="serif">
                  <Bil
                    kr={<><em className="s">"시간이 맛이다"</em> — 영상이 그 한 가지를 가져갔으면 해요?</>}
                    en={<><em className="s">"Time is the taste"</em> — should the video take that one thing?</>}
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Lock notice */}
          <div className="m-lock-note">
            <Icon name="lock" size={11} />
            <span><Bil kr="튜터는 너 대신 쓰지 않아요." en="Tutor will not write for you." /></span>
          </div>

          {/* Composer */}
          <div className="m-compose">
            <input className="m-compose__in" placeholder={"답해보기 · Reply..."} />
            <button className="m-compose__send"><Icon name="arrow" size={14} /></button>
          </div>

          {/* Home indicator */}
          <div className="m-home" />
        </div>
      </div>
    </div>
  );
}
window.MobileTutorScreen = MobileTutorScreen;
