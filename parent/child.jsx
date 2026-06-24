// parent/child.jsx — My Child screen with soft Arketype radar

function PPChild({ activeKid = 'minjun', tooltipOn = false }) {
  const [drawerOpen, setDrawer] = React.useState(false);
  const [step, setStep] = React.useState(0);

  return (
    <div className="pp-frame">
      <PPAppBar activeKid={activeKid} bordered />
      <div className="pp-scroll">
        <div style={{ padding: '20px 0 6px' }}>
          <div className="pp-greet__time mono" style={{ marginBottom: 8 }}>
            <span className="dot" />
            <Bil kr="아키타입 · 16개 차원" en="ARKETYPE · 16 DIMENSIONS" />
          </div>
          <h1 className="pp-greet__h" style={{ fontSize: 24 }}>
            <Bil
              kr={<>민준이의 <em className="s">현재 모습</em>이에요.</>}
              en={<>This is who Minjun is <em className="s">right now</em>.</>}
            />
          </h1>
          <p className="pp-greet__sub" style={{ fontSize: 12 }}>
            <Bil
              kr="아키타입은 80개의 작은 신호를 16개의 큰 결로 묶은 거예요. 점수가 아니라, 결입니다."
              en="Arketype rolls 80 small signals into 16 broader grains. Not a score — a grain."
            />
          </p>
        </div>

        <div className="pp-radar" style={{ position: 'relative' }}>
          <SoftRadar size={300} />
          <div className="pp-radar__center">
            <div className="num">민</div>
            <div className="lab"><Bil kr="이민준 · 11세" en="MINJUN · 11" /></div>
          </div>
          {tooltipOn && (
            <div className="pp-tooltip" style={{ top: 32, left: 56 }}>
              <div className="pp-tooltip__h"><Bil kr="가이드 · 1/3" en="GUIDE · 1/3" /></div>
              <div>
                <Bil
                  kr="이건 점수표가 아니에요. 16가지 결이 시간이 지나며 천천히 변해요."
                  en="This isn\u2019t a scoreboard. Sixteen grains, slowly shifting over time."
                />
              </div>
              <div className="pp-tooltip__pager">
                <span className="pp-tooltip__dots">
                  <span className="pp-tooltip__dot pp-tooltip__dot--on" />
                  <span className="pp-tooltip__dot" />
                  <span className="pp-tooltip__dot" />
                </span>
                <button className="pp-tooltip__next"><Bil kr="다음" en="NEXT" /> →</button>
              </div>
            </div>
          )}
        </div>

        {/* Plain-language interpretation */}
        <div className="pp-narr">
          <p>
            <Bil
              kr={<>민준이는 시작 전에 <em className="s">질문이 많아요.</em> 또래보다 더요. 그건 보호해줄 만한 힘이에요.</>}
              en={<>Minjun asks <em className="s">more clarifying questions</em> before starting than most kids his age. That\u2019s a strength worth protecting.</>}
            />
          </p>
          <p>
            <Bil
              kr={<>한번 들어가면 오래 머물러요. <em className="s">참을성</em>과 <em className="s">결과 다듬기</em>가 함께 자라고 있어요.</>}
              en={<>Once he\u2019s in, he stays. <em className="s">Patience</em> and <em className="s">craft</em> are growing together.</>}
            />
          </p>
          <p>
            <Bil
              kr={<>다른 사람의 말을 듣는 결도 좋은 편이지만, 자기 목소리로 답하는 건 <em className="s">아직 천천히</em> 자라는 중이에요.</>}
              en={<>His listening is steady. <em className="s">Speaking in his own voice</em> is still arriving — slowly, on its own clock.</>}
            />
          </p>
        </div>

        <div className="pp-growth">
          <div className="pp-growth__h">
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--amber)' }} />
            <Bil kr="지금 함께 자라는 결" en="GROWTH SURFACE · NOW" />
          </div>
          <h3 className="pp-growth__title">
            <Bil
              kr="자기 목소리 · Voice"
              en="Voice · finding his own line"
            />
          </h3>
          <p className="pp-growth__why">
            <Bil
              kr="민준이는 듣는 결이 강해요. 다음 두 세션은 자기 생각을 짧은 문장으로 직접 적는 연습이 중심이에요."
              en="Minjun\u2019s listening is strong. The next two sessions center on writing short sentences in his own voice."
            />
          </p>
        </div>

        <div className="pp-drawer">
          <div className="pp-drawer__head" onClick={() => setDrawer(!drawerOpen)}>
            <span><Bil kr="데이터로 보고 싶다면" en="SEE THE DATA" /></span>
            <span className="chev" style={{ transform: drawerOpen ? 'rotate(180deg)' : 'none' }}>
              <Icon name="chevronD" size={12} />
            </span>
          </div>
          <p className="pp-drawer__hint">
            <Bil
              kr="80개의 작은 신호를 보여드려요. 평소엔 닫혀 있어요 — 결을 먼저 봐주세요."
              en="80 underlying signals. Closed by default — read the grain first."
            />
          </p>
          {drawerOpen && (
            <div style={{
              marginTop: 14, padding: 14,
              background: 'var(--paper-2)', borderRadius: 'var(--r-md)',
              fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.7,
              color: 'var(--ink-2)',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>clarifying-Q rate</span><span>0.78</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>iter. revisions / draft</span><span>3.4</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span>self-initiated audio</span><span>4 / wk</span>
              </div>
              <div style={{ color:'var(--muted)', marginTop:8 }}>… 77 more signals</div>
            </div>
          )}
        </div>

        <div style={{ height: 12 }} />
      </div>
      <PPTabBar active="child" />
    </div>
  );
}

window.PPChild = PPChild;
