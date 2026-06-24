// parent/conference.jsx — 1:1 Conference booking
// Parent books a private window with the mentor. Designed to feel like
// a calm appointment card, not a calendar grid. Mentor's open windows
// are shown as warm slots with what they're best used for.

function PPConference({ activeKid = 'minjun' }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  const kid = ppKids.find(k => k.id === activeKid) || ppKids[0];
  const [pick, setPick] = React.useState('thu-1630');
  const [mode, setMode] = React.useState('inperson');
  const [topic, setTopic] = React.useState('progress');

  // Open windows offered by the mentor for the coming 2 weeks.
  const slots = [
    { id: 'wed-0900', dayKr: '수', dayEn: 'WED', dateKr: '4월 30일', dateEn: 'APR 30',
      time: '오전 9:00 — 9:25', timeEn: '9:00 — 9:25 AM',
      bestKr: '아침 · 짧은 인사', bestEn: 'Morning · brief check-in',
      remaining: 1 },
    { id: 'thu-1630', dayKr: '목', dayEn: 'THU', dateKr: '5월 1일', dateEn: 'MAY 1',
      time: '오후 4:30 — 5:00', timeEn: '4:30 — 5:00 PM',
      bestKr: '하교 후 · 차분한 대화', bestEn: 'After school · longer talk',
      featured: true, remaining: 2 },
    { id: 'fri-1100', dayKr: '금', dayEn: 'FRI', dateKr: '5월 2일', dateEn: 'MAY 2',
      time: '오전 11:00 — 11:30', timeEn: '11:00 — 11:30 AM',
      bestKr: '점심 전 · 30분', bestEn: 'Before lunch · 30 min',
      remaining: 1 },
    { id: 'mon-1700', dayKr: '월', dayEn: 'MON', dateKr: '5월 5일', dateEn: 'MAY 5',
      time: '오후 5:00 — 5:30', timeEn: '5:00 — 5:30 PM',
      bestKr: '일과 후 · 마음 편히', bestEn: 'After hours · informal',
      remaining: 3 },
    { id: 'tue-0815', dayKr: '화', dayEn: 'TUE', dateKr: '5월 6일', dateEn: 'MAY 6',
      time: '오전 8:15 — 8:45', timeEn: '8:15 — 8:45 AM',
      bestKr: '등교 시간 · 빠르게', bestEn: 'Drop-off time · quick',
      remaining: 1 },
  ];

  const topics = [
    { id: 'progress', kr: '민준이 진행 상황', en: "Minjun's progress" },
    { id: 'home',     kr: '집에서의 변화',  en: 'What I see at home' },
    { id: 'arketype', kr: '아키타입 질문',  en: 'Arketype questions' },
    { id: 'concern',  kr: '걱정되는 부분',  en: 'Something concerning me' },
    { id: 'future',   kr: '다음 학기 계획', en: 'Next semester' },
  ];

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">

        <div className="pp-letter__crumb">
          <button className="pp-letter__back" onClick={() => nav.goTo('msg')}>
            <Icon name="arrowL" size={16} />
          </button>
          <div className="mono">
            <Bil kr="1:1 면담 예약" en="BOOK A 1:1" />
          </div>
        </div>

        {/* Mentor card hero */}
        <section className="pp-conf__mentor">
          <div className="pp-conf__mentor-av">박</div>
          <div className="pp-conf__mentor-txt">
            <div className="mono pp-conf__mentor-role">
              <Bil kr="민준이의 멘토" en="MINJUN'S MENTOR" />
            </div>
            <h1 className="pp-conf__mentor-name">
              <Bil
                kr={<>박서윤 멘토와 <em className="s">조용한 30분</em>.</>}
                en={<>A <em className="s">quiet 30 min</em> with Mentor Seoyun.</>}
              />
            </h1>
            <p className="pp-conf__mentor-bio">
              <Bil
                kr="멘토 박서윤은 5학년 12명을 담당해요. 면담은 부모님 한 분 또는 두 분 모두, 짧고 사적인 대화 형식이에요."
                en="Mentor Seoyun looks after twelve G5 children. Meetings are short and private — one parent or both, however you prefer."
              />
            </p>
          </div>
        </section>

        {/* Last meeting note — calm continuity */}
        <section className="pp-conf__last">
          <div className="pp-conf__last-head">
            <span className="mono"><Bil kr="지난 면담 · 4월 1일" en="LAST MEETING · APR 1" /></span>
            <span className="pp-conf__last-dur mono"><Bil kr="27분" en="27 MIN" /></span>
          </div>
          <p className="serif">
            <Bil
              kr={<>"민준이의 침묵을 <em className="s">고민이 아닌 작업</em>으로 읽기로 했어요. 4주 후 다시 봅니다."</>}
              en={<>"We agreed to read Minjun's silences as <em className="s">work, not worry</em>. Revisit in four weeks."</>}
            />
          </p>
          <span className="mono pp-conf__last-sig">
            <Bil kr="— 멘토 메모 요약" en="— MENTOR NOTE · SUMMARY" />
          </span>
        </section>

        {/* Slot picker */}
        <section className="pp-conf__slots">
          <header className="pp-conf__slots-head">
            <h3 className="mono">
              <Bil kr="이번 주 · 다음 주 — 열린 시간" en="THIS WEEK · NEXT WEEK · OPEN WINDOWS" />
            </h3>
            <span className="mono muted">
              <Bil kr="5개 · 비공개 슬롯" en="5 SLOTS · PRIVATE" />
            </span>
          </header>

          <div className="pp-conf__slot-list">
            {slots.map(s => (
              <button key={s.id}
                className={"pp-conf__slot" + (pick === s.id ? " is-on" : "") + (s.featured ? " is-featured" : "")}
                onClick={() => setPick(s.id)}>
                <div className="pp-conf__slot-day">
                  <span className="serif"><Bil kr={s.dayKr} en={s.dayEn} /></span>
                  <span className="mono"><Bil kr={s.dateKr} en={s.dateEn} /></span>
                </div>
                <div className="pp-conf__slot-mid">
                  <span className="serif"><Bil kr={s.time} en={s.timeEn} /></span>
                  <span className="mono pp-conf__slot-best">
                    <Bil kr={s.bestKr} en={s.bestEn} />
                  </span>
                </div>
                <div className="pp-conf__slot-right">
                  {s.featured && (
                    <span className="pp-conf__slot-tag mono">
                      <Bil kr="추천" en="SUGGESTED" />
                    </span>
                  )}
                  <span className="mono pp-conf__slot-rem">
                    {s.remaining > 1
                      ? <Bil kr={`${s.remaining}자리`} en={`${s.remaining} LEFT`} />
                      : <Bil kr="마지막 자리" en="LAST" />}
                  </span>
                </div>
                <span className="pp-conf__slot-check">
                  <Icon name="check" size={12} />
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Mode (in-person / video / phone) */}
        <section className="pp-conf__mode">
          <h3 className="mono">
            <Bil kr="만나는 방식" en="HOW WE'LL MEET" />
          </h3>
          <div className="pp-conf__mode-grid">
            <button className={"pp-conf__mode-btn" + (mode === 'inperson' ? " is-on" : "")} onClick={() => setMode('inperson')}>
              <div className="pp-conf__mode-ico">
                <Icon name="home" size={16} />
              </div>
              <span className="serif"><Bil kr="대면" en="In person" /></span>
              <span className="mono muted"><Bil kr="학교 멘토실" en="MENTOR ROOM" /></span>
            </button>
            <button className={"pp-conf__mode-btn" + (mode === 'video' ? " is-on" : "")} onClick={() => setMode('video')}>
              <div className="pp-conf__mode-ico">
                <Icon name="search" size={16} />
              </div>
              <span className="serif"><Bil kr="영상" en="Video" /></span>
              <span className="mono muted"><Bil kr="줌 링크 전송" en="ZOOM LINK SENT" /></span>
            </button>
            <button className={"pp-conf__mode-btn" + (mode === 'phone' ? " is-on" : "")} onClick={() => setMode('phone')}>
              <div className="pp-conf__mode-ico">
                <Icon name="mic" size={16} />
              </div>
              <span className="serif"><Bil kr="통화" en="Phone" /></span>
              <span className="mono muted"><Bil kr="멘토가 전화" en="MENTOR CALLS" /></span>
            </button>
          </div>
        </section>

        {/* Topic suggestion */}
        <section className="pp-conf__topic">
          <h3 className="mono">
            <Bil kr="무엇을 이야기하고 싶으세요" en="WHAT WOULD YOU LIKE TO TALK ABOUT" />
          </h3>
          <p className="pp-conf__topic-sub">
            <Bil
              kr={<>여러 개 선택해도 좋아요. 멘토가 <em className="s">미리</em> 준비해 와요.</>}
              en={<>Pick more than one if it helps — mentor will <em className="s">prepare</em> ahead.</>}
            />
          </p>
          <div className="pp-conf__topic-list">
            {topics.map(t => (
              <button key={t.id}
                className={"pp-conf__topic-pill" + (topic === t.id ? " is-on" : "")}
                onClick={() => setTopic(t.id)}>
                <Bil kr={t.kr} en={t.en} />
              </button>
            ))}
          </div>
          <div className="pp-conf__topic-note">
            <textarea
              className="pp-conf__topic-text"
              placeholder={"한 줄 메모 (선택)"}
              defaultValue={"민준이가 집에서 '시간이 맛이다'라는 말을 두 번 했어요. 어디서 시작되었는지 궁금합니다."}
            />
            <span className="mono pp-conf__topic-hint">
              <Bil kr="멘토만 봐요 · 비공개" en="MENTOR-ONLY · PRIVATE" />
            </span>
          </div>
        </section>

        {/* Booking summary */}
        <section className="pp-conf__summary">
          <div className="pp-conf__summary-head mono">
            <Bil kr="예약 요약" en="BOOKING SUMMARY" />
          </div>
          <ul className="pp-conf__summary-list">
            <li>
              <span className="mono"><Bil kr="시간" en="TIME" /></span>
              <span className="serif">
                <Bil kr="5월 1일 (목) 오후 4:30 — 5:00" en="Thu, May 1 · 4:30 — 5:00 PM" />
              </span>
            </li>
            <li>
              <span className="mono"><Bil kr="방식" en="HOW" /></span>
              <span className="serif"><Bil kr="대면 · 멘토실" en="In person · mentor room" /></span>
            </li>
            <li>
              <span className="mono"><Bil kr="멘토" en="MENTOR" /></span>
              <span className="serif"><Bil kr="박서윤" en="Seoyun Park" /></span>
            </li>
            <li>
              <span className="mono"><Bil kr="주제" en="TOPIC" /></span>
              <span className="serif"><Bil kr="민준이 진행 상황" en="Minjun's progress" /></span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="pp-conf__cta">
          <button className="pp-conf__send">
            <Bil kr="면담 확정하기" en="Confirm meeting" />
            <Icon name="arrow" size={14} />
          </button>
          <button className="pp-conf__cal">
            <Icon name="plus" size={12} />
            <Bil kr="달력에 추가" en="Add to calendar" />
          </button>
        </div>

      </div>
      <PPTabBar active="msg" />
    </div>
  );
}

window.PPConference = PPConference;
