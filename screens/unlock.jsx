// screens/unlock.jsx — three unlock-moment variants, togglable
// Each is a self-contained micro-scene showing the moment when AI opens
// after the kid drafts. The 'most important emotional beat' in the brief.

const { useState: useStateU, useEffect: useEffectU } = React;

function UnlockSceneA() {
  // Variant A — soft glow + serif italic line fades in.
  const [phase, setPhase] = useStateU(0);
  useEffectU(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1700);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const t4 = setTimeout(() => setPhase(0), 5200);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);
  return (
    <div className="unlock-scene unlock-A" data-phase={phase}>
      <div className="unlock-A__chamber">
        <div className="unlock-A__halo" />
        <SumiMark size={56} />
      </div>
      <p className="unlock-A__line serif">
        <Bil
          kr={<>이제 함께 <em className="s">생각해볼까요</em>.</>}
          en={<>Now let's <em className="s">think together</em>.</>}
        />
      </p>
    </div>
  );
}

function UnlockSceneB() {
  // Variant B — notebook page-turn metaphor.
  const [phase, setPhase] = useStateU(0);
  useEffectU(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => setPhase(0), 5200);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div className="unlock-scene unlock-B" data-phase={phase}>
      <div className="unlock-B__book">
        <div className="unlock-B__left">
          <div className="unlock-B__lines">
            <span className="unlock-B__line" /><span className="unlock-B__line" /><span className="unlock-B__line" />
            <span className="unlock-B__line short" /><span className="unlock-B__line" /><span className="unlock-B__line short" />
          </div>
          <span className="unlock-B__cap mono"><Bil kr="너의 초안" en="YOUR DRAFT" /></span>
        </div>
        <div className="unlock-B__right">
          <div className="unlock-B__sumi"><SumiMark size={44} /></div>
          <span className="unlock-B__cap mono"><Bil kr="튜터의 페이지" en="TUTOR'S PAGE" /></span>
        </div>
        <div className="unlock-B__page" />
      </div>
    </div>
  );
}

function UnlockSceneC() {
  // Variant C — draft slides left, AI slides in from right with hairline rule.
  const [phase, setPhase] = useStateU(0);
  useEffectU(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(0), 5200);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div className="unlock-scene unlock-C" data-phase={phase}>
      <div className="unlock-C__pane unlock-C__draft">
        <span className="mono"><Bil kr="너의 초안" en="YOUR DRAFT" /></span>
        <p className="serif">"엄마는 빨리, <em className="s">할머니는 천천히</em>."</p>
      </div>
      <div className="unlock-C__rule" />
      <div className="unlock-C__pane unlock-C__ai">
        <SumiMark size={32} />
        <p className="serif"><Bil kr={<>그 차이를 <em className="s">왜</em> 적었어요?</>} en={<><em className="s">Why</em> did you write that difference?</>}/></p>
      </div>
    </div>
  );
}

function UnlockShowcase() {
  const [pick, setPick] = useStateU("A");
  return (
    <div className="frame unlock-page">
      <div className="unlock-page__shell">
        <header className="unlock-page__hero">
          <div className="eyebrow"><span className="dot"/><span className="mono"><Bil kr="잠금 해제 순간" en="UNLOCK MOMENT"/></span></div>
          <h1 className="unlock-page__title">
            <Bil
              kr={<>아이가 충분히 썼을 때 — <em className="s">AI가 열려요</em>.</>}
              en={<>When the kid has written enough — <em className="s">AI opens</em>.</>}
            />
          </h1>
          <p className="unlock-page__sub">
            <Bil
              kr="이 순간은 처벌의 해제가 아니라, 아이가 진짜 일을 했다는 인정이에요. 세 가지 변주를 골라보세요. 자동으로 반복 재생됩니다."
              en="This moment isn't a release from punishment — it's an acknowledgement that the kid did the real work. Pick a variant. Each loops automatically."
            />
          </p>
        </header>

        <div className="unlock-page__tabs">
          {["A","B","C"].map(k => (
            <button key={k} className={"unlock-tab" + (pick===k ? " unlock-tab--on" : "")} onClick={()=>setPick(k)}>
              <span className="mono">VARIANT {k}</span>
              <span className="serif unlock-tab__title">
                {k==="A" && <Bil kr="조용한 글로우" en="A quiet glow"/>}
                {k==="B" && <Bil kr="공책 펼치기" en="Notebook opens"/>}
                {k==="C" && <Bil kr="옆으로 비키기" en="Slide aside"/>}
              </span>
              <span className="unlock-tab__desc">
                {k==="A" && <Bil kr="살구색 헤일로 + 세리프 한 줄" en="Amber halo + one serif line"/>}
                {k==="B" && <Bil kr="공책의 다음 페이지가 열림" en="The notebook's next page turns"/>}
                {k==="C" && <Bil kr="초안이 비키고 AI가 들어옴" en="Draft slides; AI arrives"/>}
              </span>
            </button>
          ))}
        </div>

        <div className="unlock-page__stage" key={pick}>
          {pick === "A" && <UnlockSceneA />}
          {pick === "B" && <UnlockSceneB />}
          {pick === "C" && <UnlockSceneC />}
        </div>

        <p className="unlock-page__note mono">
          <Bil kr="* 자동 반복 · 5초 루프" en="* AUTO-LOOP · 5S CYCLE"/>
        </p>
      </div>
    </div>
  );
}
window.UnlockShowcase = UnlockShowcase;
