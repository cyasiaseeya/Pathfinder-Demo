// parent/scrapbook.jsx — Year Scrapbook
// Novel surface. The kid's year as a scrolling document — month bands,
// projects, the artifacts the family will want to remember. Designed
// to feel like turning the pages of a kept book, not a feed.
//
// Mounted as a destination from My Child ("see the year").

function PPScrapbook({ activeKid = 'minjun' }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  const kid = ppKids.find(k => k.id === activeKid) || ppKids[0];

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">

        <div className="pp-letter__crumb">
          <button className="pp-letter__back" onClick={() => nav.goTo('child')}>
            <Icon name="arrowL" size={16} />
          </button>
          <div className="mono">
            <Bil kr="민준의 한 해" en="MINJUN'S YEAR" />
          </div>
          <span className="pp-letter__seal mono">
            <Bil kr="2026년 봄~" en="SPRING 2026—" />
          </span>
        </div>

        {/* Cover — feels like the front page of a book */}
        <section className="pp-scrap__cover">
          <span className="pp-scrap__cover-spine mono">
            <Bil kr="ARK ACADEMY · 5학년 · 박서윤 멘토" en="ARK ACADEMY · G5 · MENTOR SEOYUN" />
          </span>
          <h1 className="pp-scrap__cover-title">
            <Bil
              kr={<>민준이의 한 해 — <em className="s">기록</em>.</>}
              en={<>Minjun's year — <em className="s">a record</em>.</>}
            />
          </h1>
          <p className="pp-scrap__cover-blurb">
            <Bil
              kr="3개 프로젝트 · 11편의 작업 · 4번의 잠금 해제. 한 해 동안 한 번도 같은 길로 가지 않았어요."
              en="3 projects · 11 artifacts · 4 unlocks. Not once did he take the same path twice."
            />
          </p>

          <div className="pp-scrap__cover-stats">
            <Stat n="3" kr="프로젝트" en="PROJECTS" />
            <Stat n="11" kr="작업" en="ARTIFACTS" />
            <Stat n="4" kr="잠금 해제" en="UNLOCKS" />
            <Stat n="142" kr="튜터 질문" en="TUTOR QS" />
          </div>
        </section>

        {/* Months — a vertical spine of bands */}
        <div className="pp-scrap__spine">

          <MonthBand monthKr="9월" monthEn="SEP" projectKr="시작" projectEn="BEGINNING">
            <p>
              <Bil
                kr={<>처음 며칠은 <em className="s">고르지</em> 않았어요. 책상에서 두 시간 — 빈 종이.</>}
                en={<>The first few days he didn't <em className="s">pick</em> anything. Two hours at the desk — blank paper.</>}
              />
            </p>
            <ScrapTrace dotKr="9.04" dotEn="9/04"
              kr="박서윤 멘토 만남"
              en="First meeting · Mentor Seoyun" />
          </MonthBand>

          <MonthBand monthKr="10월" monthEn="OCT" projectKr="동네 인터뷰" projectEn="NEIGHBORHOOD INTERVIEWS" tone="butter">
            <p>
              <Bil
                kr={<>첫 프로젝트 — 동네 가게 세 곳을 인터뷰. <em className="s">"왜 여기 가게를 하세요?"</em></>}
                en={<>First project — interviewed three neighborhood shops. <em className="s">"Why do you have a shop here?"</em></>}
              />
            </p>
            <ScrapArtifact kr="가게 주인 세 명의 손" en="Three shopkeepers' hands"
              capKr="민준이 그린 그림 · 색연필" capEn="MINJUN'S DRAWING · COLOR PENCIL" />
            <ScrapTrace dotKr="10.21" dotEn="10/21"
              kr="잠금 해제 · 1주차"
              en="Unlock · Week 01" tone="violet" />
          </MonthBand>

          <MonthBand monthKr="11월" monthEn="NOV" projectKr="조용한 달" projectEn="A QUIET MONTH">
            <p>
              <Bil
                kr={<>쉬어가는 달. 매일 두 줄씩 일기. 멘토가 <em className="s">"잘 쉬는 것도 일이에요"</em>라고.</>}
                en={<>A pause. Two-line journal entries each day. Mentor reminded him that <em className="s">"resting well is also work."</em></>}
              />
            </p>
          </MonthBand>

          <MonthBand monthKr="12월" monthEn="DEC" projectKr="할머니 노래" projectEn="GRANDMA'S SONG" tone="mint">
            <p>
              <Bil
                kr={<>겨울방학 — 할머니 댁에서 옛 노래를 녹음. 8곡. <em className="s">"이 노래는 왜 슬퍼요?"</em></>}
                en={<>Winter break — recorded old songs at grandma's house. 8 of them. <em className="s">"Why is this song sad?"</em></>}
              />
            </p>
            <ScrapAudio
              titleKr="할머니의 자장가 · 0:42" titleEn="Grandma's lullaby · 0:42"
            />
          </MonthBand>

          <MonthBand monthKr="1월" monthEn="JAN" projectKr="겨울 일기" projectEn="WINTER JOURNAL">
            <p>
              <Bil
                kr={<>한 달 내내 일기. 마지막 날, 두 줄짜리 시 — <em className="s">"눈이 천천히 / 시간도 천천히"</em>.</>}
                en={<>A month of journaling. Last entry was a two-line poem — <em className="s">"snow falls slowly / time falls slowly."</em></>}
              />
            </p>
          </MonthBand>

          <MonthBand monthKr="2월" monthEn="FEB" projectKr="친구 인터뷰" projectEn="FRIEND INTERVIEW" tone="peach">
            <p>
              <Bil
                kr={<>도현이를 인터뷰 — 그리고 도현이가 민준이를 인터뷰. <em className="s">"내가 답이 아니라 질문이 되는 게 흥미로워요."</em></>}
                en={<>Interviewed Dohyun — then Dohyun interviewed him back. <em className="s">"It was interesting to be the question, not the answer."</em></>}
              />
            </p>
            <ScrapTrace dotKr="2.18" dotEn="2/18"
              kr="잠금 해제 · 2주차"
              en="Unlock · Week 02" tone="violet" />
          </MonthBand>

          <MonthBand monthKr="3월" monthEn="MAR" projectKr="다리 만들기" projectEn="BRIDGE-MAKING" tone="blue">
            <p>
              <Bil
                kr={<>학교 운동장에 종이 다리 — 세 번 무너지고, 네 번째에 섰어요. 멘토가 <em className="s">"무너지는 것도 자료"</em>라고.</>}
                en={<>Paper bridge in the schoolyard — collapsed three times, stood on the fourth. Mentor said <em className="s">"the collapse is also data."</em></>}
              />
            </p>
            <ScrapArtifact kr="네 번의 시도" en="Four attempts"
              capKr="민준이 사진 · 4장" capEn="MINJUN'S PHOTOS · 4 OF THEM" />
          </MonthBand>

          <MonthBand monthKr="4월" monthEn="APR" projectKr="한국 음식" projectEn="KOREAN FOOD" tone="lilac" current>
            <p>
              <Bil
                kr={<>지금 진행 중. 엄마와 할머니의 김치. <em className="s">"시간이 맛이다"</em> — 본인이 만든 문장.</>}
                en={<>In progress. Mom's and grandma's kimchi. <em className="s">"Time is the taste"</em> — a sentence of his own.</>}
              />
            </p>
            <ScrapAudio
              titleKr="민준이의 30초 메모 · 영어" titleEn="Minjun's 30-sec memo · English"
              violet
            />
            <ScrapTrace dotKr="5.01" dotEn="5/01"
              kr="잠금 해제 예정 · 금요일"
              en="Unlock pending · Friday" tone="violet" future />
          </MonthBand>

        </div>

        {/* Closing page — what the year became */}
        <section className="pp-scrap__close">
          <h3 className="pp-scrap__close-title">
            <Bil
              kr={<>이 한 해, 민준이가 배운 것 — <em className="s">한 줄</em>.</>}
              en={<>What he learned this year — <em className="s">in one line</em>.</>}
            />
          </h3>
          <p className="pp-scrap__close-line">
            <Bil
              kr={<>"빠르게 도착하지 않아도 돼요. 시간이 들어가야 진짜가 돼요."</>}
              en={<>"You don't have to arrive fast. Time has to go in for something to be real."</>}
            />
          </p>
          <span className="pp-scrap__close-sig mono">
            <Bil kr="— 박서윤 멘토 · 2026년 봄" en="— MENTOR SEOYUN · SPRING 2026" />
          </span>
        </section>

        {/* Bottom actions */}
        <div className="pp-scrap__actions">
          <button className="pp-scrap__action">
            <Icon name="folder" size={13} />
            <Bil kr="PDF로 저장" en="Save as PDF" />
          </button>
          <button className="pp-scrap__action pp-scrap__action--ghost">
            <Icon name="users" size={13} />
            <Bil kr="할머니께 공유" en="Share with grandma" />
          </button>
        </div>

      </div>
      <PPTabBar active="child" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

function Stat({ n, kr, en }) {
  return (
    <div className="pp-scrap__stat">
      <span className="pp-scrap__stat-n serif">{n}</span>
      <span className="pp-scrap__stat-l mono"><Bil kr={kr} en={en} /></span>
    </div>
  );
}

function MonthBand({ monthKr, monthEn, projectKr, projectEn, tone, current, children }) {
  return (
    <section className={`pp-scrap__month pp-scrap__month--${tone || 'plain'} ${current ? 'pp-scrap__month--current' : ''}`}>
      <header className="pp-scrap__month-head">
        <div className="pp-scrap__month-tag">
          <span className="serif pp-scrap__month-name"><Bil kr={monthKr} en={monthEn} /></span>
          {current && <span className="pp-scrap__month-now mono"><Bil kr="지금" en="NOW" /></span>}
        </div>
        <span className="pp-scrap__month-proj mono">
          <Bil kr={projectKr} en={projectEn} />
        </span>
      </header>
      <div className="pp-scrap__month-body">
        {children}
      </div>
    </section>
  );
}

function ScrapArtifact({ kr, en, capKr, capEn }) {
  return (
    <figure className="pp-scrap__artifact">
      <div className="pp-scrap__artifact-img">
        <span className="serif"><Bil kr={`[ ${kr} ]`} en={`[ ${en} ]`} /></span>
      </div>
      <figcaption className="mono">
        <Bil kr={capKr} en={capEn} />
      </figcaption>
    </figure>
  );
}

function ScrapAudio({ titleKr, titleEn, violet }) {
  return (
    <div className={"pp-scrap__audio" + (violet ? " pp-scrap__audio--violet" : "")}>
      <button className="pp-scrap__audio-btn">
        <Icon name="play" size={11} />
      </button>
      <div className="pp-scrap__audio-bars">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="pp-scrap__audio-bar"
            style={{ height: 4 + 16 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.41)) }} />
        ))}
      </div>
      <span className="pp-scrap__audio-cap mono">
        <Bil kr={titleKr} en={titleEn} />
      </span>
    </div>
  );
}

function ScrapTrace({ dotKr, dotEn, kr, en, tone, future }) {
  return (
    <div className={"pp-scrap__trace" + (tone === 'violet' ? " pp-scrap__trace--violet" : "") + (future ? " pp-scrap__trace--future" : "")}>
      <span className="pp-scrap__trace-dot" />
      <span className="mono pp-scrap__trace-date">
        <Bil kr={dotKr} en={dotEn} />
      </span>
      <span className="serif pp-scrap__trace-text">
        <Bil kr={kr} en={en} />
      </span>
    </div>
  );
}

window.PPScrapbook = PPScrapbook;
