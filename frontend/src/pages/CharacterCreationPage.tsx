// CharacterCreationPage.tsx - 主页面组件

import React, { useState } from "react";
import BasicInfoStep from "../steps/BasicInfoStep";
import RaceSelectionStep from "../steps/RaceSelectionStep";
import ClassSelectionStep from "../steps/ClassSelectionStep";
import BackgroundStep from "../steps/BackgroundStep";
import AbilityScoresStep from "../steps/AbilityScoresStep";
import SkillsStep from "../steps/SkillsStep";
import SpellSelectionStep from "../steps/SpellSelectionStep"; // 新增法术选择步骤
import CompletionStep from "../steps/CompletionStep";
import StepIndicator from "../components/StepIndicator";
import { Character, CharacterStats, isSpellcaster } from "../types/character";

const CharacterCreationPage: React.FC = () => {
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState(1);

  // 角色数据
  const [character, setCharacter] = useState<Character>({
    name: "",
    race: "",
    subrace: "",
    characterClass: "",
    subclass: "", // 新增子职业
    level: 1,
    background: "",
    backgroundStory: "", // 新增背景故事
    personality: "", // 个性特点
    ideal: "", // 理想
    bond: "", // 羁绊
    flaw: "", // 缺点
    alignment: "",
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skillProficiencies: [],
    equipment: [],
    spells: {
      // 法术
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
    },
    spellsKnown: 0, // 已知法术数量
    spellSlots: {}, // 法术位
  });

  // 更新角色信息
  const updateCharacter = (key: keyof Character, value: any) => {
    setCharacter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 更新所有属性值（用于属性生成方法切换）
  const updateStats = (newStats: CharacterStats) => {
    setCharacter((prev) => ({
      ...prev,
      stats: newStats,
    }));
  };

  // 更新角色属性
  const updateStat = (stat: keyof CharacterStats, value: number) => {
    if (value >= 3 && value <= 20) {
      setCharacter((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: value,
        },
      }));
    }
  };

  // 技能选择切换
  const toggleSkill = (skill: string) => {
    setCharacter((prev) => {
      const skills = [...prev.skillProficiencies];
      if (skills.includes(skill)) {
        return {
          ...prev,
          skillProficiencies: skills.filter((s) => s !== skill),
        };
      } else {
        return {
          ...prev,
          skillProficiencies: [...skills, skill],
        };
      }
    });
  };

  // 添加或移除法术
  const toggleSpell = (spell: string, level: string) => {
    setCharacter((prev) => {
      const spellList = [
        ...(prev.spells[level as keyof typeof prev.spells] || []),
      ];

      if (spellList.includes(spell)) {
        return {
          ...prev,
          spells: {
            ...prev.spells,
            [level]: spellList.filter((s) => s !== spell),
          },
        };
      } else {
        // 检查是否达到已知法术上限
        if (level !== "cantrips") {
          // 计算已知法术总数
          const totalKnownSpells = Object.entries(prev.spells)
            .filter(([key]) => key !== "cantrips")
            .reduce((sum, [_, spells]) => sum + (spells as string[]).length, 0);

          if (totalKnownSpells >= prev.spellsKnown) return prev;
        }

        return {
          ...prev,
          spells: {
            ...prev.spells,
            [level]: [...spellList, spell],
          },
        };
      }
    });
  };

  // 处理种族变更
  const handleRaceChange = (race: string) => {
    updateCharacter("race", race);

    // 如果该种族有子种族，选择第一个作为默认值
    const subraces: Record<string, string[]> = {
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

    if (subraces[race]?.length > 0) {
      updateCharacter("subrace", subraces[race][0]);
    } else {
      updateCharacter("subrace", "");
    }
  };

  // 处理职业变更，设置初始法术数量
  const handleClassChange = (newClass: string) => {
    updateCharacter("characterClass", newClass);

    // 根据职业设置初始法术数量
    let spellsKnown = 0;
    let spellSlots = {};

    if (isSpellcaster(newClass)) {
      switch (newClass) {
        case "法师 (Wizard)":
          spellsKnown = 6; // 1级法师可记录6个1级法术（不包括仪式）
          spellSlots = { level1: 2 }; // 1级法师有2个1级法术位
          break;
        case "术士 (Sorcerer)":
          spellsKnown = 2; // 1级术士认识2个法术
          spellSlots = { level1: 2 }; // 1级术士有2个1级法术位
          break;
        case "牧师 (Cleric)":
          // 牧师准备法术而不是学习，准备数量 = 等级 + 感知调整值
          spellSlots = { level1: 2 }; // 1级牧师有2个1级法术位
          break;
        case "圣武士 (Paladin)":
        case "游侠 (Ranger)":
          // 这些职业在较高等级才获得法术能力
          break;
        case "吟游诗人 (Bard)":
          spellsKnown = 4; // 1级吟游诗人认识4个法术
          spellSlots = { level1: 2 }; // 1级吟游诗人有2个1级法术位
          break;
      }
    }

    updateCharacter("spellsKnown", spellsKnown);
    updateCharacter("spellSlots", spellSlots);
  };

  // 保存角色
  const saveCharacter = () => {
    console.log("保存角色:", character);
    // 这里可以添加API调用，保存角色到后端
    alert("角色已创建成功!");
  };

  // 步骤控制
  const nextStep = () => {
    // 如果是施法者且当前是属性步骤，则添加法术选择步骤
    if (isSpellcaster(character.characterClass) && currentStep === 5) {
      setCurrentStep(6); // 进入法术选择步骤
    } else if (isSpellcaster(character.characterClass) && currentStep === 6) {
      setCurrentStep(7); // 施法者从法术步骤进入技能步骤
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    // 如果是施法者且当前是技能步骤，则返回法术选择
    if (isSpellcaster(character.characterClass) && currentStep === 7) {
      setCurrentStep(6); // 返回法术选择步骤
    } else if (isSpellcaster(character.characterClass) && currentStep === 6) {
      setCurrentStep(5); // 施法者从法术步骤返回属性步骤
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 获取总步骤数
  const getTotalSteps = () => {
    return isSpellcaster(character.characterClass) ? 8 : 7;
  };

  // 检查当前步骤是否完成
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // 基本信息
        return !!character.name;
      case 2: // 种族选择
        return !!character.race;
      case 3: // 职业选择
        return !!character.characterClass;
      case 4: // 背景
        return !!character.background && !!character.alignment;
      case 5: // 属性分配
        return true; // 属性有默认值，所以总是完成的
      case 6: // 法术选择（仅施法者）
        if (isSpellcaster(character.characterClass)) {
          // 确保至少选择了一个法术
          const hasCantrips = character.spells.cantrips.length > 0;
          const hasSpells =
            character.level >= 1 &&
            Object.entries(character.spells)
              .filter(([key]) => key !== "cantrips")
              .some(([_, spells]) => (spells as string[]).length > 0);
          return hasCantrips || hasSpells;
        }
        return true; // 非施法者跳过此步骤
      case 7: // 技能选择
        return character.skillProficiencies.length >= 2; // 至少选择2个技能
      default:
        return true;
    }
  };

  // 根据当前步骤渲染内容
  const renderStep = () => {
    // 确定当前步骤（考虑施法者额外步骤）
    const adjustedStep =
      currentStep > 6 && !isSpellcaster(character.characterClass)
        ? currentStep - 1 // 非施法者跳过法术步骤
        : currentStep;

    switch (adjustedStep) {
      case 1:
        return (
          <BasicInfoStep
            character={character}
            updateCharacter={updateCharacter}
          />
        );
      case 2:
        return (
          <RaceSelectionStep
            character={character}
            handleRaceChange={handleRaceChange}
            updateCharacter={updateCharacter}
          />
        );
      case 3:
        return (
          <ClassSelectionStep
            character={character}
            updateCharacter={handleClassChange}
          />
        );
      case 4:
        return (
          <BackgroundStep
            character={character}
            updateCharacter={updateCharacter}
          />
        );
      case 5:
        return (
          <AbilityScoresStep
            stats={character.stats}
            updateStat={updateStat}
            updateStats={updateStats}
            race={character.race}
            subrace={character.subrace}
          />
        );
      case 6:
        return (
          <SpellSelectionStep character={character} toggleSpell={toggleSpell} />
        );
      case 7:
        return (
          <SkillsStep
            skillProficiencies={character.skillProficiencies}
            toggleSkill={toggleSkill}
            characterClass={character.characterClass}
            background={character.background}
          />
        );
      case 8:
        return <CompletionStep character={character} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 pb-16">
      <h1 className="text-3xl font-bold text-center mb-8">创建你的角色</h1>

      {/* 步骤指示器 */}
      <div className="mb-8">
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={getTotalSteps()}
          isSpellcaster={isSpellcaster(character.characterClass)}
        />
      </div>

      {/* 步骤内容 */}
      {renderStep()}

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button className="btn btn-outline" onClick={prevStep}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            上一步
          </button>
        )}

        {currentStep < getTotalSteps() ? (
          <button
            className="btn btn-primary ml-auto"
            onClick={nextStep}
            disabled={!isStepComplete()}
          >
            下一步
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button className="btn btn-primary ml-auto" onClick={saveCharacter}>
            保存角色
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterCreationPage;
