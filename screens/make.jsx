// screens/make.jsx — Step 04.5 · Making the video
// The student is producing the artifact: clips, voice-over, title card,
// timeline. Tutor whispers quietly in the margin. AI suggests trims as
// ghost markers the kid must approve. Same notebook register as the rest.

const { Topbar, Bil, Icon, SumiMark, AIStateChip } = window;

function MakeScreen() {
  return (
    <div className="frame make">
      <Topbar tab="projects" crumb={{ kr: "영상 만들기", en: "Making the video" }} />
      <div className="scroll-y" style={{ display: "flex", flexDirection: "column" }}>
        <div className="make__shell" style={{ flex: 1 }}>

          {/* Crumb */}
          <div className="make__crumb">
            <div className="eyebrow">
              <span className="dot" />
              <span className="mono"><Bil kr="단계 04.5 · 만들기" en="STEP 04.5 · MAKING" /></span>
            </div>
            <div className="make__crumb-title">
              <Bil
                kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요 — <span className="muted">영상으로 옮기기</span></>}
                en={<>Korean food has <em className="s">stories</em> — <span className="muted">putting it on screen</span></>}
              />
            </div>
            <div className="make__tools">
              <button className="tool-btn" title="Undo"><Icon name="arrowL" size={14} /></button>
              <button className="tool-btn" title="Redo"><Icon name="arrow" size={14} /></button>
              <span style={{ width: 1, height: 22, background: "var(--line-2)", margin: "0 4px" }} />
              <button className="tool-btn tool-btn--active" title="Cut"><Icon name="pencil" size={14} /></button>
              <button className="tool-btn" title="Voice"><Icon name="mic" size={14} /></button>
              <button className="tool-btn" title="Title"><Icon name="feather" size={14} /></button>
              <span style={{ width: 1, height: 22, background: "var(--line-2)", margin: "0 4px" }} />
              <AIStateChip state="active" />
            </div>
          </div>

          {/* Stage */}
          <div className="make__stage">

            {/* LEFT RAIL — script lines from the revision draft */}
            <aside className="make__rail-l">
              <h3 className="rail-h"><Bil kr="너의 2차 초안에서" en="From your revision" /></h3>
              <div className="script-line script-line--cast">
                <span className="script-line__no">01</span>
                <span className="script-line__txt">
                  <Bil kr="할머니의 김치는 다른 김치와 맛이 다르다." en="Grandma's kimchi tastes different from any other kimchi." />
                </span>
                <span className="script-line__chip">VO 01</span>
              </div>
              <div className="script-line script-line--cast">
                <span className="script-line__no">02</span>
                <span className="script-line__txt">
                  <Bil kr="왜냐하면 시간을 들이기 때문이다." en="Because she gives it time." />
                </span>
                <span className="script-line__chip">VO 02</span>
              </div>
              <div className="script-line script-line--cast">
                <span className="script-line__no">03</span>
                <span className="script-line__txt">
                  <Bil kr="엄마는 빨리 만든다. 할머니는 천천히 만든다." en="Mom makes it fast. Grandma makes it slow." />
                </span>
                <span className="script-line__chip">VO 03</span>
              </div>
              <div className="script-line script-line--cast script-line--anchor">
                <span className="script-line__no">04</span>
                <span className="script-line__txt">
                  <Bil
                    kr={<>그 시간이 곧 <em className="s">맛</em>이다.</>}
                    en={<>That time IS the <em className="s">taste</em>.</>}
                  />
                </span>
                <span className="script-line__chip">TITLE</span>
              </div>
              <div className="script-line">
                <span className="script-line__no">05</span>
                <span className="script-line__txt">
                  <Bil kr="그래서 한국 음식은 시간을 먹는 음식이다." en="So Korean food is food where you eat the time." />
                </span>
                <span className="script-line__chip">VO 05</span>
              </div>

              <div style={{ marginTop: 22 }}>
                <h3 className="rail-h"><Bil kr="목표" en="Targets" /></h3>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, fontFamily: "var(--serif)", letterSpacing: "-0.01em" }}>
                  <Bil
                    kr={<>외국인 친구가 영상을 보고 <em className="s" style={{color:"var(--coral)"}}>한 가지</em>를 가져가야 해요.</>}
                    en={<>A foreign friend should walk away holding <em className="s" style={{color:"var(--coral)"}}>one thing</em>.</>}
                  />
                </div>
                <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 6 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>
                    <Bil kr="너의 한 가지" en="YOUR ONE THING" />
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 14, color: "var(--ink)", letterSpacing: "-0.015em" }}>
                    <Bil kr={<>"시간이 맛이다."</>} en={<>"Time is the taste."</>} />
                  </div>
                </div>
              </div>
            </aside>

            {/* CENTER — preview + transport + tutor whisper */}
            <section className="make__center">
              <div className="preview">
                <span className="preview__overlay-mark"><span className="dot" /><Bil kr="2:18에 멈춤" en="PAUSED · 02:18" /></span>
                <span className="preview__time"><span className="num">02:18</span> <span className="target">/ <span className="num">03:00</span></span></span>

                <div className="preview__caption">
                  <Bil
                    kr={<>시간이 <em className="s">맛</em>이다.</>}
                    en={<>Time is the <em className="s">taste</em>.</>}
                  />
                </div>

                <span className="preview__hint">
                  <span><Bil kr="화면 · 16 : 9" en="FRAME · 16 : 9" /></span>
                  <span><Bil kr="안전 영역 표시됨" en="SAFE AREA SHOWN" /></span>
                </span>
              </div>

              <div className="transport">
                <div className="transport__btns">
                  <button className="transport-btn"><Icon name="arrowL" size={16} /></button>
                  <button className="transport-btn transport-btn--play"><Icon name="play" size={20} /></button>
                  <button className="transport-btn"><Icon name="arrow" size={16} /></button>
                </div>
                <div className="transport__scrub">
                  <div className="transport__scrub-fill" style={{ width: "76%" }} />
                  <div className="transport__scrub-head" style={{ left: "76%" }} />
                </div>
                <div className="transport__time">
                  <span className="num">02:18</span>
                  <span style={{ color: "var(--muted-2)" }}> / </span>
                  <span className="num">03:00</span>
                </div>
              </div>

              {/* Tutor whisper — quiet AI presence during making */}
              <div className="tutor-whisper">
                <SumiMark size={22} tone="ink" />
                <div className="tutor-whisper__txt">
                  <Bil
                    kr={<>지금 <em className="s">"시간이 맛이다"</em>가 2:18에 떠 있어요. 영상 끝에 다시 한 번 더 들리는 것 — 의도한 거예요?</>}
                    en={<><em className="s">"Time is the taste"</em> is sitting at 2:18 right now. Letting it land once more at the end — is that what you want?</>}
                  />
                </div>
                <button className="tutor-whisper__cta"><Bil kr="생각해볼게요" en="Let me think" /></button>
              </div>
            </section>

            {/* RIGHT RAIL — clips, voice, title */}
            <aside className="make__rail-r">
              <h3 className="rail-h"><Bil kr="네가 찍은 것" en="What you shot" /></h3>
              <div className="clip">
                <div className="clip__thumb clip__thumb--hands">B-01</div>
                <div>
                  <div className="clip__name"><Bil kr="할머니의 손" en="Grandma's hands" /></div>
                  <div className="clip__meta">00:18 · <Bil kr="3월 30일" en="MAR 30" /></div>
                </div>
                <span className="clip__used"><Bil kr="사용 중" en="USED" /></span>
              </div>
              <div className="clip">
                <div className="clip__thumb clip__thumb--jar">B-02</div>
                <div>
                  <div className="clip__name"><Bil kr="김치 통" en="Kimchi jar" /></div>
                  <div className="clip__meta">00:09 · <Bil kr="3월 30일" en="MAR 30" /></div>
                </div>
                <span className="clip__used"><Bil kr="사용 중" en="USED" /></span>
              </div>
              <div className="clip">
                <div className="clip__thumb clip__thumb--cycle">B-03</div>
                <div>
                  <div className="clip__name"><Bil kr="배추 → 김치" en="Cabbage → kimchi" /></div>
                  <div className="clip__meta">00:24 · <Bil kr="4월 1일" en="APR 01" /></div>
                </div>
                <span className="clip__used"><Bil kr="사용 중" en="USED" /></span>
              </div>
              <div className="clip">
                <div className="clip__thumb clip__thumb--family">B-04</div>
                <div>
                  <div className="clip__name"><Bil kr="가족 식탁" en="Family table" /></div>
                  <div className="clip__meta">00:32 · <Bil kr="4월 2일" en="APR 02" /></div>
                </div>
              </div>
              <div className="clip">
                <div className="clip__thumb clip__thumb--time">B-05</div>
                <div>
                  <div className="clip__name"><Bil kr="시계 / 햇빛" en="Clock / sunlight" /></div>
                  <div className="clip__meta">00:14 · <Bil kr="4월 3일" en="APR 03" /></div>
                </div>
              </div>

              <h3 className="rail-h" style={{ marginTop: 18 }}>
                <Bil kr="목소리 녹음 · VO 03" en="Voice take · VO 03" />
              </h3>
              <div className="take">
                <div className="take__name">TAKE 01</div>
                <button className="take__play"><Icon name="play" size={10} /></button>
                <div className="take__wave">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i} style={{ height: `${20 + Math.sin(i * 0.9) * 30 + (i % 4) * 8}%` }} />
                  ))}
                </div>
                <span className="take__time">00:04.2</span>
              </div>
              <div className="take take--current">
                <div className="take__name">TAKE 02 · <Bil kr="현재" en="CURRENT" /></div>
                <button className="take__play"><Icon name="play" size={10} /></button>
                <div className="take__wave">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i} style={{ height: `${30 + Math.cos(i * 0.7) * 38 + (i % 3) * 10}%` }} />
                  ))}
                </div>
                <span className="take__time">00:04.8</span>
              </div>
              <button className="record-btn"><span className="ring" /><Bil kr="다시 녹음" en="Record again" /></button>

              <h3 className="rail-h" style={{ marginTop: 18 }}>
                <Bil kr="닫는 자막" en="Closing title" />
              </h3>
              <div style={{ padding: 14, borderRadius: 6, background: "var(--butter)", color: "var(--ink)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", color: "rgba(11,11,15,.55)", textTransform: "uppercase", marginBottom: 6 }}>
                  <Bil kr="화면에 보임 · 02:35 ~ 02:58" en="ON SCREEN · 02:35 → 02:58" />
                </div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "-0.025em", lineHeight: 1.25 }}>
                  <Bil
                    kr={<>시간이 <em className="s" style={{color:"var(--coral)"}}>맛</em>이다.</>}
                    en={<>Time is the <em className="s" style={{color:"var(--coral)"}}>taste</em>.</>}
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <div className="timeline__head">
              <h3><Bil kr="타임라인 · 4 트랙" en="Timeline · 4 tracks" /></h3>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em" }}>
                <Bil kr="자르기 5 · 자막 2 · 음성 3 · 음악 1" en="5 CUTS · 2 TITLES · 3 VO · 1 MUSIC" />
              </span>
              <div className="timeline__zoom">
                <button>−</button>
                <button className="is-on">1×</button>
                <button>+</button>
                <button><Bil kr="맞춤" en="FIT" /></button>
              </div>
            </div>

            <div className="timeline__ruler">
              {["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00"].map((t, i) => (
                <span key={t} style={{ left: `${(i / 6) * 100}%` }} className="num">{t}</span>
              ))}
            </div>

            <div className="timeline__tracks">

              {/* AI suggestion ghost — spans on timeline */}
              <div className="ai-suggest" style={{ left: "8.5%", width: "5%", top: 24, bottom: 0 }}>
                <span className="ai-suggest__lbl"><Bil kr="튜터: 0.5초만 더?" en="TUTOR · HOLD 0.5s LONGER?" /></span>
              </div>
              <div className="ai-suggest" style={{ left: "62%", width: "4%", top: 24, bottom: 0 }}>
                <span className="ai-suggest__lbl"><Bil kr="여기 침묵?" en="A PAUSE HERE?" /></span>
              </div>

              {/* Playhead at ~76% (2:18 of 3:00) */}
              <div className="playhead" style={{ left: `calc(56px + 8px + (100% - 56px - 8px) * 0.76)`, top: 24, bottom: 0 }} />

              {/* V1 — clips */}
              <div className="track">
                <span className="track__label">V1</span>
                <div className="track__lane">
                  <div className="clip-block clip-block--jar" style={{ left: "0%", width: "13%" }}>B-02 · <Bil kr="김치 통" en="JAR" /></div>
                  <div className="clip-block clip-block--hands" style={{ left: "13.5%", width: "20%" }}>B-01 · <Bil kr="할머니의 손" en="HANDS" /></div>
                  <div className="clip-block clip-block--time" style={{ left: "34%", width: "12%" }}>B-05 · <Bil kr="시계" en="CLOCK" /></div>
                  <div className="clip-block clip-block--cycle" style={{ left: "46.5%", width: "22%" }}>B-03 · <Bil kr="배추 → 김치" en="CYCLE" /></div>
                  <div className="clip-block clip-block--family" style={{ left: "69%", width: "31%" }}>B-04 · <Bil kr="식탁" en="TABLE" /></div>
                </div>
              </div>

              {/* V2 — titles */}
              <div className="track">
                <span className="track__label">V2</span>
                <div className="track__lane">
                  <div className="title-block" style={{ left: "1%", width: "16%" }}>
                    <Bil kr="할머니의 김치" en="GRANDMA'S KIMCHI" />
                  </div>
                  <div className="title-block title-block--closing" style={{ left: "78%", width: "20%" }}>
                    <Bil kr={<>시간이 <em className="s">맛</em>이다</>} en={<>TIME IS THE <em className="s">TASTE</em></>} />
                  </div>
                </div>
              </div>

              {/* A1 — voice */}
              <div className="track">
                <span className="track__label">A1 · VO</span>
                <div className="track__lane">
                  <div className="audio-block" style={{ left: "2%", width: "14%" }}>
                    <div className="wave">{Array.from({ length: 24 }).map((_, i) => <span key={i} style={{ height: `${30 + Math.sin(i * 0.6) * 50}%` }} />)}</div>
                  </div>
                  <div className="audio-block" style={{ left: "18%", width: "13%" }}>
                    <div className="wave">{Array.from({ length: 22 }).map((_, i) => <span key={i} style={{ height: `${28 + Math.cos(i * 0.7) * 48}%` }} />)}</div>
                  </div>
                  <div className="audio-block" style={{ left: "36%", width: "16%" }}>
                    <div className="wave">{Array.from({ length: 26 }).map((_, i) => <span key={i} style={{ height: `${32 + Math.sin(i * 0.5) * 52}%` }} />)}</div>
                  </div>
                  <div className="audio-block" style={{ left: "55%", width: "10%" }}>
                    <div className="wave">{Array.from({ length: 18 }).map((_, i) => <span key={i} style={{ height: `${30 + Math.cos(i * 0.8) * 45}%` }} />)}</div>
                  </div>
                </div>
              </div>

              {/* A2 — music / room tone */}
              <div className="track">
                <span className="track__label">A2 · MUS</span>
                <div className="track__lane">
                  <div className="audio-block audio-block--music" style={{ left: "0%", width: "100%" }}>
                    <div className="wave">{Array.from({ length: 110 }).map((_, i) => <span key={i} style={{ height: `${18 + Math.sin(i * 0.25) * 28 + (i % 7) * 4}%` }} />)}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.MakeScreen = MakeScreen;
