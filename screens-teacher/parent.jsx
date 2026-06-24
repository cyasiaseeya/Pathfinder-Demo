// screens-teacher/parent.jsx — Parent Bridge
// The mentor's view of the family-facing surface:
//   · Friday digest in composition (12 letters about to go out)
//   · Conversation threads where a parent has asked something
//   · Quiet visibility into what each family has been seeing
// Visual register matches the existing Parent Portal (warm paper, serif claims).

const { MentorTopbar, StageChip, HumanGate, Bil, Icon, SumiMark } = window;

// 12 families. status: digest-ready | digest-needs-mentor | thread-waiting | quiet
const FAMILIES = [
  { kr: "이민준", en: "Minjun Lee",   grade: "G5", parentKr: "이도원 · 박지윤", parentEn: "Dowon Lee · Jiyoon Park",
    status: "digest-needs-mentor",
    digest: { kr: "민준은 '시간이 맛이다'라는 자기 문장을 만들었어요. Voicer +12.", en: "Minjun made his own sentence — 'time is the taste.' Voicer +12." },
    waiting: { count: 1, kr: "민준 어머니가 어제 답장에 질문했어요.", en: "Minjun's mom asked back yesterday." },
    last: "2일 전" },
  { kr: "박도윤", en: "Doyoon Park",  grade: "G6", parentKr: "박준호", parentEn: "Junho Park",
    status: "digest-ready",
    digest: { kr: "도윤이 영상 — '버려지는 음식이 가장 비싸다.' 2분 47초.", en: "Doyoon's video — 'food we waste costs the most.' 2:47." },
    last: "3일 전" },
  { kr: "윤채원", en: "Chaewon Yoon", grade: "G6", parentKr: "윤서경",      parentEn: "Seogyeong Yoon",
    status: "thread-waiting",
    digest: { kr: "채원이 잠금 해제 — 금요일 의례에 부모 동석 권장.", en: "Chaewon unlocked — family invited Friday." },
    waiting: { count: 2, kr: "채원 어머니가 금요일 의례 시간을 확인하고 싶어해요.", en: "Mom wants to confirm Friday ceremony time." },
    last: "오늘" },
  { kr: "김연수", en: "Yeonsoo Kim",  grade: "G5", parentKr: "김유리",       parentEn: "Yuri Kim",
    status: "digest-needs-mentor",
    digest: { kr: "연수는 같은 질문을 두 번 받았어요. 멘토가 방향 돌렸어요.", en: "Tutor was about to loop. I redirected. Note inside." },
    last: "1주 전" },
  { kr: "최하윤", en: "Hayoon Choi",  grade: "G3", parentKr: "최은영",       parentEn: "Eunyoung Choi",
    status: "digest-ready",
    digest: { kr: "하윤이는 동네 지도 초안을 시작했어요 — 어른 두 명을 인터뷰.", en: "Hayoon began drafting the neighborhood map — interviewed two adults." },
    last: "5일 전" },
  { kr: "정도현", en: "Dohyun Jung",  grade: "G5", parentKr: "정혜린",       parentEn: "Hyerin Jung",
    status: "quiet",
    digest: { kr: "도현이는 친구 인터뷰 영상 편집 단계.", en: "Dohyun is editing Friend Interview." },
    last: "4일 전" },
  { kr: "한소율", en: "Soyul Han",    grade: "G4", parentKr: "한지호",       parentEn: "Jiho Han",
    status: "digest-ready",
    digest: { kr: "소율이는 포드캐스트 첫 회를 녹음했어요.", en: "Soyul recorded the first podcast episode." },
    last: "1주 전" },
  { kr: "강예준", en: "Yejun Kang",   grade: "G3", parentKr: "강민서",       parentEn: "Minseo Kang",
    status: "quiet",
    digest: { kr: "예준이는 친구에게 보낼 편지 두 번째 초안 중.", en: "Yejun is on a second draft of the letter." },
    last: "3일 전" },
  { kr: "조서아", en: "Seoa Cho",     grade: "G4", parentKr: "조혜진",       parentEn: "Hyejin Cho",
    status: "digest-needs-mentor",
    digest: { kr: "서아는 할머니 노래 듣기 — '천천히'를 골랐어요.", en: "Seoa listened to grandma's song — picked 'slowly.'" },
    last: "오늘" },
  { kr: "임지안", en: "Jian Lim",     grade: "G5", parentKr: "임재현",       parentEn: "Jaehyun Lim",
    status: "thread-waiting",
    digest: { kr: "지안이는 AI 한 답을 자기가 다시 검증했어요.", en: "Jian fact-checked an AI answer himself." },
    waiting: { count: 1, kr: "지안 어머니가 'Reactor 점수를 학교에 공유해도 되나요?'", en: "Jian's mom asks — 'is sharing the Reactor profile with school ok?'" },
    last: "오늘" },
  { kr: "오나라", en: "Nara Oh",      grade: "G6", parentKr: "오기훈",       parentEn: "Gihoon Oh",
    status: "digest-ready",
    digest: { kr: "나라는 동네 소리 8개 수집 완료.", en: "Nara collected 8 neighborhood sounds." },
    last: "2일 전" },
  { kr: "신유진", en: "Yujin Shin",   grade: "G4", parentKr: "신예나",       parentEn: "Yena Shin",
    status: "quiet",
    digest: { kr: "유진이는 비밀 일기 발표 영상을 다듬는 중.", en: "Yujin is polishing the Secret Diary video." },
    last: "1주 전" },
];

const STATUS_META = {
  "digest-needs-mentor": { kr: "디제스트 검토",  en: "DIGEST NEEDS YOU", tone: "violet", icon: "pencil" },
  "thread-waiting":      { kr: "부모 답장 대기", en: "PARENT WAITING",   tone: "coral",  icon: "chat" },
  "digest-ready":        { kr: "금요일에 보냄",  en: "READY · FRI 5pm",  tone: "ok",     icon: "feather" },
  "quiet":               { kr: "조용",          en: "QUIET",            tone: "muted",  icon: "moon" },
};

function ParentBridge() {
  const needYou = FAMILIES.filter(f => f.status === "digest-needs-mentor" || f.status === "thread-waiting");
  const ready   = FAMILIES.filter(f => f.status === "digest-ready");
  const quiet   = FAMILIES.filter(f => f.status === "quiet");

  return (
    <div className="frame">
      <MentorTopbar tab="parent" crumb={{ kr: "부모 다리", en: "Parent bridge" }} />
      <div className="scroll-y">
        <div className="parent__shell">

          <header className="parent__hero">
            <div>
              <div className="eyebrow"><span className="dot" /><Bil kr="이번 금요일 디제스트 · 5월 1일 17시 발송" en="FRIDAY DIGEST · DELIVERS MAY 1, 5 PM" /></div>
              <h1>
                <Bil
                  kr={<>12편의 <em className="s">짧은 편지</em>가 곧 부모에게 갑니다.</>}
                  en={<>Twelve <em className="s">short letters</em> about to go home.</>}
                />
              </h1>
              <p>
                <Bil
                  kr="Reactor가 각 가정에 맞춰 한 단락씩 초안을 잡아놓았어요. 다섯 편은 멘토 한 줄이 더 필요해요. 두 가정은 이미 답장을 기다리고 있어요."
                  en="Reactor drafted a paragraph for each family. Five want a mentor line. Two parents are already waiting on a reply."
                />
              </p>
            </div>
            <div className="parent__hero-stats">
              <div className="phstat phstat--violet">
                <span className="phstat__n serif">{needYou.length}</span>
                <span className="phstat__l mono"><Bil kr="멘토 손" en="NEED YOU" /></span>
              </div>
              <div className="phstat phstat--ok">
                <span className="phstat__n serif">{ready.length}</span>
                <span className="phstat__l mono"><Bil kr="발송 준비" en="READY" /></span>
              </div>
              <div className="phstat">
                <span className="phstat__n serif">{quiet.length}</span>
                <span className="phstat__l mono"><Bil kr="조용" en="QUIET" /></span>
              </div>
            </div>
          </header>

          {/* Filter strip */}
          <div className="parent__filters">
            <button className="filter-pill filter-pill--active"><Bil kr="전체 12가정" en="ALL · 12" /></button>
            <button className="filter-pill filter-pill--accent">
              <Bil kr={`멘토 손 ${needYou.length}`} en={`NEEDS YOU · ${needYou.length}`} />
            </button>
            <button className="filter-pill"><Bil kr="부모 답장" en="PARENT REPLIED" /></button>
            <button className="filter-pill"><Bil kr="이번 주 잠금 해제" en="UNLOCK THIS WEEK" /></button>
            <span style={{ marginLeft: "auto" }} className="filter-pill">
              <Bil kr="정렬 · 필요 먼저" en="SORT · NEEDS-FIRST" />
            </span>
          </div>

          {/* Letters grid */}
          <section className="letters">
            {[...needYou, ...ready, ...quiet].map((f, i) => (
              <LetterCard key={i} f={f} />
            ))}
          </section>

          {/* Open thread — example */}
          <section className="thread">
            <div className="thread__head">
              <div>
                <h3><Bil kr="열린 대화 · 윤채원 어머니" en="Open thread · Chaewon's mom" /></h3>
                <p className="muted">
                  <Bil
                    kr={<>잠금 해제 의례 동석 확인 · <em className="s">두 시간 전</em></>}
                    en={<>Confirming Unlock ceremony · <em className="s">2 hours ago</em></>}
                  />
                </p>
              </div>
              <span className="mono thread__count"><Bil kr="3통" en="3 MESSAGES" /></span>
            </div>
            <div className="thread__body">
              <ThreadMsg who="parent" name={{ kr: "윤서경 (어머니)", en: "Seogyeong (mom)" }}
                kr="채원이가 잠금 해제 의례 시간이 4시 30분이라고 했는데, 맞나요? 아빠도 같이 오고 싶어해요."
                en="Chaewon said the unlock ceremony is at 4:30 — is that right? Dad would like to come too." />
              <ThreadMsg who="mentor" name={{ kr: "박서윤 멘토", en: "Seoyun (mentor)" }}
                kr={<>맞아요. 5월 1일 오후 4시 30분, 학교 도서관 작은 방이에요. 두 분 다 환영합니다. <em className="s">의례는 약 15분 — 채원이가 직접 말합니다.</em></>}
                en={<>Yes — Fri May 1, 4:30 PM, the small library room. Both of you very welcome. <em className="s">The ceremony runs about 15 min — Chaewon does the speaking.</em></>} />
              <div className="thread__compose">
                <div className="thread__compose-head">
                  <SumiMark size={22} tone="violet" />
                  <span className="mono"><Bil kr="멘토 답장 — 초안" en="MENTOR DRAFT" /></span>
                  <HumanGate size={14} />
                  <span className="mono" style={{ marginLeft: "auto", color: "var(--muted)" }}>
                    <Bil kr="Reactor 도움 · 검토 후 발송" en="REACTOR ASSIST · YOU SEND" />
                  </span>
                </div>
                <textarea
                  className="thread__compose-text"
                  defaultValue={"한 가지 더 — 의례 끝에 채원이가 '4주차 편지'를 부모님께 읽어드릴 거예요. 손에 종이 한 장이면 충분합니다."}
                />
                <div className="thread__compose-actions">
                  <button className="act-btn act-btn--approve">
                    <Icon name="check" size={12} />
                    <Bil kr="이대로 발송" en="Send as-is" />
                  </button>
                  <button className="act-btn">
                    <Icon name="pencil" size={12} />
                    <Bil kr="고쳐서 발송" en="Edit & send" />
                  </button>
                  <button className="act-btn act-btn--hold">
                    <Bil kr="일단 보류" en="Hold for now" />
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function LetterCard({ f }) {
  const meta = STATUS_META[f.status];
  return (
    <article className={`letter letter--${meta.tone}`}>
      <header className="letter__head">
        <div className="letter__who">
          <div className="letter__av">{f.kr.charAt(0)}</div>
          <div>
            <div className="letter__name"><Bil kr={f.kr} en={f.en} /></div>
            <div className="letter__sub mono">
              {f.grade} · <Bil kr={f.parentKr} en={f.parentEn} />
            </div>
          </div>
        </div>
        <span className={`letter__status letter__status--${meta.tone}`}>
          <Icon name={meta.icon} size={11} />
          <Bil kr={meta.kr} en={meta.en} />
        </span>
      </header>

      <div className="letter__sheet">
        <span className="letter__quote">"</span>
        <p className="serif"><Bil kr={f.digest.kr} en={f.digest.en} /></p>
      </div>

      {f.waiting && (
        <div className="letter__waiting">
          <Icon name="chat" size={12} />
          <span><Bil kr={f.waiting.kr} en={f.waiting.en} /></span>
        </div>
      )}

      <footer className="letter__foot">
        <span className="mono"><Bil kr={`마지막 연락 · ${f.last}`} en={`LAST CONTACT · ${f.last}`} /></span>
        {f.status === "digest-needs-mentor" && (
          <button className="letter__cta letter__cta--primary">
            <Bil kr="한 줄 더 쓰기" en="Add a line" /> <Icon name="pencil" size={11} />
          </button>
        )}
        {f.status === "thread-waiting" && (
          <button className="letter__cta letter__cta--coral">
            <Bil kr="답장 쓰기" en="Reply" /> <Icon name="arrow" size={11} />
          </button>
        )}
        {f.status === "digest-ready" && (
          <button className="letter__cta">
            <Bil kr="미리 보기" en="Preview" /> <Icon name="arrow" size={11} />
          </button>
        )}
        {f.status === "quiet" && (
          <button className="letter__cta letter__cta--ghost">
            <Bil kr="열기" en="Open" /> <Icon name="arrow" size={11} />
          </button>
        )}
      </footer>
    </article>
  );
}

function ThreadMsg({ who, name, kr, en }) {
  return (
    <div className={`tmsg tmsg--${who}`}>
      <div className="tmsg__head mono">
        <span><Bil kr={name.kr} en={name.en} /></span>
      </div>
      <div className="tmsg__bubble">
        <p><Bil kr={kr} en={en} /></p>
      </div>
    </div>
  );
}

window.ParentBridge = ParentBridge;
