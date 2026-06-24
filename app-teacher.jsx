// app-teacher.jsx — Teacher Portal canvas.
// Mounts six review/HITL screens side by side.

const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  return (
    <div className="ark-app">
      <DesignCanvas>

        <DCSection id="loop" title="Human in the Loop" subtitle="Where the mentor stands beside the AI">
          <DCArtboard id="desk" label="01 · Mentor Desk" width={1280} height={1000}>
            <window.MentorDesk />
          </DCArtboard>
          <DCArtboard id="copilot" label="02 · Tutor Co-pilot" width={1280} height={820}>
            <window.TutorCopilot />
          </DCArtboard>
        </DCSection>

        <DCSection id="cohort" title="The Cohort" subtitle="All twelve, on one arc">
          <DCArtboard id="class" label="03 · Class Arc" width={1280} height={920}>
            <window.ClassArc />
          </DCArtboard>
        </DCSection>

        <DCSection id="plan" title="Planning the Week" subtitle="A novel week-weather forecast — where your hand will be needed">
          <DCArtboard id="planner" label="04 · Project Planner" width={1280} height={2080}>
            <window.ProjectPlanner />
          </DCArtboard>
        </DCSection>

        <DCSection id="gates" title="Ceremonial Gates" subtitle="Two screens where the mentor's hand is required">
          <DCArtboard id="review" label="05 · Artifact Review" width={1280} height={900}>
            <window.ArtifactReview />
          </DCArtboard>
          <DCArtboard id="unlock" label="06 · Unlock Approval" width={1280} height={920}>
            <window.UnlockApproval />
          </DCArtboard>
        </DCSection>

        <DCSection id="calibrate" title="Calibration" subtitle="Sign off on what reaches the family">
          <DCArtboard id="arketype" label="07 · Arketype Calibration" width={1280} height={920}>
            <window.ArketypeCalibrate />
          </DCArtboard>
        </DCSection>

        <DCSection id="bridge" title="Parent Bridge" subtitle="The Friday digest, plus open threads">
          <DCArtboard id="parent" label="08 · Parent Bridge" width={1280} height={1840}>
            <window.ParentBridge />
          </DCArtboard>
        </DCSection>

        <DCSection id="onthego" title="On the Go" subtitle="One-handed triage on a phone">
          <DCArtboard id="mobile-mentor" label="09 · Mobile Mentor" width={420} height={880}>
            <window.MobileMentor />
          </DCArtboard>
        </DCSection>

      </DesignCanvas>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
