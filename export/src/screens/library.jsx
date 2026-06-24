// screens/library.jsx — Project Library / 프로젝트 서고
// "If you don't know what to do" surface. One hero pick + Surprise Me ticker
// + a curated grid by mood. Tutor offers a single Socratic prompt at the
// bottom: kid types one line, tutor responds with a question (never a project
// suggestion). Pinning drawer at the bottom (max 3).

// photo: a real Unsplash image; sized via ?w param. Bright/saturated picks.
// R(url) returns a bundled blob URL when the page is the standalone build,
// otherwise just returns the original URL. window.__photoByUrl is built
// from <meta name="ext-resource-dependency"> tags by the standalone shim.
const R = (u) => (typeof window !== "undefined" && window.__photoByUrl && window.__photoByUrl[u]) || u;
const PROJECT_POOL = [
  // Korea right now
  { id: "phone-free", cat: "now", fmt: "investigation", weeks: 4,
    title: { kr: "휴대폰 없는 학교", en: "The Phone-Free School Project" },
    hook: { kr: "교실에서 폰이 사라진 한 달을, 기자처럼 기록해보세요.",
            en: "Document the month phones leave the classroom — like an investigative journalist would." },
    why:  { kr: "이미 너희가 살고 있는 일이라, 이 주제의 전문가는 너희야.",
            en: "Every middle schooler is living this. You're already the experts." },
    tools: ["Claude", "Camera", "Canva"],
    picks: 12,
    photo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop" },
  { id: "y2k", cat: "now", fmt: "make", weeks: 3,
    title: { kr: "Y2K 부활 조사", en: "Y2K Revival Investigation" },
    hook: { kr: "엄마는 1999년에 진짜 뭘 입었을까? 인터뷰하고, 사진을 비교해 평결을 내려보세요.",
            en: "Interview your mom about what she actually wore in 1999. Compare with 2026 trends. Deliver a verdict." },
    why:  { kr: "부모와의 대화 + 시각 분석.",
            en: "Parent bonding + visual analysis." },
    tools: ["Claude", "Camera"],
    picks: 8,
    photo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop" },
  { id: "hellstar", cat: "now", fmt: "investigation", weeks: 2,
    title: { kr: "Hellstar, Essentials, Stüssy?", en: "Hellstar, Essentials, or Stüssy?" },
    hook: { kr: "복도를 점령한 세 브랜드 중 진짜 '이긴' 건 누구일까. 진짜 설문조사 방법론으로 조사하세요.",
            en: "Three brands rule the hallway. Run a real survey to find which one's actually winning." },
    why:  { kr: "연구 방법을 몰래 숨겨놓은, 진짜 재밌는 주제.",
            en: "Sneaks real research methods into something kids genuinely care about." },
    tools: ["Claude", "Camera"],
    picks: 9,
    photo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&q=80&auto=format&fit=crop" },

  // AI is changing my life
  { id: "ai-tutor-test", cat: "ai", fmt: "investigation", weeks: 2,
    title: { kr: "AI 튜터 실험", en: "The AI Tutor Test" },
    hook: { kr: "2주간 숙제를 세 가지 방식으로 — 혼자, 학원에서, AI와 함께. 점수·시간·자신감을 비교.",
            en: "For two weeks do homework three ways — solo, with a hagwon, with Claude. Compare grades, time, confidence." },
    why:  { kr: "지금 모든 한국 부모가 묻고 있는 바로 그 질문.",
            en: "The exact question every Korean parent is debating." },
    tools: ["Claude"],
    picks: 21,
    photo: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80&auto=format&fit=crop" },
  { id: "ai-bias", cat: "ai", fmt: "investigation", weeks: 2,
    title: { kr: "AI 편향 추적", en: "AI Bias Hunt" },
    hook: { kr: "ChatGPT, Claude, Gemini에게 같은 한국 관련 질문을 던져 답을 비교하고 성적표를 발행하세요.",
            en: "Ask three AIs the same questions about Korea. Catch them being wrong, biased, or western-centric. Publish a report card." },
    why:  { kr: "AI 사용자가 아니라, AI 비평가의 자리에 서보는 것.",
            en: "Positions you as critic of AI — not just a user." },
    tools: ["Claude", "Perplexity"],
    picks: 7,
    photo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop" },
  { id: "replace-self", cat: "ai", fmt: "make", weeks: 1,
    title: { kr: "나를 AI로 대체하기", en: "Replace Yourself with AI" },
    hook: { kr: "일주일간 가능한 모든 결정을 AI에게 위임. 뭐가 좋았고, 뭐가 무서웠는지 기록.",
            en: "For one week, delegate as much of your life to AI as you can. Document what worked, what was creepy, what felt less like you." },
    why:  { kr: "철학적이고, 한 줄짜리 결론이 나오는 실험.",
            en: "Viral-friendly, philosophically interesting, kid-honest." },
    tools: ["Claude"],
    picks: 14,
    photo: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&auto=format&fit=crop" },

  // Engage with the news
  { id: "election", cat: "news", fmt: "investigation", weeks: 4,
    title: { kr: "내가 투표할 수 없는 선거", en: "The Election I Can't Vote In" },
    hook: { kr: "관심 있는 한 가지 이슈를 뽑아, 세 군데 뉴스가 한 달간 어떻게 다르게 다루는지 추적.",
            en: "Pick an issue. Track how three different news sources cover it for a month. Use Claude to spot bias and framing." },
    why:  { kr: "미디어 리터러시는 2026년의 생존 기술.",
            en: "Media literacy is a 2026 survival skill." },
    tools: ["Claude"],
    picks: 6,
    photo: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80&auto=format&fit=crop" },
  { id: "climate-cheap", cat: "news", fmt: "prototype", weeks: 3,
    title: { kr: "신경 쓸 여유 없는 사람을 위한 기후 변화", en: "Climate Change for People Who Can't Afford to Care" },
    hook: { kr: "한국 중학생이 실제로 가장 저렴하게 친환경적으로 사는 법 10가지를 직접 시험하고 순위를 매겨보세요.",
            en: "Test 10 hypotheses for living lower-impact on a middle-school budget. Receipts, ranking, no preaching." },
    why:  { kr: '"환경 좀 챙겨" 같은 잔소리를 피한다.',
            en: "Dodges preachy eco-lecture energy." },
    tools: ["Claude", "Camera"],
    picks: 11,
    photo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80&auto=format&fit=crop" },
  { id: "birth-rate", cat: "news", fmt: "video", weeks: 4,
    title: { kr: "한국의 출생률 미스터리", en: "Korea's Birth Rate Mystery" },
    hook: { kr: "왜? 부모, 이모, 친구의 형제·자매를 인터뷰해 어린이의 시선으로 다큐를 만들어보세요.",
            en: "Why? Interview parents, aunts, friends' older siblings. Make an honest, kid's-eye documentary." },
    why:  { kr: "한국에서 가장 큰 대화 중 하나에, 거의 없는 어린이 목소리를 더한다.",
            en: "A massive ongoing conversation that almost no kid voices are in." },
    tools: ["Claude", "Camera"],
    picks: 4,
    photo: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1200&q=80&auto=format&fit=crop" },

  // Make something the world is talking about
  { id: "cozy-album", cat: "world", fmt: "make", weeks: 2,
    title: { kr: "코지 앨범", en: "The Cozy Album" },
    hook: { kr: "Suno로 5곡을 만들어 — 공부할 때, 잘 때, 학원 가는 길에 들을 수 있게 — YouTube에 올리고 재생수를 추적.",
            en: "Make 5 lo-fi tracks for studying, sleeping, walking home from hagwon. Release on YouTube. Track plays." },
    why:  { kr: "진짜 발매, 진짜 지표, 진짜 흐름에 올라타기.",
            en: "Real release. Real metric. Riding a real wave." },
    tools: ["Suno"],
    picks: 18,
    photo: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=1200&q=80&auto=format&fit=crop" },
  { id: "anti-algo", cat: "world", fmt: "investigation", weeks: 2,
    title: { kr: "반알고리즘", en: "The Anti-Algorithm" },
    hook: { kr: "2주간 의도적으로 알고리즘을 혼란스럽게. 싫어하는 걸 누르고, 안 보던 걸 보세요. 무엇이 바뀌는지 분석.",
            en: "Spend two weeks deliberately confusing your algorithm. Like things you hate. Watch what shifts." },
    why:  { kr: "메타 테크 비평이 웃기고 교육적이다.",
            en: "Meta-tech-criticism that's hilarious and educational." },
    tools: ["Claude"],
    picks: 16,
    photo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80&auto=format&fit=crop" },

  // Quietly impressive
  { id: "build-game", cat: "flex", fmt: "prototype", weeks: 2,
    title: { kr: "친구가 직접 할 수 있는 게임 만들기", en: "Build a game your friends can play" },
    hook: { kr: "Claude로 간단한 브라우저 게임을 코딩. 타자 시합, 학교 퀴즈, '선생님 피하기' — 링크를 보내요.",
            en: "Vibe-code a browser game with Claude — typing race, trivia, dodge-the-teacher. Send the link." },
    why:  { kr: "프로그래밍 논리, UX 설계, 디버깅을 슬쩍 익힌다.",
            en: "Hidden skills: programming logic, UX design, debugging." },
    tools: ["Claude"],
    picks: 22,
    photo: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&q=80&auto=format&fit=crop" },
  { id: "discord-bot", cat: "flex", fmt: "prototype", weeks: 2,
    title: { kr: "친구 그룹 전용 Discord 봇", en: "A Discord bot only your friend group needs" },
    hook: { kr: "지각하는 사람을 놀리고, 게임 통계를 매기고, 매일 짤을 보내는 봇. 코드는 Claude가.",
            en: "Roasts whoever's late, ranks gaming stats, sends daily memes. Claude writes the code." },
    why:  { kr: "API 사고, 자동화, 문제 분해.",
            en: "Hidden skills: API thinking, automation, decomposition." },
    tools: ["Claude"],
    picks: 13,
    photo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200&q=80&auto=format&fit=crop" },

  // Build a tiny universe
  { id: "invent-country", cat: "universe", fmt: "make", weeks: 4,
    title: { kr: "한 달간 가상 국가를 운영하기", en: "Invent a country and run it for a month" },
    hook: { kr: "국기, Suno로 국가, 화폐, 매주 AI로 만든 뉴스 헤드라인, 시민, 풀어야 할 문제. 실제처럼 업데이트.",
            en: "Flag, anthem (Suno), currency, weekly AI-generated news headlines, citizens, problems to solve. Post updates like it's real." },
    why:  { kr: "시민학 + 세계관 구축 + 지속 창작.",
            en: "Civics, world-building, sustained creative project." },
    tools: ["Claude", "Suno"],
    picks: 7,
    photo: "https://images.unsplash.com/photo-1520531158340-44015069e78e?w=1200&q=80&auto=format&fit=crop" },
  { id: "ai-pet", cat: "universe", fmt: "prototype", weeks: 1,
    title: { kr: "내 반려동물의 AI 버전", en: "Create an AI version of your pet" },
    hook: { kr: "커스텀 GPT나 Claude project를 만들어, 내 반려동물의 말투로 답하게 훈련. 성격 문서를 직접 써요.",
            en: "Train a custom GPT to talk like your pet would. Write the personality doc. Have it text you back." },
    why:  { kr: "캐릭터 글쓰기, AI 커스터마이징, 톤 잡기.",
            en: "Hidden skills: character writing, AI customization, voice/tone." },
    tools: ["Claude"],
    picks: 19,
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=80&auto=format&fit=crop" },

  // Cool kid tech flex
  { id: "meme-historian", cat: "techflex", fmt: "video", weeks: 2,
    title: { kr: "밈 역사학자가 되기", en: "Become a meme historian" },
    hook: { kr: "밈 하나를 골라 AI 번역으로 나라별 진화를 추적. 5분짜리 다큐멘터리로 만들어요.",
            en: "Pick one meme. Trace its evolution across countries with AI translation. 5-minute documentary." },
    why:  { kr: "리서치, 문화 분석, 영상 제작.",
            en: "Research, cultural analysis, video production." },
    tools: ["Claude", "Camera"],
    picks: 10,
    photo: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format&fit=crop" },
  { id: "ai-vs-you", cat: "techflex", fmt: "make", weeks: 4,
    title: { kr: "AI vs. 나: 그림 대결", en: "AI vs. you: art battle" },
    hook: { kr: "주제를 정해 직접 그리고, AI에게도 시키고, 둘 다 올려 친구들이 투표. 매주 반복.",
            en: "Pick a subject. Draw it by hand. Have AI draw it. Post both. Friends vote. Weekly." },
    why:  { kr: "기교, 프롬프트 엔지니어링, 공개 피드백에 익숙해지기.",
            en: "Artistic technique, prompt engineering, comfort with public feedback." },
    tools: ["Claude", "Camera"],
    picks: 15,
    photo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80&auto=format&fit=crop" },
];

const CATS = {
  now:      { kr: "지금 한국", en: "Korea right now" },
  ai:       { kr: "AI가 바꾸는 일상", en: "AI is changing my life" },
  news:     { kr: "뉴스에 부딪히기", en: "Engage with the news" },
  world:    { kr: "세상이 이야기하는 것 만들기", en: "Make something the world is talking about" },
  flex:     { kr: "조용히 인상적인 것", en: "Quietly impressive" },
  universe: { kr: "작은 우주 만들기", en: "Build a tiny universe" },
  techflex: { kr: "쿨한 테크 자랑", en: "Cool kid tech flex" },
};

const FMT_LABEL = {
  video:         { kr: "비디오", en: "VIDEO" },
  prototype:     { kr: "프로토타입", en: "PROTOTYPE" },
  investigation: { kr: "탐사", en: "INVESTIGATION" },
  make:          { kr: "창작", en: "MAKE" },
};

function ProjectLibrary() {
  const [hero, setHero] = React.useState(PROJECT_POOL.find(p => p.id === "phone-free"));
  const [pinned, setPinned] = React.useState(["ai-tutor-test", "build-game"]);
  const [tutorInput, setTutorInput] = React.useState("");
  const [tutorReply, setTutorReply] = React.useState(null);

  function shuffle() {
    const others = PROJECT_POOL.filter(p => p.id !== hero.id);
    setHero(others[Math.floor(Math.random() * others.length)]);
  }
  function togglePin(id) {
    setPinned(p => p.includes(id) ? p.filter(x => x !== id) : (p.length >= 3 ? p : [...p, id]));
  }
  function askTutor() {
    if (!tutorInput.trim()) return;
    // tutor never proposes a project — only asks a question
    const q = [
      { kr: "그게 너에게 왜 흥미로워? 한 줄로 적어볼래?",
        en: "Why does that catch your eye? Try one sentence." },
      { kr: "그 안에서 무엇이 가장 너답게 느껴져?",
        en: "What part of that feels most like you?" },
      { kr: "한 사람만 이걸 보게 된다면, 누가 봤으면 좋겠어?",
        en: "If only one person ever saw your finished thing, who would you want it to be?" },
    ][Math.floor(Math.random() * 3)];
    setTutorReply(q);
  }

  const byCat = Object.keys(CATS).map(k => ({
    key: k,
    label: CATS[k],
    items: PROJECT_POOL.filter(p => p.cat === k),
  })).filter(g => g.items.length);

  return (
    <div className="frame lib">
      <Topbar tab="today" crumb={{ kr: "프로젝트 서고", en: "Project Library" }} />
      <div className="scroll-y">
        <div className="lib__shell">

          {/* Hero — picked-for-you */}
          <header className="lib__hero">
            <div className="lib__hero-left">
              <div className="eyebrow">
                <span className="dot" />
                <span className="mono">
                  <Bil kr="너를 위해 골라봤어요" en="WE PICKED THIS FOR YOU" />
                </span>
              </div>
              <h1 className="lib__hero-title">
                <Bil
                  kr={<>{hero.title.kr.split(" ").slice(0, -1).join(" ")} <em className="s">{hero.title.kr.split(" ").slice(-1)[0]}</em></>}
                  en={<>{hero.title.en.split(" ").slice(0, -1).join(" ")} <em className="s">{hero.title.en.split(" ").slice(-1)[0]}</em></>} />
              </h1>
              <p className="lib__hero-hook serif">
                <Bil kr={hero.hook.kr} en={hero.hook.en} />
              </p>
              <p className="lib__hero-why">
                <span className="lib__hero-why-eyebrow mono">
                  <Bil kr="이걸 고른 이유 ·" en="WHY THIS, FOR YOU ·" />
                </span>{" "}
                <Bil
                  kr={<>네가 지난 주에 <b>관찰자(者)</b>로 한 단계 올라갔어. 이 프로젝트가 그 흐름과 잘 맞아.</>}
                  en={<>You leveled up as <b>Observer (者)</b> last week. This one fits that current.</>} />
              </p>

              <div className="lib__hero-meta">
                <span className="chip chip--ink">
                  <Bil kr={FMT_LABEL[hero.fmt].kr} en={FMT_LABEL[hero.fmt].en} />
                </span>
                <span className="chip">
                  <Bil kr={`약 ${hero.weeks}주`} en={`~ ${hero.weeks} WK`} />
                </span>
                {hero.tools.map(t => <span key={t} className="chip chip--blue">{t}</span>)}
              </div>

              <div className="lib__hero-cta">
                <button className="btn btn--primary">
                  <Bil kr="시작하기" en="Start drafting" /> <Icon name="arrow" size={14} />
                </button>
                <button className="btn btn--ghost" onClick={shuffle}>
                  <Bil kr="다른 거 보여줘" en="Suggest another" />
                </button>
                <button className={"btn " + (pinned.includes(hero.id) ? "btn--accent" : "btn--ghost")} onClick={() => togglePin(hero.id)}>
                  <Bil
                    kr={pinned.includes(hero.id) ? "저장됨" : "나중에 볼래"}
                    en={pinned.includes(hero.id) ? "Saved" : "Save for later"} />
                </button>
              </div>
            </div>

            <aside className="lib__hero-right">
              <div className="lib__hero-num mono">№ {String(PROJECT_POOL.findIndex(p => p.id === hero.id) + 1).padStart(2, "0")} / {String(PROJECT_POOL.length).padStart(2, "0")}</div>
              <div className="lib__hero-art" data-cat={hero.cat}>
                <img src={R(hero.photo)} alt="" className="lib__hero-photo" />
                <div className="lib__hero-picks">
                  <span className="mono lib__picks-eyebrow"><Bil kr="다른 친구들도 골랐어요" en="OTHER KIDS PICKED THIS" /></span>
                  <span className="mono lib__picks-count">+ {hero.picks} <Bil kr="명" en="kids" /></span>
                </div>
              </div>
            </aside>
          </header>

          {/* Surprise me ticker */}
          <div className="lib__ticker">
            <div className="lib__ticker-label mono">
              <Bil kr="아무거나 보여줘" en="SURPRISE ME ·" />
            </div>
            <button className="lib__ticker-btn" onClick={shuffle}>
              <Bil kr="다른 프로젝트 던져줘 →" en="Throw me another project →" />
            </button>
            <div className="lib__ticker-hint">
              <Bil kr="고민이 길어지면, 바로 받아보세요." en="Stuck choosing? Take a random one." />
            </div>
          </div>

          {/* Categories grid */}
          {byCat.map(group => (
            <section key={group.key} className="lib__sec">
              <div className="sec-head">
                <span className="no">{group.key.toUpperCase()}</span>
                <h2><Bil kr={group.label.kr} en={group.label.en} /></h2>
                <span className="tag mono">{group.items.length} <Bil kr="프로젝트" en="projects" /></span>
              </div>
              <div className="lib__grid">
                {group.items.map(p => (
                  <article key={p.id} className={"libcard" + (pinned.includes(p.id) ? " libcard--pinned" : "")}>
                    <div className="libcard__photo">
                      <img src={R(p.photo)} alt="" loading="lazy" />
                    </div>
                    <div className="libcard__body">
                      <div className="libcard__head">
                        <span className="chip"><Bil kr={FMT_LABEL[p.fmt].kr} en={FMT_LABEL[p.fmt].en} /></span>
                        <span className="libcard__est mono"><Bil kr={`${p.weeks}주`} en={`${p.weeks} WK`} /></span>
                      </div>
                      <h3 className="libcard__title serif">
                        <Bil kr={p.title.kr} en={p.title.en} />
                      </h3>
                      <p className="libcard__hook">
                        <Bil kr={p.hook.kr} en={p.hook.en} />
                      </p>
                      <p className="libcard__why">
                        <em><Bil kr={p.why.kr} en={p.why.en} /></em>
                      </p>
                      <div className="libcard__foot">
                        <div className="libcard__tools">
                          {p.tools.map(t => <span key={t} className="libcard__tool mono">{t}</span>)}
                        </div>
                        <span className="libcard__picks-count mono">+ {p.picks}</span>
                      </div>
                    </div>
                    <button
                      className={"libcard__pin" + (pinned.includes(p.id) ? " libcard__pin--on" : "")}
                      onClick={() => togglePin(p.id)}
                      aria-label="Pin">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill={pinned.includes(p.id) ? "currentColor" : "none"} />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* Tutor — Socratic prompt only */}
          <section className="lib__sec lib__tutor-sec">
            <div className="sec-head">
              <span className="no">+ · 01</span>
              <h2><Bil kr={<>아무것도 <em className="s">끌리지 않으면</em></>} en={<>If <em className="s">nothing</em> grabs you</>} /></h2>
              <span className="tag"><Bil kr="튜터는 답을 주지 않아요. 너에게 질문을 돌려줘요." en="The tutor won't pick. They'll ask you a question." /></span>
            </div>

            <div className="lib__tutor">
              <div className="lib__tutor-mark">
                <SumiMark size={48} variant="curious" thinking={!!tutorReply} />
              </div>
              <div className="lib__tutor-body">
                <div className="lib__tutor-prompt mono">
                  <Bil kr="한 줄로 — 요즘 무엇이 궁금해요?" en="ONE LINE — WHAT'S BEEN ON YOUR MIND?" />
                </div>
                <div className="lib__tutor-input">
                  <span className="serif lib__tutor-prefix"><Bil kr="요즘 나는 …" en="Lately I'm into …" /></span>
                  <input
                    className="lib__tutor-text serif"
                    value={tutorInput}
                    onChange={e => setTutorInput(e.target.value)}
                    placeholder="" />
                  <button className="btn btn--primary" onClick={askTutor}>
                    <Bil kr="물어보기" en="Ask" />
                  </button>
                </div>
                {tutorReply && (
                  <div className="lib__tutor-reply">
                    <div className="eyebrow"><Bil kr="튜터" en="TUTOR" /></div>
                    <p className="serif lib__tutor-q">
                      "<Bil kr={tutorReply.kr} en={tutorReply.en} />"
                    </p>
                    <div className="lib__tutor-fine mono">
                      <Bil
                        kr="튜터는 프로젝트를 골라주지 않아요. 다만, 더 좋은 질문을 같이 찾아줘요."
                        en="Tutor won't pick a project for you. They'll help you find a sharper question." />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div style={{ height: 80 }} />
        </div>

        {/* Pinning drawer */}
        {pinned.length > 0 && (
          <div className="lib__drawer">
            <div className="lib__drawer-inner">
              <div className="lib__drawer-label">
                <span className="mono"><Bil kr="저장한 프로젝트" en="SAVED" /> · {pinned.length} / 3</span>
                <span className="lib__drawer-sub"><Bil kr="셋 중 하나를 골라 시작하세요." en="Pick one of these to start." /></span>
              </div>
              <div className="lib__drawer-items">
                {pinned.map(id => {
                  const p = PROJECT_POOL.find(x => x.id === id);
                  return (
                    <div key={id} className="lib__drawer-item">
                      <img className="lib__drawer-thumb" src={R(p.photo)} alt="" />
                      <span className="lib__drawer-title serif">
                        <Bil kr={p.title.kr} en={p.title.en} />
                      </span>
                      <button className="lib__drawer-x" onClick={() => togglePin(id)} aria-label="Remove">×</button>
                    </div>
                  );
                })}
              </div>
              <button className="btn btn--primary lib__drawer-cta">
                <Bil kr="비교하고 시작하기" en="Compare & start" /> <Icon name="arrow" size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.ProjectLibrary = ProjectLibrary;
