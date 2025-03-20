// steps/SpellSelectionStep.tsx

import React, { useState, useEffect } from "react";
import { Character, calculateModifier } from "../types/character";

interface SpellSelectionStepProps {
  character: Character;
  toggleSpell: (spell: string, level: string) => void;
}

// 定义法术列表类型
interface SpellLists {
  cantrips: string[];
  level1: string[];
  level2: string[];
  level3: string[];
  level4: string[];
  level5: string[];
  level6: string[];
  level7: string[];
  level8: string[];
  level9: string[];
}

// 法术数据 - 按照职业和法术等级分类
const SPELLS_BY_CLASS: Record<string, SpellLists> = {
  "法师 (Wizard)": {
    cantrips: [
      "酸液飞溅 (Acid Splash)",
      "舞光术 (Dancing Lights)",
      "死亡冲击 (Chill Touch)",
      "火焰箭 (Fire Bolt)",
      "光亮术 (Light)",
      "法师之手 (Mage Hand)",
      "修复术 (Mending)",
      "魔法伎俩 (Prestidigitation)",
      "冻结射线 (Ray of Frost)",
      "电爪术 (Shocking Grasp)",
    ],
    level1: [
      "警报术 (Alarm)",
      "燃烧之手 (Burning Hands)",
      "魅惑人类 (Charm Person)",
      "理解语言 (Comprehend Languages)",
      "侦测魔法 (Detect Magic)",
      "易容术 (Disguise Self)",
      "羽落术 (Feather Fall)",
      "寻找魔仆 (Find Familiar)",
      "浮空术 (Floating Disk)",
      "巫术箭 (Magic Missile)",
      "护盾术 (Shield)",
      "睡眠术 (Sleep)",
    ],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
    level7: [],
    level8: [],
    level9: [],
  },
  "牧师 (Cleric)": {
    cantrips: [
      "指导术 (Guidance)",
      "光亮术 (Light)",
      "修复术 (Mending)",
      "抗力 (Resistance)",
      "圣焰 (Sacred Flame)",
      "超自然护佑 (Spare the Dying)",
      "奇术 (Thaumaturgy)",
    ],
    level1: [
      "祝福术 (Bless)",
      "命令术 (Command)",
      "治疗伤口 (Cure Wounds)",
      "侦测邪恶和善良 (Detect Evil and Good)",
      "侦测魔法 (Detect Magic)",
      "治愈真言 (Healing Word)",
      "虔诚护盾 (Shield of Faith)",
    ],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
    level7: [],
    level8: [],
    level9: [],
  },
  "术士 (Sorcerer)": {
    cantrips: [
      "酸液飞溅 (Acid Splash)",
      "冷冻射线 (Chill Touch)",
      "舞光术 (Dancing Lights)",
      "火焰箭 (Fire Bolt)",
      "光亮术 (Light)",
      "法师之手 (Mage Hand)",
      "修复术 (Mending)",
      "魔法伎俩 (Prestidigitation)",
      "冻结射线 (Ray of Frost)",
      "电爪术 (Shocking Grasp)",
    ],
    level1: [
      "燃烧之手 (Burning Hands)",
      "魅惑人类 (Charm Person)",
      "理解语言 (Comprehend Languages)",
      "侦测魔法 (Detect Magic)",
      "易容术 (Disguise Self)",
      "羽落术 (Feather Fall)",
      "巫术箭 (Magic Missile)",
      "护盾术 (Shield)",
      "睡眠术 (Sleep)",
    ],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
    level7: [],
    level8: [],
    level9: [],
  },
  "吟游诗人 (Bard)": {
    cantrips: [
      "舞光术 (Dancing Lights)",
      "小幻象 (Minor Illusion)",
      "魔法伎俩 (Prestidigitation)",
      "侮辱 (Vicious Mockery)",
    ],
    level1: [
      "魅惑人类 (Charm Person)",
      "理解语言 (Comprehend Languages)",
      "侦测魔法 (Detect Magic)",
      "易容术 (Disguise Self)",
      "羽落术 (Feather Fall)",
      "治愈真言 (Healing Word)",
      "英雄气概 (Heroism)",
      "睡眠术 (Sleep)",
    ],
    level2: [],
    level3: [],
    level4: [],
    level5: [],
    level6: [],
    level7: [],
    level8: [],
    level9: [],
  },
};

// 空法术列表
const EMPTY_SPELL_LIST: SpellLists = {
  cantrips: [],
  level1: [],
  level2: [],
  level3: [],
  level4: [],
  level5: [],
  level6: [],
  level7: [],
  level8: [],
  level9: [],
};

const SpellSelectionStep: React.FC<SpellSelectionStepProps> = ({
  character,
  toggleSpell,
}) => {
  const [activeTab, setActiveTab] = useState<string>("cantrips");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSpells, setFilteredSpells] = useState<string[]>([]);
  const [classSpells, setClassSpells] = useState<SpellLists>(EMPTY_SPELL_LIST);

  // 安全访问字符串数组
  const safeGetArray = (obj: any, key: string): string[] => {
    if (!obj || !obj[key] || !Array.isArray(obj[key])) {
      return [];
    }
    return obj[key];
  };

  // 获取角色施法属性修正值
  const getSpellcastingModifier = () => {
    let mod = 0;
    if (character?.characterClass?.includes("法师")) {
      mod = calculateModifier(character.stats.intelligence);
    } else if (
      character?.characterClass?.includes("牧师") ||
      character?.characterClass?.includes("德鲁伊")
    ) {
      mod = calculateModifier(character.stats.wisdom);
    } else if (
      character?.characterClass?.includes("术士") ||
      character?.characterClass?.includes("吟游诗人") ||
      character?.characterClass?.includes("圣武士")
    ) {
      mod = calculateModifier(character.stats.charisma);
    }
    return mod;
  };

  // 获取角色的法术攻击加值
  const getSpellAttackBonus = () => {
    const proficiencyBonus = 2; // 1级角色的熟练加值
    const abilityMod = getSpellcastingModifier();
    return proficiencyBonus + abilityMod;
  };

  // 获取角色的法术豁免DC
  const getSpellSaveDC = () => {
    const proficiencyBonus = 2; // 1级角色的熟练加值
    const abilityMod = getSpellcastingModifier();
    return 8 + proficiencyBonus + abilityMod;
  };

  // 计算角色可以选择的戏法数量
  const getAvailableCantripsCount = () => {
    if (!character?.characterClass) return 0;

    switch (character.characterClass) {
      case "法师 (Wizard)":
        return 3;
      case "牧师 (Cleric)":
        return 3;
      case "术士 (Sorcerer)":
        return 4;
      case "吟游诗人 (Bard)":
        return 2;
      default:
        return 0;
    }
  };

  // 当职业变化时，更新可用法术列表
  useEffect(() => {
    if (!character?.characterClass) {
      setClassSpells(EMPTY_SPELL_LIST);
      setFilteredSpells([]);
      return;
    }

    // 提取职业名称（不含括号）
    const className = character.characterClass.split(" ")[0];

    // 查找该职业的法术列表
    let matchedSpells: SpellLists = EMPTY_SPELL_LIST;

    for (const [key, spells] of Object.entries(SPELLS_BY_CLASS)) {
      if (key.includes(className)) {
        matchedSpells = spells;
        break;
      }
    }

    setClassSpells(matchedSpells);

    // 初始化过滤后的法术列表
    if (activeTab && matchedSpells[activeTab as keyof SpellLists]) {
      setFilteredSpells(matchedSpells[activeTab as keyof SpellLists]);
    } else {
      setFilteredSpells([]);
    }
  }, [character?.characterClass, activeTab]);

  // 当标签或搜索词变化时，更新过滤后的法术列表
  useEffect(() => {
    if (!classSpells || !activeTab) {
      setFilteredSpells([]);
      return;
    }

    const spellsForLevel = classSpells[activeTab as keyof SpellLists] || [];

    if (searchTerm) {
      // 如果有搜索词，过滤当前标签中的法术
      setFilteredSpells(
        spellsForLevel.filter((spell) =>
          spell.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // 否则显示所有当前标签中的法术
      setFilteredSpells(spellsForLevel);
    }
  }, [activeTab, searchTerm, classSpells]);

  // 计算已选择的法术数量
  const getSelectedSpellsCount = (level: string) => {
    if (!character?.spells) return 0;

    const spellsArray = safeGetArray(character.spells, level);
    return spellsArray.length;
  };

  // 获取特定等级法术显示名称
  const getSpellLevelName = (level: string) => {
    switch (level) {
      case "cantrips":
        return "戏法";
      case "level1":
        return "1环法术";
      case "level2":
        return "2环法术";
      case "level3":
        return "3环法术";
      case "level4":
        return "4环法术";
      case "level5":
        return "5环法术";
      case "level6":
        return "6环法术";
      case "level7":
        return "7环法术";
      case "level8":
        return "8环法术";
      case "level9":
        return "9环法术";
      default:
        return level;
    }
  };

  // 检查是否达到了法术选择上限
  const isAtSpellLimit = (level: string) => {
    if (!character?.spells) return true;

    if (level === "cantrips") {
      return getSelectedSpellsCount(level) >= getAvailableCantripsCount();
    }

    // 对于非戏法，计算所有已选择的非戏法法术总数
    let totalSelectedSpells = 0;
    Object.entries(character.spells).forEach(([key, spells]) => {
      if (key !== "cantrips" && Array.isArray(spells)) {
        totalSelectedSpells += spells.length;
      }
    });

    return totalSelectedSpells >= (character.spellsKnown || 0);
  };

  // 渲染法术选择界面
  const renderSpellSelection = () => {
    if (!character?.characterClass) {
      return (
        <div className="text-center p-8">
          <p>请先选择一个施法职业</p>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索法术..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tabs tabs-boxed mb-4">
          {Object.entries(classSpells).map(([level, spells]) => {
            if (!spells || spells.length === 0) return null;
            return (
              <a
                key={level}
                className={`tab ${activeTab === level ? "tab-active" : ""}`}
                onClick={() => setActiveTab(level)}
              >
                {getSpellLevelName(level)}
                <span className="ml-1 badge badge-sm">
                  {getSelectedSpellsCount(level)}
                </span>
              </a>
            );
          })}
        </div>

        <div className="bg-base-200 p-4 rounded-lg mb-4">
          {activeTab === "cantrips" ? (
            <p>
              你可以选择 <strong>{getAvailableCantripsCount()}</strong>{" "}
              个戏法。已选择:{" "}
              <strong>
                {getSelectedSpellsCount("cantrips")}/
                {getAvailableCantripsCount()}
              </strong>
            </p>
          ) : (
            <>
              <p>
                {character.characterClass === "牧师 (Cleric)"
                  ? `你可以准备等同于你的等级(${
                      character.level
                    }) + 感知调整值(${calculateModifier(
                      character.stats.wisdom
                    )}) = ${
                      character.level +
                      calculateModifier(character.stats.wisdom)
                    } 个法术。`
                  : `你可以知晓 ${
                      character.spellsKnown || 0
                    } 个法术。已选择: ${Object.entries(character.spells || {})
                      .filter(([key]) => key !== "cantrips")
                      .reduce(
                        (sum, [_, spells]) =>
                          sum + (Array.isArray(spells) ? spells.length : 0),
                        0
                      )}/${character.spellsKnown || 0}`}
              </p>
            </>
          )}
        </div>

        {filteredSpells.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredSpells.map((spell) => {
              const isSelected =
                character.spells &&
                character.spells[activeTab as keyof typeof character.spells] &&
                Array.isArray(
                  character.spells[activeTab as keyof typeof character.spells]
                ) &&
                (
                  character.spells[
                    activeTab as keyof typeof character.spells
                  ] as string[]
                ).includes(spell);

              return (
                <div
                  key={spell}
                  className={`p-2 border rounded cursor-pointer ${
                    isSelected
                      ? "bg-primary/20 border-primary"
                      : "hover:bg-base-200 border-base-300"
                  }`}
                  onClick={() => {
                    // 如果已经选中，允许取消选择
                    if (isSelected) {
                      toggleSpell(spell, activeTab);
                    }
                    // 如果未选中且未达到上限，允许选择
                    else if (!isAtSpellLimit(activeTab)) {
                      toggleSpell(spell, activeTab);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{spell}</div>
                    {isSelected && (
                      <div className="badge badge-primary">已选</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-4 bg-base-200 rounded-lg">
            <p>没有找到匹配的法术</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">选择法术</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">{renderSpellSelection()}</div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">施法能力</h3>

            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">施法属性</div>
                <div className="stat-value">
                  {character.characterClass?.includes("法师")
                    ? "智力"
                    : character.characterClass?.includes("牧师")
                    ? "感知"
                    : character.characterClass?.includes("术士") ||
                      character.characterClass?.includes("吟游诗人")
                    ? "魅力"
                    : "无"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">法术攻击加值</div>
                <div className="stat-value text-primary">
                  +{getSpellAttackBonus()}
                </div>
                <div className="stat-desc">熟练加值 + 属性调整值</div>
              </div>

              <div className="stat">
                <div className="stat-title">法术豁免DC</div>
                <div className="stat-value text-secondary">
                  {getSpellSaveDC()}
                </div>
                <div className="stat-desc">8 + 熟练加值 + 属性调整值</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">已选择的法术</h4>
              {character.spells &&
                Object.entries(character.spells).map(([level, spells]) => {
                  const spellList = Array.isArray(spells) ? spells : [];
                  if (spellList.length === 0) return null;

                  return (
                    <div key={level} className="mb-3">
                      <h5 className="text-sm font-medium text-primary">
                        {getSpellLevelName(level)}
                      </h5>
                      <ul className="list-disc list-inside">
                        {spellList.map((spell, index) => (
                          <li key={index} className="text-sm">
                            {spell}
                            <button
                              className="btn btn-xs btn-ghost ml-1 text-error"
                              onClick={() => toggleSpell(spell, level)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

              {!character.spells ||
                (Object.values(character.spells).every(
                  (spells) => !Array.isArray(spells) || spells.length === 0
                ) && <p className="text-sm italic">尚未选择任何法术</p>)}
            </div>

            <div className="mt-6 p-3 bg-base-300 rounded-lg">
              <h4 className="font-semibold mb-2">法术位</h4>
              <p className="text-sm">
                1级
                {character.characterClass?.includes("法师")
                  ? "法师"
                  : character.characterClass?.includes("牧师")
                  ? "牧师"
                  : character.characterClass?.includes("术士")
                  ? "术士"
                  : character.characterClass?.includes("吟游诗人")
                  ? "吟游诗人"
                  : "施法者"}
                拥有2个1环法术位。戏法可以无限次施放。
              </p>
            </div>

            <div className="mt-6 p-3 bg-base-300 rounded-lg">
              <h4 className="font-semibold mb-2">施法提示</h4>
              <ul className="text-xs space-y-2">
                <li>
                  <strong>施法检定:</strong>{" "}
                  当施放需要攻击检定的法术时，掷d20加上你的法术攻击加值。
                </li>
                <li>
                  <strong>法术豁免:</strong>{" "}
                  一些法术要求目标进行豁免检定。目标需要掷d20并与你的法术豁免DC比较。
                </li>
                <li>
                  <strong>施法本质:</strong>{" "}
                  {character.characterClass?.includes("法师")
                    ? "法师是学习型施法者，可以通过学习和记录恢复任意法术，但必须进行准备。"
                    : character.characterClass?.includes("牧师")
                    ? "牧师可以准备任何牧师法术，但数量有限。每天可以改变准备的法术。"
                    : character.characterClass?.includes("术士")
                    ? "术士拥有有限的已知法术，但不需要准备，可以灵活使用法术位。"
                    : character.characterClass?.includes("吟游诗人")
                    ? "吟游诗人拥有有限的已知法术，但不需要准备，可以灵活使用法术位。"
                    : "每个施法职业有独特的施法方式。"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpellSelectionStep;
