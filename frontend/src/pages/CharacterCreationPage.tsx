import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "../steps/BasicInfoStep";
import RaceSelectionStep from "../steps/RaceSelectionStep";
import ClassSelectionStep from "../steps/ClassSelectionStep";
import BackgroundStep from "../steps/BackgroundStep";
import AbilityScoresStep from "../steps/AbilityScoresStep";
import SkillsStep from "../steps/SkillsStep";
import PortraitStep from "../steps/PortraitStep";
import CompletionStep from "../steps/CompletionStep";
import StepIndicator from "../components/StepIndicator";
import { Character, CharacterStats } from "../types/character";
import { saveCharacter as saveCharacterAPI } from "../api/characters";

const CharacterCreationPage: React.FC = () => {
  // 导航
  const navigate = useNavigate();
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState(1);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 角色数据
  const [character, setCharacter] = useState<Character>({
    name: "",
    race: "",
    subrace: "",
    character_class: "",
    subclass: "",
    level: 1,
    background: "",
    background_story: "",
    personality: "",
    ideal: "",
    bond: "",
    flaw: "",
    alignment: "",
    gender: "male",
    features: [],
    portrait_url: "",
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skill_proficiencies: [],
    equipment: [],
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
      const skills = [...prev.skill_proficiencies];
      if (skills.includes(skill)) {
        return {
          ...prev,
          skill_proficiencies: skills.filter((s) => s !== skill),
        };
      } else {
        return {
          ...prev,
          skill_proficiencies: [...skills, skill],
        };
      }
    });
  };

  // 处理种族变更
  const handleRaceChange = (race: string) => {
    updateCharacter("race", race);

    // 如果该种族有子种族，选择第一个作为默认值
    const subraces: Record<string, string[]> = {
      Human: ["Standard", "Variant"],
      Elf: ["High Elf", "Wood Elf", "Dark Elf"],
      Dwarf: ["Hill Dwarf", "Mountain Dwarf"],
      Halfling: ["Lightfoot", "Stout"],
      Gnome: ["Forest Gnome", "Rock Gnome"],
      "Half-Elf": ["Standard"],
      "Half-Orc": ["Standard"],
      Tiefling: ["Standard"],
      Dragonborn: [
        "Black",
        "Blue",
        "Green",
        "Red",
        "White",
        "Gold",
        "Silver",
        "Copper",
        "Bronze",
        "Brass",
      ],
    };

    if (subraces[race]?.length > 0) {
      updateCharacter("subrace", subraces[race][0]);
    } else {
      updateCharacter("subrace", "");
    }
  };

  // 处理职业变更
  const handleClassChange = (newClass: string) => {
    updateCharacter("character_class", newClass);
  };

  // 保存角色
  const saveCharacter = async () => {
    try {
      setIsLoading(true);
      const response = await saveCharacterAPI(character);
      console.log("Character saved successfully:", response);
      alert("Character created successfully!");
      // 保存成功后跳转到角色库页面
      navigate("/character-library");
    } catch (error) {
      console.error("Error saving character:", error);
      alert("Failed to save character. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 步骤控制
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 获取总步骤数
  const getTotalSteps = () => {
    return 8; // 总共8个步骤，包括立绘步骤
  };

  // 检查当前步骤是否完成
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // 基本信息
        return !!character.name;
      case 2: // 种族选择
        return !!character.race;
      case 3: // 职业选择
        return !!character.character_class;
      case 4: // 背景
        return !!character.background && !!character.alignment; //用户必须同时完成背景和阵营的选择
      case 5: // 属性分配
        return true; // 属性有默认值，所以总是完成的
      case 6: // 技能选择
        return character.skill_proficiencies.length >= 2; // 至少选择2个技能
      case 7: // 角色立绘
        return true; // 立绘是可选的，不强制要求
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
            updateCharacter={handleClassChange}
          />
        );
      case 4:
        return (
          <BackgroundStep
            character={character}
            updateCharacter={updateCharacter}
            nextStep={nextStep}
            prevStep={prevStep}
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
          <SkillsStep
            skill_proficiencies={character.skill_proficiencies}
            toggleSkill={toggleSkill}
            character_class={character.character_class}
            background={character.background}
          />
        );
      case 7:
        return (
          <PortraitStep
            character={character}
            updateCharacter={updateCharacter}
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
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Your Character
      </h1>

      {/* 步骤指示器 */}
      <div className="mb-8">
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={getTotalSteps()}
        />
      </div>

      {/* 步骤内容 */}
      {renderStep()}

      {/* 导航按钮 - 只在非背景步骤显示，因为背景步骤有自己的导航按钮 */}
      {currentStep !== 4 && (
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
              Previous
            </button>
          )}

          {currentStep < getTotalSteps() ? (
            <button
              className="btn btn-primary ml-auto"
              onClick={nextStep}
              disabled={!isStepComplete()}
            >
              Next
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
            <button
              className={`btn btn-primary ml-auto ${
                isLoading ? "btn-disabled animate-pulse" : ""
              }`}
              onClick={saveCharacter}
              disabled={isLoading}
            >
              {isLoading && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {isLoading ? "Saving..." : "Save Character"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterCreationPage;
