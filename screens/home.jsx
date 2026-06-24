// screens/home.jsx — Home / Project Picker
// 11-yr-old's view. Three projects: Korean food (in-progress, the thread of
// the prototype), Kindness Button (proposed prototype), Lunch waste fix.
// Recent reflections column. The aesthetic is "tutor's notebook" — quiet,
// substantive, no XP.

function HomeScreen({ youngerMode = false }) {
  return (
    <div className="frame home">
      <Topbar tab="today" crumb={{ kr: "어린 창의가", en: "   Young Innovators" }} />
      <div className="scroll-y">
        <div className="home__shell">
          {/* Hero — quiet, grown-up feel for 8-12 */}
          <header className="home__hero">
            <div className="eyebrow">
              <span className="dot" />
              <span className="mono">
                <Bil
                  kr="2026년 4월 29일 · 수요일"
                  en="WED · APR 29, 2026" />
                
              </span>
            </div>
            <h1 className="home__greeting">
              <Bil
                kr={<>안녕, 민준.<br /><em className="s">오늘 무엇을 만들고 싶어요?</em></>}
                en={<>Hi, Minjun.<br /><em className="s" style={{ fontFamily: "Poppins", fontWeight: "400" }}>What do you want to make today?</em></>} />
              
            </h1>
            <p className="home__subtitle">
              <Bil
                kr={<>이번 주 멘토는 <b>박서윤</b> 선생님 · 다음 만남 <b className="mono">금 16:00</b></>}
                en={<>Mentor this week: <b>Seoyun Park</b> · Next session <b className="mono">FRI 16:00</b></>} />
              
            </p>
          </header>

          {/* Section A — In progress */}
          <section className="home__sec">
            <div className="sec-head">
              <span className="no">A · 01</span>
              <h2><Bil kr={<>지금 만들고 있는 것 <em className="s">— 진행 중</em></>} en={<>What you're making <em className="s">— in progress</em></>} /></h2>
              <span className="tag"><Bil kr="이번 주 우리가 함께 들여다볼 작업이에요." en="The piece we'll look at together this week." /></span>
            </div>

            <article className="proj proj--active">
              <div className="proj__left">
                <div className="proj__kicker">
                  <span className="chip chip--ink">
                    <span className="chip-dot" />
                    <Bil kr="비디오 · 3분" en="VIDEO · 3 MIN" />
                  </span>
                  <span className="chip">
                    <Bil kr="3주차 / 4주" en="WEEK 3 OF 4" />
                  </span>
                  <span className="chip chip--lilac">
                    <Bil kr="공감 · 정체성" en="EMPATHY · IDENTITY" />
                  </span>
                </div>
                <h3 className="proj__title serif">
                  <Bil
                    kr={<>한국 음식에는 <em className="s">이야기</em>가 있어요.</>}
                    en={<>Korean food has <em className="s">stories</em> behind it.</>} />
                  
                </h3>
                <p className="proj__brief">
                  <Bil
                    kr="한 가지 음식을 골라, 외국인 친구가 그 음식을 보고 한 가지를 기억하게 만드는 3분짜리 영상을 만들어보세요."
                    en="Pick one dish. Make a 3-minute video that leaves a foreign friend remembering exactly one thing about it." />
                  
                </p>

                <div className="proj__steps">
                  {[
                  { kr: "프로젝트 고르기", en: "Pick project", done: true },
                  { kr: "초안 쓰기", en: "Draft first", done: true, current: false },
                  { kr: "튜터와 대화", en: "Talk to tutor", done: false, current: true },
                  { kr: "혼자 고치기", en: "Revise alone", done: false },
                  { kr: "발표·성찰", en: "Defend & reflect", done: false }].
                  map((s, i) =>
                  <div key={i} className={"step" + (s.done ? " step--done" : "") + (s.current ? " step--current" : "")}>
                      <span className="step__num mono">{String(i + 1).padStart(2, "0")}</span>
                      <span className="step__txt"><Bil kr={s.kr} en={s.en} /></span>
                    </div>
                  )}
                </div>

                <div className="proj__cta">
                  <button className="btn btn--primary">
                    <Bil kr="이어서 하기" en="Resume" /> <Icon name="arrow" size={14} />
                  </button>
                  <span className="proj__note mono">
                    <Bil
                      kr="다음 단계 · 튜터와 대화"
                      en="NEXT · TALK TO TUTOR" />
                    
                  </span>
                </div>
              </div>

              <aside className="proj__right">
                <div className="proj__draft-preview">
                  <div className="eyebrow"><Bil kr="내 초안에서" en="FROM YOUR DRAFT" /></div>
                  <blockquote className="serif proj__quote">
                    <Bil
                      kr={<>"할머니 김치는 <em className="s">시간</em>으로 만들어요. 빨리 익으면 맛이 없어요."</>}
                      en={<>"Grandma's kimchi is made of <em className="s">time</em>. If it ferments fast, it doesn't taste right."</>} />
                    
                  </blockquote>
                  <div className="proj__draft-meta mono">
                    <span><Bil kr="단어 수" en="WORDS" /> · <b className="num">142</b></span>
                    <span><Bil kr="저장됨" en="SAVED" /> · <b className="mono">14:08</b></span>
                  </div>
                </div>
              </aside>
            </article>
          </section>

          {/* Section B — Available projects */}
          <section className="home__sec">
            <div className="sec-head">
              <span className="no">A · 02</span>
              <h2><Bil kr={<>다른 <em className="s">선택지</em></>} en={<>Other <em className="s">choices</em></>} /></h2>
              <span className="tag"><Bil kr="끝낼 때까지 기다려도 되고, 지금 새로 시작해도 좋아요." en="You can finish first, or start a new one alongside." /></span>
            </div>

            <div className="proj-grid">
              <article className="proj-card">
                <div className="proj-card__head">
                  <span className="chip chip--peach"><Bil kr="프로토타입" en="PROTOTYPE" /></span>
                  <span className="proj-card__est mono"><Bil kr="약 2주" en="~ 2 WK" /></span>
                </div>
                <h3 className="serif proj-card__title">
                  <Bil
                    kr={<>우리 반을 위한 <em className="s">친절 버튼</em>을 만들어볼까요.</>}
                    en={<>Build a <em className="s">kindness button</em> for our class.</>} />
                  
                </h3>
                <p className="proj-card__brief">
                  <Bil
                    kr="누군가 도움이 필요할 때 누르는 버튼. 모양과 동작, 그리고 누른 다음 어떤 일이 일어날지 직접 디자인해 보세요."
                    en="A button you press when someone in class needs help. You design what it looks like, what it does, and what happens after." />
                  
                </p>
                <div className="proj-card__skills">
                  <span className="chip chip--lilac"><Bil kr="공감" en="Empathy" /></span>
                  <span className="chip chip--blue"><Bil kr="설계 사고" en="Design thinking" /></span>
                </div>
                <div className="proj-card__cta">
                  <button className="btn btn--ghost">
                    <Bil kr="살펴보기" en="Explore" /> <Icon name="arrow" size={13} />
                  </button>
                </div>
              </article>

              <article className="proj-card">
                <div className="proj-card__head">
                  <span className="chip chip--mint"><Bil kr="실생활 제안" en="REAL FIX" /></span>
                  <span className="proj-card__est mono"><Bil kr="약 3주" en="~ 3 WK" /></span>
                </div>
                <h3 className="serif proj-card__title">
                  <Bil
                    kr={<>학교 급식의 <em className="s">남는 음식</em>을 줄이는 방법.</>}
                    en={<>Reduce <em className="s">food waste</em> at school lunch.</>} />
                  
                </h3>
                <p className="proj-card__brief">
                  <Bil
                    kr="우리 학교에서 어떤 음식이 가장 많이 남는지 직접 살펴보고, 누구에게 어떤 제안을 할지 정해서 한 장짜리 제안서를 써보세요."
                    en="Watch what gets thrown out at our school for a week. Decide who you'd ask to change something, and write them a one-page proposal." />
                  
                </p>
                <div className="proj-card__skills">
                  <span className="chip chip--blue"><Bil kr="관찰" en="Observation" /></span>
                  <span className="chip chip--peach"><Bil kr="설득 글쓰기" en="Persuasive writing" /></span>
                </div>
                <div className="proj-card__cta">
                  <button className="btn btn--ghost">
                    <Bil kr="살펴보기" en="Explore" /> <Icon name="arrow" size={13} />
                  </button>
                </div>
              </article>

              <article className="proj-card proj-card--ghost">
                <div className="proj-card__head">
                  <span className="chip"><Bil kr="내가 만들기" en="YOUR OWN" /></span>
                </div>
                <h3 className="serif proj-card__title">
                  <Bil
                    kr={<>직접 <em className="s">제안</em>해도 좋아요.</>}
                    en={<>You can <em className="s">propose</em> your own.</>} />
                  
                </h3>
                <p className="proj-card__brief">
                  <Bil
                    kr="한 문장으로 무엇을 만들고 싶은지 적으면, 멘토 선생님이 함께 모양을 잡아줘요."
                    en="Write one sentence about what you want to make. Your mentor will help shape it with you." />
                  
                </p>
                <div className="proj-card__cta">
                  <button className="btn btn--ghost">
                    <Bil kr="제안 쓰기" en="Propose" /> <Icon name="plus" size={13} />
                  </button>
                </div>
              </article>
            </div>
          </section>

          {/* Section C — Recent reflections */}
          <section className="home__sec home__reflections">
            <div className="sec-head">
              <span className="no">A · 03</span>
              <h2><Bil kr={<>최근 <em className="s">성찰</em></>} en={<>Recent <em className="s">reflections</em></>} /></h2>
              <span className="tag"><Bil kr="내가 쓴 글이에요. 누구에게도 점수 매기지 않아요." en="Your own words. Nobody grades these." /></span>
            </div>
            <ul className="reflections">
              <li className="reflection">
                <span className="reflection__date mono"><Bil kr="04.27 월" en="04.27 MON" /></span>
                <p className="serif">
                  <Bil
                    kr={<>"오늘은 처음으로 카메라 앞에서 우리 할머니에 대해 이야기했다. <em className="s">이상하게 마음이 따뜻했다.</em>"</>}
                    en={<>"Today I talked about my grandma in front of a camera for the first time. <em className="s">It felt strangely warm.</em>"</>} />
                  
                </p>
                <span className="reflection__tag"><Bil kr="공감 · 정체성" en="Empathy · Identity" /></span>
              </li>
              <li className="reflection">
                <span className="reflection__date mono"><Bil kr="04.22 수" en="04.22 WED" /></span>
                <p className="serif">
                  <Bil
                    kr={<>"튜터가 답을 안 주는 게 처음엔 답답했다. 두 번째에는 <em className="s">내 생각이 더 정확</em>해졌다."</>}
                    en={<>"At first I was annoyed the tutor wouldn't just answer. The second time, <em className="s">my own thinking got sharper.</em>"</>} />
                  
                </p>
                <span className="reflection__tag"><Bil kr="인지적 회복력" en="Cognitive resilience" /></span>
              </li>
              <li className="reflection">
                <span className="reflection__date mono"><Bil kr="04.18 토" en="04.18 SAT" /></span>
                <p className="serif">
                  <Bil
                    kr={<>"연수에게 아이디어를 보여줬는데 <em className="s">한 줄을 바꾸라</em>고 했다. 그 한 줄이 사실 핵심이었다."</>}
                    en={<>"I showed Yeonsoo my idea. She said <em className="s">change one line</em>. That one line turned out to be the whole thing."</>} />
                  
                </p>
                <span className="reflection__tag"><Bil kr="협력" en="Collaboration" /></span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>);

}
window.HomeScreen = HomeScreen;