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
