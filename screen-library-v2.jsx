// Screen: Library — curate and assign content

const LibraryScreen = ({ onNavigate }) => {
  const { PROJECTS, STUDENTS, ARKETYPE_DIMS } = window.ARK_DATA;
  const [filterKind, setFilterKind] = React.useState("all");
  const [forStudent, setForStudent] = React.useState(STUDENTS[0]);
  const [filterDim, setFilterDim] = React.useState(null);

  const recs = PROJECTS.filter(p => p.recommended);
  const filtered = PROJECTS.filter(p => {
    if (filterKind !== "all" && p.kind !== filterKind) return false;
    if (filterDim && !p.focus.includes(filterDim)) return false;
    return true;
  });

  // Find a "weakest" dim for the chosen student to surface as recommendation hook
  const weakestIdx = forStudent.profile.indexOf(Math.min(...forStudent.profile));
  const weakest = ARKETYPE_DIMS[weakestIdx];

  return (
    <div className="content">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>Library</h1>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
            Pick what {forStudent.nameRo.split(" ")[0]} works on next.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Curating for</span>
          <select
            value={forStudent.id}
            onChange={e => setForStudent(STUDENTS.find(s => s.id === e.target.value))}
            style={{
              fontFamily: "inherit", fontSize: 13, padding: "6px 10px",
              border: "1px solid var(--line-strong)", borderRadius: 6,
              background: "var(--surface)", color: "var(--ink)", cursor: "pointer",
            }}
          >
            {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.nameKo} · {s.nameRo}</option>)}
          </select>
        </div>
      </div>

      {/* Recommended for [child] rail */}
      <div style={{
        background: "linear-gradient(180deg, rgba(248, 230, 244, 0.7), var(--bg-elevated))",
        border: "1px solid rgba(196, 168, 236, 0.4)",
        borderRadius: "var(--radius)",
        padding: 20,
        marginBottom: 28,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Avatar name={forStudent.nameRo} hue={forStudent.avatarHue} size={36}/>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>
              Recommended for <span className="ko-name">{forStudent.nameKo}</span> <span className="romanized">· {forStudent.nameRo}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--accent-ink)", marginTop: 2 }}>
              Reactor sees <strong>{weakest.label}</strong> as the most growable dimension right now.
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <ArketypeRadar values={forStudent.profile} size={56} thin glow={false} highlight={weakest.key}/>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {recs.slice(0, 3).map(p => (
            <ProjectCard key={p.id} project={p} highlighted recHook={weakest.label} student={forStudent}/>
          ))}
        </div>
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", border: "1px solid var(--line-strong)", borderRadius: 6, overflow: "hidden", background: "var(--surface)" }}>
          {["all", "Project", "Soft-skill module", "AI literacy unit"].map(k => (
            <button key={k} onClick={() => setFilterKind(k)} style={{
              padding: "6px 12px", fontSize: 12, fontWeight: 500, border: "none",
              background: filterKind === k ? "var(--ink)" : "transparent",
              color: filterKind === k ? "var(--bg)" : "var(--ink-2)",
              cursor: "pointer",
            }}>{k === "all" ? "All" : k}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "var(--line)" }}/>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Filter by Arketype dimension:</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {ARKETYPE_DIMS.slice(0, 8).map(d => (
            <button key={d.key} onClick={() => setFilterDim(filterDim === d.key ? null : d.key)} className={"pill" + (filterDim === d.key ? " accent" : "")} style={{ cursor: "pointer", border: "1px solid var(--line)" }}>
              {filterDim === d.key && <span className="dot"/>}{d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(p => <ProjectCard key={p.id} project={p}/>)}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, highlighted, recHook, student }) => {
  const { ARKETYPE_DIMS } = window.ARK_DATA;
  const focusDims = project.focus.map(f => ARKETYPE_DIMS.find(d => d.key === f)).filter(Boolean);
  return (
    <div className="card" style={{
      padding: 16,
      display: "flex", flexDirection: "column", gap: 10,
      background: highlighted ? "var(--surface)" : "var(--surface)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="pill" style={{ background: "var(--bg-sunken)", borderColor: "var(--line)" }}>{project.kind}</span>
        <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{project.duration}</span>
        <span className="num" style={{ fontSize: 11, color: "var(--ink-4)", marginLeft: "auto" }}>{project.level}</span>
      </div>
      <div style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--ink)", lineHeight: 1.3, textWrap: "balance" }}>
        {project.title}
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5, flex: 1 }}>
        {project.desc}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {focusDims.map(d => (
          <span key={d.key} className="pill" style={{ fontSize: 10, background: d.spine ? "var(--accent-soft)" : "var(--bg-sunken)", color: d.spine ? "var(--accent-ink)" : "var(--ink-2)" }}>{d.label}</span>
        ))}
      </div>
      {recHook && (
        <div style={{ fontSize: 11, color: "var(--accent-ink)", padding: "6px 8px", background: "rgba(244, 217, 236, 0.45)", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="sparkle" size={11}/>
          Targets <strong>{recHook}</strong> — currently underdeveloped
        </div>
      )}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button className="btn sm" style={{ flex: 1 }}>Preview</button>
        <button className="btn sm primary" style={{ flex: 1 }}><Icon name="plus" size={12}/>Assign</button>
      </div>
    </div>
  );
};

window.LibraryScreen = LibraryScreen;
