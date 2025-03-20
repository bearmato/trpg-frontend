// CharacterCreationPage.tsx - 主页面组件

import React, { useState } from "react";
import BasicInfoStep from "../steps/BasicInfoStep";
import RaceSelectionStep from "../steps/RaceSelectionStep";
import ClassSelectionStep from "../steps/ClassSelectionStep";
import BackgroundStep from "../steps/BackgroundStep";
import AbilityScoresStep from "../steps/AbilityScoresStep";
import SkillsStep from "../steps/SkillsStep";
import CompletionStep from "../steps/CompletionStep";
import StepIndicator from "../components/StepIndicator";
import { Character, CharacterStats } from "../types/character";

const CharacterCreationPage: React.FC = () => {
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState(1);

  // 角色数据
  const [character, setCharacter] = useState<Character>({
    name: "",
    race: "",
    subrace: "",
    characterClass: "",
    level: 1,
    background: "",
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
  });

  // 更新角色信息
  const updateCharacter = (key: keyof Character, value: any) => {
    setCharacter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 更新角色属性
  const updateStat = (stat: keyof CharacterStats, value: number) => {
    if (value >= 3 && value <= 18) {
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

  // 保存角色
  const saveCharacter = () => {
    console.log("保存角色:", character);
    // 这里可以添加API调用，保存角色到后端
    alert("角色已创建成功!");
  };

  // 步骤控制
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
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
      case 6: // 技能选择
        return character.skillProficiencies.length >= 2; // 至少选择2个技能
      default:
        return true;
    }
  };

  // 根据当前步骤渲染内容
  const renderStep = () => {
    switch (currentStep) {
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
            updateCharacter={updateCharacter}
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
          <AbilityScoresStep stats={character.stats} updateStat={updateStat} />
        );
      case 6:
        return (
          <SkillsStep
            skillProficiencies={character.skillProficiencies}
            toggleSkill={toggleSkill}
          />
        );
      case 7:
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

        {currentStep < 7 ? (
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
