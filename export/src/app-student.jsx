// app-student.jsx — Student Portal canvas mounting all screens.
// Lives separate from /app.jsx (which is the Facilitator app) to avoid collisions.

const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <div className="ark-app">
      <DesignCanvas>

        <DCSection id="flow" title="Flow Map" subtitle="The 5-step PBL arc — annotated">
          <DCArtboard id="flowmap" label="01 · PBL Flow" width={1280} height={820}>
            <window.FlowMap />
          </DCArtboard>
        </DCSection>

        <DCSection id="core" title="Core Screens" subtitle="The student's journey through one project">
          <DCArtboard id="home" label="02 · Home" width={1280} height={820}>
            <window.HomeScreen />
          </DCArtboard>
          <DCArtboard id="library" label="03 · Project Library" width={1280} height={820}>
            <window.ProjectLibrary />
          </DCArtboard>
          <DCArtboard id="draft" label="04 · Draft" width={1280} height={820}>
            <window.DraftScreen state="locked" />
          </DCArtboard>
          <DCArtboard id="tutor" label="05 · Tutor" width={1280} height={820}>
            <window.TutorScreen voice="gentle" />
          </DCArtboard>
          <DCArtboard id="revise" label="06 · Revise" width={1280} height={820}>
            <window.ReviseScreen />
          </DCArtboard>
          <DCArtboard id="defend" label="07 · Defend & Reflect" width={1280} height={820}>
            <window.DefendScreen />
          </DCArtboard>
          <DCArtboard id="arketype" label="08 · Arketype" width={1280} height={820}>
            <window.ArketypeScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="mobile" title="Mobile" subtitle="Tutor on a phone">
          <DCArtboard id="mobile-tutor" label="09 · Mobile Tutor" width={420} height={820}>
            <window.MobileTutorScreen />
          </DCArtboard>
        </DCSection>

        <DCSection id="moments" title="Unlock Moments" subtitle="Three variations on the threshold ceremony">
          <DCArtboard id="unlock" label="10 · Unlock Showcase" width={1280} height={820}>
            <window.UnlockShowcase />
          </DCArtboard>
        </DCSection>

        <DCSection id="system" title="Style Guide" subtitle="Type, color, AI states, iconography">
          <DCArtboard id="styleguide" label="11 · Style Guide" width={1280} height={820}>
            <window.StyleGuide />
          </DCArtboard>
        </DCSection>

      </DesignCanvas>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
