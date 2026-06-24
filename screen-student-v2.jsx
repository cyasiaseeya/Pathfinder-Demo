// Screen: Student detail — deep view of one child

const StudentDetailScreen = ({ studentId, onNavigate }) => {
  const { STUDENTS, ARKETYPE_DIMS, TRAIT_GROUPS } = window.ARK_DATA;
  const student = STUDENTS.find(s => s.id === studentId) || STUDENTS[0];
  const [tab, setTab] = React.useState("profile");
  const [openTrait, setOpenTrait] = React.useState("courage");

  const projects = [
    { title: "Map of My Walk to School", state: "complete", date: "Apr 2", duration: 14 },
    { title: "Letter to a Future Student", state: "complete", date: "Mar 18", duration: 7 },
    { title: "Three Things I Wonder About", state: "complete", date: "Mar 4", duration: 12 },
    { title: student.activeProject.title, state: "active", date: "in progress", duration: student.activeProject.daysActive },
  ];

  return (
    <div className="content">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
        <button className="btn ghost sm" onClick={() => onNavigate("roster")} style={{ marginTop: 6 }}>
          <Icon name="chevron" size={12} className="" /> Roster
        </button>
        <div className="reactor-ring">
          <Avatar name={student.nameRo} hue={student.avatarHue} size={64}/>
        </div>
        <div style={{ flex: 1 }}>
          <NameLabel ko={student.nameKo} ro={student.nameRo} size="lg"/>
          <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="pill"><span className="num">Age {student.age}</span></span>
            <span className="pill">{student.grade} grade</span>
            <span className="pill">{student.cohort}</span>
            {student.needsAttention && <span className="pill accent"><span className="dot"/>Needs attention</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn"><Icon name="note" size={14}/>Add note</button>
          <button className="btn"><Icon name="send" size={14}/>Share with parent</button>
          <button className="btn primary" onClick={() => onNavigate("coach", student.id)}><Icon name="coach" size={14}/>Open coaching</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
        {[
          { v: "profile", label: "Arketype profile" },
          { v: "history", label: "Trait history" },
          { v: "timeline", label: "Project timeline" },
          { v: "notes", label: "Notes" },
        ].map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "transparent",
              fontSize: 13,
              fontWeight: 500,
              color: tab === t.v ? "var(--ink)" : "var(--ink-3)",
              borderBottom: tab === t.v ? "2px solid var(--ink)" : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 24 }}>
          {/* Hero radar */}
          <div className="card">
            <div className="card-header">
              <h2><span className="tip" data-tip="Arketype — a profile of the child across 16 universal skillset types, built on 80 trait datapoints. Updated by Ark Reactor.">Arketype profile</span></h2>
              <span className="sub">16 dimensions · 80 traits</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <span className="pill"><span className="dot" style={{ background: "#6B4FA8" }}/>Cognitive</span>
                <span className="pill"><span className="dot" style={{ background: "var(--accent)" }}/>Affective</span>
              </div>
            </div>
            <div style={{ padding: "32px 16px", display: "grid", placeItems: "center" }}>
              <ArketypeRadar values={student.profile} size={380} showLabels showAffectiveSpine highlight="courage" />
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                Highlighted: <span style={{ color: "var(--accent-ink)", fontWeight: 500 }}>Voicer</span> — interpersonal communication confidence
              </div>
              <button className="btn sm"><Icon name="send" size={12}/>Share Voicer with parent</button>
            </div>
          </div>

          {/* Trait list */}
          <div className="card" style={{ alignSelf: "start" }}>
            <div className="card-header">
              <h2>Traits</h2>
              <span className="sub">Grouped by cognitive & affective</span>
            </div>
            <div style={{ maxHeight: 540, overflowY: "auto" }}>
              {TRAIT_GROUPS.map(g => (
                <TraitGroup
                  key={g.dim}
                  group={g}
                  open={openTrait === g.dim}
                  onToggle={() => setOpenTrait(openTrait === g.dim ? null : g.dim)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="card">
          <div className="card-header">
            <h2>Trait history</h2>
            <span className="sub">Last 12 weeks</span>
          </div>
          <div style={{ padding: 4 }}>
            {ARKETYPE_DIMS.map((d, i) => (
              <TraitHistoryRow key={d.key} dim={d} student={student} index={i} />
            ))}
          </div>
        </div>
      )}

      {tab === "timeline" && <ProjectTimeline projects={projects}/>}

      {tab === "notes" && <NotesPanel student={student}/>}
    </div>
  );
};

const TraitGroup = ({ group, open, onToggle }) => (
  <div style={{ borderBottom: "1px solid var(--line)" }}>
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "grid", gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: 12,
        padding: "12px 16px", border: "none", background: open ? "var(--bg-elevated)" : "transparent", textAlign: "left", cursor: "pointer",
      }}
    >
      <Icon name={open ? "chevronDown" : "chevron"} size={12}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{group.label}</span>
          {group.spine && <span className="pill accent" style={{ fontSize: 10 }}>spine</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {group.gloss}
        </div>
      </div>
      <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{group.traits.length} traits</span>
    </button>
    {open && (
      <div style={{ padding: "4px 16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {group.traits.map(t => (
          <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 50px", alignItems: "center", gap: 12, padding: "6px 0" }}>
            <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{t.name}</span>
            <div className="progress" style={{ height: 3 }}>
              <span style={{ width: `${t.value}%`, background: group.spine ? "var(--accent)" : "var(--ink-2)" }}/>
            </div>
            <span className="num" style={{ fontSize: 11, color: t.delta > 0 ? "var(--accent-ink)" : "var(--ink-3)", textAlign: "right" }}>
              {t.delta > 0 ? "+" : ""}{t.delta}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const TraitHistoryRow = ({ dim, student, index }) => {
  const seed = (parseInt(student.id.slice(1)) * 17 + index * 3);
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let v = student.profile[index] - 12;
  const data = [];
  const trend = dim.spine ? 1.4 : (rand() - 0.5) * 1.5;
  for (let i = 0; i < 12; i++) {
    v += (rand() - 0.5) * 5 + trend;
    v = Math.max(15, Math.min(95, v));
    data.push(Math.round(v));
  }
  data[data.length - 1] = student.profile[index];
  const delta = data[data.length - 1] - data[0];
  const isSpine = dim.spine;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "180px 1fr 80px 60px",
      alignItems: "center",
      gap: 16,
      padding: "10px 16px",
      borderBottom: "1px solid var(--line)",
      background: isSpine ? "linear-gradient(90deg, rgba(244, 217, 236, 0.45), transparent 70%)" : "transparent",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dim.group === "affective" ? "var(--accent)" : "#6B4FA8" }}/>
        <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: isSpine ? 500 : 450 }}>{dim.label}</span>
        {isSpine && <span className="pill accent" style={{ fontSize: 10 }}>spine</span>}
      </div>
      <Sparkline data={data} width={400} height={32} stroke={isSpine ? "var(--accent)" : "var(--ink-3)"} fill={isSpine ? "var(--accent)" : "none"} accent={isSpine}/>
      <div className="num" style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "right" }}>
        <span style={{ color: "var(--ink)" }}>{data[data.length - 1]}</span> / 100
      </div>
      <div className="num" style={{ fontSize: 12, color: delta > 0 ? "var(--accent-ink)" : "var(--ink-3)", textAlign: "right" }}>
        {delta > 0 ? "+" : ""}{delta}
      </div>
    </div>
  );
};

const ProjectTimeline = ({ projects }) => (
  <div className="card">
    <div className="card-header">
      <h2>Project timeline</h2>
      <span className="sub">{projects.length} projects · 1 active</span>
    </div>
    <div style={{ position: "relative", padding: "24px 32px" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: "50%", height: 1, background: "var(--line-strong)" }}/>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {projects.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, maxWidth: 180 }}>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "center", height: 36, display: "flex", alignItems: "flex-end" }}>{p.title}</div>
            <div style={{
              width: p.state === "active" ? 18 : 12,
              height: p.state === "active" ? 18 : 12,
              borderRadius: "50%",
              background: p.state === "active" ? "var(--accent)" : "var(--ink-2)",
              boxShadow: p.state === "active" ? "0 0 0 4px rgba(226, 123, 184, 0.25)" : "none",
              border: "2px solid var(--surface)",
              outline: "1px solid var(--line-strong)",
            }}/>
            <div className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.date}</div>
            <div className="num" style={{ fontSize: 10, color: "var(--ink-4)" }}>{p.duration}d</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotesPanel = ({ student }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
    <div className="card">
      <div className="card-header">
        <h2>Private notes</h2>
        <span className="sub">Only you and the lead facilitator can see these.</span>
        <button className="btn sm primary" style={{ marginLeft: "auto" }}><Icon name="plus" size={12}/>New</button>
      </div>
      <div>
        {[
          { date: "Apr 28", text: "Voicer climbing fast. He volunteered an opinion in a partner exercise — first time. Worth pulling that into the next parent note." },
          { date: "Apr 22", text: "Stuck on revision step three for the Time Capsule. Pattern: he stalls when asked to compare drafts. Try a side-by-side prompt next session." },
          { date: "Apr 14", text: "Loves the audio modality. Resists writing. Lean audio-first for the next two projects." },
        ].map((n, i) => (
          <div key={i} style={{ padding: 16, borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
            <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{n.date}</div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="card" style={{ alignSelf: "start" }}>
      <div className="card-header"><h2>Quick stats</h2></div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "Sessions this month", value: "9" },
          { label: "Avg session length", value: "23m" },
          { label: "Audio submissions", value: "11" },
          { label: "Written drafts", value: "4" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{s.label}</span>
            <span className="num" style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

window.StudentDetailScreen = StudentDetailScreen;
