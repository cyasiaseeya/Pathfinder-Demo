export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  hint: string;
  coopOnly: boolean;
  pillar: string;
}

export const ACHIEVEMENTS: Record<string, Achievement[]> = {
  intrapersonal: [
    { id: 'mirror_moment', icon: '🪞', name: 'Mirror moment', desc: 'Named exactly how you were feeling', hint: 'Complete any solo quest', coopOnly: false, pillar: 'intrapersonal' },
    { id: 'feelings_check', icon: '🌡️', name: 'Feelings check', desc: 'Noticed a feeling changing mid-quest', hint: 'Complete 2 solo quests', coopOnly: false, pillar: 'intrapersonal' },
    { id: 'calm_in_storm', icon: '🌀', name: 'Calm in the storm', desc: 'Used a strategy to reset when overwhelmed', hint: 'Try "Calm down when frustrated"', coopOnly: false, pillar: 'intrapersonal' },
    { id: 'inner_compass', icon: '🔦', name: 'Inner compass', desc: 'Used your values to make a decision', hint: 'Unlocks at Guide level', coopOnly: false, pillar: 'intrapersonal' },
  ],
  interpersonal: [
    { id: 'in_their_shoes', icon: '👁️', name: 'In their shoes', desc: 'Described how someone else was feeling', hint: 'Complete any solo quest', coopOnly: false, pillar: 'interpersonal' },
    { id: 'bridge_builder', icon: '🌉', name: 'Bridge builder', desc: 'Found common ground with someone different', hint: 'Try "Solve a friend fallout"', coopOnly: false, pillar: 'interpersonal' },
    { id: 'reads_the_room', icon: '🎭', name: 'Reads the room', desc: 'Spotted a mood shift before they said anything', hint: 'Unlocks in co-op missions only', coopOnly: true, pillar: 'interpersonal' },
    { id: 'people_magnet', icon: '🧲', name: 'People magnet', desc: 'Made someone feel genuinely heard', hint: 'Unlocks at Guide level', coopOnly: false, pillar: 'interpersonal' },
  ],
  communication: [
    { id: 'first_word', icon: '🗣️', name: 'First word', desc: 'Spoke up when staying quiet felt easier', hint: 'Complete any solo quest', coopOnly: false, pillar: 'communication' },
    { id: 'deep_listener', icon: '👂', name: 'Deep listener', desc: 'Repeated back what someone said before responding', hint: 'Complete 2 solo quests', coopOnly: false, pillar: 'communication' },
    { id: 'fair_fighter', icon: '⚖️', name: 'Fair fighter', desc: 'Disagreed without blaming or shutting down', hint: 'Complete 3 solo quests', coopOnly: false, pillar: 'communication' },
    { id: 'loud_and_clear', icon: '📣', name: 'Loud and clear', desc: 'Delivered a hard message kindly', hint: 'Try "Ask for something important"', coopOnly: false, pillar: 'communication' },
  ],
  adaptability: [
    { id: 'go_with_it', icon: '🏄', name: 'Go with it', desc: 'Changed your plan when things shifted', hint: 'Try "Handle a big change"', coopOnly: false, pillar: 'adaptability' },
    { id: 'plan_b', icon: '🔄', name: 'Plan B person', desc: 'New approach when your first idea failed', hint: 'Unlocks in co-op missions only', coopOnly: true, pillar: 'adaptability' },
    { id: 'after_storm', icon: '🌤️', name: 'After the storm', desc: 'Found your footing after something hard', hint: 'Try "Deal with a tough family moment"', coopOnly: false, pillar: 'adaptability' },
    { id: 'puzzle_solver', icon: '🧩', name: 'Puzzle solver', desc: 'Adapted your role when the challenge changed', hint: 'Co-op missions only', coopOnly: true, pillar: 'adaptability' },
  ],
  growth: [
    { id: 'first_try', icon: '🌱', name: 'First try', desc: 'Attempted something scary anyway', hint: 'Complete your first quest', coopOnly: false, pillar: 'growth' },
    { id: 'bounce_back', icon: '🏹', name: 'Bounce back', desc: 'Failed and tried again anyway', hint: 'Try "Bounce back from a bad grade"', coopOnly: false, pillar: 'growth' },
    { id: 'not_yet', icon: '💬', name: 'Not yet', desc: 'Said "not yet" instead of "I can\'t"', hint: 'AI detects "yet" framing in reflection', coopOnly: false, pillar: 'growth' },
    { id: 'on_a_roll', icon: '🔥', name: 'On a roll', desc: '3 quests completed without giving up', hint: 'Complete one more quest to unlock', coopOnly: false, pillar: 'growth' },
  ],
};

export function getAchievementById(id: string): Achievement | undefined {
  for (const pillarAchievements of Object.values(ACHIEVEMENTS)) {
    const found = pillarAchievements.find((a) => a.id === id);
    if (found) return found;
  }
  return undefined;
}
