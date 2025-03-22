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
  characterClass: string;
  subclass: string;
  level: number;
  background: string;
  backgroundStory: string; // 背景故事
  personality: string; // 个性特点
  ideal: string; // 理想
  bond: string; // 羁绊
  flaw: string; // 缺点
  alignment: string;
  gender: string; // 新增：性别
  features: string[]; // 新增：外貌特征
  portraitUrl: string; // 新增：角色立绘URL
  stats: CharacterStats;
  skillProficiencies: string[];
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
    "法师", "Wizard", "法师 (Wizard)",
    "牧师", "Cleric", "牧师 (Cleric)",
    "术士", "Sorcerer", "术士 (Sorcerer)",
    "吟游诗人", "Bard", "吟游诗人 (Bard)",
    "德鲁伊", "Druid", "德鲁伊 (Druid)",
    "邪术师", "Warlock", "邪术师 (Warlock)"
  ];
  
  return spellcasterClasses.some(casterClass => 
    characterClass === casterClass || 
    characterClass.toLowerCase().includes(casterClass.toLowerCase())
  );
};

// 预设数据 - 可以在需要的地方导入使用
export const RACES = [
  "人类 (Human)",
  "精灵 (Elf)",
  "矮人 (Dwarf)",
  "半身人 (Halfling)",
  "侏儒 (Gnome)",
  "半精灵 (Half-Elf)",
  "半兽人 (Half-Orc)",
  "提夫林 (Tiefling)",
  "龙裔 (Dragonborn)",
];

export const SUBRACES: Record<string, string[]> = {
  "人类 (Human)": ["标准", "变体"],
  "精灵 (Elf)": ["高等精灵", "木精灵", "黑暗精灵"],
  "矮人 (Dwarf)": ["丘陵矮人", "山地矮人"],
  "半身人 (Halfling)": ["轻足半身人", "强魄半身人"],
  "侏儒 (Gnome)": ["森林侏儒", "岩石侏儒"],
  "半精灵 (Half-Elf)": ["标准"],
  "半兽人 (Half-Orc)": ["标准"],
  "提夫林 (Tiefling)": ["标准"],
  "龙裔 (Dragonborn)": [
    "黑龙",
    "蓝龙",
    "绿龙",
    "红龙",
    "白龙",
    "金龙",
    "银龙",
    "铜龙",
    "青铜龙",
    "黄铜龙",
  ],
};

export const CLASSES = [
  "战士 (Fighter)",
  "法师 (Wizard)",
  "游荡者 (Rogue)",
  "牧师 (Cleric)",
  "游侠 (Ranger)",
  "圣武士 (Paladin)",
  "吟游诗人 (Bard)",
  "德鲁伊 (Druid)",
  "武僧 (Monk)",
  "术士 (Sorcerer)",
  "邪术师 (Warlock)",
  "野蛮人 (Barbarian)",
];

export const BACKGROUNDS = [
  "侍僧 (Acolyte)",
  "江湖艺人 (Charlatan)",
  "罪犯 (Criminal)",
  "艺人 (Entertainer)",
  "民间英雄 (Folk Hero)",
  "公会工匠 (Guild Artisan)",
  "隐士 (Hermit)",
  "贵族 (Noble)",
  "化外之民 (Outlander)",
  "贤者 (Sage)",
  "海员 (Sailor)",
  "士兵 (Soldier)",
  "流浪儿 (Urchin)",
];

export const ALIGNMENTS = [
  "守序善良 (Lawful Good)",
  "中立善良 (Neutral Good)",
  "混乱善良 (Chaotic Good)",
  "守序中立 (Lawful Neutral)",
  "绝对中立 (True Neutral)",
  "混乱中立 (Chaotic Neutral)",
  "守序邪恶 (Lawful Evil)",
  "中立邪恶 (Neutral Evil)",
  "混乱邪恶 (Chaotic Evil)",
];

export const SKILLS = [
  "体操 (Acrobatics)",
  "驯兽 (Animal Handling)",
  "奥秘 (Arcana)",
  "运动 (Athletics)",
  "欺瞒 (Deception)",
  "历史 (History)",
  "洞悉 (Insight)",
  "威吓 (Intimidation)",
  "调查 (Investigation)",
  "医疗 (Medicine)",
  "自然 (Nature)",
  "察觉 (Perception)",
  "表演 (Performance)",
  "说服 (Persuasion)",
  "宗教 (Religion)",
  "巧手 (Sleight of Hand)",
  "隐匿 (Stealth)",
  "求生 (Survival)",
];

