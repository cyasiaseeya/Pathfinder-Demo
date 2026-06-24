// Screen: Live coaching — what the child is working on now

const CoachingScreen = ({ studentId, onNavigate }) => {
  const { STUDENTS } = window.ARK_DATA;
  const student = STUDENTS.find(s => s.id === studentId) || STUDENTS[0];
  const [comments, setComments] = React.useState([
    { id: 1, anchor: "p2", author: "you", time: "yesterday", text: "Beautiful detail about the bakery. Could you record this in your own voice?" },
  ]);
  const [draft, setDraft] = React.useState("");
  const [anchor, setAnchor] = React.useState(null);

  const submit = () => {
    if (!draft.trim() || !anchor) return;
    setComments([...comments, { id: Date.now(), anchor, author: "you", time: "just now", text: draft }]);
    setDraft("");
    setAnchor(null);
  };

  return (
    <div className="content" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 20, height: "calc(100vh - 56px)", paddingBottom: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn ghost sm" onClick={() => onNavigate("today")}><Icon name="chevron" size={12}/> Today</button>
          <Avatar name={student.nameRo} hue={student.avatarHue} size={36}/>
          <div>
            <NameLabel ko={student.nameKo} ro={student.nameRo} size="sm"/>
          </div>
          <div style={{ width: 1, height: 28, background: "var(--line)" }}/>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{student.activeProject.title}</div>
            <div className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>Project · 3 weeks · day {student.activeProject.daysActive}</div>
          </div>
          <span className="pill accent" style={{ marginLeft: 8 }}><span className="dot"/>Stuck</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className="btn sm" onClick={() => onNavigate("student", student.id)}>Profile</button>
            <button className="btn sm primary"><Icon name="send" size={12}/>Send all comments</button>
          </div>
        </div>

        {/* Artifact */}
        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-elevated)" }}>
            <div style={{ display: "inline-flex", gap: 0, border: "1px solid var(--line-strong)", borderRadius: 6, overflow: "hidden", background: "var(--surface)" }}>
              {[
                { v: "text", icon: "text", label: "Draft" },
                { v: "audio", icon: "audio", label: "Audio (2)" },
                { v: "drawing", icon: "drawing", label: "Map" },
              ].map((t, i) => (
                <button key={t.v} className="num" style={{
                  padding: "5px 10px", fontSize: 12, fontWeight: 500,
                  border: "none",
                  background: i === 0 ? "var(--ink)" : "transparent",
                  color: i === 0 ? "var(--bg)" : "var(--ink-2)",
                  display: "flex", alignItems: "center", gap: 6,
                  cursor: "pointer",
                }}><Icon name={t.icon} size={11}/>{t.label}</button>
              ))}
            </div>
            <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: 8 }}>Draft 3 of 3 · last edit 36h ago</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button className="btn ghost sm"><Icon name="eye" size={12}/>What child sees</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "32px 64px", background: "var(--surface)" }}>
            <div style={{ maxWidth: 620, margin: "0 auto" }}>
              <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>My Neighborhood Time Capsule · draft 3</div>
              <h2 style={{ fontFamily: "'Inter Display', Inter, sans-serif", fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", color: "var(--ink)", margin: "0 0 24px", textWrap: "balance" }}>
                Things from my street I want someone to find in 50 years
              </h2>

              <ArtifactPara
                id="p1"
                anchor={anchor}
                comments={comments}
                onAnchor={setAnchor}
                text="My street has a bakery that opens before the sun. The owner is named Mrs. Han. She remembers what bread my grandmother bought every Saturday for thirty years."
              />
              <ArtifactPara
                id="p2"
                anchor={anchor}
                comments={comments}
                onAnchor={setAnchor}
                text="When you walk past at six in the morning the smell is the first thing that wakes up. I want to put that smell in my time capsule but I don't know how to put a smell in a box."
              />
              <ArtifactPara
                id="p3"
                anchor={anchor}
                comments={comments}
                onAnchor={setAnchor}
                stuck
                text="I tried to write more but I am stuck. I don't know if a smell is a thing for a time capsule or"
              />

              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: "rgba(244, 217, 236, 0.45)",
                border: "1px dashed rgba(226, 123, 184, 0.5)",
                color: "var(--accent-ink)",
                fontSize: 12, display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icon name="flag" size={12}/>
                Child stopped here. No keystrokes for 36 hours.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <aside style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
        {/* Why flagged */}
        <div className="card" style={{ background: "linear-gradient(180deg, rgba(248, 230, 244, 0.6), var(--surface))" }}>
          <div className="card-header" style={{ borderBottom: "none", paddingBottom: 6 }}>
            <Icon name="flag" size={14} className=""/>
            <h2>Why Reactor flagged this</h2>
          </div>
          <div style={{ padding: "0 16px 14px", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>"No progress in 36 hours after the third revision step."</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "var(--ink-3)" }}>
              <SignalLine label="Last keystroke" value="36h 14m ago"/>
              <SignalLine label="Drafts started → submitted" value="3 → 2"/>
              <SignalLine label="Pattern (last 4 weeks)" value="Stalls at draft 3"/>
              <SignalLine label="Emotional read" value="Frustrated → quiet"/>
            </div>
          </div>
        </div>

        {/* What Reactor already nudged */}
        <div className="card">
          <div className="card-header"><h2>Reactor has already said</h2><span className="sub">Don't repeat these.</span></div>
          <div style={{ padding: "8px 16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { time: "yesterday 4:12pm", text: "\"What's one thing you'd want a stranger to know?\"" },
              { time: "yesterday 6:30pm", text: "\"Try recording your idea out loud first.\"" },
              { time: "today 9:01am", text: "\"It's okay to leave a draft and come back.\"" },
            ].map((n, i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid var(--line-strong)" }}>
                <div className="num" style={{ fontSize: 10, color: "var(--ink-4)", marginBottom: 2, letterSpacing: "0.04em", textTransform: "uppercase" }}>{n.time}</div>
                {n.text}
              </div>
            ))}
          </div>
        </div>

        {/* Compose comment */}
        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 200 }}>
          <div className="card-header">
            <h2>Your comment</h2>
            {anchor ? (
              <span className="pill accent"><span className="dot"/>anchored to {anchor}</span>
            ) : (
              <span className="sub">Click a paragraph to anchor</span>
            )}
          </div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Write a coaching prompt that meets him where he is..."
              style={{
                flex: 1, minHeight: 80, resize: "none",
                border: "1px solid var(--line-strong)", borderRadius: 6,
                padding: 10, fontFamily: "inherit", fontSize: 13, color: "var(--ink)",
                background: "var(--bg-elevated)", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button className="btn sm ghost"><Icon name="sparkle" size={12}/>Suggest</button>
              <button className="btn sm ghost"><Icon name="audio" size={12}/>Voice</button>
              <button className="btn sm primary" onClick={submit} style={{ marginLeft: "auto" }} disabled={!draft.trim() || !anchor}>
                <Icon name="send" size={12}/>Post
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const ArtifactPara = ({ id, text, comments, anchor, onAnchor, stuck }) => {
  const myComments = comments.filter(c => c.anchor === id);
  const isAnchored = anchor === id;
  return (
    <div
      onClick={() => onAnchor(id)}
      style={{
        position: "relative",
        padding: "12px 14px",
        margin: "0 -14px 14px",
        borderRadius: 8,
        cursor: "pointer",
        background: isAnchored ? "rgba(244, 217, 236, 0.55)" : (myComments.length ? "var(--bg-elevated)" : "transparent"),
        border: isAnchored ? "1px solid rgba(226, 123, 184, 0.5)" : "1px solid transparent",
        transition: "background 0.12s",
      }}
    >
      <p style={{
        margin: 0,
        fontSize: 16,
        lineHeight: 1.65,
        color: stuck ? "var(--ink-3)" : "var(--ink)",
        fontStyle: stuck ? "italic" : "normal",
        textWrap: "pretty",
      }}>{text}{stuck && <span style={{ color: "var(--accent)" }}>|</span>}</p>
      {myComments.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--line-strong)", display: "flex", flexDirection: "column", gap: 8 }}>
          {myComments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: 8 }}>
              <Avatar name="A" hue={50} size={22}/>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-3)" }}><span style={{ color: "var(--ink)", fontWeight: 500 }}>You</span> · {c.time}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SignalLine = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
    <span>{label}</span>
    <span className="num" style={{ color: "var(--ink-2)" }}>{value}</span>
  </div>
);

window.CoachingScreen = CoachingScreen;
