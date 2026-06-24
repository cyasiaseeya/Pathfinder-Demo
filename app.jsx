// App shell — sidebar nav + screen routing

const App = () => {
  // Tweaks
  const tweaks = window.useTweaks(window.TWEAK_DEFAULTS);

  // Apply theme + density to root via data attrs
  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.values.theme;
    document.documentElement.dataset.density = tweaks.values.density;
  }, [tweaks.values.theme, tweaks.values.density]);

  // Routing state
  const [route, setRoute] = React.useState({ screen: "today", studentId: null });

  const navigate = (screen, studentId = null) => setRoute({ screen, studentId });

  const navItems = [
    { key: "today", label: "Today", icon: "today", badge: 2, badgeAccent: true },
    { key: "roster", label: "Roster", icon: "roster", badge: 8, badgeAccent: false },
    { key: "library", label: "Library", icon: "library" },
    { key: "parents", label: "Parents", icon: "parents", badge: 2, badgeAccent: true },
    { key: "mobile", label: "Mobile preview", icon: "student" },
  ];

  // crumb
  const { STUDENTS } = window.ARK_DATA;
  const student = route.studentId ? STUDENTS.find(s => s.id === route.studentId) : null;

  let title;
  if (route.screen === "today") title = "Today";
  else if (route.screen === "roster") title = "Roster";
  else if (route.screen === "student") title = <><span className="crumb" style={{cursor:"pointer"}} onClick={() => navigate("roster")}>Roster</span> <span style={{ color: "var(--ink-4)" }}>/</span> Student</>;
  else if (route.screen === "coach") title = <><span className="crumb" style={{cursor:"pointer"}} onClick={() => navigate("today")}>Today</span> <span style={{ color: "var(--ink-4)" }}>/</span> Live coaching</>;
  else if (route.screen === "library") title = "Library";
  else if (route.screen === "parents") title = "Parents";
  else if (route.screen === "mobile") title = "Mobile · Today";

  let activeNavKey = route.screen;
  if (route.screen === "student") activeNavKey = "roster";
  if (route.screen === "coach") activeNavKey = "today";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"></div>
          <div className="brand-text">
            <span className="name">Ark Academy</span>
            <span className="role">Facilitator</span>
          </div>
        </div>
        <div className="nav">
          <div className="nav-section">Workspace</div>
          {navItems.slice(0, 4).map(n => (
            <button key={n.key} className={"nav-item" + (activeNavKey === n.key ? " active" : "")} onClick={() => navigate(n.key)}>
              <Icon name={n.icon} size={15}/>
              <span>{n.label}</span>
              {n.badge && <span className={"badge" + (n.badgeAccent ? "" : " muted")} >{n.badge}</span>}
            </button>
          ))}
          <div className="nav-section" style={{ marginTop: 16 }}>Cohorts</div>
          {[
            { label: "Seoul · Tuesdays", count: 3 },
            { label: "Busan · Thursdays", count: 2 },
            { label: "Online · Mondays", count: 3 },
          ].map(c => (
            <button key={c.label} className="nav-item">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink-4)", marginLeft: 4, marginRight: 6 }}/>
              <span style={{ fontSize: 12 }}>{c.label}</span>
              <span className="badge muted">{c.count}</span>
            </button>
          ))}
          <div className="nav-section" style={{ marginTop: 16 }}>Preview</div>
          <button className={"nav-item" + (route.screen === "mobile" ? " active" : "")} onClick={() => navigate("mobile")}>
            <Icon name="student" size={15}/>
            <span>Mobile · Today</span>
          </button>
        </div>

        <div className="facilitator-card">
          <Avatar name="A" hue={50} size={32}/>
          <div className="meta" style={{ flex: 1, minWidth: 0 }}>
            <div className="name">Alex Han</div>
            <div className="role">Lead facilitator</div>
          </div>
          <Icon name="settings" size={14}/>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="spacer"/>
          <div className="search">
            <Icon name="search" size={14}/>
            <input placeholder="Search children, projects, traits..."/>
            <span className="kbd">⌘K</span>
          </div>
          <button className="icon-btn"><Icon name="bell" size={14}/></button>
          <button className="icon-btn"><Icon name="settings" size={14}/></button>
        </header>

        {route.screen === "today" && <window.TodayScreen onNavigate={navigate}/>}
        {route.screen === "roster" && <window.RosterScreen onNavigate={navigate}/>}
        {route.screen === "student" && <window.StudentDetailScreen studentId={route.studentId} onNavigate={navigate}/>}
        {route.screen === "coach" && <window.CoachingScreen studentId={route.studentId || "s1"} onNavigate={navigate}/>}
        {route.screen === "library" && <window.LibraryScreen onNavigate={navigate}/>}
        {route.screen === "parents" && <window.ParentsScreen onNavigate={navigate}/>}
        {route.screen === "mobile" && <window.MobileTodayScreen/>}
      </main>

      {/* Tweaks panel */}
      <window.TweaksPanel>
        <window.TweakSection title="Appearance">
          <window.TweakRadio
            label="Theme"
            value={tweaks.values.theme}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
            onChange={v => tweaks.setTweak("theme", v)}
          />
          <window.TweakRadio
            label="Density"
            value={tweaks.values.density}
            options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
            onChange={v => tweaks.setTweak("density", v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Arketype radar">
          <window.TweakRadio
            label="Style"
            value={tweaks.values.radarStyle}
            options={[{ value: "hex", label: "Hex" }, { value: "circle", label: "Rings" }]}
            onChange={v => tweaks.setTweak("radarStyle", v)}
          />
          <window.TweakToggle
            label="Show glow"
            value={tweaks.values.glow}
            onChange={v => tweaks.setTweak("glow", v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
