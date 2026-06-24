// parent/wall.jsx — Family Wall
// A low-pressure async surface where extended family (grandparents,
// siblings, cousins, aunts/uncles) can leave a reaction or a short
// note on the kid's work. The kid sees them at end of week as a
// "family read" at the bottom of his portal. Parent moderates lightly.
//
// Three input shapes: emoji reaction, one-line text, 6-second voice memo.
// The wall feels like a noticeboard, not a feed — no comments-on-comments.

function PPWall({ activeKid = 'minjun' }) {
  const nav = (typeof usePPNav === 'function') ? usePPNav() : { goTo: () => {} };
  const kid = ppKids.find(k => k.id === activeKid) || ppKids[0];
  const [tab, setTab] = React.useState('all');

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} multi={true} />
      <div className="pp-scroll">

        <div className="pp-letter__crumb">
          <button className="pp-letter__back" onClick={() => nav.goTo('child')}>
            <Icon name="arrowL" size={16} />
          </button>
          <div className="mono">
            <Bil kr="가족 게시판" en="FAMILY WALL" />
          </div>
          <span className="pp-letter__seal mono pp-wall__seal">
            <Bil kr="비공개 · 가족만" en="PRIVATE · FAMILY ONLY" />
          </span>
        </div>

        {/* Hero */}
        <section className="pp-wall__hero">
          <div className="mono pp-wall__kicker">
            <span className="dot" />
            <Bil kr="이번 주 4명이 다녀갔어요" en="4 FAMILY MEMBERS VISITED" />
          </div>
          <h1 className="pp-wall__h">
            <Bil
              kr={<>민준이를 위한 가족의 <em className="s">한 줄</em>.</>}
              en={<>A <em className="s">line</em> from the family — for Minjun.</>}
            />
          </h1>
          <p className="pp-wall__sub">
            <Bil
              kr="할머니, 할아버지, 누나, 사촌이 이번 주 작업에 남긴 메모. 민준이는 금요일 저녁에 모두 한 번에 읽어요."
              en="Notes from grandma, grandpa, big sister and cousin on this week's work. Minjun reads them all together on Friday evening."
            />
          </p>
        </section>

        {/* Reaction summary strip */}
        <section className="pp-wall__reactions">
          <Reaction emoji="💛" countKr="6명" countEn="6" tone="butter" />
          <Reaction emoji="✨" countKr="3명" countEn="3" tone="lilac" />
          <Reaction emoji="🥺" countKr="2명" countEn="2" tone="peach" />
          <Reaction emoji="🌱" countKr="2명" countEn="2" tone="mint" />
          <Reaction emoji="📷" countKr="1명" countEn="1" tone="blue" />
        </section>

        {/* Filter pills */}
        <div className="pp-wall__filter">
          <button className={"pp-wall__pill" + (tab === 'all' ? " is-on" : "")} onClick={() => setTab('all')}>
            <Bil kr="전체 9" en="ALL · 9" />
          </button>
          <button className={"pp-wall__pill" + (tab === 'voice' ? " is-on" : "")} onClick={() => setTab('voice')}>
            <Icon name="mic" size={11} /> <Bil kr="음성 3" en="VOICE · 3" />
          </button>
          <button className={"pp-wall__pill" + (tab === 'text' ? " is-on" : "")} onClick={() => setTab('text')}>
            <Bil kr="한 줄 4" en="LINES · 4" />
          </button>
          <button className={"pp-wall__pill" + (tab === 'photo' ? " is-on" : "")} onClick={() => setTab('photo')}>
            <Icon name="folder" size={11} /> <Bil kr="사진 2" en="PHOTOS · 2" />
          </button>
        </div>

        {/* Wall — masonry-feeling list */}
        <section className="pp-wall__board">

          <WallNote
            kind="voice"
            tone="butter"
            tilt="-0.5"
            fromKr="할머니"
            fromEn="Grandma"
            avatar="할"
            relKr="외할머니"
            relEn="MATERNAL GRANDMA"
            timeKr="오늘 오전 9:12"
            timeEn="TODAY · 9:12 AM"
            kr="네가 만든 김치 영상 다 봤어. 할머니도 그렇게 만들어. 시간이 들어가는 거 — 맞아."
            en="Grandma watched your whole kimchi video. That's how I make it too. Time goes in — yes."
            duration="0:14"
          />

          <WallNote
            kind="text"
            tone="lilac"
            tilt="0.4"
            fromKr="누나"
            fromEn="Sister"
            avatar="서"
            relKr="이서연 · 초3"
            relEn="SEOYEON · G3"
            timeKr="어제 저녁"
            timeEn="LAST NIGHT"
            kr="민준 오빠 똑똑해 ✨ 나도 우리 학교에서 그런 거 하고 싶어."
            en="My brother is so smart ✨ I want to do something like that at my school too."
          />

          <WallNote
            kind="photo"
            tone="peach"
            tilt="-0.7"
            fromKr="할아버지"
            fromEn="Grandpa"
            avatar="할"
            relKr="외할아버지"
            relEn="MATERNAL GRANDPA"
            timeKr="2일 전"
            timeEn="2 DAYS AGO"
            kr="할아버지 어릴 때 — 우리 어머니가 김치 만드시는 사진이야. 너도 봐."
            en="From when I was a boy — my mother making kimchi. For you to see."
            photoCapKr="흑백 사진 · 1968년 · 부산"
            photoCapEn="B&W PHOTO · 1968 · BUSAN"
          />

          <WallNote
            kind="text"
            tone="mint"
            tilt="0.5"
            fromKr="이모"
            fromEn="Aunt"
            avatar="이"
            relKr="이은영 · 캐나다"
            relEn="EUNYOUNG · CANADA"
            timeKr="3일 전"
            timeEn="3 DAYS AGO"
            kr={"\"시간이 맛이다\" — 이건 우리 가족 전체가 알아야 하는 문장이야."}
            en={"\"Time is the taste\" — that's a sentence the whole family should know."}
          />

          <WallNote
            kind="voice"
            tone="blue"
            tilt="-0.3"
            fromKr="사촌 형"
            fromEn="Cousin"
            avatar="준"
            relKr="박지호 · 중2"
            relEn="JIHO · MIDDLE 2"
            timeKr="3일 전"
            timeEn="3 DAYS AGO"
            kr="형도 너네 학교 가고 싶었어. 영상 다시 보니까 진짜 잘 만들었어."
            en="I wish I'd gone to your school. Watched the video again — really well made."
            duration="0:08"
          />

          <WallNote
            kind="text"
            tone="butter"
            tilt="0.6"
            fromKr="할머니"
            fromEn="Grandma"
            avatar="할"
            relKr="친할머니"
            relEn="PATERNAL GRANDMA"
            timeKr="5일 전"
            timeEn="5 DAYS AGO"
            kr="우리 민준, 어쩜 그런 생각을 다 했니. 자랑스럽다."
            en="My little Minjun — how did you come up with that. So proud."
          />

          <WallNote
            kind="voice"
            tone="lilac"
            tilt="-0.4"
            fromKr="삼촌"
            fromEn="Uncle"
            avatar="삼"
            relKr="이재현 · 미국"
            relEn="JAEHYUN · USA"
            timeKr="1주 전"
            timeEn="1 WEEK AGO"
            kr="삼촌이 미국에서도 김치 만들어. 너 영상 본 다음에 — 천천히 만들었어."
            en="Uncle makes kimchi here in America too. After watching your video — I made it slowly."
            duration="0:22"
          />

        </section>

        {/* Compose new note */}
        <section className="pp-wall__compose">
          <div className="pp-wall__compose-head">
            <span className="mono"><Bil kr="가족 누군가 한 줄 남기게 하기" en="LET A FAMILY MEMBER LEAVE A LINE" /></span>
          </div>
          <p className="pp-wall__compose-sub">
            <Bil
              kr={<>링크 한 번 보내면 — 댓글 없이 <em className="s">한 줄</em>만 남길 수 있어요. 6초 음성도 가능.</>}
              en={<>One link sent — they can leave just <em className="s">one line</em>. Six-second voice also fine.</>}
            />
          </p>
          <div className="pp-wall__compose-actions">
            <button className="pp-wall__cta">
              <Icon name="users" size={14} />
              <Bil kr="할머니께 링크 보내기" en="Send link to grandma" />
            </button>
            <button className="pp-wall__cta-ghost">
              <Icon name="search" size={12} />
              <Bil kr="다른 가족" en="Someone else" />
            </button>
          </div>
        </section>

        {/* Privacy footer */}
        <footer className="pp-wall__priv mono">
          <span>
            <Bil
              kr="이 게시판은 부모만 모더레이션. 누구도 다른 누구의 메시지에 답글을 달 수 없어요."
              en="Only parents moderate this wall. No one can reply to anyone else's note."
            />
          </span>
        </footer>

      </div>
      <PPTabBar active="child" />
    </div>
  );
}

function Reaction({ emoji, countKr, countEn, tone }) {
  return (
    <div className={`pp-wall__reaction pp-wall__reaction--${tone}`}>
      <span className="pp-wall__reaction-emoji">{emoji}</span>
      <span className="pp-wall__reaction-n mono"><Bil kr={countKr} en={countEn} /></span>
    </div>
  );
}

function WallNote({ kind, tone, tilt, fromKr, fromEn, avatar, relKr, relEn, timeKr, timeEn, kr, en, duration, photoCapKr, photoCapEn }) {
  return (
    <article
      className={`pp-wall__note pp-wall__note--${tone}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <header className="pp-wall__note-head">
        <div className="pp-wall__note-av">{avatar}</div>
        <div className="pp-wall__note-from">
          <span className="serif"><Bil kr={fromKr} en={fromEn} /></span>
          <span className="mono"><Bil kr={relKr} en={relEn} /></span>
        </div>
        <span className="mono pp-wall__note-time"><Bil kr={timeKr} en={timeEn} /></span>
      </header>

      {kind === "photo" && (
        <div className="pp-wall__note-photo">
          <span className="serif"><Bil kr={photoCapKr} en={photoCapEn} /></span>
        </div>
      )}

      {kind === "voice" && (
        <div className="pp-wall__note-voice">
          <button className="pp-wall__note-play">
            <Icon name="play" size={11} />
          </button>
          <div className="pp-wall__note-bars">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="pp-wall__note-bar"
                style={{ height: 3 + 18 * Math.abs(Math.sin(i * 1.8 + Number(tilt || 0)) * Math.cos(i * 0.4)) }} />
            ))}
          </div>
          <span className="pp-wall__note-dur mono">{duration}</span>
        </div>
      )}

      <p className="pp-wall__note-text">
        <Bil kr={kr} en={en} />
      </p>
    </article>
  );
}

window.PPWall = PPWall;
