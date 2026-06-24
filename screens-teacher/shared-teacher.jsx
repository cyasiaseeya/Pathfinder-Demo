// screens-teacher/shared-teacher.jsx — teacher-portal-specific atoms

const { ArkBrand, Bil, Icon, SumiMark, AIStateChip } = window;

function MentorTopbar({ tab = "desk", crumb }) {
  const tabs = [
    { id: "desk", kr: "데스크", en: "Desk" },
    { id: "class", kr: "교실", en: "Class" },
    { id: "copilot", kr: "튜터 옆", en: "Co-pilot" },
    { id: "plan", kr: "계획", en: "Plan" },
    { id: "parent", kr: "부모", en: "Parents" },
    { id: "arketype", kr: "아키타입", en: "Arketype" },
  ];
  return (
    <div className="topbar topbar--mentor">
      <ArkBrand
        slash={crumb?.kr || "멘토"}
        slashEn={crumb?.en || "  Mentor"}
      />
      <nav className="topbar__tabs">
        {tabs.map((t) => (
          <button key={t.id} className={"tab" + (tab === t.id ? " tab--active" : "")}>
            <Bil kr={t.kr} en={t.en} />
          </button>
        ))}
      </nav>
      <div className="topbar__right">
        <span className="mentor-pill">
          <span className="bil">
            <span className="kr">멘토 보기</span>
            <span className="en">Mentor view</span>
          </span>
        </span>
        <button className="icon-btn"><Icon name="search" size={16} /></button>
        <button className="icon-btn"><Icon name="bell" size={16} /></button>
        <div className="kid-id">
          <div className="kid-id__av">박</div>
          <div className="kid-id__txt">
            <div className="kid-id__name">
              <Bil kr="박서윤" en="Seoyun Park" />
            </div>
            <div className="kid-id__meta mono">
              <Bil kr="멘토 · 12명 담당" en="MENTOR · 12 KIDS" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// A mini "ink ring" for the threshold/HITL — denotes a human gate
function HumanGate({ size = 14 }) {
  return (
    <span
      style={{
        display: "inline-grid", placeItems: "center",
        width: size, height: size, borderRadius: "50%",
        background: "var(--violet)", color: "white",
        fontFamily: "var(--mono)", fontSize: size * 0.55,
        fontWeight: 600,
      }}
    >H</span>
  );
}

// Stage chip (Draft / Tutor / Revise / Defend / Arketype)
function StageChip({ stage }) {
  const labels = {
    draft:    { kr: "초안",     en: "DRAFT" },
    tutor:    { kr: "튜터",     en: "TUTOR" },
    revise:   { kr: "고치기",   en: "REVISE" },
    defend:   { kr: "발표",     en: "DEFEND" },
    arketype: { kr: "아키타입", en: "ARKETYPE" },
  };
  const l = labels[stage] || labels.draft;
  return (
    <span className={`tag-stage tag-stage--${stage}`}>
      <span className="bil">
        <span className="kr">{l.kr}</span>
        <span className="en">{l.en}</span>
      </span>
    </span>
  );
}

Object.assign(window, { MentorTopbar, HumanGate, StageChip });
