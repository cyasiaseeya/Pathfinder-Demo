// Screen: Roster — full caseload, sortable

const RosterScreen = ({ onNavigate }) => {
  const { STUDENTS } = window.ARK_DATA;
  const [sort, setSort] = React.useState("attention");

  const sorted = React.useMemo(() => {
    const arr = [...STUDENTS];
    if (sort === "attention") {
      arr.sort((a, b) => (b.needsAttention - a.needsAttention) || (b.activeProject.stuck - a.activeProject.stuck));
    } else if (sort === "newest") {
      arr.sort((a, b) => b.activeProject.daysActive - a.activeProject.daysActive);
    } else if (sort === "longest") {
      // sort by lastTouch text — simple mock
      const order = { "today": 0, "1d ago": 1, "2d ago": 2, "3d ago": 3, "4d ago": 4, "5d ago": 5 };
      arr.sort((a, b) => (order[b.lastTouch] || 9) - (order[a.lastTouch] || 9));
    }
    return arr;
  }, [sort]);

  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: "var(--ink)" }}>Roster</h1>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            <span className="num">{STUDENTS.length}</span> children · <span className="num">3</span> cohorts ·{" "}
            <span style={{ color: "var(--accent-ink)" }}><span className="num">2</span> need attention</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SortToggle value={sort} onChange={setSort} />
          <button className="btn"><Icon name="filter" size={14}/>Filter</button>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1.5fr) 90px minmax(220px, 2fr) 80px 90px 110px",
          padding: "10px 16px",
          fontSize: 11,
          color: "var(--ink-3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 500,
          borderBottom: "1px solid var(--line)",
          background: "var(--bg-elevated)",
          alignItems: "center",
          gap: 12,
        }}>
          <span>Student</span>
          <span>Arketype</span>
          <span>Active project</span>
          <span style={{ textAlign: "right" }}>Voicer</span>
          <span>Last touch</span>
          <span></span>
        </div>
        {sorted.map(s => <RosterRow key={s.id} student={s} onOpen={() => onNavigate("student", s.id)} />)}
      </div>
    </div>
  );
};

const SortToggle = ({ value, onChange }) => {
  const opts = [
    { v: "attention", label: "Needs attention" },
    { v: "newest", label: "Newest" },
    { v: "longest", label: "Longest since contact" },
  ];
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface)" }}>
      {opts.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className="num"
          style={{
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 500,
            border: "none",
            background: value === o.v ? "var(--ink)" : "transparent",
            color: value === o.v ? "var(--bg)" : "var(--ink-2)",
            cursor: "pointer",
          }}
        >{o.label}</button>
      ))}
    </div>
  );
};

const RosterRow = ({ student, onOpen }) => {
  const trendDelta = student.voiceTrend[student.voiceTrend.length - 1] - student.voiceTrend[0];
  return (
    <div
      onClick={onOpen}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1.5fr) 90px minmax(220px, 2fr) 80px 90px 110px",
        padding: "14px 16px",
        borderBottom: "1px solid var(--line)",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        background: student.needsAttention ? "linear-gradient(90deg, oklch(0.95 0.04 50 / 0.5), transparent 60%)" : "transparent",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = student.needsAttention ? "linear-gradient(90deg, oklch(0.94 0.05 50 / 0.7), var(--bg-sunken) 60%)" : "var(--bg-elevated)"}
      onMouseLeave={e => e.currentTarget.style.background = student.needsAttention ? "linear-gradient(90deg, oklch(0.95 0.04 50 / 0.5), transparent 60%)" : "transparent"}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
        <Avatar name={student.nameRo} hue={student.avatarHue} size={36}/>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="ko-name" style={{ fontSize: 14 }}>{student.nameKo}</span>
            {student.needsAttention && <span className="pill accent" style={{ fontSize: 10, padding: "1px 6px" }}><span className="dot"/></span>}
          </div>
          <div className="romanized num" style={{ fontSize: 12 }}>
            {student.nameRo} · age {student.age} · {student.cohort.split(" ·")[0]}
          </div>
        </div>
      </div>
      <ArketypeRadar values={student.profile} size={56} thin glow={false} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {student.activeProject.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
          <div className="progress" style={{ flex: 1, maxWidth: 160 }}>
            <span style={{ width: `${student.activeProject.progress}%`, background: student.activeProject.stuck ? "var(--accent)" : "var(--ink-2)" }}/>
          </div>
          <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{student.activeProject.progress}%</span>
          {student.activeProject.stuck && <span style={{ fontSize: 11, color: "var(--accent-ink)" }}>Stuck</span>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Sparkline data={student.voiceTrend} width={70} height={26} stroke="var(--ink-3)" fill={trendDelta > 0 ? "oklch(0.72 0.16 38)" : "none"} accent={trendDelta > 5} />
      </div>
      <div className="num" style={{ fontSize: 12, color: student.lastTouch === "today" ? "var(--ink)" : "var(--ink-3)" }}>
        {student.lastTouch}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
        <button className="btn sm ghost" onClick={(e) => { e.stopPropagation(); }}><Icon name="note" size={12}/></button>
        <button className="btn sm" onClick={(e) => { e.stopPropagation(); onOpen(); }}>Open</button>
      </div>
    </div>
  );
};

window.RosterScreen = RosterScreen;
