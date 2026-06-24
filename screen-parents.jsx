// Screen: Parents — threaded messaging + scheduled progress notes

const ParentsScreen = ({ onNavigate }) => {
  const { PARENT_THREADS, STUDENTS, ARKETYPE_DIMS } = window.ARK_DATA;
  const [activeId, setActiveId] = React.useState(PARENT_THREADS[0].id);
  const [composing, setComposing] = React.useState(true);
  const active = PARENT_THREADS.find(t => t.id === activeId);
  const student = STUDENTS.find(s => s.id === active.studentId);

  return (
    <div className="content" style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr) 320px", gap: 16, height: "calc(100vh - 56px)", paddingBottom: 0 }}>
      {/* Threads list */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="card-header">
          <h2>Families</h2>
          <span className="pill accent" style={{ marginLeft: "auto" }}><span className="dot"/>2 unread</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {PARENT_THREADS.map(t => {
            const s = STUDENTS.find(x => x.id === t.studentId);
            return (
              <div
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--line)",
                  background: activeId === t.id ? "var(--bg-sunken)" : "transparent",
                  cursor: "pointer",
                  display: "flex", gap: 10, position: "relative",
                }}
              >
                <Avatar name={t.parentName} hue={s.avatarHue} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>
                      <span className="ko-name" style={{ fontSize: 13 }}>{t.parentKo}</span>
                    </span>
                    <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{t.time}</span>
                  </div>
                  <div className="romanized" style={{ fontSize: 11, marginBottom: 4 }}>
                    {t.parentName} · {s.nameKo}'s parent
                  </div>
                  <div style={{ fontSize: 12, color: t.unread ? "var(--ink)" : "var(--ink-3)", lineHeight: 1.4, fontWeight: t.unread ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {t.last}
                  </div>
                </div>
                {t.unread && <div style={{ position: "absolute", top: 14, right: 8, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={active.parentName} hue={student.avatarHue} size={36}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
              <span className="ko-name">{active.parentKo}</span>
              <span className="romanized" style={{ fontSize: 12, marginLeft: 6 }}>· {active.parentName}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Parent of <span style={{ color: "var(--ink-2)" }}>{student.nameKo} · {student.nameRo}</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn sm" onClick={() => onNavigate("student", student.id)}>View child</button>
            <button className="btn sm"><Icon name="schedule" size={12}/>History</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, background: "var(--bg-elevated)" }}>
          {active.messages.length === 0 ? (
            <div style={{ margin: "auto", textAlign: "center", color: "var(--ink-3)" }}>
              <div style={{ fontSize: 13 }}>No messages yet.</div>
            </div>
          ) : active.messages.map((m, i) => (
            <Bubble key={i} m={m} student={student} parent={active}/>
          ))}
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <span className="num" style={{ fontSize: 11, color: "var(--ink-3)", padding: "2px 10px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--line)" }}>
              Last seen by parent · 1h ago
            </span>
          </div>
        </div>

        <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea
            placeholder="Write a quick reply..."
            style={{
              width: "100%", minHeight: 50, resize: "none",
              border: "1px solid var(--line-strong)", borderRadius: 6,
              padding: 10, fontFamily: "inherit", fontSize: 13,
              background: "var(--surface)", outline: "none", color: "var(--ink)",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn sm ghost"><Icon name="sparkle" size={12}/>Suggest</button>
            <button className="btn sm ghost"><Icon name="schedule" size={12}/>Schedule</button>
            <div style={{ flex: 1 }}/>
            <button className="btn sm primary"><Icon name="send" size={12}/>Send</button>
          </div>
        </div>
      </div>

      {/* Compose progress note */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="card-header">
          <h2>Scheduled progress note</h2>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
          <div>
            <Label>Recipient</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "var(--bg-elevated)" }}>
              <Avatar name={active.parentName} hue={student.avatarHue} size={22}/>
              <span style={{ fontSize: 13 }}><span className="ko-name">{active.parentKo}</span> <span className="romanized">· {active.parentName}</span></span>
            </div>
          </div>

          <div>
            <Label>Send</Label>
            <div style={{ display: "flex", gap: 6 }}>
              <Chip selected>Friday 5 PM</Chip>
              <Chip>Now</Chip>
              <Chip>Pick a time</Chip>
            </div>
          </div>

          <div>
            <Label>Body</Label>
            <textarea
              defaultValue={`Hi ${active.parentName.split(" ")[1]} — Minjun had a meaningful week. He volunteered an opinion in a partner exercise on Tuesday — the first time he's done that in English. Small moment, but it matters.\n\nHe's still working on the Time Capsule project. He's stuck on draft 3, which is normal at this stage. We'll work through it together this Thursday.`}
              style={{
                width: "100%", minHeight: 130, resize: "vertical",
                border: "1px solid var(--line-strong)", borderRadius: 6,
                padding: 10, fontFamily: "inherit", fontSize: 13, lineHeight: 1.5,
                background: "var(--bg-elevated)", outline: "none", color: "var(--ink-2)",
              }}
            />
          </div>

          <div>
            <Label>Arketype highlight to attach</Label>
            <div style={{ padding: 12, border: "1px solid oklch(0.88 0.06 50)", borderRadius: 8, background: "oklch(0.96 0.03 50 / 0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <ArketypeRadar values={student.profile} size={48} thin glow={false} highlight="courage"/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--accent-ink)", fontWeight: 500 }}>Voicer · climbing</div>
                  <div className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>+14 over 4 weeks</div>
                </div>
                <Sparkline data={student.voiceTrend} width={60} height={24} stroke="var(--accent)" fill="oklch(0.72 0.16 38)" accent/>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5, padding: 8, background: "var(--surface)", borderRadius: 6, border: "1px solid var(--line)" }}>
                "Voicer" measures interpersonal communication confidence — how willing your child is to speak up, especially in English.
              </div>
            </div>
          </div>

          <div>
            <Label>Already shared with parent</Label>
            <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.6 }}>
              <div>Apr 22 · Map of My Walk to School · final showcase</div>
              <div>Apr 8 · Audio recording (Letter project)</div>
              <div>Mar 25 · Voicer trait note</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
            <button className="btn sm" style={{ flex: 1 }}>Save draft</button>
            <button className="btn sm primary" style={{ flex: 1 }}><Icon name="schedule" size={12}/>Schedule send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Bubble = ({ m, student, parent }) => {
  const isMe = m.from === "facilitator";
  return (
    <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", gap: 8 }}>
      {!isMe && <Avatar name={parent.parentName} hue={student.avatarHue} size={28}/>}
      <div style={{ maxWidth: "70%" }}>
        <div style={{
          padding: "10px 14px",
          borderRadius: 14,
          borderBottomLeftRadius: !isMe ? 4 : 14,
          borderBottomRightRadius: isMe ? 4 : 14,
          background: isMe ? "var(--ink)" : "var(--surface)",
          color: isMe ? "var(--bg)" : "var(--ink)",
          fontSize: 13,
          lineHeight: 1.5,
          border: isMe ? "none" : "1px solid var(--line)",
          textWrap: "pretty",
        }}>{m.text}</div>
        <div className="num" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 4, textAlign: isMe ? "right" : "left" }}>{m.time}</div>
      </div>
      {isMe && <Avatar name="A" hue={50} size={28}/>}
    </div>
  );
};

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>{children}</div>
);

const Chip = ({ children, selected }) => (
  <button className={"pill" + (selected ? " accent" : "")} style={{ cursor: "pointer", padding: "4px 10px", fontSize: 11 }}>
    {selected && <span className="dot"/>}
    {children}
  </button>
);

window.ParentsScreen = ParentsScreen;
