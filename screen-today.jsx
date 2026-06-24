// Screen: Today (home) — facilitator triage view

const TodayScreen = ({ onNavigate }) => {
  const { STUDENTS, PARENT_THREADS } = window.ARK_DATA;
  const stuck = STUDENTS.filter(s => s.activeProject.stuck);
  const milestones = STUDENTS.filter(s => s.activeProject.milestone);
  const unread = PARENT_THREADS.filter(t => t.unread);

  return (
    <div className="content" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
        {/* Greeting */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>Tuesday · April 30</div>
            <h1 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: "var(--ink)", textWrap: "pretty" }}>
              Good morning, Alex.<br/>
              <span style={{ color: "var(--ink-3)" }}>Two kids need you first.</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn"><Icon name="schedule" size={14}/>Schedule</button>
            <button className="btn primary"><Icon name="plus" size={14}/>New note</button>
          </div>
        </div>

        {/* Caseload glance — instrument strip */}
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            <GlanceStat label="Active projects" value="14" sub="across 8 children" />
            <GlanceStat label="Avg days to complete" value="11.2" sub="-1.4 vs last week" trend="down-good" />
            <GlanceStat label="Voicer trend, cohort" value="+6.4" sub="last 4 weeks" trend="up" />
            <GlanceStat label="Open coaching loops" value="3" sub="2 stuck · 1 milestone" trend="warn" last/>
          </div>
        </div>

        {/* Needs you now */}
        <section>
          <SectionHeader
            title="Needs you now"
            count={stuck.length}
            sub="Reactor flagged. No facilitator response yet."
            accent
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stuck.map(s => (
              <StuckCard key={s.id} student={s} onOpen={() => onNavigate("coach", s.id)} />
            ))}
          </div>
        </section>

        {/* Crossing milestones */}
        <section>
          <SectionHeader title="Crossing a milestone today" count={milestones.length} sub="Worth a note to the child or the parent." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {milestones.map(s => (
              <MilestoneCard key={s.id} student={s} onOpen={() => onNavigate("student", s.id)} />
            ))}
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        <ReactorPulse />
        <ParentMessages threads={unread} onOpen={() => onNavigate("parents")} />
        <UpcomingPanel />
      </aside>
    </div>
  );
};

const GlanceStat = ({ label, value, sub, trend, last }) => (
  <div style={{ padding: "16px 20px", borderRight: last ? "none" : "1px solid var(--line)" }}>
    <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <div className="num" style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>{value}</div>
      {trend === "up" && <Icon name="arrowUp" size={12} className="" />}
    </div>
    <div className="num" style={{ fontSize: 12, color: trend === "warn" ? "var(--accent-ink)" : "var(--ink-3)", marginTop: 2 }}>{sub}</div>
  </div>
);

const SectionHeader = ({ title, count, sub, accent }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
    <h2 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em", margin: 0, color: "var(--ink)" }}>{title}</h2>
    {typeof count === "number" && (
      <span className={"pill" + (accent ? " accent" : "")}>{accent && <span className="dot"/>}<span className="num">{count}</span></span>
    )}
    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{sub}</span>
  </div>
);

const StuckCard = ({ student, onOpen }) => (
  <div className="card" style={{ padding: 16, display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 16, alignItems: "center" }}>
    <div className="reactor-ring">
      <Avatar name={student.nameRo} hue={student.avatarHue} size={44} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <NameLabel ko={student.nameKo} ro={student.nameRo} inline />
        <span className="pill accent"><span className="dot"/>Stuck</span>
        <span style={{ fontSize: 11, color: "var(--ink-3)" }} className="num">flagged 14h ago</span>
      </div>
      <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 6, fontWeight: 450 }}>
        On <span style={{ color: "var(--ink)" }}>{student.activeProject.title}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="flag" size={12}/>
        <span>Reactor: <span style={{ color: "var(--ink-2)" }}>"{student.activeProject.stuckReason}"</span></span>
      </div>
    </div>
    <ArketypeRadar values={student.profile} size={56} thin glow={false} />
    <button className="btn primary" onClick={onOpen}>Open coaching <Icon name="arrowRight" size={12}/></button>
  </div>
);

const MilestoneCard = ({ student, onOpen }) => (
  <div className="card" style={{ padding: 14, display: "flex", gap: 12, cursor: "pointer" }} onClick={onOpen}>
    <Avatar name={student.nameRo} hue={student.avatarHue} size={40}/>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <NameLabel ko={student.nameKo} ro={student.nameRo} inline />
        <Icon name="sparkle" size={14} className="" />
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.4 }}>
        {student.activeProject.milestone}
      </div>
      <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6 }}>
        {student.activeProject.title} · {student.activeProject.progress}%
      </div>
    </div>
  </div>
);

const ReactorPulse = () => {
  const { STUDENTS } = window.ARK_DATA;
  return (
    <div className="card">
      <div className="card-header" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="brand-mark" style={{ width: 18, height: 18 }}/>
        <h2>Reactor pulse</h2>
        <span className="pill" style={{ marginLeft: "auto" }}><span className="dot" style={{ background: "oklch(0.7 0.13 145)"}}/>live</span>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
          <span className="tip" data-tip="Ark Reactor — the engine that assigns projects, watches the child, and updates their Arketype.">Ark Reactor</span>{" "}
          is observing 8 children right now.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {STUDENTS.slice(0, 8).map(s => (
            <div key={s.id} title={s.nameRo} style={{
              aspectRatio: "1",
              borderRadius: 8,
              background: "var(--bg-sunken)",
              border: "1px solid var(--line)",
              display: "grid", placeItems: "center",
              position: "relative",
            }}>
              <ArketypeRadar values={s.profile} size={44} thin glow={false} />
              {s.activeProject.stuck && (
                <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 2px var(--surface)" }}/>
              )}
            </div>
          ))}
        </div>
        <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span>Last update 12s ago</span>
          <span>2 flagged</span>
        </div>
      </div>
    </div>
  );
};

const ParentMessages = ({ threads, onOpen }) => (
  <div className="card">
    <div className="card-header">
      <h2>Parent messages</h2>
      <span className="pill accent" style={{ marginLeft: "auto" }}><span className="dot"/><span className="num">{threads.length} unread</span></span>
    </div>
    <div>
      {threads.map((t, i) => (
        <div key={t.id} style={{ padding: "12px 14px", borderTop: i === 0 ? "none" : "1px solid var(--line)", display: "flex", gap: 10, cursor: "pointer" }} onClick={onOpen}>
          <Avatar name={t.parentName} hue={(i * 60) + 30} size={28}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                <span className="ko-name" style={{ fontSize: 13 }}>{t.parentKo}</span>
                <span className="romanized" style={{ fontSize: 12, marginLeft: 6 }}>· {t.parentName}</span>
              </span>
              <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{t.time}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {t.last}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ padding: 10, borderTop: "1px solid var(--line)" }}>
      <button className="btn ghost sm" onClick={onOpen} style={{ width: "100%" }}>Open inbox <Icon name="chevron" size={12}/></button>
    </div>
  </div>
);

const UpcomingPanel = () => (
  <div className="card">
    <div className="card-header"><h2>Upcoming</h2></div>
    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { time: "11:00", label: "Live coaching · Jiho Park", sub: "Catch the third draft" },
        { time: "14:30", label: "Cohort sync · Seoul Tuesdays", sub: "Weekly 25 min" },
        { time: "16:00", label: "Send progress note · 4 families", sub: "Drafted, scheduled" },
      ].map((u, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 10, alignItems: "center" }}>
          <div className="num" style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 14, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}>{u.time}</div>
          <div>
            <div style={{ fontSize: 12, color: "var(--ink)", fontWeight: 500 }}>{u.label}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{u.sub}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

window.TodayScreen = TodayScreen;
