// parent/projects.jsx — Projects timeline + share-card sheet

function PPProjects({ activeKid = 'minjun', shareOpen = false }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { share: shareOpen, setShare: () => {}, goTo: () => {} };
  const isOpen = nav.share !== undefined ? nav.share : shareOpen;
  const projects = [
    { date: { kr: '오늘 · 4:18 PM', en: 'TODAY · 4:18 PM' },
      title: { kr: '시간이 맛이다', en: 'Time is the taste' },
      sum:   { kr: '할머니 김치를 영어로 설명하는 30초 영상.', en: 'A 30-second video explaining grandma\u2019s kimchi in English.' },
      type: 'audio', sym: '♪', tag: 'AUDIO',
      meta: { kr: '진행 중', en: 'IN PROGRESS' } },
    { date: { kr: '어제 · 7:02 PM', en: 'YESTERDAY · 7:02 PM' },
      title: { kr: '엄마와 할머니의 김치 비교', en: 'Mom\u2019s kimchi vs. grandma\u2019s' },
      sum:   { kr: '두 김치의 차이를 표로 정리한 첫 시도.', en: 'First attempt at comparing two kimchis in a small table.' },
      type: 'write', sym: 'A', tag: 'WRITE',
      meta: { kr: '완료', en: 'DONE' } },
    { date: { kr: '월요일 · 4:48 PM', en: 'MON · 4:48 PM' },
      title: { kr: '내 동네의 5분 산책 지도', en: 'A 5-minute walk in my neighborhood' },
      sum:   { kr: '걸으며 본 8가지를 색연필로 그렸어요.', en: 'Eight things noticed on a walk, drawn in colored pencil.' },
      type: 'draw', sym: '✦', tag: 'DRAW',
      meta: { kr: '완료', en: 'DONE' } },
    { date: { kr: '지난 주 · 화', en: 'LAST WEEK · TUE' },
      title: { kr: '나만의 작은 알람', en: 'A tiny alarm I built' },
      sum:   { kr: '아침에 스스로 일어나기 위한 6줄짜리 코드.', en: 'Six lines of code to help him wake up on his own.' },
      type: 'code', sym: '⌘', tag: 'CODE',
      meta: { kr: '공유됨', en: 'SHARED' } },
  ];

  return (
    <div className="pp-frame" style={{ position: 'relative' }}>
      <PPAppBar activeKid={activeKid} bordered />
      <div className="pp-scroll">
        <div style={{ padding: '20px 0 4px' }}>
          <h1 className="pp-greet__h" style={{ fontSize: 24, marginBottom: 6 }}>
            <Bil
              kr={<>민준이가 만든 것들 <em className="s">— 모두</em>.</>}
              en={<>Everything Minjun has <em className="s">made</em>.</>}
            />
          </h1>
          <p className="pp-greet__sub" style={{ fontSize: 12 }}>
            <Bil
              kr="가장 최근부터. 카드를 눌러 작품 전체를 보거나, 공유 카드를 만들 수 있어요."
              en="Most recent first. Tap a card to see the full artifact, or generate a shareable card."
            />
          </p>
        </div>

        <div className="pp-proj">
          {projects.map((p, i) => (
            <React.Fragment key={i}>
              <div className="pp-proj__date mono"><Bil kr={p.date.kr} en={p.date.en} /></div>
              <div className="pp-proj-card" onClick={() => nav.setShare && nav.setShare(true)}>
                <div className={"pp-proj-card__thumb pp-proj-card__thumb--" + p.type}>
                  <span className="pp-proj-card__type mono">{p.tag}</span>
                  <span className="pp-proj-card__sym">{p.sym}</span>
                </div>
                <div className="pp-proj-card__body">
                  <h4 className="pp-proj-card__title"><Bil kr={p.title.kr} en={p.title.en} /></h4>
                  <p className="pp-proj-card__sum"><Bil kr={p.sum.kr} en={p.sum.en} /></p>
                  <div className="pp-proj-card__foot">
                    <span><Bil kr={p.meta.kr} en={p.meta.en} /></span>
                    <button className="pp-proj-card__share" onClick={(e) => { e.stopPropagation(); nav.setShare && nav.setShare(true); }}>
                      <Icon name="arrow" size={11} />
                      <Bil kr="공유" en="SHARE" />
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <PPTabBar active="projects" />

      {isOpen && (
        <div className="pp-share-overlay" onClick={(e) => { if (e.target === e.currentTarget) nav.setShare && nav.setShare(false); }}>
          <div className="pp-share-sheet">
            <div className="pp-share-sheet__handle" />
            <p className="pp-share-sheet__title">
              <Bil kr="공유 카드를 만들었어요" en="A card to share" />
            </p>

            <div className="pp-share-card">
              <div className="pp-share-card__head">
                <span className="ark">Ark Academy</span>
                <span><Bil kr="2026 · 4월 · 28일" en="APR · 28 · 2026" /></span>
              </div>
              <div className="pp-share-card__art">
                <span className="placeholder">
                  <Bil kr="[ 민준의 김치 항아리 스케치 ]" en="[ Minjun\u2019s kimchi-jar sketch ]" />
                </span>
              </div>
              <h3 className="pp-share-card__title">
                <Bil kr="시간이 맛이다." en="Time is the taste." />
              </h3>
              <p className="pp-share-card__quote">
                <Bil
                  kr={'"엄마는 빨리, 할머니는 천천히. 시간이 들어가서 맛이 달라요."'}
                  en={'"Mom fast, grandma slow. Time goes in, so the taste is different."'}
                />
              </p>
              <div className="pp-share-card__foot">
                <span className="by">— <Bil kr="이민준 · 11세" en="Minjun, 11" /></span>
                <span><Bil kr="ARK 아카데미 · 프로젝트" en="ARK ACADEMY · PROJECT" /></span>
              </div>
            </div>

            <div className="pp-share-actions">
              <button className="pp-share-action">
                <span className="pp-share-action__icon pp-share-action__icon--kakao">K</span>
                <span><Bil kr="카카오톡" en="KakaoTalk" /></span>
              </button>
              <button className="pp-share-action">
                <span className="pp-share-action__icon pp-share-action__icon--message"><Icon name="chat" size={14} /></span>
                <span><Bil kr="메시지" en="Message" /></span>
              </button>
              <button className="pp-share-action">
                <span className="pp-share-action__icon pp-share-action__icon--save"><Icon name="check" size={14} /></span>
                <span><Bil kr="저장" en="Save" /></span>
              </button>
              <button className="pp-share-action">
                <span className="pp-share-action__icon pp-share-action__icon--copy"><Icon name="quote" size={14} /></span>
                <span><Bil kr="링크" en="Copy link" /></span>
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
              <Bil
                kr="공유하기 전, 아이의 이름이 들어가도 괜찮은지 확인해주세요."
                en="Before sharing, check that you\u2019re comfortable including your child\u2019s name."
              />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

window.PPProjects = PPProjects;
