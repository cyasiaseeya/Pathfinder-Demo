// Mock data for the Ark Academy Facilitator Portal
// All names, projects, traits are fictional for design purposes.

const ARKETYPE_DIMS = [
  { key: "explore",    label: "Explorer",    short: "EXP",  group: "cognitive" },
  { key: "build",      label: "Builder",     short: "BLD",  group: "cognitive" },
  { key: "analyze",    label: "Analyst",     short: "ANL",  group: "cognitive" },
  { key: "synthesize", label: "Synthesist",  short: "SYN",  group: "cognitive" },
  { key: "imagine",    label: "Imaginer",    short: "IMG",  group: "cognitive" },
  { key: "decide",     label: "Decider",     short: "DEC",  group: "cognitive" },
  { key: "translate",  label: "Translator",  short: "TRN",  group: "cognitive" },
  { key: "question",   label: "Questioner",  short: "QST",  group: "cognitive" },
  { key: "express",    label: "Expresser",   short: "EXP2", group: "affective" },
  { key: "listen",     label: "Listener",    short: "LSN",  group: "affective" },
  { key: "persist",    label: "Persister",   short: "PRS",  group: "affective" },
  { key: "reflect",    label: "Reflector",   short: "RFL",  group: "affective" },
  { key: "collab",     label: "Collaborator",short: "COL",  group: "affective" },
  { key: "courage",    label: "Voicer",      short: "VOI",  group: "affective", spine: true }, // interpersonal communication confidence
  { key: "regulate",   label: "Regulator",   short: "REG",  group: "affective" },
  { key: "wonder",     label: "Wonderer",    short: "WND",  group: "affective" },
];

// Each student has a 16-d profile (0–100) and a sparkline history per dim
function makeProfile(seed) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return ARKETYPE_DIMS.map(d => Math.round(35 + rand() * 55));
}
function makeHistory(seed, len = 12, trend = 0) {
  let s = seed * 7 + 13;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let v = 35 + rand() * 30;
  const out = [];
  for (let i = 0; i < len; i++) {
    v += (rand() - 0.5) * 6 + trend;
    v = Math.max(15, Math.min(95, v));
    out.push(Math.round(v));
  }
  return out;
}

const STUDENTS = [
  {
    id: "s1",
    nameKo: "김민준",
    nameRo: "Minjun Kim",
    age: 11,
    grade: "5th",
    cohort: "Seoul · Tuesdays",
    avatarHue: 30,
    profile: makeProfile(1),
    voiceTrend: makeHistory(1, 12, 1.4), // rising
    activeProject: { title: "My Neighborhood Time Capsule", progress: 62, daysActive: 9, stuck: true, stuckReason: "No progress in 36 hours after the third revision step", milestone: null },
    lastTouch: "3d ago",
    needsAttention: true,
    attentionReason: "Stuck — Reactor flagged 14h ago",
  },
  {
    id: "s2",
    nameKo: "이서연",
    nameRo: "Seoyeon Lee",
    age: 10,
    grade: "4th",
    cohort: "Seoul · Tuesdays",
    avatarHue: 200,
    profile: makeProfile(2),
    voiceTrend: makeHistory(2, 12, 0.8),
    activeProject: { title: "Letter to a Future Student", progress: 88, daysActive: 6, stuck: false, milestone: "Crossing milestone — first audio recording today" },
    lastTouch: "1d ago",
    needsAttention: false,
  },
  {
    id: "s3",
    nameKo: "박지호",
    nameRo: "Jiho Park",
    age: 12,
    grade: "6th",
    cohort: "Busan · Thursdays",
    avatarHue: 140,
    profile: makeProfile(3),
    voiceTrend: makeHistory(3, 12, -0.4),
    activeProject: { title: "AI Storyteller Studio", progress: 24, daysActive: 12, stuck: true, stuckReason: "Three drafts started, none submitted in 5 days", milestone: null },
    lastTouch: "5d ago",
    needsAttention: true,
    attentionReason: "Long gap — last touchpoint 5 days",
  },
  {
    id: "s4",
    nameKo: "최하윤",
    nameRo: "Hayoon Choi",
    age: 9,
    grade: "3rd",
    cohort: "Online · Mondays",
    avatarHue: 320,
    profile: makeProfile(4),
    voiceTrend: makeHistory(4, 12, 0.5),
    activeProject: { title: "Build a Classroom Robot (Wizard-of-Oz)", progress: 45, daysActive: 4, stuck: false, milestone: null },
    lastTouch: "today",
    needsAttention: false,
  },
  {
    id: "s5",
    nameKo: "정도윤",
    nameRo: "Doyoon Jung",
    age: 11,
    grade: "5th",
    cohort: "Seoul · Tuesdays",
    avatarHue: 60,
    profile: makeProfile(5),
    voiceTrend: makeHistory(5, 12, 0.2),
    activeProject: { title: "Map of My Walk to School", progress: 71, daysActive: 7, stuck: false, milestone: null },
    lastTouch: "2d ago",
    needsAttention: false,
  },
  {
    id: "s6",
    nameKo: "한소율",
    nameRo: "Soyul Han",
    age: 10,
    grade: "4th",
    cohort: "Busan · Thursdays",
    avatarHue: 270,
    profile: makeProfile(6),
    voiceTrend: makeHistory(6, 12, 1.0),
    activeProject: { title: "Podcast: Three Things I Wonder About", progress: 33, daysActive: 5, stuck: false, milestone: null },
    lastTouch: "4d ago",
    needsAttention: false,
  },
  {
    id: "s7",
    nameKo: "윤채원",
    nameRo: "Chaewon Yoon",
    age: 12,
    grade: "6th",
    cohort: "Online · Mondays",
    avatarHue: 10,
    profile: makeProfile(7),
    voiceTrend: makeHistory(7, 12, 0.7),
    activeProject: { title: "Designing a Better Lunch Menu", progress: 95, daysActive: 11, stuck: false, milestone: "Final showcase ready for review" },
    lastTouch: "today",
    needsAttention: false,
  },
  {
    id: "s8",
    nameKo: "강예준",
    nameRo: "Yejun Kang",
    age: 9,
    grade: "3rd",
    cohort: "Online · Mondays",
    avatarHue: 180,
    profile: makeProfile(8),
    voiceTrend: makeHistory(8, 12, 0.3),
    activeProject: { title: "Talking to a Friend in Another Country", progress: 18, daysActive: 2, stuck: false, milestone: null },
    lastTouch: "today",
    needsAttention: false,
  },
];

const TRAIT_GROUPS = [
  {
    dim: "courage",
    label: "Voicer",
    gloss: "Interpersonal communication confidence — willingness to speak up, especially in a second language.",
    spine: true,
    traits: [
      { name: "Initiates conversation in English", value: 64, delta: +8 },
      { name: "Recovers after a misunderstanding", value: 71, delta: +12 },
      { name: "Asks clarifying questions", value: 58, delta: +5 },
      { name: "Volunteers an opinion", value: 49, delta: +3 },
      { name: "Speaks in front of peers", value: 42, delta: +9 },
    ]
  },
  {
    dim: "express",
    label: "Expresser",
    gloss: "Comfort turning thoughts into words, drawings, or audio.",
    traits: [
      { name: "Word choice variety", value: 68, delta: +4 },
      { name: "Draft-to-final tightening", value: 62, delta: +2 },
      { name: "Voice in writing", value: 71, delta: +6 },
    ]
  },
  {
    dim: "persist",
    label: "Persister",
    gloss: "Continuing through frustration on a project.",
    traits: [
      { name: "Returns after a stuck moment", value: 55, delta: -2 },
      { name: "Sustained focus across sessions", value: 48, delta: 0 },
      { name: "Tolerates ambiguity", value: 52, delta: +1 },
    ]
  },
  {
    dim: "analyze",
    label: "Analyst",
    gloss: "Breaking a problem into parts and noticing patterns.",
    traits: [
      { name: "Identifies the real question", value: 73, delta: +3 },
      { name: "Compares evidence", value: 66, delta: +2 },
      { name: "Spots inconsistencies", value: 59, delta: +5 },
    ]
  },
];

const PROJECTS = [
  { id: "p1", title: "My Neighborhood Time Capsule", kind: "Project", duration: "3 weeks", level: "Grade 4–6", focus: ["express", "imagine", "courage"], desc: "Build a digital time capsule of your block. Interview a neighbor in English. Record one moment in audio.", recommended: true, recommendedFor: "Voicer +" },
  { id: "p2", title: "AI Storyteller Studio", kind: "Project", duration: "2 weeks", level: "Grade 5–7", focus: ["imagine", "synthesize", "translate"], desc: "Co-write a short story with an AI helper. Decide what the AI gets right and what you change." },
  { id: "p3", title: "How to Disagree Kindly", kind: "Soft-skill module", duration: "4 sessions", level: "Grade 3–6", focus: ["listen", "courage", "regulate"], desc: "Practice saying \"I see it differently\" in English with a partner. Five short scenarios.", recommended: true, recommendedFor: "Listener" },
  { id: "p4", title: "Hallucination Firewall: spotting AI mistakes", kind: "AI literacy unit", duration: "3 sessions", level: "Grade 5–8", focus: ["analyze", "question"], desc: "How to notice when AI is making things up — a four-step check you can use anywhere." },
  { id: "p5", title: "Letter to a Future Student", kind: "Project", duration: "1 week", level: "Grade 3–5", focus: ["reflect", "express"], desc: "Write a letter to whoever joins the cohort after you. Record it as audio too." },
  { id: "p6", title: "Map of My Walk to School", kind: "Project", duration: "2 weeks", level: "Grade 3–6", focus: ["explore", "build"], desc: "Map your route. Mark the places that matter. Caption each one in English." },
  { id: "p7", title: "Three Things I Wonder About", kind: "Project", duration: "2 weeks", level: "Grade 3–6", focus: ["wonder", "question", "express"], desc: "Pick three open questions. Make a short podcast asking each of them out loud." },
  { id: "p8", title: "Asking AI Better Questions", kind: "AI literacy unit", duration: "2 sessions", level: "Grade 4–8", focus: ["question", "analyze"], desc: "Prompting basics in plain English. Why \"who, what, why\" beats \"tell me everything.\"" },
  { id: "p9", title: "Working with Someone Different", kind: "Soft-skill module", duration: "5 sessions", level: "Grade 4–7", focus: ["collab", "listen", "regulate"], desc: "Five short pair tasks designed to be a little uncomfortable, on purpose." },
];

const PARENT_THREADS = [
  {
    id: "t1", studentId: "s1", parentName: "Mrs. Kim",
    parentKo: "김 어머님",
    last: "Could you share what \"Voicer\" means? My son said his Reactor showed it going up.",
    time: "2h ago", unread: true,
    messages: [
      { from: "parent", text: "Hi — Minjun mentioned Reactor showed his \"Voicer\" went up this week. Could you explain what that means? He seemed proud of it.", time: "Tue 9:14 AM" },
      { from: "facilitator", text: "Of course. Voicer is our short name for interpersonal communication confidence — basically, how willing he is to speak up, especially in English. It's been climbing for three weeks now.", time: "Tue 9:42 AM" },
      { from: "parent", text: "Could you share what \"Voicer\" means? My son said his Reactor showed it going up.", time: "Wed 8:01 AM" },
    ]
  },
  {
    id: "t2", studentId: "s2", parentName: "Mr. Lee",
    parentKo: "이 아버님",
    last: "Thank you for last week's note. The audio piece was really moving.",
    time: "yesterday", unread: false,
    messages: []
  },
  {
    id: "t3", studentId: "s3", parentName: "Mrs. Park",
    parentKo: "박 어머님",
    last: "Jiho seems frustrated lately. Is everything okay?",
    time: "yesterday", unread: true,
    messages: []
  },
  {
    id: "t4", studentId: "s4", parentName: "Mr. Choi",
    parentKo: "최 아버님",
    last: "She loved the robot project! Can we get a copy of what she made?",
    time: "3d ago", unread: false,
    messages: []
  },
  {
    id: "t5", studentId: "s5", parentName: "Mrs. Jung",
    parentKo: "정 어머님",
    last: "—",
    time: "5d ago", unread: false,
    messages: []
  },
];

window.ARK_DATA = {
  ARKETYPE_DIMS,
  STUDENTS,
  TRAIT_GROUPS,
  PROJECTS,
  PARENT_THREADS,
};
