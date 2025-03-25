// types/character.ts

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  name: string;
  race: string;
  subrace: string;
  character_class: string;
  subclass: string;
  level: number;
  background: string;
  background_story: string;
  personality: string;
  ideal: string;
  bond: string;
  flaw: string;
  alignment: string;
  gender: string;
  features: string[];
  portrait_url: string;
  stats: CharacterStats;
  skill_proficiencies: string[];
  equipment: string[];
}

// 计算调整值工具函数
export const calculateModifier = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

// 判断职业是否是施法者 - 保留此函数以便将来可能重新添加法术功能
export const isSpellcaster = (characterClass: string): boolean => {
  if (!characterClass) return false;
  
  const spellcasterClasses = [
    "Wizard",
    "Cleric",
    "Sorcerer",
    "Bard",
    "Druid",
    "Warlock"
  ];
  
  return spellcasterClasses.includes(characterClass);
};

// 预设数据 - 可以在需要的地方导入使用
export const RACES = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Tiefling",
  "Dragonborn"
];

export const SUBRACES: Record<string, string[]> = {
  "Human": ["Standard", "Variant"],
  "Elf": ["High Elf", "Wood Elf", "Dark Elf"],
  "Dwarf": ["Hill Dwarf", "Mountain Dwarf"],
  "Halfling": ["Lightfoot", "Stout"],
  "Gnome": ["Forest Gnome", "Rock Gnome"],
  "Half-Elf": ["Standard"],
  "Half-Orc": ["Standard"],
  "Tiefling": ["Standard"],
  "Dragonborn": [
    "Black",
    "Blue",
    "Green",
    "Red",
    "White",
    "Gold",
    "Silver",
    "Copper",
    "Bronze",
    "Brass"
  ]
};

export const CLASSES = [
  "Fighter",
  "Wizard",
  "Rogue",
  "Cleric",
  "Ranger",
  "Paladin",
  "Bard",
  "Druid",
  "Monk",
  "Sorcerer",
  "Warlock",
  "Barbarian"
];

export const BACKGROUNDS = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin"
];

export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil"
];

export const SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival"
];

