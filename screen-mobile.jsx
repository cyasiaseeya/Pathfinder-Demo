// Mobile Today screen — condensed view for facilitators between sessions

const MobileTodayScreen = () => {
  const { STUDENTS, PARENT_THREADS } = window.ARK_DATA;
  const stuck = STUDENTS.filter(s => s.activeProject.stuck);
  const milestones = STUDENTS.filter(s => s.activeProject.milestone);
  const unread = PARENT_THREADS.filter(t => t.unread);

  return (
    <div style={{
      maxWidth: 390, margin: "20px auto", borderRadius: 32,
      background: "var(--bg)", border: "1px solid var(--line-strong)",
      boxShadow: "var(--shadow-lg)", overflow: "hidden",
      height: 780, display: "flex", flexDirection: "column", position: "relative",
    }}>
      {/* status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px 4px", fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>
        <span className="num">9:41</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10 }}>•••</span>
          <span style={{ fontSize: 10 }}>◐</span>
          <span style={{ fontSize: 10 }}>▮▮</span>
        </span>
      </div>

      {/* header */}
      <div style={{ padding: "12px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div className="brand-mark" style={{ width: 26, height: 26 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Ark Academy</div>
            <div style={{ fontSize: 10, color: "var(--ink-3)" }}>Facilitator</div>
          </div>
          <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="bell" size={14}/></button>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>Tuesday · April 30</div>
        <h1 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
          Two kids need you<br/><span style={{ color: "var(--ink-3)" }}>first.</span>
        </h1>
      </div>

      {/* glance pill */}
      <div style={{ margin: "0 20px", padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, display: "flex", justifyContent: "space-between" }}>
        <Stat label="Active" value="14"/>
        <div style={{ width: 1, background: "var(--line)" }}/>
        <Stat label="Stuck" value="2" accent/>
        <div style={{ width: 1, background: "var(--line)" }}/>
        <Stat label="Unread" value="2"/>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 80px" }}>
        <SectionLabel title="Needs you now" count={stuck.length} accent/>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {stuck.map(s => (
            <div key={s.id} className="card" style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
              <div className="reactor-ring"><Avatar name={s.nameRo} hue={s.avatarHue} size={36}/></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="ko-name" style={{ fontSize: 13 }}>{s.nameKo}</span>
                  <span className="romanized" style={{ fontSize: 11 }}>· {s.nameRo}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.activeProject.title}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  <span className="pill accent" style={{ fontSize: 10 }}><span className="dot"/>Stuck 14h</span>
                </div>
              </div>
              <Icon name="chevron" size={14} className=""/>
            </div>
          ))}
        </div>

        <SectionLabel title="Milestone today" count={milestones.length}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {milestones.map(s => (
            <div key={s.id} className="card" style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar name={s.nameRo} hue={s.avatarHue} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="ko-name" style={{ fontSize: 13 }}>{s.nameKo}</span>
                <span className="romanized" style={{ fontSize: 11, marginLeft: 4 }}>· {s.nameRo}</span>
                <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.4 }}>{s.activeProject.milestone}</div>
              </div>
              <Icon name="sparkle" size={14}/>
            </div>
          ))}
        </div>

        <SectionLabel title="Parent messages" count={unread.length}/>
        <div className="card">
          {unread.map((t, i) => {
            const s = STUDENTS.find(x => x.id === t.studentId);
            return (
              <div key={t.id} style={{ padding: 12, borderTop: i === 0 ? "none" : "1px solid var(--line)", display: "flex", gap: 8 }}>
                <Avatar name={t.parentName} hue={s.avatarHue} size={28}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="ko-name" style={{ fontSize: 12 }}>{t.parentKo}</span>
                    <span className="num" style={{ fontSize: 10, color: "var(--ink-3)" }}>{t.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {t.last}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* tab bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-around", padding: "10px 20px 24px",
        background: "var(--bg-elevated)", borderTop: "1px solid var(--line)",
        backdropFilter: "blur(10px)",
      }}>
        {[
          { icon: "today", label: "Today", active: true },
          { icon: "roster", label: "Roster" },
          { icon: "library", label: "Library" },
          { icon: "parents", label: "Inbox", badge: 2 },
        ].map(t => (
          <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: t.active ? "var(--ink)" : "var(--ink-3)", position: "relative" }}>
            <Icon name={t.icon} size={20}/>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{t.label}</span>
            {t.badge && <span style={{ position: "absolute", top: -2, right: 6, background: "var(--accent)", color: "white", fontSize: 9, borderRadius: 10, padding: "0 4px", fontWeight: 600 }}>{t.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ label, value, accent }) => (
  <div style={{ textAlign: "center", flex: 1 }}>
    <div className="num" style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 18, fontWeight: 500, color: accent ? "var(--accent-ink)" : "var(--ink)" }}>{value}</div>
    <div style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
  </div>
);

const SectionLabel = ({ title, count, accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <h3 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 14, fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
    <span className={"pill" + (accent ? " accent" : "")} style={{ fontSize: 10 }}>{accent && <span className="dot"/>}<span className="num">{count}</span></span>
  </div>
);

window.MobileTodayScreen = MobileTodayScreen;
