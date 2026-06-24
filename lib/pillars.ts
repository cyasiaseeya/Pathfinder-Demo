export type PillarKey = 'intrapersonal' | 'interpersonal' | 'communication' | 'adaptability' | 'growth';

export interface Pillar {
  key: PillarKey;
  name: string;
  childName: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const PILLARS: Pillar[] = [
  {
    key: 'intrapersonal',
    name: 'Intrapersonal EQ',
    childName: 'Know yourself',
    icon: '🪞',
    color: '#534AB7',
    bgColor: '#EEEDFE',
    borderColor: '#AFA9EC',
    textColor: '#3C3489',
  },
  {
    key: 'interpersonal',
    name: 'Interpersonal EQ',
    childName: 'Read others',
    icon: '👁️',
    color: '#1D9E75',
    bgColor: '#E1F5EE',
    borderColor: '#5DCAA5',
    textColor: '#085041',
  },
  {
    key: 'communication',
    name: 'Communication',
    childName: 'Speak and listen',
    icon: '🗣️',
    color: '#D85A30',
    bgColor: '#FAECE7',
    borderColor: '#F0997B',
    textColor: '#712B13',
  },
  {
    key: 'adaptability',
    name: 'Adaptability',
    childName: 'Roll with change',
    icon: '🏄',
    color: '#BA7517',
    bgColor: '#FAEEDA',
    borderColor: '#EF9F27',
    textColor: '#633806',
  },
  {
    key: 'growth',
    name: 'Growth Mindset',
    childName: 'Keep trying',
    icon: '🌱',
    color: '#639922',
    bgColor: '#EAF3DE',
    borderColor: '#97C459',
    textColor: '#27500A',
  },
];

export const LEVEL_NAMES = ['Spark', 'Explorer', 'Pathfinder', 'Guide', 'Mentor'];
export const XP_THRESHOLDS = [100, 150, 220, 320, 450];

export function getPillarByName(name: string): Pillar | undefined {
  return PILLARS.find(
    (p) =>
      p.name.toLowerCase() === name.toLowerCase() ||
      p.childName.toLowerCase() === name.toLowerCase()
  );
}

export function getPillarByKey(key: string): Pillar | undefined {
  return PILLARS.find((p) => p.key === key);
}
