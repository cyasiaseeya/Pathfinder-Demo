export interface PillarState {
  level: number;
  xp: number;
  xpToNext: number;
}

export interface BraveTry {
  id: string;
  mission: string;
  description: string;
  pillar: string;
  status: 'pending' | 'tried' | 'not_yet';
  whatGotInTheWay?: string;
  sessionId: string;
  date: string;
}

export interface Session {
  id: string;
  type: 'solo' | 'coop';
  questTitle: string;
  date: string;
  pillarSignals: Record<string, string>;
  reflectionAnswers: string[];
  badgesEarned: string[];
  crewScore?: number;
}

export interface PathfindersState {
  childName: string;
  entitlement: 'free' | 'paid';
  sessionsCompleted: number;
  pillars: {
    intrapersonal: PillarState;
    interpersonal: PillarState;
    communication: PillarState;
    adaptability: PillarState;
    growth: PillarState;
  };
  achievements: string[];
  braveTries: BraveTry[];
  sessionHistory: Session[];
}

const XP_THRESHOLDS = [100, 150, 220, 320, 450];

export const defaultState: PathfindersState = {
  childName: '',
  entitlement: 'paid',
  sessionsCompleted: 0,
  pillars: {
    intrapersonal: { level: 0, xp: 0, xpToNext: 100 },
    interpersonal: { level: 0, xp: 0, xpToNext: 100 },
    communication: { level: 0, xp: 0, xpToNext: 100 },
    adaptability: { level: 0, xp: 0, xpToNext: 100 },
    growth: { level: 0, xp: 0, xpToNext: 100 },
  },
  achievements: [],
  braveTries: [],
  sessionHistory: [],
};

const SEED_STATE: PathfindersState = {
  childName: '',
  entitlement: 'paid',
  sessionsCompleted: 2,
  pillars: {
    intrapersonal: { level: 1, xp: 65, xpToNext: 150 },
    interpersonal: { level: 0, xp: 80, xpToNext: 100 },
    communication: { level: 1, xp: 40, xpToNext: 150 },
    adaptability: { level: 0, xp: 50, xpToNext: 100 },
    growth: { level: 1, xp: 30, xpToNext: 150 },
  },
  achievements: ['mirror_moment', 'first_word', 'first_try'],
  braveTries: [
    {
      id: 'bt1',
      mission: 'Say hi first',
      description: 'Walk up to someone new at lunch and start the conversation yourself.',
      pillar: 'Interpersonal EQ',
      status: 'tried',
      sessionId: 'session1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'bt2',
      mission: 'Name the feeling',
      description: 'Next time you feel frustrated, pause and say out loud (or write down) exactly what the feeling is.',
      pillar: 'Intrapersonal EQ',
      status: 'pending',
      sessionId: 'session1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'bt3',
      mission: 'Ask one question',
      description: 'In your next group project, ask a clarifying question before jumping to a solution.',
      pillar: 'Communication',
      status: 'not_yet',
      whatGotInTheWay: "I forgot when the moment came up.",
      sessionId: 'session2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  sessionHistory: [
    {
      id: 'session1',
      type: 'solo',
      questTitle: 'Handle being left out',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      pillarSignals: {
        intrapersonal: 'Said "I felt really hurt and embarrassed when they didn\'t invite me."',
        interpersonal: 'Considered how their friends might have forgotten, not excluded them on purpose.',
      },
      reflectionAnswers: [
        "I tried to distract myself but it didn't really work.",
        "They were probably just busy and forgot.",
        "I think I can ask next time instead of waiting.",
      ],
      badgesEarned: ['mirror_moment'],
    },
    {
      id: 'session2',
      type: 'solo',
      questTitle: 'Speak up in class',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      pillarSignals: {
        communication: 'Identified that fear of being wrong was stopping them from raising their hand.',
        growth: 'Said "maybe I won\'t get it right but at least I can try."',
      },
      reflectionAnswers: [
        "I realized the worry in my head was bigger than it needed to be.",
        "I tried to remind myself everyone gets answers wrong sometimes.",
        "I feel less scared now — like I have a plan.",
      ],
      badgesEarned: ['first_word', 'first_try'],
    },
  ],
};

export function loadState(): PathfindersState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem('pathfinders_state');
    if (!raw) return defaultState;
    return JSON.parse(raw) as PathfindersState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: PathfindersState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pathfinders_state', JSON.stringify(state));
}

export function seedDemoData(childName: string): PathfindersState {
  const seeded = { ...SEED_STATE, childName };
  saveState(seeded);
  return seeded;
}

export function resetState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pathfinders_state');
}

export function addXP(
  state: PathfindersState,
  pillar: keyof PathfindersState['pillars'],
  amount: number
): PathfindersState {
  const pillarState = { ...state.pillars[pillar] };
  pillarState.xp += amount;

  while (pillarState.level < 4 && pillarState.xp >= pillarState.xpToNext) {
    pillarState.xp -= pillarState.xpToNext;
    pillarState.level += 1;
    pillarState.xpToNext = XP_THRESHOLDS[Math.min(pillarState.level, 4)];
  }

  return {
    ...state,
    pillars: { ...state.pillars, [pillar]: pillarState },
  };
}

export function unlockAchievement(state: PathfindersState, id: string): PathfindersState {
  if (state.achievements.includes(id)) return state;
  return { ...state, achievements: [...state.achievements, id] };
}
