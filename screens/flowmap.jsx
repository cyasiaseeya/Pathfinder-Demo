// screens/flowmap.jsx — 5-step PBL flow map (annotated)
function FlowMap() {
  const steps = [
    { n: 1, kr: "프로젝트 고르기", en: "Pick project", body: { kr: "비디오 · 프로토타입 · 실생활 제안 중 하나.", en: "One of: video · prototype · real-world fix." }, ai: "off" },
    { n: 2, kr: "초안 쓰기", en: "Draft first", body: { kr: "AI는 잠겨 있어요. 60단어 정도면 열려요.", en: "AI is locked. ~60 words and it opens." }, ai: "locked" },
    { n: 3, kr: "튜터와 대화", en: "Talk to tutor", body: { kr: "튜터는 질문만 해요. 답은 안 줘요.", en: "Tutor only asks. It does not answer." }, ai: "active" },
    { n: 4, kr: "혼자 고치기", en: "Revise alone", body: { kr: "튜터는 옆으로 비켜요. 고치는 건 너.", en: "Tutor steps aside. You revise." }, ai: "off" },
    { n: 5, kr: "발표·성찰", en: "Defend & reflect", body: { kr: "짝과 멘토에게 보여주고, 세 줄 성찰.", en: "Show peer + mentor. Three-line journal." }, ai: "off" },
  ];
  return (
    <div className="frame flowmap">
      <div className="flowmap__shell">
        <header className="flowmap__hero">
          <div className="eyebrow"><span className="dot"/><span className="mono"><Bil kr="흐름도 · 50분 세션 사이의 자기 학습" en="FLOW · SELF-STUDY BETWEEN SESSIONS"/></span></div>
          <h1 className="flowmap__title">
            <Bil
              kr={<>한 프로젝트 = <em className="s">5단계</em>. AI는 <em className="s">두 번째 단계가 끝난 뒤에만</em> 열려요.</>}
              en={<>One project = <em className="s">5 steps</em>. AI opens <em className="s">only after step 2</em>.</>}
            />
          </h1>
        </header>

        <div className="flow">
          {steps.map((s,i) => (
            <React.Fragment key={s.n}>
              <div className={`flow-node flow-node--${s.ai}`}>
                <span className="flow-node__n mono">0{s.n}</span>
                <h3 className="serif flow-node__title"><Bil kr={s.kr} en={s.en}/></h3>
                <p className="flow-node__body"><Bil kr={s.body.kr} en={s.body.en}/></p>
                <div className="flow-node__ai">
                  {s.ai === "off"     && <span className="chip"><Icon name="moon" size={11}/> <Bil kr="AI 잠잠" en="AI quiet"/></span>}
                  {s.ai === "locked"  && <span className="chip chip--peach"><Icon name="lock" size={11}/> <Bil kr="AI 잠김" en="AI locked"/></span>}
                  {s.ai === "active"  && <span className="chip chip--mint"><Icon name="sparkle" size={11}/> <Bil kr="AI 깨어남" en="AI active"/></span>}
                </div>
              </div>
              {i < steps.length-1 && <div className="flow-edge"><Icon name="arrow" size={14}/></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="flow-rules">
          <div className="flow-rule">
            <span className="mono"><Bil kr="규칙 01" en="RULE 01"/></span>
            <p><Bil kr="튜터는 답을 주지 않는다 — 질문만." en="The tutor never answers — only asks."/></p>
          </div>
          <div className="flow-rule">
            <span className="mono"><Bil kr="규칙 02" en="RULE 02"/></span>
            <p><Bil kr="아이가 먼저 쓴다 — 그 다음에야 AI가 열린다." en="The kid drafts first — only then does AI open."/></p>
          </div>
          <div className="flow-rule">
            <span className="mono"><Bil kr="규칙 03" en="RULE 03"/></span>
            <p><Bil kr="혼자 고친다 — AI 제안은 평가 대상, 채택 대상 아님." en="The kid revises alone — suggestions evaluated, not adopted."/></p>
          </div>
          <div className="flow-rule">
            <span className="mono"><Bil kr="규칙 04" en="RULE 04"/></span>
            <p><Bil kr="짝/멘토 앞에서 발표 — 그리고 세 줄 성찰." en="Defend to a peer/mentor — close with a three-line reflection."/></p>
          </div>
        </div>
      </div>
    </div>
  );
}
window.FlowMap = FlowMap;
