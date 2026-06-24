export interface ArkMission {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  icon: string;
  tagline: string;
  coreValues: string[];
  pillars: string[];          // pillar keys required
  pillarNames: string[];      // display names
  prepQuests: string[];       // solo quest titles that count as prep
  unlockThreshold: number;    // how many prep quests needed to unlock co-op
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ARK_MISSIONS: ArkMission[] = [
  {
    id: 1,
    title: 'Escape the Mall',
    subtitle: 'Mission 001',
    theme: 'escape',
    icon: '🛍️',
    tagline: 'Locked in a futuristic mall. Find the escape code before the power dies.',
    coreValues: ['Growth Mindset', 'Adaptability'],
    pillars: ['growth', 'adaptability'],
    pillarNames: ['Growth Mindset', 'Adaptability'],
    prepQuests: ['Bounce back from a bad grade', 'Handle a big change', 'Try something scary'],
    unlockThreshold: 2,
    color: '#534AB7',
    bgColor: '#EEEDFE',
    borderColor: '#AFA9EC',
  },
  {
    id: 2,
    title: 'Four-Season Islands',
    subtitle: 'Mission 002',
    theme: 'islands',
    icon: '🏝️',
    tagline: 'Three islands cut off from each other. Design a system that connects everyone.',
    coreValues: ['Empathy', 'Adaptability'],
    pillars: ['interpersonal', 'adaptability'],
    pillarNames: ['Interpersonal EQ', 'Adaptability'],
    prepQuests: ['Work with someone difficult', 'Stop fighting with a sibling', 'Handle a big change'],
    unlockThreshold: 2,
    color: '#1D9E75',
    bgColor: '#E1F5EE',
    borderColor: '#5DCAA5',
  },
  {
    id: 3,
    title: 'Mystery of the Missing Student',
    subtitle: 'Mission 003',
    theme: 'mystery',
    icon: '🔍',
    tagline: 'A student vanished after school. Follow the clues — but not all of them are real.',
    coreValues: ['Resilience', 'Empathy'],
    pillars: ['growth', 'interpersonal'],
    pillarNames: ['Growth Mindset', 'Interpersonal EQ'],
    prepQuests: ['Handle being left out', 'Solve a friend fallout', 'Calm down when frustrated'],
    unlockThreshold: 2,
    color: '#D85A30',
    bgColor: '#FAECE7',
    borderColor: '#F0997B',
  },
  {
    id: 4,
    title: 'No One Gets Left Behind',
    subtitle: 'Mission 004 — Final',
    theme: 'rocket',
    icon: '🚀',
    tagline: 'Earth is failing. Design a rocket that saves everyone — no exceptions.',
    coreValues: ['Empathy', 'Resilience', 'Growth Mindset', 'Adaptability'],
    pillars: ['interpersonal', 'growth', 'adaptability', 'communication'],
    pillarNames: ['Interpersonal EQ', 'Growth Mindset', 'Adaptability', 'Communication'],
    prepQuests: ['Ask for something important', 'Handle a big change', 'Speak up in class', 'Deal with a tough family moment'],
    unlockThreshold: 3,
    color: '#BA7517',
    bgColor: '#FAEEDA',
    borderColor: '#EF9F27',
  },
];

export function getArkMission(id: number): ArkMission | undefined {
  return ARK_MISSIONS.find((m) => m.id === id);
}

export function isPrepQuest(questTitle: string, missionId: number): boolean {
  const mission = getArkMission(missionId);
  return mission?.prepQuests.includes(questTitle) ?? false;
}

// ─── Full co-op scenario data (Ark Challenge Files) ─────────────────────────

export interface ReflectionQuestion {
  label: string;
  text: string;
  pillar: string;
  peerResponses: Array<{ name: string; text: string }>;
}

export interface CoopBadge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  pillar: string;
  type: 'ai' | 'peer';
}

export interface CoopXP {
  pillar: string;
  key: string;
  xp: number;
  color: string;
  bg: string;
}

export interface CoopScoreItem {
  label: string;
  points: number;
}

export interface ArkCoopScenario {
  missionId: number;
  // Lobby
  situation: string;
  goal: string;
  botRoles: Array<{ name: string; role: string; color: string; bg: string; initial: string }>;
  // Player role card in the deal
  playerRole: { icon: string; name: string };
  // Briefing
  playerClues: string;
  playerAction: { command: string; description: string };
  // Challenge
  initialGreeting: { character: string; message: string };
  chatPlaceholder: string;
  twistMessage: string;
  // Reveal
  crewAnswer: string;
  correctAnswer: string;
  whatCrackedTheCase: string;
  // Reflection
  reflectionQuestions: ReflectionQuestion[];
  // Results
  badges: CoopBadge[];
  xpGains: CoopXP[];
  scoreItems: CoopScoreItem[];
  // Solo follow-up after co-op
  weakPillarHints: Array<{ pillar: string; questToTry: string; reason: string }>;
}

export const ARK_COOP_SCENARIOS: ArkCoopScenario[] = [
  // ── MISSION 1: ESCAPE THE MALL ────────────────────────────────────────────
  {
    missionId: 1,
    situation: 'You\'re locked inside a futuristic mall after closing time. Exits are sealed, lights are glitching, and a storm is knocking out power sector by sector. A mall AI named M.A.R.A. has recruited your team as emergency problem-solvers.',
    goal: 'Find the 4-digit escape code hidden across four stores before power completely shuts down. Every clue is different — only together can you unlock the exit.',
    botRoles: [
      { name: 'Casey', role: 'Evidence Analyst', color: '#1D9E75', bg: '#E1F5EE', initial: 'C' },
      { name: 'River', role: 'Mapper',           color: '#D85A30', bg: '#FAECE7', initial: 'R' },
      { name: 'Drew',  role: 'Timekeeper',       color: '#BA7517', bg: '#FAEEDA', initial: 'D' },
    ],
    playerRole: { icon: '🔬', name: 'Code Breaker' },
    playerClues: 'You found a crumpled receipt from the Tech Store. It reads:\n\nTech Store · Item #1 = 7 · Item #2 = ? · Time: 7:14 PM\n\nWritten on the back: "The first number hides where knowledge sleeps."\n\nYou also have the full mall map: Tech Store · Food Court · Bookstore · Arcade · Cinema · Main Exit',
    playerAction: {
      command: '/decode [location]',
      description: 'Run a code analysis on any location clue your crew collects. Use it once to unlock a hidden digit.',
    },
    initialGreeting: {
      character: 'System',
      message: '🔒 M.A.R.A. ONLINE: Emergency lockdown activated. I am M.A.R.A. — Mall Assistance and Rescue Android. Power remaining: 45 minutes. All exits are sealed. Your team must find the 4-digit escape code hidden across four stores. Investigate and share what you discover. Good luck, investigators.',
    },
    chatPlaceholder: 'Share a clue or theory… (try /decode [location])',
    twistMessage: '⚡ POWER FAILURE — SECTOR 3: The Food Court has gone dark. All Food Court records are now inaccessible. Reconstruct what you remember from your notes and adapt your plan.',
    crewAnswer: 'The escape code is 4-1-5-6, found by combining clues from the Bookstore, Arcade, Food Court, and Cinema.',
    correctAnswer: 'The 4-digit escape code is 4-1-5-6. Each store hid one digit: Bookstore → 4 (from the highlighted word "KEYS"), Arcade → 1 (from reversing the high score 7214), Food Court → 5 (Pizza + Taco = 5), Cinema → 6 (the pattern of +1 hour in the showtimes). The clues connected in that exact order.',
    whatCrackedTheCase: 'Combining the receipt clue ("knowledge sleeps" = Bookstore) with each teammate\'s store digit — no one person had the full code. The crew had to share everything to see the pattern.',
    reflectionQuestions: [
      {
        label: 'Reflect',
        text: 'Which clue was hardest for your crew to agree on — and why?',
        pillar: 'Growth Mindset',
        peerResponses: [
          { name: 'Casey', text: "The Food Court one — we lost it in the power outage and had to work from memory." },
          { name: 'River', text: "The Arcade clue was tricky because we had to think backwards. Not obvious at first." },
        ],
      },
      {
        label: 'Consider',
        text: 'When power cut out in Sector 3, how did you and your crew adapt your plan?',
        pillar: 'Adaptability',
        peerResponses: [
          { name: 'Casey', text: "We worked from what we'd already written down — good thing we took notes early." },
          { name: 'Drew', text: "I reminded the crew what time we had left. That kept us from panicking." },
        ],
      },
      {
        label: 'Look ahead',
        text: 'Which teammate\'s idea or contribution made the biggest difference? What did they do?',
        pillar: 'Communication',
        peerResponses: [
          { name: 'River', text: "When you connected the receipt clue to the Bookstore — that started the whole chain." },
          { name: 'Drew', text: "Casey staying calm after the power outage and reconstructing the Food Court clue was huge." },
        ],
      },
    ],
    badges: [
      { id: 'code_cracker',      icon: '🔐', name: 'Code Cracker',     desc: 'You decoded the receipt clue first and pointed the crew to the Bookstore — that started the whole chain.',        pillar: 'Growth Mindset',   type: 'ai' },
      { id: 'power_resilient',   icon: '⚡', name: 'Power Resilient',  desc: 'After Sector 3 lost power, you helped reconstruct the missing Food Court clue from memory and notes.',             pillar: 'Adaptability',     type: 'ai' },
      { id: 'crew_coordinator',  icon: '👑', name: 'Crew Coordinator', desc: 'Casey and River both named you as the teammate who kept the crew focused when the situation got chaotic.',          pillar: 'Communication',    type: 'peer' },
    ],
    xpGains: [
      { pillar: 'Growth Mindset', key: 'growth',        xp: 45, color: '#639922', bg: '#EAF3DE' },
      { pillar: 'Adaptability',   key: 'adaptability',  xp: 50, color: '#BA7517', bg: '#FAEEDA' },
      { pillar: 'Communication',  key: 'communication', xp: 40, color: '#D85A30', bg: '#FAECE7' },
    ],
    scoreItems: [
      { label: 'Correct escape code',        points: 500 },
      { label: 'Time remaining (8:22 left)', points: 160 },
      { label: 'All store clues shared',     points: 100 },
      { label: 'Power outage adapted',       points: 150 },
      { label: 'No time extension used',     points: 50  },
      { label: 'Reflection quality',         points: 90  },
    ],
    weakPillarHints: [
      { pillar: 'growth',       questToTry: 'Bounce back from a bad grade',  reason: 'Your crew hesitated after early wrong guesses — this quest builds persistence after mistakes.' },
      { pillar: 'adaptability', questToTry: 'Handle a big change',           reason: 'The power outage twist challenged the crew — this quest builds flexibility when plans break.' },
      { pillar: 'communication',questToTry: 'Speak up in class',             reason: 'Some clues took too long to surface — this quest builds the habit of sharing ideas quickly.' },
    ],
  },

  // ── MISSION 2: FOUR-SEASON ISLANDS ───────────────────────────────────────
  {
    missionId: 2,
    situation: 'Three islands — Winter Island, Summer Island, and Storm Island — have become completely disconnected. Families are separated, food deliveries are delayed, and medical supplies cannot reach those who need them. Mayor Aurora needs your team to design a transportation solution.',
    goal: 'Design transportation systems connecting all three islands. You can only build TWO major systems. Every citizen must be considered — children, elderly, workers, and emergency services.',
    botRoles: [
      { name: 'Kai',   role: 'Systems Analyst',   color: '#1D9E75', bg: '#E1F5EE', initial: 'K' },
      { name: 'Maya',  role: 'Empathy Engineer',  color: '#D85A30', bg: '#FAECE7', initial: 'M' },
      { name: 'Atlas', role: 'Budget Tracker',    color: '#BA7517', bg: '#FAEEDA', initial: 'A' },
    ],
    playerRole: { icon: '🌿', name: 'Community Planner' },
    playerClues: 'Your research data shows:\n\n• 150 elderly residents on Winter Island need weekly medical deliveries\n• Elderly citizens cannot tolerate extreme cold during long transport\n• Any Winter Island connection must include shelter, heating, and accessibility features\n• A transport option without weather protection will fail elderly citizens',
    playerAction: {
      command: '/survey [citizen group]',
      description: 'Survey a specific citizen group to learn their exact needs. Use it once to unlock critical design requirements.',
    },
    initialGreeting: {
      character: 'System',
      message: '📡 MAYOR AURORA: Hello, Ark Problem Solvers. Our islands have always relied on one another. Winter Island grows medicine. Summer Island grows food. Storm Island generates electricity. Without transportation, our communities cannot survive. You have 20 minutes. Design a system that connects everyone — and remember, every citizen matters.',
    },
    chatPlaceholder: 'Share your design idea or research… (try /survey [citizen group])',
    twistMessage: '⚡ BREAKING NEWS: A powerful blizzard has struck Winter Island. Visibility is near zero. Roads are frozen. Your current transportation plan may fail in these conditions. Emergency redesign required!',
    crewAnswer: 'Underground tunnel connecting Winter and Storm Islands, plus a heated enclosed cable car from Summer Island.',
    correctAnswer: 'The safest design uses two systems: an underground tunnel connecting Winter and Storm Islands (protected from weather, accessible for elderly, delivers medicine and electricity), and a heated, enclosed cable car from Summer Island to the tunnel hub (safe for children like Lily who fear storms, efficient for food delivery). This approach protects the most vulnerable and keeps all three islands connected even during extreme weather.',
    whatCrackedTheCase: 'Combining Kai\'s terrain analysis with Maya\'s citizen profiles and Atlas\'s budget constraints — the crew realized only an underground connection could survive Winter Island\'s conditions and protect the elderly.',
    reflectionQuestions: [
      {
        label: 'Reflect',
        text: 'Which citizen\'s needs most changed your design — and how?',
        pillar: 'Interpersonal EQ',
        peerResponses: [
          { name: 'Kai',  text: "Grandpa Ben — once we realized he couldn't walk long distances, we had to add accessibility to everything." },
          { name: 'Maya', text: "Lily changed my whole thinking. She's afraid of storms, so covered transport became non-negotiable." },
        ],
      },
      {
        label: 'Consider',
        text: 'When the blizzard hit, what part of your plan had to change — and what did your crew do?',
        pillar: 'Adaptability',
        peerResponses: [
          { name: 'Atlas', text: "We'd planned an open bridge — the blizzard made that impossible. We pivoted to underground." },
          { name: 'Kai',   text: "The team stayed calm and asked 'what still works?' instead of starting from zero." },
        ],
      },
      {
        label: 'Look ahead',
        text: 'What would you do differently if you redesigned this from the start?',
        pillar: 'Growth Mindset',
        peerResponses: [
          { name: 'Maya',  text: "I'd read all the citizen profiles before sketching anything — empathy first, design second." },
          { name: 'Atlas', text: "I'd plan for weather emergencies from the beginning, not as an afterthought." },
        ],
      },
    ],
    badges: [
      { id: 'citizen_champion', icon: '❤️', name: 'Citizen Champion',  desc: 'You surfaced the elderly accessibility requirement that became the cornerstone of the entire design.',          pillar: 'Interpersonal EQ', type: 'ai' },
      { id: 'blizzard_proof',   icon: '❄️', name: 'Blizzard Proof',    desc: 'After the blizzard twist, you proposed the underground tunnel redesign that saved the plan.',                  pillar: 'Adaptability',     type: 'ai' },
      { id: 'design_lead',      icon: '🌟', name: 'Design Lead',       desc: 'Kai and Maya both credited your community research as the reason the final design considered everyone.',        pillar: 'Interpersonal EQ', type: 'peer' },
    ],
    xpGains: [
      { pillar: 'Interpersonal EQ', key: 'interpersonal', xp: 55, color: '#1D9E75', bg: '#E1F5EE' },
      { pillar: 'Adaptability',     key: 'adaptability',  xp: 50, color: '#BA7517', bg: '#FAEEDA' },
      { pillar: 'Growth Mindset',   key: 'growth',        xp: 35, color: '#639922', bg: '#EAF3DE' },
    ],
    scoreItems: [
      { label: 'Design covers all citizens',   points: 500 },
      { label: 'Time remaining (7:45 left)',   points: 150 },
      { label: 'All citizen needs addressed',  points: 120 },
      { label: 'Blizzard redesign completed',  points: 150 },
      { label: 'Budget constraints respected', points: 60  },
      { label: 'Reflection quality',           points: 80  },
    ],
    weakPillarHints: [
      { pillar: 'interpersonal', questToTry: 'Work with someone difficult',  reason: 'Understanding different needs was challenging — this quest builds perspective-taking.' },
      { pillar: 'adaptability',  questToTry: 'Stop fighting with a sibling', reason: 'The blizzard twist caused friction — this quest builds flexible thinking under pressure.' },
      { pillar: 'growth',        questToTry: 'Try something scary',          reason: 'Some design ideas felt too risky — this quest builds confidence to try bold approaches.' },
    ],
  },

  // ── MISSION 3: MYSTERY OF THE MISSING STUDENT ─────────────────────────────
  {
    missionId: 3,
    situation: 'A student named Eli never arrived home after school. His family called the school. Investigators found strange markings on his papers and a cryptic notebook. The principal has called in the Ark Investigation Bureau — your team.',
    goal: 'Analyze the evidence, determine where Eli is and why he disappeared, and present a safe rescue plan — before nightfall. Warning: not every clue is real.',
    botRoles: [
      { name: 'Morgan', role: 'Evidence Analyst', color: '#1D9E75', bg: '#E1F5EE', initial: 'M' },
      { name: 'Jamie',  role: 'Mapper',           color: '#D85A30', bg: '#FAECE7', initial: 'J' },
      { name: 'Reese',  role: 'Clue Connector',   color: '#BA7517', bg: '#FAEEDA', initial: 'R' },
    ],
    playerRole: { icon: '🔍', name: 'Logic Checker' },
    playerClues: 'You have two pieces of Eli\'s evidence:\n\n1. His science quiz — in the top corner, letters are written vertically: L · I · B · R · A · R · Y\n\n2. A notebook page reads: "Sometimes the quietest place has the loudest answers."\n\n3. A personal journal excerpt: "I hope nobody thinks I\'m in trouble. I just need to finish something important before tomorrow."',
    playerAction: {
      command: '/analyze [clue]',
      description: 'Run a deep logic analysis on any piece of evidence. Use it once to test whether a clue is real or a red herring.',
    },
    initialGreeting: {
      character: 'System',
      message: '🏫 PRINCIPAL\'S OFFICE: Investigators, we have a serious situation. Student Eli never arrived home after school. We found unusual markings on his papers. Everything in your evidence packet may matter — but not all of it is real. Good investigators determine the difference before drawing conclusions. Find Eli before nightfall.',
    },
    chatPlaceholder: 'Share your analysis or theory… (try /analyze [clue])',
    twistMessage: '⚡ NEW EVIDENCE ALERT: One clue in your evidence packet was intentionally planted as a fake. The library clue was false — the letters on the quiz do NOT lead to the library. Reassess your evidence immediately!',
    crewAnswer: 'Eli is in the old Science Greenhouse, working on a secret science fair project. He is safe.',
    correctAnswer: 'Eli is in the old Science Greenhouse behind the main school building. He was secretly finishing a science project for the school showcase and lost track of time — his phone battery died. He was never in danger. The real clues were: the Greenhouse circled on the school map, the teacher\'s sighting of Eli with a science book and flashlight, the "SCIENCE" acrostic in his notebook, and the lab schedule showing the Greenhouse was open after school.',
    whatCrackedTheCase: 'Ignoring the false library clue and focusing on the Greenhouse map circle, the science book sighting, and the hidden SCIENCE acrostic — no single clue was enough, but together they pointed to one location.',
    reflectionQuestions: [
      {
        label: 'Reflect',
        text: 'How did your team react when you discovered a clue was fake — what happened next?',
        pillar: 'Growth Mindset',
        peerResponses: [
          { name: 'Morgan', text: "We were frustrated for a moment, but then regrouped and asked: what do we know for certain?" },
          { name: 'Jamie',  text: "I went back to the map and started fresh from the Greenhouse circle — it was our strongest lead." },
        ],
      },
      {
        label: 'Consider',
        text: 'Why is it important not to assume the worst about someone before you have all the evidence?',
        pillar: 'Interpersonal EQ',
        peerResponses: [
          { name: 'Reese', text: "Eli's journal said he didn't want anyone to worry — he had good reasons for being there." },
          { name: 'Morgan', text: "If we'd assumed the worst, we might have wasted time on the wrong lead." },
        ],
      },
      {
        label: 'Look ahead',
        text: 'What helped your crew keep going when things got confusing?',
        pillar: 'Adaptability',
        peerResponses: [
          { name: 'Jamie',  text: "We kept coming back to what the evidence actually said, not what we assumed." },
          { name: 'Reese',  text: "Staying focused on finding Eli — not on being right — kept us moving." },
        ],
      },
    ],
    badges: [
      { id: 'fake_spotter',     icon: '🧠', name: 'Fake Spotter',     desc: 'You correctly questioned the library clue before the twist revealed it — your critical thinking protected the crew from a false lead.', pillar: 'Growth Mindset',   type: 'ai' },
      { id: 'steady_detective', icon: '🔎', name: 'Steady Detective', desc: 'After the fake clue reveal, you kept the crew grounded and redirected them to the strongest remaining evidence.',                      pillar: 'Adaptability',    type: 'ai' },
      { id: 'most_reliable',    icon: '🤝', name: 'Most Reliable',    desc: 'Morgan and Reese both named you as the teammate who stayed calm and kept the investigation logical throughout.',                         pillar: 'Interpersonal EQ',type: 'peer' },
    ],
    xpGains: [
      { pillar: 'Growth Mindset',   key: 'growth',        xp: 50, color: '#639922', bg: '#EAF3DE' },
      { pillar: 'Interpersonal EQ', key: 'interpersonal', xp: 45, color: '#1D9E75', bg: '#E1F5EE' },
      { pillar: 'Adaptability',     key: 'adaptability',  xp: 40, color: '#BA7517', bg: '#FAEEDA' },
    ],
    scoreItems: [
      { label: 'Correct location identified', points: 500 },
      { label: 'Time remaining (9:05 left)',  points: 180 },
      { label: 'Fake clue identified',        points: 120 },
      { label: 'Twist adapted correctly',     points: 150 },
      { label: 'All evidence evaluated',      points: 60  },
      { label: 'Reflection quality',          points: 75  },
    ],
    weakPillarHints: [
      { pillar: 'growth',       questToTry: 'Bounce back from a bad grade',  reason: 'When the fake clue hit, some hesitation showed — this quest builds persistence after setbacks.' },
      { pillar: 'interpersonal',questToTry: 'Handle being left out',         reason: 'Understanding Eli\'s perspective was key — this quest builds empathy for others\' hidden experiences.' },
      { pillar: 'adaptability', questToTry: 'Calm down when frustrated',     reason: 'The false clue twist caused frustration — this quest builds emotional reset under pressure.' },
    ],
  },

  // ── MISSION 4: NO ONE GETS LEFT BEHIND ────────────────────────────────────
  {
    missionId: 4,
    situation: 'Earth\'s atmosphere is collapsing. Scientists have identified a safe colony on a nearby planet. A single evacuation rocket is being prepared — but resources are scarce and space is limited. Your team is humanity\'s final emergency planning council.',
    goal: 'Design an evacuation system that protects every passenger. You have 10 people, 8 sleeping pods, and limited resources. The central rule: NO ONE GETS LEFT BEHIND. No exceptions.',
    botRoles: [
      { name: 'Nova',  role: 'Resource Manager', color: '#1D9E75', bg: '#E1F5EE', initial: 'N' },
      { name: 'Orion', role: 'Engineer',          color: '#D85A30', bg: '#FAECE7', initial: 'O' },
      { name: 'Lyra',  role: 'Ethics Advisor',    color: '#BA7517', bg: '#FAEEDA', initial: 'L' },
    ],
    playerRole: { icon: '🚀', name: 'Evacuation Planner' },
    playerClues: 'Emergency inventory:\n\n• Oxygen Tanks = 10 (for 10 passengers)\n• Sleeping Pods = 8 (for 10 passengers — 2 short)\n• Medical Kits = 3\n• Food Units = 12\n• Energy Cells = 5\n\nCritical constraint: The Doctor and Injured Scientist both require immediate access to the 3 Medical Kits. Grandma Rosa needs mobility support near her sleeping area.',
    playerAction: {
      command: '/allocate [resource] to [passenger]',
      description: 'Assign a critical resource to a specific passenger. Use it once to resolve a high-priority conflict.',
    },
    initialGreeting: {
      character: 'System',
      message: '🚨 MISSION CONTROL: Attention Ark Council. Earth\'s atmosphere is becoming unstable. Survival colonies are ready. Resources are critically limited. You have 10 passengers: Grandma Rosa (mobility support needed), Twin Children (adult supervision), Injured Scientist (medical station), Engineer (control room access), Service Dog (safe accommodation), and Doctor (medical supplies). Every decision matters. No one gets left behind.',
    },
    chatPlaceholder: 'Share your resource plan or design… (try /allocate [resource] to [passenger])',
    twistMessage: '⚡ INCOMING EMERGENCY: Two additional survivors have arrived at the launch site — a child and a farmer. Launch is in 5 minutes. There is no second rocket. Redesign your plan immediately. No one gets left behind.',
    crewAnswer: 'Foldable sleeping platforms for the two new survivors built using Energy Cells, with shared spaces for the twins and service dog.',
    correctAnswer: 'Final evacuation plan: Twins share one sleeping pod. Service Dog accommodates with Grandma Rosa. Two new survivors (child + farmer) use foldable platforms built from 2 Energy Cells. Doctor and Scientist share access to all 3 Medical Kits near the medical station. Engineer stays at the control room. Everyone survives. Fairness was maintained by prioritizing vulnerability and sharing, not exclusion.',
    whatCrackedTheCase: 'Orion\'s engineering insight to build foldable platforms with Energy Cells, combined with Lyra\'s ethics framework of "equity over equality" — these two ideas together made it possible to include everyone.',
    reflectionQuestions: [
      {
        label: 'Reflect',
        text: 'When you realized you had fewer sleeping pods than passengers, what did your crew do — and how did you feel?',
        pillar: 'Growth Mindset',
        peerResponses: [
          { name: 'Nova',  text: "We almost panicked, but then switched from 'who gets cut' to 'how do we make more space.'" },
          { name: 'Orion', text: "I remembered the Energy Cells. That pivot — from scarcity thinking to engineering thinking — changed everything." },
        ],
      },
      {
        label: 'Consider',
        text: 'How did your crew decide what was fair when resources were scarce? What guided your decisions?',
        pillar: 'Interpersonal EQ',
        peerResponses: [
          { name: 'Lyra',  text: "We kept asking: who needs this most right now, not who deserves it most." },
          { name: 'Nova',  text: "Fairness meant giving people what they needed, not the same thing to everyone." },
        ],
      },
      {
        label: 'Look ahead',
        text: 'When the two new survivors arrived, how did your crew stay calm and adapt in under 5 minutes?',
        pillar: 'Adaptability',
        peerResponses: [
          { name: 'Orion', text: "We already had a plan framework — we just extended it. The foldable platform idea was ready." },
          { name: 'Lyra',  text: "Nobody froze. Everyone trusted each other's role and moved fast." },
        ],
      },
    ],
    badges: [
      { id: 'nobody_left',    icon: '🚀', name: 'Nobody Left Behind', desc: 'You found the foldable platform solution that made it possible to include every single passenger.',                            pillar: 'Growth Mindset',   type: 'ai' },
      { id: 'equity_leader',  icon: '⚖️', name: 'Equity Leader',     desc: 'Your resource allocation decisions consistently prioritized the most vulnerable passengers — Grandma Rosa, the twins, the scientist.', pillar: 'Interpersonal EQ', type: 'ai' },
      { id: 'crew_mvp',       icon: '🌟', name: 'Crew MVP',          desc: 'Nova, Orion, and Lyra all named you as the person whose calm under pressure kept the council from falling apart.',               pillar: 'Adaptability',     type: 'peer' },
    ],
    xpGains: [
      { pillar: 'Growth Mindset',   key: 'growth',        xp: 50, color: '#639922', bg: '#EAF3DE' },
      { pillar: 'Interpersonal EQ', key: 'interpersonal', xp: 55, color: '#1D9E75', bg: '#E1F5EE' },
      { pillar: 'Adaptability',     key: 'adaptability',  xp: 50, color: '#BA7517', bg: '#FAEEDA' },
      { pillar: 'Communication',    key: 'communication', xp: 35, color: '#D85A30', bg: '#FAECE7' },
    ],
    scoreItems: [
      { label: 'All passengers protected',   points: 500 },
      { label: 'Time remaining (4:30 left)', points: 90  },
      { label: 'Two new survivors included', points: 200 },
      { label: 'Ethical decisions justified', points: 150 },
      { label: 'All roles contributed',      points: 80  },
      { label: 'Reflection quality',         points: 75  },
    ],
    weakPillarHints: [
      { pillar: 'interpersonal', questToTry: 'Ask for something important',    reason: 'Advocating for others\' needs was challenging — this quest builds the skill of speaking up for what matters.' },
      { pillar: 'growth',        questToTry: 'Try something scary',            reason: 'Thinking beyond the obvious pod shortage took courage — this quest builds creative risk-taking.' },
      { pillar: 'adaptability',  questToTry: 'Deal with a tough family moment',reason: 'The 5-minute redesign was intense — this quest builds grace under pressure.' },
    ],
  },
];

export function getCoopScenario(missionId: number): ArkCoopScenario | undefined {
  return ARK_COOP_SCENARIOS.find((s) => s.missionId === missionId);
}

export const GOALS = {
  friends: [
    { title: 'Make a new friend', desc: "You see someone you'd like to know. How do you take that first step?", pillar: 'Interpersonal EQ' },
    { title: 'Handle being left out', desc: "Your friends didn't invite you. What do you do with that feeling?", pillar: 'Intrapersonal EQ' },
    { title: 'Solve a friend fallout', desc: "You and a friend aren't talking. How do you fix it?", pillar: 'Communication' },
  ],
  family: [
    { title: 'Stop fighting with a sibling', desc: 'Same argument, again. What\'s actually going on?', pillar: 'Adaptability' },
    { title: 'Ask for something important', desc: "There's something you really want. How do you bring it up well?", pillar: 'Communication' },
    { title: 'Deal with a tough family moment', desc: 'Something hard is happening at home. How do you take care of yourself?', pillar: 'Intrapersonal EQ' },
  ],
  school: [
    { title: 'Speak up in class', desc: "You have an answer but your hand won't go up. What's stopping you?", pillar: 'Growth Mindset' },
    { title: 'Work with someone difficult', desc: "Your group partner isn't pulling their weight. What do you do?", pillar: 'Interpersonal EQ' },
    { title: 'Bounce back from a bad grade', desc: 'You got a result that stings. How do you move forward?', pillar: 'Growth Mindset' },
  ],
  myself: [
    { title: 'Calm down when frustrated', desc: "You're about to lose it. What actually helps you reset?", pillar: 'Intrapersonal EQ' },
    { title: 'Try something scary', desc: "There's something you want to do but keep putting off. What's the block?", pillar: 'Growth Mindset' },
    { title: 'Handle a big change', desc: 'Something in your life is shifting. How do you find your footing?', pillar: 'Adaptability' },
  ],
};

export type LifeArea = keyof typeof GOALS;

export const LIFE_AREAS: { key: LifeArea; label: string }[] = [
  { key: 'friends', label: 'Friends' },
  { key: 'family', label: 'Family' },
  { key: 'school', label: 'School' },
  { key: 'myself', label: 'Myself' },
];

export interface CoopRole {
  id: string;
  icon: string;
  name: string;
  player: string;
  color: string;
  bgColor: string;
}

export const COOP_ROLES: CoopRole[] = [
  { id: 'scout', icon: '🔍', name: 'Scout', player: 'Jordan', color: '#1D9E75', bgColor: '#E1F5EE' },
  { id: 'diplomat', icon: '🤝', name: 'Diplomat', player: 'Sam', color: '#D85A30', bgColor: '#FAECE7' },
  { id: 'timekeeper', icon: '⏱️', name: 'Timekeeper', player: 'Alex', color: '#BA7517', bgColor: '#FAEEDA' },
  { id: 'scientist', icon: '🔬', name: 'Scientist', player: 'You', color: '#534AB7', bgColor: '#EEEDFE' },
];
